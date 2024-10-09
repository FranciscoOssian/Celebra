import { NextResponse } from "next/server";
import { randomBytes, createHash } from "crypto";
import admin from "@/services/firebaseAdmin/firebase";
import stripe from "@/services/stripe/stripe";
import type { NextRequest } from "next/server";

// Constants
const MAX_FREE_EVENTS = 3;
const EVENT_PRICE_CENTS = 200; // R$2 in cents
const STORAGE_BUCKET = "gs://celebra-edbb4.appspot.com";
const CURRENCY = "brl";

// Helper Functions

/**
 * Generates a unique hash for a file using its name, a random salt, and a timestamp.
 * @param fileName - Original name of the file.
 * @returns A unique hashed file name with the original extension.
 */
const generateFileHash = (fileName: string): string => {
  const salt = randomBytes(8).toString("hex");
  const timestamp = Date.now().toString();
  const extension = fileName.split(".").pop() || "file";

  const hash = createHash("md5")
    .update(fileName + salt + timestamp)
    .digest("base64")
    .replace(/[/+=]/g, "");

  return `${hash}.${extension}`;
};

/**
 * Uploads a file to Firebase Storage.
 * @param file - The file to upload.
 * @param eventId - The ID of the event to associate the file with.
 * @returns The hashed file name used as the identifier.
 */
const uploadFile = async (
  file: FormDataEntryValue | null,
  eventId: string
): Promise<string | undefined> => {
  if (!file || !(file instanceof Blob)) return undefined;

  const fileName = (file as File).name;
  const fileHash = generateFileHash(fileName);
  const filePath = `Events/${eventId}/${fileHash}`;
  const bucket = admin.storage().bucket(STORAGE_BUCKET);
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const storageFile = bucket.file(filePath);
  await storageFile.save(fileBuffer, {
    metadata: { contentType: file.type, originalFileName: fileName },
  });

  return fileHash;
};

/**
 * Validates and parses the incoming form data.
 * @param request - The incoming request.
 * @returns An object containing the parsed file, tokenId, and event data.
 */
const parseFormData = async (request: NextRequest) => {
  const formData = await request.formData();
  const file = formData.get("file");
  const tokenId = formData.get("tokenId");
  const eventRaw = formData.get("event");

  if (typeof tokenId !== "string") {
    throw { status: 400, message: "Invalid tokenId" };
  }

  if (!eventRaw) {
    throw { status: 400, message: "Event data is required" };
  }

  let event;
  try {
    event = JSON.parse(eventRaw.toString());
  } catch {
    throw { status: 400, message: "Invalid event data format" };
  }

  return { file, tokenId, event };
};

/**
 * Creates a Stripe checkout session for event purchase.
 * @param uid - The user's Firebase UID.
 * @returns The Stripe session URL.
 */
const createStripeSession = async (uid: string): Promise<string> => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: CURRENCY,
          product_data: {
            name: "Evento",
            // Add other product properties if necessary
          },
          unit_amount: EVENT_PRICE_CENTS,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      firebaseId: uid,
    },
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=cancel`,
  });

  return session.url ?? "";
};

// Handlers

export async function GET() {
  return NextResponse.json({ message: "API is working 🤨?" }, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate form data
    const { file, tokenId, event } = await parseFormData(request);

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(tokenId);
    const uid = decodedToken.uid;

    // Fetch user data from Firestore
    const userRef = admin.firestore().collection("Users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    const eventsCreated = (userData?.events as string[])?.length || 0;
    const purchasedEvents = userData?.purchasedEvents || 0;

    // Reference to Events collection
    const eventsRef = admin.firestore().collection("Events");

    // Determine if the user can create an event without payment
    if (eventsCreated < MAX_FREE_EVENTS || purchasedEvents > 0) {
      const newEventDocRef = eventsRef.doc();
      const fileHash = await uploadFile(file, newEventDocRef.id);

      // Prepare event data
      const eventData = {
        ...event,
        fileHero: fileHash,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        creatorUid: uid,
      };

      // Save event to Firestore
      await newEventDocRef.set(eventData);

      // Update user's event data
      const updateData: Partial<typeof userData> = {
        events: [...(userData?.events || []), newEventDocRef.id],
      };

      if (eventsCreated >= MAX_FREE_EVENTS && purchasedEvents > 0) {
        updateData.purchasedEvents = purchasedEvents - 1;
      }

      await userRef.update(updateData);

      return NextResponse.json(
        {
          success: true,
          message: "Event created successfully.",
          id: newEventDocRef.id,
        },
        { status: 200 }
      );
    }

    // User has reached the free event limit and has no purchased events
    const paymentUrl = await createStripeSession(uid);

    return NextResponse.json(
      {
        url: paymentUrl,
        message: "Redirecting to payment...",
      },
      { status: 402 } // 402 Payment Required
    );
  } catch (error: any) {
    console.error("Error in POST /api/event:", error);

    const status = error.status || 500;
    const message = error.message || "Internal Server Error";

    return NextResponse.json({ error: message }, { status });
  }
}

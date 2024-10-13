import { NextResponse } from "next/server";
import admin from "@/services/firebaseAdmin/firebase";
import type { NextRequest } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "API is working 🤨?" }, { status: 200 });
}

/**
 * Validates and parses the incoming form data.
 * @param request - The incoming request.
 * @returns An object containing the parsed data.
 */
const parseFormData = async (request: NextRequest) => {
  const formData = await request.formData();
  const tokenId = formData.get("tokenId");
  const eventId = formData.get("eventId");
  const amount = formData.get("amount");

  if (typeof tokenId !== "string") {
    throw { status: 400, message: "Invalid tokenId" };
  }

  if (!eventId) {
    throw { status: 400, message: "Event is required" };
  }

  return { amount, tokenId, eventId };
};

export async function POST(request: NextRequest) {
  try {
    const { amount, tokenId, eventId } = await parseFormData(request);

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(tokenId);
    const uid = decodedToken.uid;

    // Fetch user data from Firestore
    const userRef = admin.firestore().collection("Users").doc(uid);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    // Check if user has sufficient balance
    const eventRef = admin
      .firestore()
      .collection("Events")
      .doc(eventId.toString());
    const eventDoc = await eventRef.get();
    const eventData = eventDoc.data();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (
      (userData?.balance ?? 0) <
      (eventData?.priceUnit ?? 0) * parseInt(amount?.toString() ?? "0")
    ) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 402 }
      );
    }

    const subscriptionRef = admin
      .firestore()
      .collection("Users")
      .doc(uid)
      .collection("subscriptions")
      .doc(eventId.toString());

    const subscriptionSnapshot = await subscriptionRef.get();

    if (subscriptionSnapshot.exists) {
      subscriptionRef.update({
        amount: admin.firestore.FieldValue.increment(
          parseInt(amount?.toString() ?? "0")
        ),
        purchasedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      subscriptionRef.set({
        amount,
        purchasedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error in POST /api/event:", error);

    const status = (error as { status: number }).status || 500;
    const message =
      (error as { message: string }).message || "Internal Server Error";

    return NextResponse.json({ error: message }, { status });
  }
}

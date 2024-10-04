import { NextResponse } from "next/server";
import admin from "@/services/firebaseAdmin/firebase";
import stripe from "@/services/stripe/stripe";

export async function POST(request: Request) {
  const sig = request.headers.get("Stripe-Signature");
  const body = await request.text();

  if (!sig) {
    return NextResponse.json(
      { error: "Missing Stripe Signature" },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_SECRET_WEBHOOK_KEY ?? ""
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Webhook Error: " + (err as Error).message },
      { status: 400 }
    );
  }

  // Verifica o tipo de evento
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const firebaseId = session.metadata?.firebaseId;
    if (!firebaseId) return;
    await admin
      .firestore()
      .collection("Users")
      .doc(firebaseId)
      .update({
        purchasedEvents: admin.firestore.FieldValue.increment(1),
      });
  }

  return NextResponse.json({ received: true });
}

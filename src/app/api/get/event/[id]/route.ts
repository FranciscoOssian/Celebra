import { NextResponse } from "next/server";
import admin from "@/services/firebaseAdmin/firebase";
import type { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    const eventRef = admin.firestore().collection("Events").doc(id);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(eventDoc.data());
  } catch (error: unknown) {
    console.error("Error in POST /api/event:", error);

    const status = (error as { status: number }).status || 500;
    const message =
      (error as { message: string }).message || "Internal Server Error";

    return NextResponse.json({ error: message }, { status });
  }
}

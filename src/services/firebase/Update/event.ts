import { db } from "../firebase";
import { doc, updateDoc, DocumentData } from "firebase/firestore";

export default async function updateEvent(
  eventId: string,
  eventData: Partial<DocumentData>
) {
  const eventRef = doc(db, "Events", eventId);
  await updateDoc(eventRef, eventData);
}

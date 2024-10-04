import { db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";

export default async function deleteEvent(eventId: string) {
  await deleteDoc(doc(db, "Events", eventId));
}

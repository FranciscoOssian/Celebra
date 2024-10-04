import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default async function createEvent(userData: Record<string, unknown>) {
  const docRef = await addDoc(collection(db, "Events"), {
    ...userData,
  });
  return docRef.id;
}

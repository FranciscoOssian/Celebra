import { db } from "../firebase";
import { doc, updateDoc, DocumentData } from "firebase/firestore";

export default async function updateUser(
  userId: string,
  userData: Partial<DocumentData>
) {
  const userRef = doc(db, "Users", userId);
  await updateDoc(userRef, userData);
}

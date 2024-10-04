import { db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";

export default async function deleteUser(userId: string) {
  await deleteDoc(doc(db, "Users", userId));
}

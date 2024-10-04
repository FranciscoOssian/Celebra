import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export const readUser = async (userId: string) => {
  const docSnapshot = await getDoc(doc(db, "Users", userId));
  return docSnapshot.exists()
    ? { id: docSnapshot.id, ...docSnapshot.data() }
    : null;
};

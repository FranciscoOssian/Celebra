import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../firebase";

const db = getFirestore(app);

export const doesDocExist = async (collection: string, docId: string) => {
  const docRef = doc(db, collection, docId);
  const docSnap = await getDoc(docRef);

  return docSnap.exists();
};

import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "../firebase";

const db = getFirestore(app);

const createEmptyDoc = async (collection: string, docId: string) => {
  const docRef = doc(db, collection, docId);

  await setDoc(docRef, {});

  console.log(`Documento ${docId} criado na coleção ${collection}`);
};

export default createEmptyDoc;

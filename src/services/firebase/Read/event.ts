import { doc, getDoc, getFirestore } from "firebase/firestore";
import { app } from "../firebase";

const db = getFirestore(app);

const isValidEventId = (id: string) => {
  const eventIdPattern = /^[A-Za-z0-9]{20}$/;
  return eventIdPattern.test(id);
};

const getEvent = async (id: string) => {
  try {
    if (!isValidEventId(id)) return null;
    const eventDoc = await getDoc(doc(db, "Events", id));
    if (eventDoc.exists()) {
      return { ...eventDoc.data(), id };
    } else {
      throw null;
    }
  } catch (error) {
    throw new Error(`Error fetching event: ${error}`);
  }
};

export default getEvent;

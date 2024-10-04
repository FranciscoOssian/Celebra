import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

import { EventType } from "@/types/Event";

export const readEvent = async (eventId: string): Promise<EventType | null> => {
  const docSnapshot = await getDoc(doc(db, "Events", eventId));
  return docSnapshot.exists()
    ? ({ id: docSnapshot.id, ...docSnapshot.data() } as EventType)
    : null;
};

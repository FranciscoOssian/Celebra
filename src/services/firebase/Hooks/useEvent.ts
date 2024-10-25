import { doc, DocumentData } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { db } from "@/services/firebase/firebase";

const useEvent = (id: string) => {
  const [event, loading, error] = useDocument<DocumentData>(
    doc(db, "Events", id)
  );

  return { event, loading, error, id };
};

export default useEvent;

import { useEffect, useState } from "react";
import { doc, DocumentData } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { useDocument } from "react-firebase-hooks/firestore";
import { db, storage } from "@/services/firebase/firebase";

const useEvent = (id: string) => {
  const [fileHero, setFileHero] = useState<string>("");
  const [event, loading, error] = useDocument<DocumentData>(
    doc(db, "Events", id)
  );

  useEffect(() => {
    const fetchFileHero = async () => {
      if (event?.exists()) {
        const eventData = event.data();
        try {
          const url = await getDownloadURL(
            ref(storage, `Events/${id}/${eventData.fileHero}`)
          );
          setFileHero(url);
        } catch (err) {
          console.error("Erro ao obter a URL do arquivo:", err);
        }
      }
    };
    fetchFileHero();
  }, [event, id]);

  return { event, loading, error, fileHero };
};

export default useEvent;

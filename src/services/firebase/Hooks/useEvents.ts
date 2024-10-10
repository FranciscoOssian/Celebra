import { useEffect, useState } from "react";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db, app } from "../firebase";
import { getStorage, ref, listAll, deleteObject } from "firebase/storage";
import { EventType } from "@/types/Event";

const useUserEvents = (list: string[]) => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const deleteEvent = async (id: string) => {
    try {
      // Deletar o documento do Firestore
      const eventDoc = doc(db, "Events", id);
      await deleteDoc(eventDoc);

      // Deletar arquivos da pasta 'Events/eventID' no Storage
      const storage = getStorage(app);
      const folderRef = ref(storage, `Events/${id}`);

      // Listar todos os arquivos dentro da pasta
      const folderItems = await listAll(folderRef);

      // Deletar cada arquivo da pasta
      const deletePromises = folderItems.items.map((itemRef) =>
        deleteObject(itemRef)
      );
      await Promise.all(deletePromises);

      console.log(`Evento ${id} deletado com sucesso do Firestore e Storage.`);
    } catch (error) {
      console.error("Erro ao deletar o evento:", error);
      setError("Não foi possível deletar o evento.");
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const eventsData = await Promise.all(
          list.map((id) =>
            getDoc(doc(db, "Events", id)).then((snap) => {
              return snap.exists()
                ? ({ id: snap.id, ...snap.data() } as EventType)
                : null;
            })
          )
        );
        setEvents(eventsData.filter((e) => e !== null));
      } catch {
        setError("Erro ao buscar eventos");
      } finally {
        setLoading(false);
      }
    };

    if (list?.length) fetchEvents();
  }, [list]);

  return { events, loading, error, deleteEvent };
};

export default useUserEvents;

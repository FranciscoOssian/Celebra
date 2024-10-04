import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { EventType } from "@/types/Event";

const useUserEvents = (list: string[]) => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return { events, loading, error };
};

export default useUserEvents;

import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/services/firebase/firebase";
import { EventType } from "@/types/Event";

const useUserSubscriptions = (userId?: string) => {
  const [subscriptions, setSubscriptions] = useState<EventType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setSubscriptions([]);
      setLoading(false);
      return;
    }

    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        const subscriptionsRef = collection(
          db,
          "Users",
          userId,
          "subscriptions"
        );
        const subscriptionSnapshots = await getDocs(subscriptionsRef);

        const eventIds = subscriptionSnapshots.docs.map((doc) => doc.id);

        // Buscar todos os eventos inscritos usando getDoc para cada ID
        const subscribedEvents = await Promise.all(
          eventIds.map((id) =>
            getDoc(doc(db, "Events", id)).then((snap) =>
              snap.exists()
                ? ({ id: snap.id, ...snap.data() } as EventType)
                : null
            )
          )
        );

        // Filtrar para garantir que só eventos existentes sejam incluídos
        setSubscriptions(subscribedEvents.filter((event) => event !== null));
      } catch {
        setError("Erro ao buscar eventos subscritos.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [userId]);

  return { subscriptions, loading, error };
};

export default useUserSubscriptions;

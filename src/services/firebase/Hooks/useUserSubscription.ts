import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "@/services/firebase/firebase";
import { SubscriptionType } from "@/types/Subscription";
import { EventType } from "@/types/Event";
import { getDownloadURL } from "firebase/storage";
import { ref } from "firebase/storage";

const useUserSubscription = (userId: string, subscriptionId?: string) => {
  const [subscription, setSubscription] = useState<{
    subscription: SubscriptionType;
    event: EventType;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !subscriptionId) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const fetchFileHero = async (
      sub: {
        subscription: SubscriptionType;
        event: EventType;
      } | null
    ) => {
      const url = await getDownloadURL(
        ref(storage, `Events/${sub?.event.id}/${sub?.event.fileHero}`)
      );
      const temp = { ...sub };
      if (!temp.event) return;
      temp.event.fileHero = url;
      setSubscription(
        temp as {
          subscription: SubscriptionType;
          event: EventType;
        } | null
      );
    };

    const fetchSubscription = async () => {
      setLoading(true);
      try {
        // Função para buscar o snapshot da assinatura
        const docSnapshot = await getDoc(
          doc(db, "Events", subscriptionId, "subscriptions", userId)
        );
        const subscriptionData = docSnapshot.data() as SubscriptionType;

        // Função para buscar dados do evento
        const eventDoc = await getDoc(doc(db, "Events", subscriptionId));
        const eventData = eventDoc.data() as EventType;

        const resp = {
          subscription: { ...subscriptionData },
          event: { ...eventData, id: subscriptionId },
        };

        setSubscription(resp);
        fetchFileHero(resp);
      } catch {
        setError("Erro ao buscar evento subscrito.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [subscriptionId, userId]);

  return { subscription, loading, error };
};

export default useUserSubscription;

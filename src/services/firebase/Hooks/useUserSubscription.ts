import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase/firebase";
import { SubscriptionType } from "@/types/Subscription";
import { EventType } from "@/types/Event";

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

    const fetchSubscription = async () => {
      setLoading(true);
      try {
        const docSnapshot = await getDoc(
          doc(db, "Events", subscriptionId, "subscriptions", userId)
        );
        const subscriptionData = docSnapshot.data() as SubscriptionType;

        const eventDoc = await getDoc(doc(db, "Events", subscriptionId));
        const eventData = eventDoc.data() as EventType;

        const resp = {
          subscription: { ...subscriptionData },
          event: { ...eventData, id: subscriptionId },
        };

        setSubscription(resp);
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

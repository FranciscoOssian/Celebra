import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase/firebase";
import { SubscriptionType } from "@/types/Subscription";
import { EventType } from "@/types/Event";

const useUserSubscriptions = (
  userId: string,
  listOfSubscriptions?: string[]
) => {
  const [subscriptions, setSubscriptions] = useState<
    {
      subscription: SubscriptionType;
      event: EventType;
    }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !listOfSubscriptions) {
      setSubscriptions([]);
      setLoading(false);
      return;
    }

    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        // Função para buscar o snapshot de uma assinatura
        const getSubscriptionSnapshot = async (
          subId: string,
          userId: string
        ) => {
          const docSnapshot = await getDoc(
            doc(db, "Events", subId, "subscriptions", userId)
          );
          return { id: subId, docSnapshot }; // Retorna o subId junto com o snapshot
        };

        // Função para buscar dados de um evento
        const getEventData = async (sub: SubscriptionType & { id: string }) => {
          const docSnapshot = await getDoc(doc(db, "Events", sub.id));
          return {
            subscription: { ...sub },
            event: { ...(docSnapshot.data() as EventType), id: sub.id },
          };
        };

        // Função principal para buscar as assinaturas e eventos
        const subs = await Promise.all(
          (
            await Promise.all(
              listOfSubscriptions?.map((subId) =>
                getSubscriptionSnapshot(subId, userId)
              ) ?? []
            )
          )
            .map((item) => ({
              ...(item.docSnapshot.data() as SubscriptionType),
              id: item.id,
            }))
            .map((sub) => getEventData(sub))
        );

        setSubscriptions(subs);
      } catch {
        setError("Erro ao buscar eventos subscritos.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [listOfSubscriptions, userId]);

  return { subscriptions, loading, error };
};

export default useUserSubscriptions;

import { SubscriptionType } from "@/types/Subscription";
import { UserType } from "@/types/user";
import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../firebase";

interface GuestSubscriptionType {
  subscription: SubscriptionType;
  user: UserType;
}

const useGuestsSubscriptions = (eventId: string) => {
  const [subscriptions, setSubscriptions] = useState<
    GuestSubscriptionType[] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      setSubscriptions(null);
      setLoading(false);
      return;
    }
    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        const guestsSubscriptionsQuerySnapshot = await getDocs(
          collection(db, "Events", eventId, "subscriptions")
        );

        const guests = guestsSubscriptionsQuerySnapshot.docs.map(
          (doc) => doc.data() as GuestSubscriptionType
        );

        setSubscriptions(guests);
      } catch {
        setError("Erro ao buscar subscriptions.");
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, [eventId]);

  const addGuest = (guestId: string) => {
    return guestId;
  };

  const removeGuest = (guestId: string) => {
    return guestId;
  };

  return { subscriptions, addGuest, removeGuest, loading, error };
};

export default useGuestsSubscriptions;

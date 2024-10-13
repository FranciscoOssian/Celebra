import { useDocument } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "@/services/firebase/firebase";
import { SubscriptionType } from "@/types/Subscription";

const useUserSubscription = (userId?: string, eventId?: string) => {
  const subscriptionRef =
    userId && eventId
      ? doc(db, "Users", userId, "subscriptions", eventId)
      : null;

  const [subscriptionSnapshot, loading, error] = useDocument(subscriptionRef);

  const subscription = subscriptionSnapshot?.data() as
    | SubscriptionType
    | undefined;
  const noSubscription = !loading && !subscriptionSnapshot?.exists();

  return {
    subscription,
    loading,
    error: error ? "Erro ao buscar eventos subscritos." : null,
    noSubscription,
  };
};

export default useUserSubscription;

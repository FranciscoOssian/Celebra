import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { SubscriptionType } from "@/types/Subscription";
import getEvent from "./event";
import { EventType } from "@/types/Event";

const fetchEventSubscriptions = async (eventIds: string[] | undefined) => {
  if (!eventIds) return;

  const eventSubscriptions: {
    event: EventType;
    subscriptions: SubscriptionType[];
  }[] = [];

  try {
    for (const eventId of eventIds) {
      const subscriptionsSnapshot = await getDocs(
        collection(db, "Events", eventId, "subscriptions")
      );

      // Para cada evento, crie um objeto com as subscriptions
      const subscriptions: SubscriptionType[] = [];
      subscriptionsSnapshot.forEach((doc) => {
        const subscriptionData = doc.data();
        console.log(subscriptionData);
        if (subscriptionData) {
          subscriptions.push({
            amount: subscriptionData?.amount || 0,
            purchasedAt: subscriptionData?.purchasedAt || null,
          });
        }
      });

      eventSubscriptions.push({
        event: (await getEvent(eventId)) as EventType,
        subscriptions,
      });
    }
  } catch (error) {
    console.error("Erro ao buscar subscriptions dos eventos:", error);
  }

  return eventSubscriptions;
};

const calculateTotalTicketsForEvent = (
  eventId: string,
  eventSubscriptions: any[]
) => {
  let totalTickets = 0;

  eventSubscriptions.forEach((event) => {
    if (event.event.id === eventId) {
      event.subscriptions.forEach((subscription: { amount: number }) => {
        totalTickets += subscription.amount;
      });
    }
  });

  return totalTickets;
};

const calculateTotalTickets = (eventSubscriptions: any[]) => {
  let totalTickets = 0;

  eventSubscriptions.forEach((event) => {
    event.subscriptions.forEach((subscription: { amount: number }) => {
      totalTickets += subscription.amount;
    });
  });

  return totalTickets;
};

export {
  fetchEventSubscriptions,
  calculateTotalTickets,
  calculateTotalTicketsForEvent,
};

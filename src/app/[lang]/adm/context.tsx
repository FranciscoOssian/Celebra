import useUser, { User } from "@/services/firebase/Hooks/useUser";
import { fetchEventSubscriptions } from "@/services/firebase/Read/totalTickets";
import { EventType } from "@/types/Event"; // Usando seu tipo EventType
import { SubscriptionType } from "@/types/Subscription";
import { FirestoreError } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AppContextType {
  setSubscriptions: React.Dispatch<
    React.SetStateAction<
      {
        event: EventType;
        subscriptions: SubscriptionType[];
      }[]
    >
  >;
  subscriptions:
    | {
        event: EventType;
        subscriptions: SubscriptionType[];
      }[];
  user: {
    user: User;
    loading: boolean;
    error: Error | FirestoreError | undefined;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const user = useUser();

  const [subscriptions, setSubscriptions] = useState<
    {
      event: EventType;
      subscriptions: SubscriptionType[];
    }[]
  >([]);

  useEffect(() => {
    fetchEventSubscriptions(user?.user?.events).then((amount) =>
      setSubscriptions(amount ?? [])
    );
  }, [user?.user?.events]);

  return (
    <AppContext.Provider value={{ user, subscriptions, setSubscriptions }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext deve ser usado dentro do AppProvider");
  }
  return context;
};

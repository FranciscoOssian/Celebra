"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import SlideButton from "@/components/pages/dashboard/SlideButton";
import useUser from "@/services/firebase/Hooks/useUser";
import useUserEvents from "@/services/firebase/Hooks/useEvents";
import { QueueListIcon, TableCellsIcon } from "@heroicons/react/16/solid";
import EventForm, {
  EventFormType,
} from "@/components/pages/dashboard/EventForm";
import Image from "next/image";
import useDeviceType from "@/hooks/useDeviceType";
import { app } from "@/services/firebase/firebase";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import updateUser from "@/services/firebase/Update/user";
import EventList from "@/components/pages/dashboard/EventList";
import useUserSubscriptions from "@/services/firebase/Hooks/useUserSubscriptions";
import SwitchSelection from "@/components/common/SwitchSelection";
import { motion } from "framer-motion";
import BottomSheet from "@/components/common/BottomSheet";
import { getTranslations, translations } from "@/services/translations";

const auth = getAuth(app);

const DashboardPage = ({ params: { lang } }: { params: { lang: string } }) => {
  const { user } = useUser();
  const { subscriptions } = useUserSubscriptions(
    user?.uid,
    user?.subscriptions
  );
  const { events: myEvents, deleteEvent } = useUserEvents(user?.events);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deviceType = useDeviceType();
  const router = useRouter();

  const [items, setItems] = useState<string[]>([]);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const [evenType, setEventType] = useState<"my" | "third_parties">("my");
  const [events, setEvents] = useState(myEvents);

  const t = getTranslations(lang, translations);

  useEffect(() => {
    if (evenType === "my") {
      setEvents(myEvents);
      setItems(myEvents.map((e) => e.id));
    } else {
      setEvents(subscriptions.map((sub) => sub.event));
      setItems(subscriptions.map((sub) => sub.event.id));
    }
  }, [evenType, subscriptions, myEvents]);

  useEffect(() => {
    if (deviceType === "desktop" && events.length > 1) {
      setViewMode("grid");
    } else {
      setViewMode("list");
    }
  }, [deviceType, events, evenType]);

  const handleReorder = useCallback(
    (newOrder: string[]) => {
      if (viewMode === "grid" || evenType === "third_parties") return;

      setItems(newOrder);

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const id = setTimeout(() => {
        updateUser(user?.uid, { events: newOrder });
      }, 2000);

      setTimeoutId(id);
    },
    [viewMode, evenType, timeoutId, user?.uid]
  );

  const handleCreateEvent = async (eventData: EventFormType) => {
    try {
      const tokenId = await auth.currentUser?.getIdToken();

      const formData = new FormData();
      formData.append("tokenId", tokenId ?? "");
      formData.append("event", JSON.stringify({ ...eventData }));

      if (eventData.eventFileHero) {
        formData.append("file", eventData.eventFileHero);
      }

      const response = await fetch("/api/createEvent", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setIsModalOpen(false);

        //if (analytics)
        //  logEvent(analytics, "createEvent", {
        //    userId: user.uid, // O ID do usuário autenticado
        //    userEmail: user.email, // Ou outros dados que você queira acompanhar
        //  });
        router.refresh();
      } else if (result.url) {
        setIsModalOpen(false);
        window.location.href = result.url;
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Erro ao criar evento:", error);
    }
  };

  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === "list" ? "grid" : "list"));
  };

  const handleDelete = useCallback(
    (eventId: string) => {
      deleteEvent(eventId);
      const updatedItems = items.filter((id) => id !== eventId);
      setItems(updatedItems);
      updateUser(user?.uid, { events: updatedItems });
    },
    [deleteEvent, items, user]
  );

  const subText = useMemo(() => {
    if (evenType === "my") {
      if (events.length === 0) return t("You haven't created any events yet.");
      else
        return `${t("You have")} ${user?.purchasedEvents} ${t(
          "Purchased event(s) available for creation."
        )}`;
    } else
      return `${t("You are registered for")} ${events?.length ?? 0} ${t(
        "events"
      )}`;
  }, [evenType, user, events]);

  return (
    <>
      <div className="container mx-auto p-4">
        <header className="flex mb-20 relative flex-col items-center pt-20">
          <h1 className="mb-6  text-6xl text-center font-bold tracking-tight text-[#001122]">
            {t("My Events")}
          </h1>
          <motion.div className="mb-6 absolute -bottom-16 text-center font-bold tracking-tight text-[#001122]">
            {subText}
          </motion.div>
        </header>

        <SwitchSelection
          onSelect={(s) => {
            if (s === t("Created by me")) setEventType("my");
            else if (s === t("I registered for")) setEventType("third_parties");
          }}
          options={[t("Created by me"), t("I registered for")]}
        />

        {events?.length !== 0 && (
          <div className="flex justify-between items-center w-full max-md:flex-col gap-6">
            <div />
            <div className="flex h-10 gap-5 m-4">
              <button
                className="p-2 bg-blue-500 text-white rounded-lg max-md:order-2"
                onClick={toggleViewMode}
                aria-label={t("Toggle view mode")}
              >
                {viewMode === "list" ? (
                  <QueueListIcon className="w-6 h-6" />
                ) : (
                  <TableCellsIcon className="w-6 h-6" />
                )}
              </button>

              <SlideButton
                className={`${evenType !== "my" ? "hidden" : ""}`}
                onClick={() => {
                  if ((user?.events?.length ?? 0) >= 3) {
                    //alert(
                    //  "Limite de eventos atingido, em breve teremos opção por pagamento"
                    //);
                    setIsModalOpen(true);
                  } else {
                    setIsModalOpen(true);
                  }
                }}
              />
            </div>
          </div>
        )}

        {events?.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 mt-3 text-center">
            {evenType === "my" && (
              <SlideButton
                className={`${evenType !== "my" ? "hidden" : ""}`}
                onClick={() => {
                  if ((user?.events?.length ?? 0) >= 3) {
                    //alert(
                    //  "Limite de eventos atingido, em breve teremos opção por pagamento"
                    //);
                    setIsModalOpen(true);
                  } else {
                    setIsModalOpen(true);
                  }
                }}
              />
            )}
            <div className="flex flex-col justify-center items-center text-center">
              <Image
                src="/no-events.jpeg"
                alt="Sem eventos"
                width={256}
                height={256}
                className="w-64 h-64 rounded-full"
              />
              <h2 className="text-2xl font-semibold text-gray-500 mt-4">
                {t("You have no events :(")}
              </h2>
              <p className="text-gray-400 mt-2">
                {evenType === "my" ? t("Create") : t("Find")}{" "}
                {t("your first event and start planning something amazing!")}
              </p>
            </div>
          </div>
        )}

        <EventList
          items={items}
          events={events}
          eventType={evenType}
          viewMode={viewMode}
          onReorder={handleReorder}
          onDelete={handleDelete}
        />
      </div>
      <BottomSheet isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">{t("Create New Event")}</h2>
        <EventForm onSubmit={handleCreateEvent} />
      </BottomSheet>
    </>
  );
};

export default DashboardPage;

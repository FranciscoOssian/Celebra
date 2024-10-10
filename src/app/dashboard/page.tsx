// src/components/Dashboard/DashboardPage.tsx

"use client";

import { useEffect, useState, useCallback } from "react";
import SlideButton from "@/components/pages/dashboard/SlideButton";
import useUser from "@/services/firebase/Hooks/useUser";
import useUserEvents from "@/services/firebase/Hooks/useEvents";
import { QueueListIcon, TableCellsIcon } from "@heroicons/react/16/solid";
import Modal from "@/components/common/Modal";
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

const auth = getAuth(app);

const DashboardPage: React.FC = () => {
  const { user } = useUser();
  const { events, deleteEvent } = useUserEvents(user?.events);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deviceType = useDeviceType();
  const router = useRouter();

  const [items, setItems] = useState<string[]>([]);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (events) {
      setItems(events.map((event) => event.id));
    }
  }, [events]);

  useEffect(() => {
    if (deviceType === "desktop" && events.length > 1) {
      setViewMode("grid");
    } else {
      setViewMode("list");
    }
  }, [deviceType, events]);

  const handleReorder = useCallback(
    (newOrder: string[]) => {
      if (viewMode === "grid") return;

      setItems(newOrder);

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const id = setTimeout(() => {
        updateUser(user?.uid, { events: newOrder });
      }, 2000);

      setTimeoutId(id);
    },
    [viewMode, timeoutId, user]
  );

  const handleCreateEvent = async (eventData: EventFormType) => {
    try {
      const tokenId = await auth.currentUser?.getIdToken();

      const formData = new FormData();
      formData.append("tokenId", tokenId ?? "");
      formData.append(
        "event",
        JSON.stringify({ ...eventData, creatorId: user?.uid })
      );

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

  return (
    <div className="container mx-auto p-4">
      <header className="flex flex-col items-center pt-20">
        <h1 className="mb-6 text-6xl text-center font-bold tracking-tight text-[#001122]">
          Meus Eventos
        </h1>
        {(user?.purchasedEvents ?? 0) > 0 && (
          <div className="mb-6 text-center font-bold tracking-tight text-[#001122]">
            Você tem {user?.purchasedEvents} evento(s) comprado(s) disponíveis
            para criação
          </div>
        )}
        <SlideButton
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
      </header>

      {user?.events?.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-10 text-center">
          <Image
            src="/no-events.jpeg"
            alt="Sem eventos"
            width={256}
            height={256}
            className="w-64 h-64 rounded-full"
          />
          <h2 className="text-2xl font-semibold text-gray-500 mt-4">
            Você não tem eventos :(
          </h2>
          <p className="text-gray-400 mt-2">
            Crie seu primeiro evento e comece a planejar algo incrível!
          </p>
        </div>
      )}

      {user?.events?.length !== 0 && (
        <div className="w-full flex justify-end mb-3">
          <button
            className="p-2 bg-blue-500 text-white rounded-lg"
            onClick={toggleViewMode}
            aria-label="Alternar modo de visualização"
          >
            {viewMode === "list" ? (
              <QueueListIcon className="w-6 h-6" />
            ) : (
              <TableCellsIcon className="w-6 h-6" />
            )}
          </button>
        </div>
      )}

      <EventList
        items={items}
        events={events}
        viewMode={viewMode}
        onReorder={handleReorder}
        onDelete={handleDelete}
      />

      <Modal
        className="bg-white p-4 m-4 md:m-0 rounded-3xl w-full md:w-1/2"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <h2 className="text-xl font-semibold mb-4">Criar Novo Evento</h2>
        <EventForm onSubmit={handleCreateEvent} />
      </Modal>
    </div>
  );
};

export default DashboardPage;

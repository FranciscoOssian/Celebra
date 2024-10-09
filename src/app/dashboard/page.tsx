"use client";

import { useEffect, useState } from "react";
import SlideButton from "@/components/pages/dashboard/SlideButton";
import useUser from "@/services/firebase/Hooks/useUser";
import useUserEvents from "@/services/firebase/Hooks/useEvents";
import { useMotionValue, motion } from "framer-motion";
import {
  QueueListIcon,
  TableCellsIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import Modal from "@/components/common/Modal";
import EventForm, {
  EventFormType,
} from "@/components/pages/dashboard/EventForm";
import Link from "next/link";
import Image from "next/image";
import useDeviceType from "@/hooks/useDeviceType";
import { app } from "@/services/firebase/firebase";
import { useRouter } from "next/navigation";
import { Reorder } from "framer-motion";

import { getAuth } from "firebase/auth";
import updateUser from "@/services/firebase/Update/user";

import { EventType } from "@/types/Event";

const auth = getAuth(app);

const Item = ({ event }: { event: EventType }) => {
  const y = useMotionValue(0);
  const [dragged, setDragged] = useState(false);
  const [startPosition, setStartPosition] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false); // Estado para controlar a visibilidade do menu

  const handleDragStart = (event: PointerEvent | MouseEvent | TouchEvent) => {
    setDragged(true);
    let startX: number;

    if ("touches" in event) {
      startX = event.touches[0].clientX; // Para TouchEvent
    } else {
      startX = event.clientX; // Para MouseEvent
    }

    setStartPosition(startX); // Captura a posição inicial
  };

  const handleDrag = (event: PointerEvent | MouseEvent | TouchEvent) => {
    if (dragged) {
      let currentX: number;

      if ("touches" in event) {
        currentX = event.touches[0].clientX; // Para TouchEvent
      } else {
        currentX = event.clientX; // Para MouseEvent
      }

      // Determine a direção do drag
      const direction = currentX - startPosition;

      // Verifica se arrastou para a direita
      if (direction > 50) {
        setMenuVisible(true); // Mostra o menu
      } else if (direction < -50) {
        setMenuVisible(false); // Esconde o menu
      }
    }
  };

  const handleDragEnd = () => {};

  return (
    <Reorder.Item
      drag="x"
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      value={event.id}
      id={event.id}
      style={{ y, x: menuVisible ? 100 : 0 }}
      className="w-full flex justify-center items-center relative"
    >
      <motion.div
        onClick={() => ({})}
        initial={{ scale: 0 }}
        animate={{ scale: menuVisible ? 1 : 0 }}
        className="w-20 h-full bg-red-600 rounded-3xl absolute -right-4 flex justify-center items-center"
      >
        <TrashIcon className="size-10 text-white" />
      </motion.div>

      <Link className="w-full" href={`/event/${event.id}`}>
        <div
          className={`bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-3xl shadow-lg w-full`}
        >
          <h2 className="text-xl font-semibold">{event?.name}</h2>
          <p className="mt-2 text-sm">
            {new Date(event.date).getDate()}/
            {new Date(event.date).getMonth() + 1}/
            {new Date(event.date).getFullYear()}
          </p>
          <p className="mt-1 text-xs text-gray-200">{event?.location}</p>
        </div>
      </Link>
    </Reorder.Item>
  );
};

export default function DashboardPage() {
  const { user } = useUser();
  const { events, loading: loadingEvents } = useUserEvents(user?.events);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deviceType = useDeviceType();
  const router = useRouter();

  // Inicialize items como um array de IDs dos eventos
  const [items, setItems] = useState<string[]>([]);

  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleReorder = (newOrder: string[]) => {
    if (viewMode === "grid") return;

    setItems(newOrder);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Crie um novo timeout
    const id = setTimeout(() => {
      updateUser(user.uid, { events: newOrder });
    }, 2000);

    setTimeoutId(id);
  };

  useEffect(() => {
    if (events) {
      setItems(events.map((event: EventType) => event.id));
    }
  }, [events]);

  useEffect(() => {
    if (deviceType === "desktop" && events.length > 1) setViewMode("grid");
    else setViewMode("list");
  }, [deviceType, events]);

  const handleCreateEvent = async (eventData: EventFormType) => {
    const tokenId = await auth?.currentUser?.getIdToken();

    // Crie uma nova instância de FormData
    const formData = new FormData();

    // Adicione o tokenId ao FormData
    formData.append("tokenId", tokenId ?? "");

    // Adicione o objeto eventData ao FormData como uma string JSON
    formData.append(
      "event",
      JSON.stringify({ ...eventData, creatorId: user?.uid })
    );

    // Se houver um arquivo, adicione também ao FormData
    const file = eventData.eventFileHero;
    if (file) {
      formData.append("file", file); // Supondo que 'file' é um objeto do tipo File
    }

    // Envie a requisição usando fetch
    const response = await fetch("/api/createEvent", {
      method: "POST",
      body: formData, // Use formData diretamente
    });

    const result = await response.json();

    console.log(result);

    if (result.success) {
      // Evento criado com sucesso
      setIsModalOpen(false);
      router.refresh(); // Atualiza a página
    } else if (result.url) {
      setIsModalOpen(false);
      window.location.href = result.url;
    } else {
      console.error(result.error);
    }
  };

  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === "list" ? "grid" : "list"));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center items-center pt-20 flex-col">
        <h1 className="mb-6 text-[72px] text-center leading-none font-bold tracking-tight text-[#001122]">
          Meus Eventos
        </h1>
        <SlideButton
          onClick={async () => {
            if ((user?.events?.length ?? 0) >= 3) {
              alert("Limite de eventos atingido");
            } else {
              setIsModalOpen(true);
            }
          }}
        />
      </div>

      {events.length === 0 && !loadingEvents && (
        <div className="select-none flex flex-col items-center justify-center mt-10">
          <Image
            src="/no-events.jpeg"
            alt="Sem eventos"
            width={256}
            height={256}
            className="w-64 h-64 rounded-full"
          />
          <h2 className="text-2xl font-semibold text-gray-500 mt-4">
            {"Você não tem eventos :("}
          </h2>
          <p className="text-gray-400 mt-2 text-center">
            Crie seu primeiro evento e comece a planejar algo incrível!
          </p>
        </div>
      )}

      {events.length > 0 && (
        <div className="w-full flex justify-end items-end mb-3">
          <button
            className="size-11 p-2 bg-blue-500 text-white rounded-lg"
            onClick={toggleViewMode}
          >
            {viewMode === "list" ? <QueueListIcon /> : <TableCellsIcon />}
          </button>
        </div>
      )}

      <Reorder.Group
        axis="y"
        onReorder={handleReorder}
        values={items}
        className={`w-full ${
          viewMode === "grid" ? "grid gap-4" : "flex flex-col space-y-4"
        }`}
        animate={{
          gridTemplateColumns:
            viewMode === "grid" ? "repeat(2, minmax(0, 1fr))" : "none",
          gap: viewMode === "grid" ? "1rem" : "0",
        }}
        transition={{ duration: 0.2 }}
      >
        {items.map((eventId) => {
          const event = events.find((e: EventType) => e.id === eventId);
          return event ? <Item key={event.id} event={event} /> : null;
        })}
      </Reorder.Group>

      {/* Modal com Formulário de Evento */}
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
}

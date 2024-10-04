"use client";

import { useEffect, useState } from "react";
import SlideButton from "@/components/pages/dashboard/SlideButton";
import useUser from "@/services/firebase/Hooks/useUser";
import useUserEvents from "@/services/firebase/Hooks/useEvents";
import { motion } from "framer-motion";
import { QueueListIcon, TableCellsIcon } from "@heroicons/react/16/solid";
import Modal from "@/components/common/Modal";
import EventForm from "@/components/pages/dashboard/EventForm";
import Link from "next/link";
import Image from "next/image";
import useDeviceType from "@/hooks/useDeviceType";
import { app } from "@/services/firebase/firebase";
import { useRouter } from "next/navigation";

import { getAuth } from "firebase/auth";

const auth = getAuth(app);

export default function DashboardPage() {
  const { user } = useUser();
  const { events, loading: loadingEvents } = useUserEvents(user?.events);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deviceType = useDeviceType();
  const router = useRouter();

  useEffect(() => {
    if (deviceType === "desktop" && events.length > 1) setViewMode("grid");
    else setViewMode("list");
  }, [deviceType, events]);

  const handleCreateEvent = async (eventData: unknown) => {
    const tokenId = await auth?.currentUser?.getIdToken();
    const response = await fetch("/api/createEvent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tokenId: tokenId,
        event: eventData,
      }),
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
            if (user.events.length >= 3) {
              alert("limite de eventos atingido");
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

      <motion.ul
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
        {events.map((event, i) => (
          <li key={i} className="w-full">
            <Link href={`/event/${event.id}`}>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-3xl shadow-lg">
                <h2 className="text-xl font-semibold">{event?.name}</h2>
                <p className="mt-2 text-sm">
                  {new Date(event.date).getDay() - 1}/
                  {new Date(event.date).getMonth()}/
                  {new Date(event.date).getFullYear()}
                </p>
                <p className="mt-1 text-xs text-gray-200">{event?.location}</p>
              </div>
            </Link>
          </li>
        ))}
      </motion.ul>

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

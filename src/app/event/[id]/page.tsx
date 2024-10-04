"use client";

import { useEffect } from "react";
import Link from "next/link";
import { doc, DocumentData } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { db } from "@/services/firebase/firebase"; // Certifique-se de ajustar o caminho para o seu arquivo de configuração do Firebase

export default function EventPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // Usando o hook para buscar o documento do evento
  const [event, loading, error] = useDocument<DocumentData>(
    doc(db, "Events", id)
  );

  useEffect(() => {
    if (error) {
      console.error("Erro ao buscar o evento:", error);
    }
  }, [error]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro ao buscar o evento. Tente novamente.</div>;
  }

  if (!event?.exists()) {
    return <div>Evento não encontrado.</div>;
  }

  const eventData = event.data(); // Obtém os dados do documento

  return (
    <div className="container mx-auto p-4 mt-28">
      <h1 className="text-3xl font-bold mb-4">{eventData.name}</h1>
      <p className="text-lg mb-2">
        <strong>Data e Hora:</strong>{" "}
        {new Date(eventData.date.seconds * 1000).toLocaleString()}
      </p>
      <p className="text-lg mb-2">
        <strong>Local:</strong> {eventData.location}
      </p>
      <p className="text-lg mb-4">
        <strong>Descrição:</strong> {eventData.description}
      </p>
      <Link href="/dashboard" className="text-blue-500 underline">
        Voltar para a lista de eventos
      </Link>
    </div>
  );
}

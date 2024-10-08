"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { doc, DocumentData } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { useDocument } from "react-firebase-hooks/firestore";
import { db, storage } from "@/services/firebase/firebase";
import InternalLayout from "@/components/layout/InternalLayout";
import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";

export default function EventPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const [event, loading, error] = useDocument<DocumentData>(
    doc(db, "Events", id)
  );

  const [fileHero, setFileHero] = useState<string>("");

  useEffect(() => {
    if (event && event.exists()) {
      const eventData = event.data(); // Obtém os dados do documento
      const run = async () => {
        try {
          const url = await getDownloadURL(
            ref(storage, "Events/" + id + "/" + eventData.fileHero)
          );
          setFileHero(url);
        } catch (err) {
          console.error("Erro ao obter a URL do arquivo:", err);
        }
      };
      run();
    }
  }, [event, id]); // Dependências do useEffect: evento e id

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

  const eventData = event.data();

  return (
    <div className="flex flex-col justify-center items-center">
      {fileHero && (
        <div className="w-full h-52 md:w-[50%] relative flex justify-center items-center">
          <div className="max-md:hidden absolute w-[100vw] h-52 opacity-30">
            <Image
              src={fileHero}
              alt="Hero Image"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <Image
            src={fileHero}
            alt="Hero Image"
            layout="fill"
            objectFit="cover"
          />
        </div>
      )}
      <InternalLayout className="mt-5">
        <h1 className="text-3xl font-bold mb-4">{eventData.name}</h1>
        <div className="flex text-lg mb-2">
          <ClockIcon className="size-7 mr-1" />
          {new Date(eventData.date).toLocaleString()}
        </div>
        <div className="flex text-lg mb-2">
          <MapPinIcon className="size-7 mr-1" />
          {eventData.location}
        </div>
        <p className="text-lg mb-4">
          <strong>Sobre:</strong> {eventData.about}
        </p>
      </InternalLayout>
    </div>
  );
}

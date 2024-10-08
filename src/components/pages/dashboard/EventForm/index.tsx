import { useState } from "react";
import Image from "next/image";

export interface EventFormType {
  name: string;
  date: string;
  location: string;
  about: string;
  eventFileHero?: File | undefined;
}

export default function EventForm({
  onSubmit,
}: {
  onSubmit: ({
    name,
    date,
    location,
    about,
    eventFileHero,
  }: EventFormType) => void;
}) {
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");
  const [eventFileHero, setEventFileHero] = useState<File | undefined>(
    undefined
  );
  const [eventFileHeroPreview, setEventFileHeroPreview] = useState<
    string | undefined
  >(undefined);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    onSubmit({ name, date: dateTime, location, about, eventFileHero });
  };

  const handleFileChange = (file: File | undefined) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setEventFileHero(file);
      setEventFileHeroPreview(imageUrl);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFileChange(file);
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full flex flex-col gap-4`}>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nome do Evento
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Sobre o Evento
        </label>
        <textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Data e Hora
        </label>
        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Local</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <div className="">
        <label className="block text-sm font-medium text-gray-700">
          Imagem/Vídeo de divulgação (opcional)
        </label>
        <input
          type="file"
          onChange={handleFileInput}
          accept="image/png, image/jpeg, image/webp, video/webm, video/mp4"
        />
        {eventFileHeroPreview && (
          <div className="relative w-fill h-20">
            {eventFileHero?.type.includes("image") && (
              <Image
                src={eventFileHeroPreview ?? ""}
                alt=""
                objectFit="contain"
                fill
              />
            )}
            {eventFileHero?.type.includes("video") && (
              <video controls className="w-full h-20">
                <source src={eventFileHeroPreview} type="video/webm" />
              </video>
            )}
          </div>
        )}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Criar Evento
        </button>
      </div>
    </form>
  );
}

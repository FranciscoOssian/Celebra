import { useState } from "react";

export default function EventForm({
  onSubmit,
}: {
  onSubmit: ({
    name,
    date,
    location,
    about,
  }: {
    name: string;
    date: string;
    location: string;
    about: string;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Aqui você passa os dados preenchidos no form para o pai
    onSubmit({ name, date: dateTime, location, about });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
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
        <input
          type="text"
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

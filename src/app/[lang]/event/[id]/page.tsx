import { EventType } from "@/types/Event";
import { PuckPage } from "@/components/pages/event/Puck";
import { NormalPage } from "@/components/pages/event/Normal";

async function getEvent(id: string): Promise<EventType> {
  const response = await fetch(
    `http://${process.env.NEXT_PUBLIC_DOMAIN}/api/get/event/${id}`,
    { next: { revalidate: 1200 } }
  );
  return response.json();
}

const EventPage = async ({
  params: { id, lang },
}: {
  params: { id: string; lang: string };
}) => {
  const event = await getEvent(id);

  if (event?.usePuck) return <PuckPage event={event} />;

  return <NormalPage lang={lang} event={{ ...event, id }} />;
};

export default EventPage;

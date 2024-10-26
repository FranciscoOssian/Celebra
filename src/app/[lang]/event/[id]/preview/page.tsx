import { NormalPage } from "@/components/pages/event/Normal";
import { PuckPage } from "@/components/pages/event/Puck";
import { EventType } from "@/types/Event";

export const dynamic = "force-dynamic";

async function getEvent(id: string): Promise<EventType> {
  const response = await fetch(
    `http://${process.env.NEXT_PUBLIC_BASE_URL}/api/get/event/${id}`,
    { cache: "no-store" }
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

  return <NormalPage lang={lang} event={event} />;
};

export default EventPage;

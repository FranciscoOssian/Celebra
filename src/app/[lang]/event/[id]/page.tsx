import { EventType } from "@/types/Event";
import { PuckPage } from "@/components/pages/event/Puck";
import { NormalPage } from "@/components/pages/event/Normal";
import type { Metadata } from "next";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

async function getEvent(id: string): Promise<EventType> {
  const response = await fetch(
    `http://${process.env.NEXT_PUBLIC_DOMAIN}/api/get/event/${id}`,
    { next: { revalidate: 1200 } }
  );
  return response.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;

  const event = await getEvent(id);

  return {
    title: event.name,
    description: event.description,
  };
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

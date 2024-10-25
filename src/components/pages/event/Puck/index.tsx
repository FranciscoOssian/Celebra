import Render from "@/services/puck/Render";
import { EventType } from "@/types/Event";

export const PuckPage = ({ event }: { event: EventType }) => {
  return <Render data={event?.puckData as never} />;
};

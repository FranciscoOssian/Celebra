"use client";

import { AnimatePresence, Reorder } from "framer-motion";
import EventItem from "../EventItem";
import { EventType } from "@/types/Event";

interface EventListProps {
  items: string[];
  events: EventType[];
  eventType: string;
  viewMode: "list" | "grid";
  onReorder: (newOrder: string[]) => void;
  onDelete: (eventId: string) => void;
}

const EventList: React.FC<EventListProps> = ({
  items,
  events,
  viewMode,
  eventType,
  onReorder,
  onDelete,
}) => {
  return (
    <AnimatePresence>
      <Reorder.Group
        axis="y"
        onReorder={onReorder}
        values={items}
        className={`w-full ${
          viewMode === "grid"
            ? "grid gap-4 grid-cols-2"
            : "flex flex-col space-y-4"
        }`}
        transition={{ duration: 0.2 }}
      >
        {items.map((eventId) => {
          const event = events.find((e) => e.id === eventId);
          return event ? (
            <EventItem
              eventType={eventType}
              key={event.id}
              event={event}
              onDelete={() => onDelete(event.id)}
            />
          ) : null;
        })}
      </Reorder.Group>
    </AnimatePresence>
  );
};

export default EventList;

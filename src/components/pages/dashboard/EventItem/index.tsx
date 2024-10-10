"use client";

import { useState } from "react";
import Link from "next/link";
import { useMotionValue, motion } from "framer-motion";
import { TrashIcon } from "@heroicons/react/16/solid";
import { Reorder, PanInfo } from "framer-motion";
import { EventType } from "@/types/Event";

interface EventItemProps {
  event: EventType;
  onDelete: () => void;
}

const EventItem: React.FC<EventItemProps> = ({ event, onDelete }) => {
  const y = useMotionValue(0);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    setIsDragging(false);
    if (info.offset.x > 50) {
      setMenuVisible(true);
    } else if (info.offset.x < -50) {
      setMenuVisible(false);
    }
  };

  return (
    <Reorder.Item
      drag
      value={event.id}
      id={event.id}
      exit={{ x: -300, opacity: 0 }}
      style={{ y, x: menuVisible ? 100 : 0 }}
      className="w-full flex justify-center items-center relative"
      onDragEnd={handleDragEnd}
      onDragStart={() => setIsDragging(true)}
    >
      <motion.div
        onClick={onDelete}
        initial={{ scale: 0 }}
        animate={{ scale: menuVisible ? 1 : 0 }}
        className="w-20 h-full bg-red-600 rounded-3xl absolute -right-4 flex justify-center items-center cursor-pointer"
      >
        <TrashIcon className="w-6 h-6 text-white" />
      </motion.div>

      <Link
        draggable="false"
        href={`/event/${event.id}`}
        onClick={(e) => {
          if (isDragging) e.preventDefault();
        }}
        className="w-full select-none"
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-3xl shadow-lg w-full">
          <h2 className="text-xl font-semibold">{event.name}</h2>
          <p className="mt-2 text-sm">
            {new Date(event.date).toLocaleDateString()}
          </p>
          <p className="mt-1 text-xs text-gray-200">{event.location}</p>
        </div>
      </Link>
    </Reorder.Item>
  );
};

export default EventItem;

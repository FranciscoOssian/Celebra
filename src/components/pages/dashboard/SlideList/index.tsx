"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SlideList({
  list,
}: {
  list: {
    id: string;
    data: { imageUrl: string; projectData: { name: string } };
  }[];
}) {
  const router = useRouter();

  return (
    <section className="w-full flex flex-wrap justify-center gap-4">
      {list.map((slide, index) => (
        <motion.div
          key={index}
          className="relative w-full md:w-1/2 lg:w-1/3 p-4 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.preventDefault();
            router.push(`/editor/${slide.id}`);
          }}
        >
          <div className="relative w-full h-60 rounded-lg overflow-hidden">
            <Image
              alt={slide.data.projectData.name}
              src={slide.data.imageUrl}
              layout="fill"
              objectFit="cover"
              className="absolute inset-0"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black via-transparent to-transparent">
              <p className="text-white font-semibold text-lg">
                {slide.data.projectData.name}
              </p>
              <p className="text-gray-300 text-sm">{}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </section>
  );
}

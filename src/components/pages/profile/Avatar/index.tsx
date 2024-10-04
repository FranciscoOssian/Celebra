"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Avatar({ img }: { img: string }) {
  return (
    <motion.div
      className="size-64"
      initial={{
        scale: 1,
        rotate: -3,
      }}
      whileHover={{
        scale: 1.05,
        rotate: 0,
      }}
    >
      <div className="w-full h-full flex justify-center items-center rounded-[40px] shadow-[0px_0.602187px_3.01094px_-0.333333px_rgba(0,0,0,0.02),_0px_2.28853px_11.4427px_-0.666667px_rgba(0,0,0,0.035),_0px_10px_5px_rgba(0,0,0,0.08)]">
        <div className="relative size-52 overflow-hidden rounded-[40px]">
          <Image alt="user profile picture" src={img} fill objectFit="cover" />
        </div>
      </div>
    </motion.div>
  );
}

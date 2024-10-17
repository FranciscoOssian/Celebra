"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import useScreenDimensions from "@/hooks/useScreenDimensions";
import Button from "../Button";
import { useParams } from "next/navigation";
import { getTranslations, translations } from "@/services/translations";
import useDeviceType from "@/hooks/useDeviceType";

const BottomSheet = ({
  children,
  isOpen,
  onClose,
  className,
}: {
  isOpen: boolean;
  className?: string;
  onClose: () => void;
  children?: React.ReactNode;
}) => {
  const { height } = useScreenDimensions();
  const { lang } = useParams();
  const deviceType = useDeviceType();
  const t = getTranslations(
    typeof lang === "string" ? lang : "en",
    translations
  );

  const classNameFinal = `rounded-2xl p-6 w-full bg-white h-[100vh] absolute right-0 top-0 shadow-[0px_-40px_50px_rgba(0,0,0,0.4)] ${
    deviceType === "desktop" || deviceType === "tablet"
      ? "!w-1/2"
      : "!top-[15%]"
  } ${className}`;
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="touch-none absolute z-50 w-[100vw] h-[100vh] bottom-0 overflow-hidden">
          <motion.div
            className="w-full h-full bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: isOpen ? 0.9 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "tween", stiffness: 0, duration: 0.9 }}
          />
          <motion.div
            className={classNameFinal}
            initial={{ y: height }}
            exit={{ y: isOpen ? height : 0 }}
            animate={{ y: isOpen ? 0 : height }}
            transition={{ type: "tween", stiffness: 0, duration: 0.7 }}
            drag="y"
            dragConstraints={{
              top: 0,
              bottom: 0,
            }}
          >
            <div className="w-full flex justify-end">
              <div className="w-[55%] mb-4 flex justify-between items-center">
                {/* Barra de arraste */}
                <div className="w-16 h-2 bg-gray-300 rounded cursor-pointer" />
                {/* Cancelar */}
                <Button onClick={onClose}>{t("Close")}</Button>
              </div>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;

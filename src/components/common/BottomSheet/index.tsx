import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import useScreenDimensions from "@/hooks/useScreenDimensions";
import Button from "../Button";

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
  const classNameFinal = `rounded-2xl w-full bg-white h-[100vh] absolute right-0 top-[60px] shadow-[0px_-40px_50px_rgba(0,0,0,0.4)] ${className}`;
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="touch-none absolute z-50 w-[100vw] h-[100vh] bottom-0 overflow-hidden">
          <motion.div
            className="w-full h-full bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: isOpen ? 0.9 : 0 }}
            exit={{ opacity: 0 }}
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
              <div className="w-[55%] m-4 flex justify-between items-center">
                {/* Barra de arraste */}
                <div className="w-16 h-2 bg-gray-300 rounded cursor-pointer" />
                {/* Cancelar */}
                <Button onClick={onClose}>Fechar</Button>
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

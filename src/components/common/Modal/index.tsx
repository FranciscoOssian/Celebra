import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Modal({
  isOpen,
  onClose,
  children,
  className,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className: string;
}) {
  // Fechar o modal ao apertar 'Esc'
  useEffect(() => {
    const handleKeyDown = (e: { key: string }) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center !will-change-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Modal para mobile (de baixo para cima) */}
      <motion.div
        className={`${className} !will-change-auto`}
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

import { useState, useId } from "react";
import { motion } from "framer-motion";

const SwitchSelection = ({
  options,
  onSelect,
}: {
  options: string[];
  onSelect: (value: string) => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const id = useId();

  return (
    <div className="select-none relative isolate w-full max-w-sm bg-slate-200 rounded-xl h-14 border-x-[6px] border-slate-200 flex justify-between items-center shadow-inner">
      {options.map((option, i) => (
        <div
          key={option}
          className={`relative w-full text-center cursor-pointer p-2 text-black
            ${currentIndex === i ? "font-bold text-white" : ""}`}
          onClick={() => {
            setCurrentIndex(i);
            onSelect(option);
          }}
        >
          {currentIndex === i && (
            <motion.div
              className="absolute mix-blend-multiply w-[90%] h-full rounded-lg top-0 -z-10 bg-black shadow-md"
              layoutId={id}
            ></motion.div>
          )}
          <div className="z-10">{option}</div>
        </div>
      ))}
    </div>
  );
};
export default SwitchSelection;

"use client";

import React, { useState } from "react";

function FAQItem({
  question,
  answer,
  selected,
  setSelected,
}: {
  selected: boolean;
  setSelected: React.Dispatch<React.SetStateAction<null | string>>;
  question: string;
  answer: string;
}) {
  return (
    <div className="mx-4 my-3">
      <button
        onClick={() => setSelected(() => (selected ? null : question))}
        className="flex items-center gap-4 w-full"
      >
        <svg
          className="flex-shrink-0 w-6 h-6 transition-all data-[state=open]:rotate-45"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          data-state={selected ? "open" : "closed"}
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            className="vertical stroke-current"
            x1="12"
            y1="5"
            x2="12"
            y2="19"
            strokeWidth="2"
          />
          <line
            className="horizontal stroke-current"
            x1="5"
            y1="12"
            x2="19"
            y2="12"
            strokeWidth="2"
          />
        </svg>
        <div className="text-lg font-bolder text-left">{question}</div>
      </button>
      <div
        data-state={selected ? "open" : "closed"}
        className="data-[state=closed]:h-0 data-[state=closed]:opacity-0 overflow-hidden transition-all text-left pl-10 mb-7"
      >
        <p className="text-gray-600">{answer}</p>
      </div>
    </div>
  );
}

function FAQ({ list }: { list: { question: string; answer: string }[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <>
      <h2 className="text-5xl font-bold my-14 text-gray-800 text-center">
        FAQ
      </h2>
      <div className="bg-[#F7F7F7] rounded-2xl p-3">
        <div>
          {list.map((item, i) => (
            <FAQItem
              setSelected={setSelected}
              selected={selected === item.question}
              key={i}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default FAQ;

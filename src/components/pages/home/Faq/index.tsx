"use client";

import React, { useState } from "react";

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={toggleOpen}
        className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-100"
      >
        <div className="text-lg font-medium text-gray-800">{question}</div>
        <div className="flex items-center">
          <svg
            className={`w-6 h-6 transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className="px-4 py-2">
          <p className="text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  );
}

function FAQ({ list }: { list: { question: string; answer: string }[] }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">FAQ</h2>
      <div>
        {list.map((item, i) => (
          <FAQItem key={i} question={item.question} answer={item.answer} />
        ))}
      </div>
    </div>
  );
}

export default FAQ;

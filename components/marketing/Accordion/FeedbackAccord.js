"use client";

import { useState } from "react";
import { Transition } from "@headlessui/react";
import Image from "next/image";
import { Button } from "../Button";

export function FeedbackAccord({ question, onSubmit, initialAnswer }) {
  const [isOpen, setIsOpen] = useState(false);
  const [answer, setAnswer] = useState("");

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(answer);
    setAnswer("");
  };

  return (
    <div className="py-4 border-b">
      <div
        className="flex justify-between items-center cursor-pointer transition-colors duration-300 ease-in-out "
        onClick={toggleAccordion}
      >
        <h6 className="text-blue-strong text-xl font-semibold">
          {question}
        </h6>
        <Image
          src="/icons/toggle.svg"
          alt="toggle button"
          width={20}
          height={20}
          loading="lazy"
          className={`${isOpen ? " duration-500 ease-in rotate-180" : " duration-500 ease-out"}`}
        />
      </div>
      <hr className="text-white opacity-[12%]  " />
      <Transition
        show={isOpen}
        enter="duration-500 ease-out"
        enterFrom="opacity-0 -translate-y-6"
        enterTo="opacity-100 translate-y-0"
        leave="duration-500 ease-out"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-6"
      >
        <form onSubmit={handleSubmit}>
          <textarea
            value={initialAnswer ? initialAnswer : answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full py-3 px-4 my-4 border-[#B2B3B3] outline-none h-[164px] mb-2 border rounded font-medium placeholder:text-[#8D8D8D] text-sm"
            placeholder="Write your message here..."
          />
          <div className="flex justify-end">
            <Button>Submit message</Button>
          </div>
        </form>
      </Transition>
    </div>
  );
}

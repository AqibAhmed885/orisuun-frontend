"use client";

import { useState } from "react";
import { Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { AccessFaq } from "../../../data/marketing/AccessFaq";

export function AccessAccord() {
  const [openIndices, setOpenIndices] = useState([]);

  const toggleAccordion = (index) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const renderContent = (text) => {
    const parts = text.split(/(\[.*?]\(.*?\)|\n|[^\s@]+@[^\s@]+\.[^\s@]+)/g); // Split text by markdown-like links, newlines, and email addresses
    return parts.map((part, index) => {
      if (part.match(/\[.*?]\(.*?\)/)) {
        const linkText = part.match(/\[(.*?)]/)[1];
        const linkHref = part.match(/\((.*?)\)/)[1];
        return linkHref.startsWith("/") || linkHref.startsWith("http") ? (
          <Link key={index} href={linkHref} className="text-blue-500 ">
            {linkText}
          </Link>
        ) : (
          <a key={index} href={linkHref} className="text-blue-500 underline">
            {linkText}
          </a>
        );
      } else if (part === "\n") {
        return <br key={index} />;
      } else if (part.match(/[^\s@]+@[^\s@]+\.[^\s@]+/)) {
        return (
          <Link
            key={index}
            href={`mailto:${part}`}
            className="text-blue-500 underline"
          >
            {part}
          </Link>
        );
      } else {
        return part;
      }
    });
  };

  return (
    <div>
      {AccessFaq.map((faq, index) => (
        <div key={index} className="py-4 border-b">
          <div
            className="flex justify-between items-center cursor-pointer transition-colors duration-300 ease-in-out"
            onClick={() => toggleAccordion(index)}
          >
            <h6 className="text-blue-strong text-xl font-semibold leading-[130%]">
              {faq.question}
            </h6>
            <Image
              src="/icons/toggle.svg"
              alt="toggle button"
              width={20}
              height={20}
              loading="lazy"
              className={`transition-transform duration-500 ${openIndices.includes(index) ? "rotate-180" : ""
                }`}
            />
          </div>
          <hr className="text-white opacity-[12%]" />
          <div className="overflow-hidden">
            <Transition
              show={openIndices.includes(index)}
              enter="duration-500 ease-out"
              enterFrom="opacity-0 -translate-y-6"
              enterTo="opacity-100 translate-y-0"
              leave="duration-500 ease-out"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 -translate-y-6"
            >
              <div className="text-[#5B657B] mt-6 mb-8 font-medium text-base max-w-[564px]">
                {renderContent(faq.content)}
              </div>
            </Transition>
          </div>
        </div>
      ))}
    </div>
  );
}

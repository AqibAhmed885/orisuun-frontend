'use client';

import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { AccessFaq } from '@/data/marketing/AccessFaq';

type FaqItem = {
  question: string;
  content: string;
};

function renderFaqContent(text: unknown): ReactNode {
  if (typeof text !== "string") {
    return text as ReactNode;
  }

  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\n|[^\s@]+@[^\s@]+\.[^\s@]+)/g);

  return parts.map((part, index) => {
    if (!part) return null;

    const markdownLink = part.match(/\[(.*?)\]\((.*?)\)/);

    if (markdownLink) {
      const [, label, href] = markdownLink;

      const isInternal = href.startsWith("/");

      const className =
        "font-medium text-[#3a5f98] underline underline-offset-2";

      return isInternal ? (
        <Link key={`${href}-${index}`} href={href} className={className}>
          {label}
        </Link>
      ) : (
        <a
          key={`${href}-${index}`}
          href={href}
          className={className}
          target="_blank"
          rel="noopener noreferrer"
        >
          {label}
        </a>
      );
    }

    if (part === "\n") {
      return <br key={`break-${index}`} />;
    }

    const emailMatch = part.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);

    if (emailMatch) {
      return (
        <Link
          key={`${part}-${index}`}
          href={`mailto:${part}`}
          className="font-medium text-[#3a5f98] underline underline-offset-2"
        >
          {part}
        </Link>
      );
    }

    return part;
  }) as ReactNode;
}

export default function FAQSection() {
  const faqs = AccessFaq as FaqItem[];
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-white py-6">
      <div className="mx-auto grid max-w-[1440px] gap-10 rounded-[28px] bg-[#f4f4f5] p-6 sm:p-8 lg:grid-cols-[0.58fr_1fr] lg:gap-14 lg:p-10">
        <div className="flex min-h-[360px] flex-col justify-between">
          <h2 className="max-w-[420px] text-[45px] leading-[1.08] tracking-normal text-[#0A0A0A] ">
            Frequently asked questions
          </h2>

          <p className="mt-10 max-w-[430px] text-[20px] leading-[1.35] text-[#5b6880]  lg:mt-auto">
            If you have other questions - please, contact us by email:{' '}
            <Link href="mailto:hello@orisuun.com" className="underline underline-offset-4">
              hello@orisuun.com
            </Link>
          </p>
        </div>

        <div className="rounded-[10px] bg-white p-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={faq.question} className="border-b border-[#edf0f4] last:border-b-0">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-8 py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-lg font-medium leading-[1.25] text-[#2f3c50] ">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={22}
                    strokeWidth={2}
                    className={`shrink-0 text-[#9aa4b5] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <div
                  className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="min-h-0">
                    <p className="max-w-[940px] pb-7 text-base leading-[1.6] text-[#6f7b8f] ">
                      {renderFaqContent(faq.content)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

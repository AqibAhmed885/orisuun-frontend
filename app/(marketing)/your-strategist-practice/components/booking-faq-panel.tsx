"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqEntry = {
  question: string;
  answer: string;
};

const faqTabs = ["Bookings & Setup", "Earnings & Growth", "Trust & Security"];

const faqByTab: Record<string, FaqEntry[]> = {
  "Bookings & Setup": [
    {
      question: "Do I need a Zoom account?",
      answer: "No, it is all built-in.",
    },
    {
      question: "How do you handle cancellation?",
      answer:
        "Cancellations happen. Because we value our professionals' time, you can set your own cancellation policy, communicated before and after booking. You can also charge up to 50% of your booking fee (capped at $250) if cancellation occurs inside your no-cancellation window (up to 48 hours).",
    },
    {
      question: "How do founders find me?",
      answer:
        "Founders search our directory by industry, expertise, or specific challenge. If your profile fits their need, they book a slot you marked as available. You can also be discovered through our community chat, crowdfunding, platform activity feed, and business development matching tools.",
    },
    {
      question: "Can I decline a booking?",
      answer:
        "Yes. You have full visibility into the owner profile and question before the session happens.",
    },
    {
      question: "How do I set my rates?",
      answer:
        "You have full autonomy. Set your per-session rate, and set rates for ongoing one-on-one sessions as well.",
    },
    {
      question: "Can I transition these into long term clients?",
      answer:
        "Absolutely. The booking system is a front door. If an owner or founder needs a full audit or ongoing consultation, you can handle that through your standard firm engagement.",
    },
  ],
  "Earnings & Growth": [
    {
      question: "Can I charge for my time?",
      answer:
        "Yes. You can set your own hourly rate, or choose to donate your fees to our investment fund.",
    },
    {
      question: "What fees does Orisuun charge for hosting?",
      answer: "We charge 3% of the booking fee.",
    },
    {
      question: "What is the average ROI per session?",
      answer:
        "Consultants set their own rates, often from $100 to $500 per 30-minute sprint, making this one of the highest-leverage ways to monetize downtime.",
    },
    {
      question: "How do I manage my firm's non-compete?",
      answer:
        "You have total control over the industries and business sizes you consult for. Our platform also allows you to screen every booking to ensure there are no professional conflicts.",
    },
  ],
  "Trust & Security": [
    {
      question: "Is the video platform secure?",
      answer:
        "Yes. Our built-in video suite uses enterprise-grade encryption to ensure your conversations remain protected.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes. We use enterprise-grade encrypted video and document sharing, built for the high-confidentiality requirements of management consulting.",
    },
    {
      question: "Can I maintain my firm's confidentiality?",
      answer:
        "Yes. Many consultants list as independent or under their own LLC while citing professional history. Our secure video suite helps ensure proprietary methods remain private.",
    },
    {
      question: "Is there a minimum time commitment?",
      answer:
        "No. You can be available for 1 hour a month or 60. You have total control.",
    },
  ],
};

export default function BookingFaqPanel() {
  const [activeTab, setActiveTab] = useState(faqTabs[0]);
  const [openIndex, setOpenIndex] = useState(0);

  const activeFaqs = faqByTab[activeTab];

  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto grid w-full max-w-[1440px] gap-8 rounded-[28px] bg-[#f4f5f7] p-5 sm:p-8 lg:grid-cols-[0.50fr_1fr] lg:gap-10 lg:p-10">
        <div className="flex md:min-h-[320px] flex-col justify-between">
          <h2 className="max-w-[420px] text-4xl font-normal leading-[1.08] tracking-[-0.02em] text-[#0a0a0a] sm:text-[46px]">
            Frequently
            <br />
            asked questions
          </h2>

          <p className="md:mt-8  max-w-[460px] text-lg leading-[1.35] text-[#5c6b86] sm:text-xl">
            If you have other questions - please, contact us by email:{" "}
            <Link
              href="mailto:hello@orisuun.com"
              className="underline underline-offset-4"
            >
              hello@orisuun.com
            </Link>
          </p>
        </div>

        <div className="min-w-0">
          <div className="w-full max-w-full min-w-0 overflow-hidden">
            <div className="w-full max-w-full overflow-x-auto overscroll-x-contain rounded-[12px] border border-[#d9e4f1] bg-[#1C55971A] p-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex w-max min-w-full gap-2">
                {faqTabs.map((tab) => {
                  const isActive = activeTab === tab;

                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab);
                        setOpenIndex(0);
                      }}
                      className={`h-11 w-40 md:w-full whitespace-nowrap rounded-[10px] px-4 text-sm transition sm:text-base ${isActive
                          ? "bg-[#032b4f] text-white"
                          : "bg-white text-[#2b4f78]"
                        }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[12px] border border-[#eef2f8] bg-white px-4 sm:p-12">
            {activeFaqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={faq.question}
                  className="border-b border-[#edf1f6] last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-medium leading-[1.3] text-[#2a3b57] sm:text-base">
                      {faq.question}
                    </span>

                    <ChevronDown
                      size={20}
                      className={`shrink-0 text-[#95a4bc] transition-transform ${isOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {isOpen && (
                    <p className="pb-5 text-xs leading-[1.6] text-[#667897] sm:text-sm">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
'use client';
import { useState } from 'react';
import AccordionItem from '@/components/marketing/Accordion/AccordionItem';
import Link from 'next/link';
import Image from 'next/image';
import { Transition } from '@headlessui/react';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
export const FindMeFAQ = ({ faqList }) => {
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
        <section className="" aria-label="Frequently asked questions">
            <div
                className="bg-[#F1F4FB] bg-left-bottom bg-no-repeat"
                style={{ backgroundImage: `url('${staticUrl}/bg/bg-star.svg')` }}
            >
                <div className="p-4 py-24 lg:px-16 gap-16 lg:gap-0 grid grid-cols-1 lg:grid-cols-2">
                    <div className="space-y-4">
                        <h2 className="text-[40px] small-500:text-[24px] small-500:text-left leading-[44px] font-semibold text-[#194082] text-center lg:text-start lg:max-w-[80%]">
                            If you&apos;ve got questions, we&apos;ve got answers
                        </h2>
                        
                    </div>
                    <div>
                        {faqList.map((faq, index) => (
                            <div key={index} className="py-4 border-b">
                                <div
                                    className="flex justify-between items-center cursor-pointer transition-colors duration-300 ease-in-out"
                                    onClick={() => toggleAccordion(index)}
                                >
                                    <h6 className="text-blue-strong text-xl font-semibold leading-[130%]">
                                        {faq.title}
                                    </h6>
                                    <Image
                                        src={`${staticUrl}/icons/toggle.svg`}
                                        alt="toggle button"
                                        width={20}
                                        height={20}
                                        loading="lazy"
                                        className={`w-5 h-5 flex-shrink-0 object-contain transition-transform duration-500 ${openIndices.includes(index) ? "rotate-180" : ""
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
                </div>
            </div>

            <div className='flex items-center justify-center'>

                <svg width="79" height="18" viewBox="0 0 79 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M45.6569 14.8335C42.4542 18.9688 36.2099 18.9688 33.0072 14.8335L1.69051 -25.6014C-2.38117 -30.8586 1.36578 -38.5 8.01538 -38.5L70.6487 -38.5C77.2983 -38.5 81.0452 -30.8587 76.9736 -25.6014L45.6569 14.8335Z" fill="#ECF0FA" />
                </svg>
            </div>
        </section>
    );
};


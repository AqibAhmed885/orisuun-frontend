'use client';

import Image from 'next/image';
import { useState, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { FaqItem } from '../page';

interface BookingFaqProps {
  faqs: FaqItem[];
  title?: string | ReactNode;
  highlightedTitle?: string | ReactNode;
  titleAfterHighlight?: string | ReactNode;
  svgHighlight?: ReactNode;
  description?: string;
}

export default function BookingFaq({
  faqs,
  title = 'Set Your Availability. The System Does the Rest',
  highlightedTitle = 'The System',
  titleAfterHighlight = '',
  svgHighlight = <></>,
  description = "We've removed the friction. Your dashboard is a command center for your professional investing.",
}: BookingFaqProps) {
  const [openIndex, setOpenIndex] = useState(0);
  const activeItem = faqs[openIndex];

  return (
    <section
      id="consultant-booking-faq"
      className="my-4 mx-2 overflow-hidden py-4 lg:h-[580px]"
    >
      <div className="grid h-full items-start gap-8 lg:grid-cols-[50%_50%] lg:gap-8">
        <div className="flex h-full flex-col justify-between">
          <div className="mx-auto max-w-[760px] text-center lg:mx-0 lg:text-left">
            <h2 className="text-3xl font-normal leading-[1.08] tracking-normal text-[#151922] sm:text-[42px] lg:text-[38px]">
              {title}{' '}
              <span className="relative inline-block whitespace-nowrap">
                {svgHighlight}
                <span className="relative z-10">{highlightedTitle} </span>
              </span>
              {titleAfterHighlight}
            </h2>

            <p className="mx-auto mt-4 max-w-[620px] text-[20px] leading-[1.3] text-[#657086] lg:mx-0 lg:max-w-[480px] lg:text-lg lg:leading-[1.35]">
              {description}
            </p>
          </div>

          <div className="mt-10 max-w-[940px] overflow-hidden rounded-[34px] bg-[#e7f0f6] shadow-[inset_0_1px_0_#c7d3e2] lg:mt-0 lg:rounded-[20px] lg:bg-[#f2f5f8]">
            {faqs.map((item, index) => {
              const isOpen = index === openIndex;

              return (
                <div
                  key={item.title}
                  className="border-b border-[#cbd6e3] last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(index)}
                    className="flex w-full items-center justify-between gap-6 px-7 py-6 text-left sm:px-9 lg:py-4"
                    aria-expanded={isOpen}
                  >
                    <span className="text-lg font-normal leading-tight text-[#151922] lg:text-lg">
                      {item.title}
                    </span>

                    <ChevronDown
                      size={28}
                      className={`shrink-0 text-[#151922] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                        }`}
                    />
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-7 pb-7 text-base leading-[1.25] text-[#657086] sm:px-9 lg:pb-2 lg:text-base lg:leading-[1.22]">
                        {item.body}
                      </p>

                      <div className="relative h-[560px] border-t border-[#cbd6e3] bg-[#0e6a9b] sm:h-[620px] lg:hidden">
                        <Image
                          src={item.image}
                          alt={item.imageAlt}
                          fill
                          sizes="100vw"
                          className={`object-cover ${item.imagePosition ?? 'object-right-top'
                            }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative hidden h-[540px] overflow-hidden lg:block">
          <Image
            key={activeItem.image}
            src={activeItem.image}
            alt={activeItem.imageAlt}
            fill
            sizes="55vw"
            className={`object-contain ${activeItem.imagePosition ?? 'object-right-top'
              }`}
          />
        </div>
      </div>
    </section>
  );
}
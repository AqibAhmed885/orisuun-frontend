'use client';
import { useState } from 'react';
import AccordionItem from '../../../../components/marketing/Accordion/AccordionItem';
import { pricingFAQ } from '../../../../data/marketing/PricingData';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export const PricingFAQ = () => {
  const [openIndexes, setOpenIndexes] = useState([]);

  const handleClick = (index) => {
    if (openIndexes.includes(index)) {
      setOpenIndexes(openIndexes.filter((i) => i !== index));
    } else {
      setOpenIndexes([...openIndexes, index]);
    }
  };
  return (
    <section className="">
      <div
        className="bg-[#1B3C7B] bg-left-bottom bg-no-repeat"
        style={{ backgroundImage: `url('${staticUrl}/bg/bg-star.svg')` }}
      >
        <div className="p-4 py-24 lg:px-16 gap-16 lg:gap-0 grid grid-cols-1 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-[40px] small-500:text-[24px] small-500:text-left leading-[44px] font-semibold text-white text-center lg:text-start lg:max-w-[80%]">
              Frequently Asked Questions about pricing and plans
            </h3>
            <p className="text-white text-[20px] small-500:text[16px] small-500:text-left font-normal text-center lg:text-start lg:max-w-[50%]">
              Here you can find answers to our most frequently asked questions.
            </p>
            <p className="text-white text-[20px] small-500:text[16px] small-500:text-left font-normal text-center lg:text-start lg:max-w-[50%]">
              If you have other questions - please, contact us by email:
              <span className="underline  underline-offset-[3px] ml-1">
                hello@orisuun.com
              </span>
            </p>
          </div>
          <div>
            {pricingFAQ.map((faq, index) => (
              <AccordionItem
                key={index}
                faq={faq}
                onClick={() => handleClick(index)}
                isOpen={openIndexes.includes(index)}
                index={index}
                titleClass="text-white font-semibold text-[20px]"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

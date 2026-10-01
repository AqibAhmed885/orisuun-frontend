'use client';

import AccordionItem from '@/components/marketing/Accordion/AccordionItem';
import { useState } from 'react';
import { discountFAQ } from '../../../../data/marketing/discountFAQ';
const DiscountFAQ = () => {
  const [openIndexes, setOpenIndexes] = useState([]);

  const handleClick = (index: number) => {
    if (openIndexes.includes(index)) {
      setOpenIndexes(openIndexes.filter((i) => i !== index));
    } else {
      setOpenIndexes([...openIndexes, index]);
    }
  };

  return (
    <>
      <section className="pb-[50px]">
        <div className="bg-[#F5FAFF] bg-left-bottom bg-no-repeat">
          <div className="p-4 py-24 lg:px-16 gap-16 lg:gap-0 grid grid-cols-1 lg:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-[40px] small-500:text-[24px] small-500:text-left leading-[110%] font-semibold text-blue-strong text-center lg:text-start lg:max-w-[80%]">
                Join Orisuun and Get on the Discount Portal Today! <br />
                It’s Free!
              </h3>
              <p className="text-blue-strong text-[20px] small-500:text[16px] small-500:text-left font-normal text-center lg:text-start lg:max-w-[50%]">
                We are available to get you started around the clock at
                <span className="underline underline-offset-[4px] ml-1 decoration-1">
                  discountportal@orisuun.com
                </span>
                <br />
                Or give us a call at +1 212.540.5009
              </p>
            </div>
            <div>
              {discountFAQ.map((faq, index) => (
                <AccordionItem
                  key={index}
                  faq={faq}
                  onClick={() => handleClick(index)}
                  isOpen={openIndexes.includes(index)}
                  index={index}
                  titleClass="text-blue-strong font-semibold text-[20px]"
                  blue
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default DiscountFAQ;

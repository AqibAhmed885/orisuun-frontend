'use client';

import { useState } from 'react';

type FaqItem = {
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    question: 'Do I need to be a paying member to be eligible?',
    answer:
      'Yes. The weekly $1,000 fund is a member benefit available to active members with completed business profiles.',
  },
  {
    question: 'Can I win more than once?',
    answer: 'Yes. Members can win more than once.',
  },
  {
    question: 'How do I increase my chances?',
    answer: 'Each day of qualifying activity earns you an additional entry into the weekly selection pool.',
  },
  {
    question: 'What counts as qualifying activity?',
    answer:
      'Examples include chats, launching new fundraising campaigns, posting new business opportunities, and offering new discounts on the platform.',
  },
  {
    question: 'How will I know how many entries I have?',
    answer: 'There is a dashboard widget that tracks your weekly activity and keeps count of your entries.',
  },
  {
    question: 'If I win, how will I be contacted?',
    answer: 'Winning members are contacted immediately by email and through chat on the platform.',
  },
  {
    question: 'How are winners selected?',
    answer: 'Winners are selected at random from the eligible entry pool each week.',
  },
  {
    question: 'How do winners get paid?',
    answer: "Funds are sent securely and directly to the winner's bank account or online wallet.",
  },
  {
    question: 'Do I have to give Orisuun a piece of my business?',
    answer:
      'No. This funding is not tied to equity or ownership in your company. The money is yours, with no strings attached.',
  },
  {
    question: 'Is this money a loan?',
    answer:
      'No. This funding is not tied to any debt or repayment obligation. The money is yours, with no strings attached.',
  },
  {
    question: 'Do I have to give Orisuun my bank details to win?',
    answer:
      'No. You are not required to provide your bank details. If you win, you can choose to provide them securely to receive a direct transfer. Other payment options may include online wallets, Orisuun\'s peer-to-peer system, or a check by mail.',
  },
  {
    question: 'Is the process public?',
    answer: 'Yes. The selection process is published, and winners are announced each week.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className='w-full bg-white py-[100px]'>
      <div className='mx-auto flex w-full max-w-[1440px] flex-col gap-14 px-6 lg:flex-row lg:justify-between lg:gap-[88px]'>
        <h2 className='max-w-[393px] text-[40px] font-semibold leading-none tracking-[-0.02em] text-[#0F1116] md:text-[56px]'>
          Frequently asked questions
        </h2>

        <div className='w-full max-w-[610px] space-y-4'>
          {faqItems.map((item, index) => {
            const isOpen = index === openIndex;

            return (
              <div key={item.question} className='border-b border-[rgba(15,17,22,0.1)]'>
                <button
                  type='button'
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className='flex w-full items-center gap-4 px-4 py-4 text-left'
                  aria-expanded={isOpen}
                >
                  <div className='flex-1'>
                    <p className='text-xl font-medium leading-[1.4] tracking-[-0.02em] text-[#0F1116]'>
                      {item.question}
                    </p>
                  </div>

                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-300 ${
                      isOpen ? 'rotate-0' : 'rotate-180'
                    }`}
                    aria-hidden='true'
                  >
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24 20L16 12L8 20" stroke="#0F1116" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>

                  </span>
                </button>

                <div
                  className={`grid overflow-hidden px-4 transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] pb-4 opacity-100' : 'grid-rows-[0fr] pb-0 opacity-0'
                  }`}
                >
                  <div className='min-h-0'>
                    <p className='max-w-[520px] text-base leading-relaxed text-[#5B657B]'>{item.answer}</p>
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

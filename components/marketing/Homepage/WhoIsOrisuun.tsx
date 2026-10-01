'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const tabs = [
  'Black Owned Businesses',
  'Investors',
  'Mentors',
  'Partners',
  'Strategy Consultants',
  'Professionals',
  'Experts',
  'Advocates',
];

const tabImages: Record<string, string> = {
  'Black Owned Businesses': `${process.env.NEXT_PUBLIC_STATIC_URL}/home/images/WhoIsOrissun/bob.png`,
  Investors: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/images/WhoIsOrissun/investor.png`,
  Mentors: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/images/WhoIsOrissun/mentor.png`,
  Partners: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/images/WhoIsOrissun/Partner.png`,
  'Strategy Consultants': `${process.env.NEXT_PUBLIC_STATIC_URL}/home/images/WhoIsOrissun/consultant.png`,
  Professionals: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/images/WhoIsOrissun/professional.png`,
  Experts: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/images/WhoIsOrissun/expert.png`,
  Advocates: `${process.env.NEXT_PUBLIC_STATIC_URL}/home/images/WhoIsOrissun/advocate.png`,
};

const tabContent: Record<
  string,
  {
    title: string;
    description: string;
    bullets: string[];
    link: string;
  }
> = {
  'Black Owned Businesses': {
    title: 'Black-Owned Businesses',
    description:
      'Your business should be part of a powerful ecosystem. Orisuun connects you to customers, capital, and community in one simple platform. You bring the vision — we help you expand it.',
    bullets: [
      'Attract new customers and loyal supporters',
      'Find resources for funding, growth, and visibility',
      'Get listed and promoted to a values-driven audience',
      'Collaborate and learn with other entrepreneurs',
    ],
    link: '/signup?profile=black-owned-businesses',
  },
  Investors: {
    title: 'Investors',
    description:
      'The next big idea might not be in your usual pipeline. Orisuun makes it easier to discover overlooked opportunities with real growth potential. Connect with underrepresented founders building scalable, investable businesses. Put your capital to work in a way that reflects your values.',
    bullets: [
      'View business performance and founder profiles',
      'Track companies by growth metrics or sector',
      'Get early access to new opportunities and pitches',
      'Filter by industry, stage, and funding needs',
    ],
    link: '/signup?profile=investors',
  },
  Mentors: {
    title: 'Mentors',
    description:
      'You’ve built, led, and learned — now you can help someone else do the same. Orisuun invites mentors who are ready to invest time, not just money. You can change the trajectory of a business with one conversation.',
    bullets: [
      'Match with founders based on goals and experience',
      'Choose flexible mentoring formats — calls, messages, live chats',
      'Track your mentorship impact across the platform',
      'Be recognized for your contributions and impact',
      'Get Paid',
    ],
    link: '/signup?profile=mentors',
  },
  Partners: {
    title: 'Partners',
    description:
      'Orisuun helps established companies turn commitments into action. Whether it’s through sponsorship, discounts, or pro bono services, your organization can directly support Black-owned businesses at scale.',
    bullets: [
      'Sponsor campaigns or visibility initiatives',
      'Offer pro bono expertise, mentorship, or tools',
      'Provide product or service discounts to small businesses',
      'Demonstrate corporate values through meaningful engagement',
    ],
    link: '/signup?profile=partners',
  },
  'Strategy Consultants': {
    title: 'Strategy Consultants',
    description:
      'Support businesses in scaling, pivoting, or solving critical challenges with strategic insight.',
    bullets: [
      'Find clients aligned with your values and expertise',
      'Offer packaged services or flexible engagements',
      'Get visibility within a curated professional network',
      'Contribute to economic equity through your work',
      'Get paid',
    ],
    link: '/signup?profile=strategy-consultants',
  },
  Professionals: {
    title: 'Professionals',
    description:
      'Your professional skills are powerful tools for change. Orisuun makes it easy for legal, financial, communications, and other professionals to support Black-owned businesses doing incredible work.',
    bullets: [
      'List your firm or solo practice in our services directory',
      'Offer pro bono, sliding scale, or standard-rate services',
      'Collaborate on workshops, webinars, or consulting packages',
      'Find businesses aligned with your focus, and filter by your specialty',
      'Get paid',
    ],
    link: '/signup?profile=professionals',
  },
  Experts: {
    title: 'Experts',
    description:
      `If you're an expert in your field, there's a founder who needs you on their side. We bring you into the conversation as an expert advisor, thought partner, or sounding board.`,
    bullets: [
      'Share insights on emerging markets and industry trends',
      'Support product decisions, market entry, or strategic pivots',
      'Offer flexible engagements or brief consults',
      'Get visibility as a go-to voice in your domain',
      'Get paid',
    ],
    link: '/signup?profile=experts',
  },
  Advocates: {
    title: 'Advocates',
    description:
      `Orisuun helps you find and support Black-owned businesses in every category — from fashion to finance, food to tech. Every purchase, share, or recommendation helps build stronger, more equitable economies.`,
    bullets: [
      'Discover Black-owned businesses near you or online',
      'Share your favorite finds with friends and followers',
      'Support founders creating products and services you love',
      'Be part of a community that shops with purpose',
    ],
    link: '/signup?profile=advocates',
  },
};

export default function WhoIsOrisuun() {
  const [activeTab, setActiveTab] = useState('Black Owned Businesses');
  const [contentImage, setContentImage] = useState(tabImages['Black Owned Businesses']);
  const content = tabContent[activeTab];

  useEffect(() => {
    setContentImage(tabImages[activeTab] ?? tabImages['Black Owned Businesses']);
  }, [activeTab]);

  return (
    <section className="bg-[#f2f7fc] py-14 px-4 md:px-20">
      <h2 className="pt-4 text-blue-strong text-[25px] font-medium md:text-[61px] md:leading-[110%] mb-3 text-center">
        Who is Orisuun For?
      </h2>

      <div className="hidden lg:flex flex-wrap justify-center gap-3 mb-7 text-[#5B657B] text-[20px]">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 transition-all duration-200 ${
              activeTab === tab ? 'text-[#2357C6] font-semibold' : 'hover:text-blue-600'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="lg:hidden w-full overflow-x-auto">
        <div className="flex w-max gap-3 mb-7 text-[#5B657B] text-[20px] px-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 whitespace-nowrap transition-all duration-200 ${
                activeTab === tab ? 'text-[#2357C6] font-semibold' : 'hover:text-blue-600'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row gap-10"
        >
          <div className="w-full md:w-1/2">
            <Image
              src={contentImage}
              alt={content.title}
              width={600}
              height={500}
              className="rounded-2xl w-full h-auto object-cover"
            />
          </div>

          <div className="w-full md:w-1/2 bg-white p-10 pt-10 rounded-3xl flex flex-col justify-between">
            <div>
              <h3 className="text-[35px] font-semibold text-[#1E1E1E]">{content.title}</h3>
              <p className="text-xl mb-6 text-[#5B657B]">{content.description}</p>
              <ul className="space-y-3">
                {content.bullets.map((bullet, index) => (
                  <li key={index} className="flex gap-2 text-lg text-[#06124C]">
                    <span>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.0013 1.66699C5.4013 1.66699 1.66797 5.40033 1.66797 10.0003C1.66797 14.6003 5.4013 18.3337 10.0013 18.3337C14.6013 18.3337 18.3346 14.6003 18.3346 10.0003C18.3346 5.40033 14.6013 1.66699 10.0013 1.66699ZM7.74297 13.5753L4.7513 10.5837C4.67415 10.5065 4.61295 10.4149 4.5712 10.3141C4.52944 10.2133 4.50795 10.1053 4.50795 9.99616C4.50795 9.88705 4.52944 9.77901 4.5712 9.67821C4.61295 9.5774 4.67415 9.48581 4.7513 9.40866C4.82845 9.33151 4.92005 9.27031 5.02085 9.22855C5.12165 9.1868 5.22969 9.16531 5.3388 9.16531C5.44791 9.16531 5.55595 9.1868 5.65675 9.22855C5.75756 9.27031 5.84915 9.33151 5.9263 9.40866L8.33464 11.8087L14.068 6.07533C14.2238 5.91951 14.4351 5.83197 14.6555 5.83197C14.8758 5.83197 15.0872 5.91951 15.243 6.07533C15.3988 6.23114 15.4863 6.44247 15.4863 6.66283C15.4863 6.88318 15.3988 7.09451 15.243 7.25033L8.91797 13.5753C8.84087 13.6526 8.7493 13.7139 8.64849 13.7557C8.54768 13.7975 8.43961 13.819 8.33047 13.819C8.22133 13.819 8.11326 13.7975 8.01245 13.7557C7.91164 13.7139 7.82006 13.6526 7.74297 13.5753Z"
                          fill="#447DFC"
                        />
                      </svg>
                    </span>
                    <span className="text-[#5B657B]">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link href={content.link}>
              <button className="w-[200px] text-lg px-1 py-3 bg-[#2357C6] mt-[1rem] text-white font-semibold rounded-full hover:bg-[#8ba8e7] transition">
                Join the community
              </button>
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

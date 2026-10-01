'use client';
import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/marketing';
import { useRouter } from 'next/navigation';
import { getShimmerPlaceholder } from '@/utils/shimmerPlaceholder';
import { Dialog, DialogPanel } from '@headlessui/react';
import DemoEmbed from '@/components/marketing/DemoEmbed';

const bob = [
  {
    heading: 'Get Found. Get Funded. Grow Faster.',
    description: 'Orisuun helps Black-owned businesses stand out to customers, collaborators, and investors. Join a trusted platform built to fuel your growth and protect your value.'
  },
  {
    heading: 'You Built the Business. We’ll Help the Right People Find It.',
    description: 'List your business, build your presence, and connect with partners who believe in what you’re building. Orisuun is designed to move your business forward.'
  },
  {
    heading: 'Plug Into a Network Built Just for You',
    description: 'Orisuun connects Black-owned businesses with funding, services, mentors, and advocates—so you never have to grow alone.'
  }
];
const professionals = [
  'Use Your Skills to Power Black-Led Growth',
  'Work with Founders Who Need What You Do Best',
  'Get Paid for Your Services while Helping Black-owned Businesses Grow',
];
const experts = [
  'Your Expertise is Someone’s Missing Piece',
  'Get Paid for Your Expertise While Helping Black-Owned Businesses Grow',
];
const mentors = [
  'Share Your Journey. Shape Someone Else’s',
  'Someone’s Just One Conversation Away From Clarity',
  'Your Guidance. Their Growth. Your Growth.'
];
const consultants = [
  'Your Strategic Insight. Their Competitive Edge. ',
  'Be the Strategic Mind Behind Black Business Growth',
  'Offer Strategic Guidance. Land High-Value, High-Potential Clients. '
];
const partners = [
  'Partner with Purpose and Support the Ecosystem',
  'Strengthen the Ecosystem. Scale the Impact. '
];
const investors = [
  'Access the Pipeline You’ve Been Missing',
  'A New Pipeline of Bold Ideas and Untapped Markets'
];
const advocates = [
  'Find Black-Owned Businesses to Support in Your Neighborhood and Around the World',
  'Be the Reason Businesses Get Found'
];
const contentMap = {
  professionals,
  experts,
  mentors,
  'strategy-consultants': consultants,
  partners,
  advocates,
  investors,
  'black-owned-businesses': bob,
};
const discriptionMap = {
  professionals: 'Your expertise can change the game. Join as an expert to guide, mentor, and collaborate with Black-owned business looking for trusted insight and strategic support. Join the community, and help shape the future of Black entrepreneurship - one smart decision at a time. ',
  experts: 'Get paid to be the voice you wish you had! From one conversation to ongoing guidance, your mentorship helps businesses move faster and smarter - with your experience as their edge',
  mentors: 'Get paid to be the voice you wish you had! From one conversation to ongoing guidance, your mentorship helps businesses move faster and smarter - with your experience as their edge',
  'strategy-consultants': 'Shape strategy and accelerate progress. Lend your experience to founders building on bold visions. From business models to go-to-market plans, your skills bring the clarity businesses need in today’s ever-complex marketplace. ',
  partners: 'Engage with businesses through real tools - not just sponsorships. Orisuun helps partners deliver resources, find collaborators, and build lasting relationships with high-potential founders',
  investors: 'Get early access to Black founders building across industries. Orisuun makes  it easy to find, vet, and fund businesses with real traction and vision',
  advocates: 'Your support goes further on Orisuun. Help Black-owned businesses get discovered, trusted, and funded - starting with just one click. Search and filter for Black-owned businesses in your neighborhood and around the world'
};

export const UserSection2 = ({ userType, initialSeed }) => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    // Dynamically import AOS only when component is mounted on client
    let mounted = true;
    (async () => {
      if (typeof window === 'undefined') return;
      try {
        await import('aos/dist/aos.css');
        const AOS = (await import('aos')).default;
        if (!mounted) return;
        AOS?.init?.({ duration: 1500, once: false });
        AOS?.refresh?.();
      } catch (err) {
        // non-critical, just skip on error
        console.warn('AOS failed to load', err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);
  const router = useRouter();
  const imgSrc = `${process.env.NEXT_PUBLIC_STATIC_URL}/userTypes/images/${userType}.png`;
  useEffect(() => {
    if (typeof window !== "undefined" && userType) {
      localStorage.setItem('userType', userType);
    }
  }, [userType]);


  // Memoize content array to prevent changing dependency reference each render
  const content = useMemo(() => contentMap[userType] || [], [userType]);


  const computeInitialIndex = (type, len) => {
    if (!type || len === 0) return 0;
    // simple deterministic hash based on chars of userType
    let sum = 0;
    for (let i = 0; i < type.length; i++) sum += type.charCodeAt(i);
    return sum % len;
  };

  const initialContent = (userType && Array.isArray(content) && content.length > 0)
    ? content[computeInitialIndex(userType, content.length)]
    : null;

  const [selectedContent, setSelectedContent] = useState(initialContent);


  useEffect(() => {
    if (!Array.isArray(content) || content.length === 0) {
      setSelectedContent(null);
      return;
    }

    // Use a per-userType key so each user type cycles independently
    const rotationKey = `userTypeRotationIndex_${userType}`;
    let nextIndex = 0;
    try {
      if (typeof window !== 'undefined') {
        const prevRaw = window.localStorage.getItem(rotationKey);
        const prevIndex = prevRaw !== null ? parseInt(prevRaw, 10) : -1;
        if (!Number.isNaN(prevIndex) && prevIndex >= 0) {
          nextIndex = (prevIndex + 1) % content.length;
        }
        window.localStorage.setItem(rotationKey, String(nextIndex));
      }
    } catch (e) {
      // Fallback: just pick index 0 if localStorage unavailable
      nextIndex = 0;
    }

    const next = content[nextIndex];
    setSelectedContent(next);
  }, [userType, content]);

  return (
    <section className="lg:flex justify-center mx-auto w-full gap-[11rem]">
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 flex w-screen bg-[#111] bg-opacity-80 items-center justify-center">
          <DialogPanel className="space-y-4">
            <div className="w-[925px] 2xl:w-[1200px] 2k:w-[1300px] max-w-[90vw] rounded-xl overflow-hidden">
              <DemoEmbed />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      <div className="mt-7 md:mt-[111px] md:max-w-[793px] mx-auto lg:mx-0 text-start px-7 lg:px-0">
        <p className="text-[#8E95A4] text-base font-semibold leading-[110%] uppercase mb-4 ">
          Orisuun and {userType == 'strategy-consultants' ? 'Strategy consultants' : (userType == 'black-owned-businesses' ? 'Black Owned Businesses' : userType)}
        </p>
        {selectedContent ? (
          <h1 className="text-blue-strong text-[30px] leading-[33.6px] md:text-[45px] font-[450px] md:leading-[110%] mb-6 max-w-[80%] md:max-w-[593px]">
            {selectedContent?.heading || selectedContent}
          </h1>
        ) : (
          /* Shimmer skeleton for heading */
          <div className="mb-6 max-w-[80%] md:max-w-[593px]">
            <div className="h-10 md:h-12 bg-gray-200 rounded-md w-3/4 animate-shimmer mb-3" />
            <div className="h-8 md:h-10 bg-gray-200 rounded-md w-1/2 animate-shimmer" />
          </div>
        )}

        {selectedContent ? (
          <p className="text-[#5B657B] text-xl font-[450px] leading-[150%] mx-auto lg:mx-0 lg:max-w-[459px] mb-[60px] text-left">
            {userType === 'black-owned-businesses'
              ? selectedContent?.description
              : discriptionMap[userType]}
          </p>
        ) : (
          /* Shimmer skeleton for paragraph */
          <div className="space-y-3 mx-auto lg:mx-0 lg:max-w-[459px] mb-[60px]">
            <div className="h-4 bg-gray-200 w-full rounded animate-shimmer" />
            <div className="h-4 bg-gray-200 w-5/6 rounded animate-shimmer" />
            <div className="h-4 bg-gray-200 w-2/3 rounded animate-shimmer" />
          </div>
        )}
        <div className="flex gap-4 flex-row justify-center items-center lg:justify-start ">
          <Button
            className="text-base font-bold leading-[150%] text-white py-2 lg:py-2.5 px-2 lg:px-5"
            onClick={() => router.push(userType ? `/signup?profile=${encodeURIComponent(userType)}` : '/signup')}
          >
            Join the community
          </Button>
          <Button
            onClick={() => {
              setIsOpen(true);
            }}
            className="bg-white  text-[#2357C6] text-[16px] font-bold leading-[150%] py-2 lg:py-2.5 px-2 lg:px-5  border border-[#A9C4FF]"
          >
            Watch demo{' '}
            <svg width="16" className='ml-2' height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0ZM6.62988 5.0625C6.35441 4.89214 6 5.09164 6 5.41699V10.583C6 10.9084 6.35441 11.1079 6.62988 10.9375L10.8027 8.35449C11.0651 8.19206 11.0651 7.80794 10.8027 7.64551L6.62988 5.0625Z" fill="#2357C6" />
            </svg>

          </Button>
        </div>
      </div>
      <Image
        src={imgSrc}
        alt="illustration-home"
        width={596}
        height={701}
        // remove priority so image lazy-loads and doesn't block LCP
        placeholder="blur"
        blurDataURL={getShimmerPlaceholder(596, 701)}
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 796px"
      />
    </section>
  );
};


'use client';

import FavouriteCard from '@/components/cards/favourite-card';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import styles from './FavouriteCardsSlider.module.css';

const CARD_GAP = 16;
const SLIDE_INTERVAL = 3000;
const SLIDE_TRANSITION = 600;

const partnerLogos = [
  '/homepage-slider/bill.svg',
  '/homepage-slider/shopify.svg',
  '/homepage-slider/mailchimp.svg',
  '/homepage-slider/zenwork-tax1099.svg',
  '/homepage-slider/snapchat-ads.svg',
  '/homepage-slider/apollo.svg',
  '/homepage-slider/brevo.svg',
  '/homepage-slider/framer.svg',
  '/homepage-slider/riverside-fm.svg',
  '/homepage-slider/deel.svg',
  '/homepage-slider/google-cloud.svg',
  '/homepage-slider/hubspot.svg',
  '/homepage-slider/leadpages.svg',
  '/homepage-slider/dell.svg',
  '/homepage-slider/claude.svg',
  '/homepage-slider/openai.svg',
  '/homepage-slider/zendesk.svg',
  '/homepage-slider/dext.svg',
  '/homepage-slider/notion.svg',
  '/homepage-slider/aws.svg',
  '/homepage-slider/webflow.svg',
];

const partnerNames = [
  'Bill.com',
  'Shopify',
  'Mailchimp',
  'ZenWork Tax1099',
  'Snapchat Ads',
  'Apollo.io',
  'Brevo',
  'Framer',
  'Riverside FM',
  'Deel',
  'Google Cloud',
  'HubSpot',
  'Leadpages',
  'Dell',
  'Claude by Anthropic',
  'Open AI',
  'Zendesk',
  'Dext',
  'Notion',
  'Amazon Web Services',
  'Webflow',
];

const partnerSlogans = [
  'Your Financial Operations Platform',
  'Make Commerce Better for Everyone',
  'Guess Less, Sell More',
  'Riding the Tech Wave',
  'Less Social Media. More Snapchat.',
  'Reach Every Buyer on Earth',
  'Turn Every Email into Lifetime Customer',
  'Design and Publish Your Dream Site',
  'Record. Edit. Publish.',
  'Global-First HR Platform',
  'The New Way to Cloud',
  'Grow Better',
  'Know What Works',
  'The Power to Do More',
  'Keep Thinking',
  'Never Stop Learning',
  'Intelligent Heart of Customer Experience',
  'Built for Bigger Things',
  'Think It. Make It.',
  'Build On',
  'For Modern Business',
];

const discountTitles = [
  '25% OFF Bill Accounts Payable',
  '25% OFF of annual plans',
  '30% OFF for 12 Months',
  '50% OFF of the subscription',
  '$375 in FREE Ad Credit',
  '50% OFF for First Year',
  '75% OFF Annual Plan',
  '12 Months FREE Pro Account',
  '20% OFF subscription',
  '$500 CREDIT with New Account',
  '$350,000 in FREE CREDITS',
  '90% OFF Your First Year',
  '30% OFF First Month',
  '20% OFF Hardware',
  '2X CREDITS',
  '2X CREDITS',
  '6 Months FREE',
  '30% OFF for 12 Months',
  '6 Months FREE',
  '$100K FREE Credits',
  '40% OFF Annual Plan',
];

const partnerDescriptions = [
  'A cloud-based financial operations platform that automates accounts payable, accounts receivable, and spend.',
  'Shopify is one of the world’s leading ecommerce platforms, helping founders build an online store, sell products, and accept payments.',
  'Mailchimp is an all-in-one marketing platform that helps founders and businesses manage email marketing, automations, and landing pages.',
  'TechWave Innovations is a dynamic technology company dedicated to creating cutting-edge solutions that redefine industry standards.',
  'Full-screen, mobile-first multimedia placements built to target younger demographics like Gen Z and Millennials. They feature brand-focused creative experiences.',
  'Apollo is one of the most widely used sales intelligence and outbound platforms among startups. It combines a large contact database with powerful engagement tools.',
  'Brevo is widely used by startups and growing businesses as a more affordable alternative to tools like Mailchimp.',
  'Framer is a modern website builder designed for startups that want a fast, polished marketing site without hiring developers.',
  'An AI-powered platform designed for recording studio-quality remote podcasts and video interviews. It captures uncompressed audio and video.',
  'If you’re on the lookout for a tool to help with HR, compliance, or payroll, Deel is one of the most popular options for businesses.',
  'Running a startup requires powerful, scalable technology, and our partnership with Google Cloud delivers exactly that.',
  'An all-in-one AI-powered customer platform that unifies marketing, sales, customer service, and content management into a single platform.',
  'A code-free, AI-assisted platform that lets you build high-converting landing pages, websites, and pop-ups in about 60 seconds.',
  'Dell Technologies shapes the infrastructure of tomorrow by creating the digital bedrock for human progress. They design technology for businesses of every size.',
  'New users with business email addresses can access free credits ranging from $50 to $300 for LLM models through Claude.',
  'ChatGPT is an artificial intelligence chatbot that uses natural language processing to engage in human-like conversations.',
  'Zendesk is a complete cloud-based customer service and AI-powered service platform. It brings together messaging, email, and support tools.',
  'Dext is a powerful AI-driven bookkeeping and expense management platform designed to eliminate manual data entry.',
  'Enjoy six months of Notion free on the Business plan, including Notion AI, with a total value of up to $12,000.',
  'Both existing and new AWS customers can access up to $100,000 in free AWS credits plus additional savings.',
  'Webflow is a visual web development platform that lets you design, build, and launch custom websites without writing code.',
];

const partnerWebsites = [
  'https://www.bill.com',
  'https://www.shopify.com',
  'https://mailchimp.com',
  'https://www.tax1099.com',
  'https://forbusiness.snapchat.com',
  'https://www.apollo.io',
  'https://www.brevo.com',
  'https://www.framer.com',
  'https://riverside.fm',
  'https://www.deel.com',
  'https://cloud.google.com',
  'https://www.hubspot.com',
  'https://www.leadpages.com',
  'https://www.dell.com',
  'https://www.anthropic.com/claude',
  'https://openai.com',
  'https://www.zendesk.com',
  'https://dext.com',
  'https://www.notion.com',
  'https://aws.amazon.com',
  'https://webflow.com',
];

const cards = Array.from({ length: 21 }, (_, index) => ({
  Id: index + 1,
  CompanyLogo: partnerLogos[index % partnerLogos.length],
  CompanyName: partnerNames[index % partnerNames.length],
  CompanySlogan:
    partnerSlogans[index] || 'Helping businesses grow',
  SloganSingleLine: true,
  DiscountTitle:
    discountTitles[index] || '50% OFF of the subscription',
  CompanyDescription:
    partnerDescriptions[index] ||
    'Access valuable products and services at an exclusive Orisuun member price.',
  DiscountCreateWebsite: partnerWebsites[index] || 'https://orisuun.com',
  ExpiryDate: '21 June, 2028',
  IsFavourite: true,
  DisableNavigation: true,
  HomepageSliderCard: true,
}));

const noop = () => {};

function CardGroup({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      className={`${styles.group} ${hidden ? styles.duplicate : ''} `}
      aria-hidden={hidden || undefined}
    >
      {cards.map((card) => (
        <div
          className={styles.card}
          data-slider-card
          key={`${hidden ? 'copy' : 'card'}-${card.Id}`}
        >
          <FavouriteCard
            data={card}
            setUsedData={noop}
            setFavouriteData={noop}
            setExpireData={noop}
            setIsNewData={noop}
            setMostPopulatedData={noop}
          />
        </div>
      ))}
    </div>
  );
}

export default function FavouriteCardsSlider() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardStepRef = useRef(0);
  const currentIndexRef = useRef(0);
  const resetTimerRef = useRef<number>();
  const [isPaused, setIsPaused] = useState(false);

  useLayoutEffect(() => {
    const firstCard =
      trackRef.current?.querySelector<HTMLElement>('[data-slider-card]');

    if (!firstCard) return;

    const updateCardStep = () => {
      cardStepRef.current =
        firstCard.getBoundingClientRect().width + CARD_GAP;
    };

    updateCardStep();
    const resizeObserver = new ResizeObserver(updateCardStep);
    resizeObserver.observe(firstCard);

    return () => resizeObserver.disconnect();
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const viewport = viewportRef.current;
    const cardStep = cardStepRef.current;

    if (!viewport || !cardStep) return;

    const nextIndex = Math.max(0, Math.min(index, cards.length));
    viewport.scrollTo({
      left: nextIndex * cardStep,
      behavior: 'smooth',
    });
    currentIndexRef.current = nextIndex;

    if (nextIndex === cards.length) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = window.setTimeout(() => {
        viewport.scrollTo({ left: 0, behavior: 'auto' });
        currentIndexRef.current = 0;
      }, SLIDE_TRANSITION + 100);
    }
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const interval = window.setInterval(() => {
      scrollToIndex(currentIndexRef.current + 1);
    }, SLIDE_INTERVAL);

    return () => window.clearInterval(interval);
  }, [isPaused, scrollToIndex]);

  useEffect(() => {
    return () => window.clearTimeout(resetTimerRef.current);
  }, []);

  const handlePrevious = () => {
    if (currentIndexRef.current === 0) {
      const viewport = viewportRef.current;
      const cardStep = cardStepRef.current;

      if (!viewport || !cardStep) return;

      viewport.scrollTo({
        left: cards.length * cardStep,
        behavior: 'auto',
      });
      currentIndexRef.current = cards.length;

      window.requestAnimationFrame(() => {
        scrollToIndex(cards.length - 1);
      });
      return;
    }

    scrollToIndex(currentIndexRef.current - 1);
  };

  const handleScroll = () => {
    const viewport = viewportRef.current;
    const cardStep = cardStepRef.current;

    if (!viewport || !cardStep) return;

    currentIndexRef.current = Math.round(viewport.scrollLeft / cardStep);
  };

  return (
    <section
      className="relative pb-16 md:pb-24"
      aria-label="Corporate partner discounts"
    >
      {/* <div className="relative z-10 mb-4 flex justify-end gap-2 px-6">
        <button
          type="button"
          onClick={handlePrevious}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-xl text-gray-900 transition hover:bg-gray-100"
          aria-label="Show previous discount"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => scrollToIndex(currentIndexRef.current + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-xl text-gray-900 transition hover:bg-gray-100"
          aria-label="Show next discount"
        >
          ›
        </button>
      </div> */}
      <div
        ref={viewportRef}
        className={`relative z-10 ${styles.viewport}`}
        onScroll={handleScroll}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div ref={trackRef} className={styles.track}>
          <CardGroup />
          <CardGroup hidden />
        </div>
      </div>
    </section>
  );
}

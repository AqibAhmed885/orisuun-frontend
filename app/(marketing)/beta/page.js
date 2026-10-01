import Hero from './components/Hero';
import Onboarding from './components/Onboarding';
import { Letter } from './components/Letter';

export const metadata = {
  title: 'Orisuun | Platform Beta Launch Opportunities',
  description:
    'Take advantage of our beta launch and onboarding promotional program for our groundbreaking platform dedicated to supporting Black-owned start-ups and established businesses. Gain early access to special features.',
  // keywords:
    // 'Black-Owned Business, Bek Sunuu, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching',
  robots: {
    index: false,
  },
  alternates: {
    canonical: 'https://orisuun.com/beta',
  },
};

const Beta = () => {
  return (
    <section className="mt-20">
      <Hero />
      <Letter />
      <Onboarding />
    </section>
  );
};

export default Beta;

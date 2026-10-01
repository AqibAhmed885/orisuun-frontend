import SignUp from "./components/SignUp";

export const metadata = {
  title: 'Orisuun | Sign Up',
  description:
    'Sign up for an account on Orisuun. Share your experience with Orisuun.com. Let us know how to make the platform better for you.',
  // keywords:
    // 'Black-Owned Business, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching',
  alternates: {
    canonical: 'https://orisuun.com/signup',
  },
  openGraph: {
    title: 'Join Orisuun',
    description: 'Create an account to join in the Orisuun ecosystem and “Build Something Great!”',
    url: 'https://orisuun.com/signup',
    siteName: 'Orisuun',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://orisuun.com/og/signup630.png',
        width: 1200,
        height: 630,
        alt: 'Join Orisuun',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join Orisuun',
    description: 'Create an account to participate in the Orisuun ecosystem.',
    images: ['https://orisuun.com/og/signup675.png'],
    domain: 'orisuun.com',
    url: 'https://orisuun.com/signup',
  },
  metadataBase: new URL('https://orisuun.com'),
};

export default function Sign() {
  return (
    <div className=" mx-auto bg-white">
      <SignUp />
    </div>
    
  );
}

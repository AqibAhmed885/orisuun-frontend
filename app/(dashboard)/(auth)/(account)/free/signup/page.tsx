import SignUp from "../../signup/components/SignUp";

export const metadata = {
  title: 'Orisuun Free Tier | Sign Up',
  description:
    'Sign up for free to access discounts, communities, connections, reviews, search, and leaderboard. Join Orisuun at no cost!',
  // keywords:
    // 'Free membership, Black-Owned Business, Black Business, Business Network, Business Directory, Discounts, Communities, Connections, Reviews, Search, Leaderboard',
  alternates: {
    canonical: 'https://orisuun.com/free/signup',
  },
  openGraph: {
    title: 'Join Orisuun Free Tier',
    description: 'Create a free account to access communities, discounts, connections, and more.',
    url: 'https://orisuun.com/free/signup',
    siteName: 'Orisuun',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://orisuun.com/og/signup630.png',
        width: 1200,
        height: 630,
        alt: 'Join Orisuun Free Tier',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join Orisuun Free Tier',
    description: 'Create a free account to participate in the Orisuun ecosystem.',
    images: ['https://orisuun.com/og/signup675.png'],
    domain: 'orisuun.com',
    url: 'https://orisuun.com/free/signup',
  },
  metadataBase: new URL('https://orisuun.com'),
};

export default function FreeSignUpPage() {
  return (
    <div className="mx-auto bg-white">
      <SignUp />
    </div>
  );
}

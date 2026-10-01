import { Metadata } from 'next';

export const metadata = {
  title: 'Orisuun | How You Can Help Us',
  description: "Join Orisuun's mission to empower Black-owned businesses and drive collective economic growth. Whether you're a connector, event host, mentor, media advocate or contributor to our Black Wealth Fund — your ideas, participation and network matter. Learn how you can help us build Orisuun's platform for innovation, opportunity and community impact.",
  // keywords: 'Orisuun, help us, empower Black-owned business, Black Wealth Fund, business connector, mentor event host, contribute ideas, share network, collective economic growth, black business events, build community, sustainable opportunities',
  alternates: {
    canonical: 'https://orisuun.com/how-you-can-help-us',
  },
  
};

export default function HowYouCanHelpUsLayout({ children }) {
  return <>{children}</>;
}

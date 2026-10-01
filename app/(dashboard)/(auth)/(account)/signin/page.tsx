import SigninContent from '@/app/(dashboard)/(auth)/(account)/signin/components/SignInContent';


export const metadata = {
  title: 'Orisuun | Sign In',
  description: 'Sign in to your account to access your dashboard',
  // keywords: ['Sign in', 'Login', 'Account', 'Dashboard', 'Orisuun'],
  alternates: {
    canonical: 'https://orisuun.com/signin',
  },
  openGraph: {
    title: 'Sign In to Orisuun',
    description: 'Access your Orisuun account.',
    url: 'https://orisuun.com/signin',
    siteName: 'Orisuun',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://orisuun.com/og/signin630.png',
        width: 1200,
        height: 630,
        alt: 'Sign In to Orisuun',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sign In to Orisuun',
    description: 'Access your Orisuun account.',
    images: ['https://orisuun.com/og/signin675.png'],
    domain: 'orisuun.com',
    url: 'https://orisuun.com/signin',
  },
  metadataBase: new URL('https://orisuun.com'),
};

const Signin = () => {
  return (
    <SigninContent />
  );
};

export default Signin;

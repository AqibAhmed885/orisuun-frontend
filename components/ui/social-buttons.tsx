import React from 'react';
import Button from '@/components/ui/button';
import { GoogleIcon } from '@/icons/socials/google';
import { MicrosoftIcon } from '@/icons/socials/microsoft';
import { AppleIcon } from '@/icons/socials/apple';
import { LinkedInSquareIcon } from '@/icons/socials/linkedin-square';
import { signIn, signOut, useSession } from 'next-auth/react';
import { SetSignInUpWIthAction } from '@/utils/auth.helpers';
import { usePathname } from 'next/navigation';

const handleSignIn = async (provider: string) => {
  try {
    var result: any = null;
    // For signup, redirect back to signup page to complete registration
    // For signin, stay on current page
    const isSignupPage = window.location.pathname.includes('/signup');
    // Preserve query params (e.g. ?profile=investor) so Profile.js can read them on return
    const callbackUrl = isSignupPage
      ? `${window.location.origin}${window.location.pathname}${window.location.search}`
      : window.location.href;

    // For signup flow, we need to ensure a fresh OAuth flow
    // First clear any existing NextAuth session to force a new account selection
    if (isSignupPage) {
      // Clear session silently (without redirect) before initiating new OAuth
      await signOut({ redirect: false });
    }

    if (provider === 'apple') {
      result = signIn('apple', {
        callbackUrl: callbackUrl,
      });
    } else {
      result = await signIn(provider, {
        callbackUrl: callbackUrl,
        redirect: true,
      });
    }

    if (result?.error) {
      console.error(`${provider} Sign-In failed:`, result.error);
    } else {
    }
  } catch (error) {
    console.error(`Error during ${provider} Sign-In:`, error);
  }
};

interface ISocialButtonsProps {
  handleStatusToggle: (status: boolean) => void;
  isSignUp?: boolean;
  isSubmitting?: boolean;
}

const SocialButtons: React.FC<ISocialButtonsProps> = ({
  handleStatusToggle,
  isSignUp = true,
  isSubmitting,
}) => {
  const pathname = usePathname();
  const isFreeSignupPath = pathname?.startsWith('/free/signup');
  const isPaidSignupPath = pathname?.startsWith('/signup');
  const gtmTagPrefix = isFreeSignupPath
    ? 'signup_free'
    : isPaidSignupPath
      ? 'signup_paid'
      : '';

  return (
    <div className="flex flex-col space-y-4">
      <Button
        type="button"
        data-gtm={gtmTagPrefix ? `${gtmTagPrefix}_google` : undefined}
        startIcon={<GoogleIcon />}
        title={`${isSignUp ? 'Continue ' : 'Sign in '} with Google`}
        onClick={() => {
          handleStatusToggle(true);
          SetSignInUpWIthAction('google');
          handleSignIn('google');
        }}
        disabled={isSubmitting}
        className="px-7 py-4 max-h-[50px] m-0 4xl:max-h-12 text-base leading-5 bg-white border border-[#E4E9F5] text-gray-900  rounded-lg xs:col-span-12 lg:!col-span-6 font-semibold"
      />
      <Button
        type="button"
        data-gtm={gtmTagPrefix ? `${gtmTagPrefix}_linkedin` : undefined}
        startIcon={<LinkedInSquareIcon className='rounded-[6px]' />}
        title={`${isSignUp ? 'Continue ' : 'Sign in '} with LinkedIn`}
        onClick={() => {
          handleStatusToggle(true);
          SetSignInUpWIthAction('linkedin');
          handleSignIn('linkedin');
        }}
        disabled={isSubmitting}
        className="px-7 py-4 max-h-[50px] order-2 m-0 4xl:max-h-12 text-base leading-5 bg-white border border-[#E4E9F5] text-gray-900 rounded-lg xs:col-span-12 lg:!col-span-6 font-semibold"
      />
      <Button
        type="button"
        data-gtm={gtmTagPrefix ? `${gtmTagPrefix}_microsoft` : undefined}
        startIcon={<MicrosoftIcon />}
        title={`${isSignUp ? 'Continue ' : 'Sign in '} with Microsoft`}
        onClick={() => {
          handleStatusToggle(true);
          SetSignInUpWIthAction('azure-ad');
          handleSignIn('azure-ad');
        }}
        disabled={isSubmitting}
        className="px-7 py-4 max-h-[50px] m-0 4xl:max-h-12 text-base leading-5 bg-white border border-[#E4E9F5] text-gray-900 rounded-lg xs:col-span-12 lg:!col-span-6 font-semibold"
      />
      <Button
        type="button"
        data-gtm={gtmTagPrefix ? `${gtmTagPrefix}_apple` : undefined}
        startIcon={<AppleIcon />}
        title={`${isSignUp ? 'Continue ' : 'Sign in '} with Apple`}
        onClick={() => {
          handleStatusToggle(true);
          SetSignInUpWIthAction('apple');
          handleSignIn('apple');
        }}
        disabled={isSubmitting}
        className="px-7 py-4 max-h-[50px] m-0 4xl:max-h-12 text-base leading-5 bg-white border border-[#E4E9F5] text-gray-900 rounded-lg xs:col-span-12 lg:!col-span-6 font-semibold"
      />
    </div>
  );
};

export default SocialButtons;

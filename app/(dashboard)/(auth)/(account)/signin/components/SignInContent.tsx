'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Loader from '@/components/ui/loader';
import Video from '@/components/ui/Video';
import LogoFullBlack from '@/icons/logo-full-black';
import SocialButtons from '@/components/ui/social-buttons';
import Divider from '@/components/ui/divider';
import { handleSignInToggle } from '@/utils/auth.helpers';
import { SessionProvider } from 'next-auth/react';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

const SigninContent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const SigninForm = dynamic(() => import('@/components/ui/signin-form'), {
    ssr: false,
  });

  if (isLoading) return <Loader />;

  return (
    <div className="relative w-full h-screen">
      <Video className="w-full h-screen" src="/videos/signin_background.mp4" />

      <div className="max-w-[544px] 2xl:max-w-screen-sm 2k:max-w-[650px] w-full mx-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-10">
        <div className="px-[40px] py-[30px] bg-white rounded-lg shadow-xl">
          <div className="absolute transform -translate-x-1/2 -top-20 left-1/2">
            <LogoFullBlack className="h-10 w-32" />
          </div>

          <div className="">
            <div className="mb-[30px] gap-2.5 flex flex-col">
              <h5 className="font-bold !text-[22px] leading-[28px]">Sign In</h5>
              <p className="text-h9 !leading-[16px] 2xl:text-scaled-h9">
                We&apos;re excited about what you&apos;re building!
              </p>
            </div>

            <div className="flex flex-col gap-[20px]">
              <SocialButtons
                handleStatusToggle={handleSignInToggle}
                isSignUp={false}
              />
              <Divider text="or" />
              <SessionProvider>
                <SigninForm setIsLoading={setIsLoading} isLoading={isLoading} />
              </SessionProvider>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container for error messages
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      /> */}
    </div>
  );
};
export default SigninContent;

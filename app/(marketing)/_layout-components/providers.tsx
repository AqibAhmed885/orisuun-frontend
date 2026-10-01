'use client';

import { Footer } from '@/components/marketing/Footer/Footer';
import { Navbar } from '@/components/marketing/Navbar/Navbar';
import { Slide } from 'react-toastify';
import Image from 'next/image';
import { PropsWithChildren, Suspense, useEffect, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { Provider } from 'react-redux';
import store from '@/data/store';
import Link from 'next/link';
import dynamic from 'next/dynamic';
const ToastContainer = dynamic(
  () => import('react-toastify').then(mod => mod.ToastContainer)
);

const dynamicUserPages = [
  '/professionals',
  '/partners',
  '/investors',
  '/black-owned-businesses',
  '/experts',
  '/mentors',
  '/strategy-consultants',
  '/advocates',
];

const isDynamicUserPage = (pathname) => {
  return dynamicUserPages.some((page) => pathname.startsWith(page));
};

export const Providers = ({ children }: PropsWithChildren) => {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { userType } = useParams();

  useEffect(() => { setMounted(true); }, []); 
  const extraTopPaddingPages = [ '/find-black-owned-businesses','/find-black-owned-restaurants','/refund' ]; const addTopPadding = extraTopPaddingPages.some((page) => pathname.startsWith(page) ); 
  const isSignUpPage = pathname === '/signup'; 
  const isRootPath = pathname === '/';
  const isDiscountPortalLandingPage =
    pathname === '/business-discount-club' ||
    pathname === '/partners-discount-club';
  const dynamicUserPage = isDynamicUserPage(pathname);
  const isAllowedUserType =
    !userType || dynamicUserPages.includes(`/${userType}`);

  return (
    <main
      className={`${dynamicUserPage || isSignUpPage
        ? ''
        : 'max-w-[1440px] 3xl:max-w-[1600px] 2k:max-w-[1800px]'
        } w-full mx-auto`}
    >
      <div className={isDiscountPortalLandingPage ? 'bg-[#B8D8F8]' : 'bg-white'}>
        {!isSignUpPage && (isRootPath || isAllowedUserType) ? (
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
        ) : null}

        {!isSignUpPage && (isRootPath || isAllowedUserType) ? (
          <Link
            href="feedback"
            prefetch={false}
            className="flex gap-3 items-start px-4 py-2 z-50 font-semibold text-base text-white transform origin-bottom-right -rotate-90 fixed mobile:top-[70%] top-2/3 -translate-y-1/2 right-0 bg-nav-blue max-w-max rounded-t-md"
          >
            Feedback
          </Link>
        ) : null}
        {mounted && (
          <ToastContainer
            transition={Slide}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            containerId="containerA"
          />
        )}
      <div className={addTopPadding ? "pt-14 md:pt-15" : ""}> <Provider store={store}>{children}</Provider> </div>
      </div>
      {!isSignUpPage && (isRootPath || isAllowedUserType) ? (
        <>
          <div className="sticky bottom-0 md:pb-20 flex flex-wrap items-center justify-center mx-auto -z-10">
            <div className="w-full lg:max-w-[95%] mobile:h-32 xl:max-w-[1200px] h-[300px] md:h-[372px] 3xl:h-[410px] 2k:h-[496px] 3xl:max-w-[1400px] 2k:max-w-[1700px] sm:max-w-[739px] sm:h-[370px] md:max-w-[95%] small-500:h-[250px] relative small-500:w-[95%]">
              <Image
                className="object-contain"
                src={`${process.env.NEXT_PUBLIC_STATIC_URL}/home/images/webp/orisuunFooter.webp`}
                loading="lazy"
                fill
                alt="Orisuun official black logo"
                sizes="(max-width: 768px) 95vw, (max-width: 1200px) 95vw, 1400px"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejmoRoFqBsHITYCbL5yjJ1gLJjdQTe1E7qr7rnYoelRlvOtMVAeILVNJ9CRmPvyj/2Q=="
              />
            </div>
            <div className='md:hidden top-52 h-[30vh] transform'>
              <Suspense fallback={null}>
                <Footer />
              </Suspense>
            </div>
          </div>
          <div className='hidden md:block'>
            <Suspense fallback={null}>
              <Footer />
            </Suspense>
          </div>
        </>
      ) : null}
    </main>
  );
};

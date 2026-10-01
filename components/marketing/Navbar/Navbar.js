'use client';

import Image from 'next/image';
import NextLink from 'next/link';
import React, { useEffect, useState } from 'react';
import Hamburger from 'hamburger-react';
import { DropDown } from '../Dropdown';
import { Button } from '../Button';
import Platform from './Platform';
import Connect from './Connect';
import { usePathname } from 'next/navigation';
import { mainOptions } from '../../../data/marketing';
import {
  Dialog,
  DialogPanel,
} from '@headlessui/react';
import DemoEmbed from '../DemoEmbed';
import { featureAndFunctionmobile } from '../../../data/marketing/NavData';
import ByFeature from './Platform/ByFeature';

const platformRoutes = [
  '/black-owned-businesses',
  '/professionals',
  '/experts',
  '/mentors',
  '/strategy-consultants',
  '/partners',
  '/investors',
  '/advocates',
];

const Link = (props) => <NextLink {...props} prefetch={false} />;

function NavbarContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [navState, setNavState] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [openOption, setOpenOption] = useState();
  const [isPlatformRoute, setIsPlatformRoute] = useState(false);
  const [pricingProfile, setPricingProfile] = useState('');
  const pathName = usePathname();
  const isPricingPage = pathName.includes('/pricing');
  const profileRoutes = [
    '/black-owned-businesses',
    '/mentors',
    '/experts',
    '/investors',
    '/professionals',
    '/partners',
    '/strategy-consultants',
    '/advocates',
  ];
  let profileParam = profileRoutes
    .find(route => pathName.includes(route))
    ?.replace('/', '');
  // On pricing page, prefer profile from query param set by dropdown
  if (isPricingPage && pricingProfile) {
    profileParam = pricingProfile;
  }
  const signupHref = profileParam
    ? `/signup?profile=${encodeURIComponent(profileParam)}`
    : '/signup';

  const isProfilePage = profileRoutes.some(route => pathName.includes(route));

  useEffect(() => {
    setIsPlatformRoute(platformRoutes.includes(pathName));
    setOpenMenu(false);
    setOpenSubMenu(null);
    setOpenOption(undefined);
  }, [pathName]);

  useEffect(() => {
    if (!isPricingPage || typeof window === 'undefined') {
      setPricingProfile('');
      return;
    }

    const qp = new URLSearchParams(window.location.search).get('profile');
    setPricingProfile(qp || '');
  }, [isPricingPage, pathName]);

  const onNavScroll = () => {
    if (window.scrollY > 15) {
      setNavState(true);
    } else {
      setNavState(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', onNavScroll);

    return () => {
      window.removeEventListener('scroll', onNavScroll);
    };
  }, []);

  return (
    <div
      className={`fixed left-0 right-0  z-[200]  ${!navState ? 'top-0 md:top-3.5' : ' md:top-3.5 top-0'
        }`}
      // style={{
      //   background:
      //     isPlatformRoute &&
      //     !navState &&
      //     'linear-gradient(180deg, rgba(52, 100, 158, 0.80) 0%, rgba(52, 100, 158, 0.34) 49.19%, rgba(52, 100, 158, 0.00) 100%)',
      // }}
    >
      <header
        style={{
          boxShadow: navState && '2px 4px 16px 0px rgba(8, 8, 8, 0.08)',
        }}
        className={` py-3 max-w-[1360px]  w-full mx-auto max-h-[76px] bg-[#B9D9EB9E] rounded-b-xl md:rounded-xl backdrop-blur-md ${!navState
          ? 'p-4 lg:px-8'
          : 'px-8  mobile:px-4 mobile:py-2.5 right-0 left-0 flex items-center justify-center  z-[200] blur-effect-theme transition-colors duration-300  align-middle'
          }`}
      >
        <nav className="flex items-center mx-auto justify-between w-full relative">
          {/* <div className="flex gap-[80px] w-full lg:w-auto justify-between lg:justify-start lg:items-end items-center"> */}
          <Link
            href="/"
            onClick={() => {
              setOpenMenu(false);
              setOpenSubMenu(null);
            }}
          >
            <Image
              src={
                isPlatformRoute && !navState ? '/white-blue.svg' : '/white-blue.svg'
              }
              className=""
              width={150}
              height={55}
              alt="logo"
              loading="lazy"
            />
          </Link>
          <ul className="hidden lg:flex gap-10 relative">
            <li>
              <DropDown
                isScrolled={navState}
                title="Features"
                Component={Platform}
                // whiteColor={isPlatformRoute && !navState}
              />
            </li>
            <li>
              <DropDown
                isScrolled={navState}
                title="Connect"
                Component={Connect}
                // whiteColor={isPlatformRoute && !navState}
              />
            </li>
            <li>
              <Link
                className="font-medium text-[#000511] text-[16px]"
                href="/calendar"
                style={{ color: isPlatformRoute && !navState && '#000511' }}
              >
                Calendar
              </Link>
            </li>
            <li>
              <Link
                className="font-medium text-[#000511] text-[16px]"
                href="/resources"
                style={{ color: isPlatformRoute && !navState && '' }}
              >
                Resources
              </Link>
            </li>
            <li>
              <Link
                className="font-medium text-[#000511] text-[16px]"
                href="/pricing"
                prefetch={false}
                style={{ color: isPlatformRoute && !navState && '' }}
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                className="font-medium text-[#000511] text-[16px]"
                href="/fund"
                style={{ color: isPlatformRoute && !navState && '' }}
              >
                Fund
              </Link>
            </li>
          </ul>
          <div className="flex items-center gap-3 lg:hidden">
            {/* {!openMenu && (
              <Link href={signupHref} prefetch={false}>
                <Button size="sm" className="px-5">
                  Start Free Trial!
                </Button>
              </Link>
            )} */}
            <div className="block  bg-[#F8F8F8] rounded-full">
              <Hamburger
                toggled={openMenu}
                toggle={setOpenMenu}
                label="Show menu"
                color="black"
                size={20}
              />
            </div>
          </div>
          {/* </div> */}
          <div className="hidden lg:flex gap-2 items-end">
            <Link href="/signin">
              <Button
                size="sm"
                className={`mobile:px-4 px-3 font-medium border h-11  border-[#0A1733] 'border-[#0A1733] text-[#0A1733] rounded-[10px] hover:bg-transparent hover:text-[#0A193A]'
                  }`}
                variant="outlined"
                // style={{ color: isPlatformRoute && !navState && 'white' }}
              >
                <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_933_17361)">
                    <g clip-path="url(#clip1_933_17361)">
                      {/* <mask id="mask0_933_17361" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="23" height="23">
                        <path d="M0.9375 0.460039L0.9375 22.46L22.9375 22.46L22.9375 0.460039L0.9375 0.460039Z" fill="#D9D9D9" />
                      </mask> */}
                      <g mask="url(#mask0_933_17361)">
                      </g>
                      <g clip-path="url(#clip2_933_17361)">
                        <path d="M12.3663 5.66441C12.8382 5.66441 13.2996 5.80426 13.6921 6.0663C14.0846 6.32833 14.3906 6.7008 14.5716 7.13667C14.7525 7.57253 14.8003 8.05224 14.7087 8.51521C14.6172 8.97819 14.3906 9.40366 14.0574 9.7379C13.7242 10.0721 13.2995 10.3001 12.8368 10.3931C12.3741 10.4861 11.8943 10.4399 11.4578 10.2604C11.0214 10.0808 10.6479 9.77597 10.3847 9.38431C10.1214 8.99265 9.98004 8.53175 9.97853 8.05982C9.97954 7.42721 10.2316 6.82085 10.6792 6.37388C11.1269 5.92691 11.7337 5.67587 12.3663 5.67587M12.3663 4.63289C11.6863 4.63289 11.0215 4.83455 10.456 5.21236C9.8906 5.59018 9.44989 6.12718 9.18964 6.75547C8.9294 7.38375 8.86131 8.0751 8.99398 8.74208C9.12665 9.40907 9.45413 10.0217 9.93499 10.5026C10.4159 10.9835 11.0285 11.3109 11.6955 11.4436C12.3625 11.5763 13.0538 11.5082 13.6821 11.2479C14.3104 10.9877 14.8474 10.547 15.2252 9.98156C15.603 9.41612 15.8047 8.75134 15.8047 8.07129C15.8047 7.15937 15.4424 6.2848 14.7976 5.63997C14.1528 4.99515 13.2782 4.63289 12.3663 4.63289ZM16.6032 13.3473C16.8058 13.3473 17.0002 13.4278 17.1435 13.5711C17.2868 13.7144 17.3673 13.9088 17.3673 14.1114C17.3673 15.6663 14.693 17.248 12.7827 17.248H12.0186C10.1084 17.248 7.45704 15.6663 7.45704 14.1114C7.45704 13.9088 7.53754 13.7144 7.68084 13.5711C7.82413 13.4278 8.01848 13.3473 8.22113 13.3473H16.6032ZM16.6032 12.3082H8.22495C7.74467 12.3082 7.28407 12.4989 6.94446 12.8385C6.60485 13.1782 6.41406 13.6388 6.41406 14.119C6.41406 16.4113 9.7111 18.2986 12.0186 18.2986H12.8095C15.1017 18.2986 18.4141 16.4266 18.4141 14.119C18.4141 13.8812 18.3672 13.6458 18.2762 13.426C18.1852 13.2063 18.0518 13.0067 17.8837 12.8385C17.7155 12.6704 17.5159 12.537 17.2962 12.446C17.0765 12.355 16.841 12.3082 16.6032 12.3082Z" fill="#0A1733" />
                      </g>
                    </g>
                  </g>
                  <defs>
                    <clipPath id="clip0_933_17361">
                      <rect width="22.92" height="23.8681" fill="white" transform="matrix(0 -1 1 0 0 22.92)" />
                    </clipPath>
                    <clipPath id="clip1_933_17361">
                      <rect width="22" height="22.9167" fill="white" transform="matrix(0 -1 1 0 0.476562 22.46)" />
                    </clipPath>
                    <clipPath id="clip2_933_17361">
                      <rect width="12" height="13.6772" fill="white" transform="translate(6.41406 4.62166)" />
                    </clipPath>
                  </defs>
                </svg>

                Sign In
              </Button>
            </Link>
            <Link href={signupHref} prefetch={false}>
              <Button
                size="sm"
                className="mobile:px-4 px-5 font-medium rounded-[10px] border h-11 py-2.5 bg-[#0A1733] border-[#0A1733] text-white hover:bg-transparent hover:text-[#0A193A]"
              >
                Start Free Trial!
              </Button>
            </Link>
          </div>
          {openMenu && (
            <div
              className={`fixed top-16 left-0 z-100 h-screen w-full flex flex-col justify-between px-4 py-8 bg-white overflow-y-auto ${navState ? 'top-[68px]' : ''
                }`}
            >
              <div className="flex flex-col gap-5">
                {openOption ? (
                  <div className="flex flex-col w-full gap-6">
                    <button
                      className="w-full flex gap-2 items-center justify-start"
                      onClick={() => setOpenOption(undefined)}
                    >
                      <Image
                        src="/icons/toggle-right.svg"
                        alt="right arrow"
                        className="rotate-180"
                        width={8}
                        height={8}
                        loading="lazy"
                      />
                      <p className="text-base font-semibold text-[#001E5F]">
                        {openOption}
                      </p>
                    </button>
                    {openOption === 'Connect' ? (
                      <div className="flex flex-col w-full gap-6">
                        <div className="flex flex-col justify-start gap-3">
                          <p className="text-base text-[#001E5F] font-semibold">
                            {mainOptions.connect.text}
                          </p>
                          <p className="text-sm text-[#001E5F] font-medium">
                            {mainOptions.connect.subText}
                          </p>
                        </div>
                        <div className="flex flex-col gap-6">
                          {mainOptions.connect.subLinks.map((s) => (
                            <Link
                              key={s.link}
                              href={s.link}
                              onClick={() => {
                                setOpenMenu(false);
                                setOpenOption(undefined);
                              }}
                              className="flex w-full gap-3 items-center"
                            >
                              <Image
                                src={`/icons/${s.image}.svg`}
                                alt={s.image}
                                width={20}
                                height={20}
                                loading="lazy"
                              />
                              <p className="text-base text-[#001E5F] font-semibold">
                                {s.text}
                              </p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-10 w-full h-full mb-20">
                        <div className="flex w-full flex-col gap-4 justify-start">
                          <p className="text-sm text-blue-200">
                            BY MEMBER TYPE
                          </p>
                          <div className="flex flex-col gap-6 w-full">
                            {mainOptions.platform.memberType.map((m) => (
                              <Link
                                href={m.link}
                                key={m.link}
                                onClick={() => {
                                  setOpenMenu(false);
                                  setOpenOption(undefined);
                                }}
                                className="flex w-full gap-3"
                              >
                                <Image
                                  src={`/icons/${m.image}.svg`}
                                  alt={m.image}
                                  width={20}
                                  height={20}
                                  loading="lazy"
                                />
                                <p className="text-base text-[#001E5F] font-semibold">
                                  {m.text}
                                </p>
                              </Link>
                            ))}
                          </div>
                        </div>
                        <div className="flex w-full flex-col gap-4 justify-start">
                          <p className="text-sm text-blue-200">
                            BY FEATURE & FUNCTION
                          </p>
                            <ByFeature/>
                        </div>
                        <div className="relative min-h-[720px]  h-full rounded-xl">
                          <div className="flex justify-center items-center flex-col gap-5 p-6 w-full">
                            <h1 className="text-white font-semibold text-center text-[20px] tracking-wider font-medium w-full items-center justify-center">
                              Learn more about Orisuun!
                            </h1>
                            <p className="text-white text-[15px] text-center font-medium w-full items-center justify-center px-[50px]">
                              See our growth platform in action and how it can
                              work for you!
                            </p>
                            <Button
                              className="text-white bg-transparent w-[160px] text-base font-semibold leading-[150%] border rounded-xl border-white"
                              onClick={() => {
                                setIsOpen(true);
                              }}
                            >
                              Watch Demo
                              <Image
                                src="/home/icons/exclude-white.svg"
                                className="inline-block ml-2"
                                alt="exclude"
                                loading="lazy"
                                width={20}
                                height={20}
                              />
                            </Button>
                          </div>
                          <Image
                              src="/icons/mega-manu1.svg"
                            alt="bg-mobile"
                            className="w-full absolute rounded-lg -z-10 h-full object-cover"
                            fill
                            loading="lazy"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div
                      className="w-full flex items-center justify-between"
                      onClick={() => {
                        setOpenOption('Features');
                      }}
                    >
                      <div className="flex items-center justify-between w-full ">
                        <div className="text-[16px] font-[600] text-[#5B657B] w-full">
                          Features
                        </div>
                        <Image
                          src="/icons/toggle-right.svg"
                          className={openOption && 'hidden'}
                          alt="right arrow"
                          width={8}
                          height={8}
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div
                      className="w-full flex items-center justify-between"
                      onClick={() => {
                        setOpenOption('Connect');
                      }}
                    >
                      <div className="text-[16px] font-[600] text-[#5B657B] w-full">
                        Connect
                      </div>
                      <Image
                        src="/icons/toggle-right.svg"
                        className={openOption && 'hidden'}
                        alt="right arrow"
                        width={8}
                        height={8}
                        loading="lazy"
                      />
                    </div>

                    {mainOptions.links.map((l) => (
                      <Link
                        key={l.link}
                        onClick={() => {
                          setOpenMenu(false);
                          setOpenOption(undefined);
                        }}
                        className="w-full flex items-center justify-between text-[16px] font-[600] text-[#5B657B]"
                        href={l.link}
                      >
                        {l.mainText}
                      </Link>
                    ))}
                  </>
                )}
              </div>
              {openOption === undefined && (
                <div className="flex gap-2 w-full justify-between items-center mb-20">
                  <Link href="/signin" className="w-full">
                    <Button
                      size="sm"
                      className={`px-5 w-full text-base font-semibold ${isPricingPage
                        ? 'border-[#0A193A] text-[#0A193A] hover:bg-transparent hover:text-[#0A193A]'
                        : ''
                        }`}
                      variant="outlined"
                      style={{ color: isPlatformRoute && !navState && 'white' }}
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href={signupHref} prefetch={false} className="w-full">
                    <Button
                      size="sm"
                      className="px-5 w-full text-base font-semibold"
                    >
                      Start Free Trial!
                    </Button>
                  </Link>
                </div>
              )}
              <Dialog
                open={isOpen}
                onClose={() => setIsOpen(false)}
                className="relative z-50"
              >
                <div className="fixed inset-0 flex w-screen bg-[#111] bg-opacity-80 items-center justify-center ">
                  <DialogPanel className="space-y-4">
                    <div className="w-[925px] 2xl:w-[1200px] 2k:w-[1300px] max-w-[90vw] rounded-xl overflow-hidden">
                      <DemoEmbed />
                    </div>
                  </DialogPanel>
                </div>
              </Dialog>
            </div>
          )}
        </nav>
      </header>
    </div>
  );
}

export function Navbar() {
  return <NavbarContent />;
}

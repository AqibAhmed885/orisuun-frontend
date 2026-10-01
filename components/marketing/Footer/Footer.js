'use client';
import { useState, useEffect } from 'react';

import Image from 'next/image';
import NextLink from 'next/link';
import { FooterForm } from './FooterForm';
import { YoutubeIcon } from '../SVG/YoutubeIcon/YoutubeIcon';
import { LinkedinIcon } from '../SVG/LinkedinIcon/LinkedinIcon';
import { InstagramIcon } from '../SVG/InstagramIcon/InstagramIcon';
import TikTokIcon from '../SVG/TikTokIcon/TikTokIcon';
import { DemoVideoDialog } from '../Navbar/Platform';
import ChevronDown from '@/icons/chevron-down';

const Link = (props) => <NextLink {...props} prefetch={false} />;

export function Footer() {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldOpenDialog, setShouldOpenDialog] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  useEffect(() => {
    if (shouldOpenDialog) {
      setIsOpen(true);
    }
  }, [shouldOpenDialog]);

  const handleWatchDemoClick = () => {
    setShouldOpenDialog(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setShouldOpenDialog(false);
  };

  return (
    <div>
      <div className="flex gap-3 justify-center mt-10  lg:hidden ">
        <a
          href="https://www.youtube.com/@orisuun"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
        >
          <YoutubeIcon />
        </a>
        <a
          href="http://linkedin.com/company/orisuun"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <LinkedinIcon />
        </a>
        <a
          href="https://www.instagram.com/orisuun/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <InstagramIcon />
        </a>
        <a
          href="https://www.tiktok.com/@orisuun"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TikTok"
        >
          <TikTokIcon />
        </a>
      </div>
      <footer className="xl:px-[80px] px-4 lg:py-[50px] !mx-auto max-w-[1440px] 3xl:max-w-[1600px] 2k:max-w-[1800px]">
        <div className="mt-[60px] lg:mt-[53px] w-full ">
          <div className="grid grid-cols-2  md:grid-cols-4 gap-12 lg:grid-cols-5 justify-between ">
            {/* colum 1 */}
            <div className="hidden lg:block">
              <h4 className="text-black-500-custom text-[20px] font-bold leading-7 mb-4">
                Connect
              </h4>
              <div className="flex gap-[7px]">
                <a
                  href="https://www.youtube.com/@orisuun"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                >
                  <YoutubeIcon />
                </a>
                <a
                  href="http://linkedin.com/company/orisuun"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon />
                </a>
                <a
                  href="https://www.instagram.com/orisuun/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://www.tiktok.com/@orisuun"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                >
                  <TikTokIcon />
                </a>
              </div>
            </div>
            <div className="">
              <h4 className=" text-base leading-[20.8px] text-black-500-custom md:text-[20px] font-bold md:leading-7 mb-4">
                Orisuun and You
              </h4>
              <nav>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/black-owned-businesses"
                      className="text-[14px] font-medium leading-[130%] text-[#5A5A5A] hover:text-nav-blue"
                    >
                      For Black-Owned Businesses
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/strategy-consultants"
                      className="text-[14px] font-medium leading-[130%] text-[#5A5A5A] hover:text-nav-blue"
                    >
                      For Strategy Consultants
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/experts"
                      className="text-[14px] font-medium leading-[130%] text-[#5A5A5A] hover:text-nav-blue"
                    >
                      For Experts
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/professionals"
                      className="text-[14px] font-medium leading-[130%] text-[#5A5A5A] hover:text-nav-blue"
                    >
                      For Professionals
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/investors"
                      className="text-[14px] font-medium leading-[130%] text-[#5A5A5A] hover:text-nav-blue"
                    >
                      For Investors
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/mentors"
                      className="text-[14px] font-medium leading-[130%] text-[#5A5A5A] hover:text-nav-blue"
                    >
                      For Mentors
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/partners"
                      className="text-[14px] font-medium leading-[130%] text-[#5A5A5A] hover:text-nav-blue"
                    >
                      For Partners
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/advocates"
                      className="text-[14px] font-medium leading-[130%] text-[#5A5A5A] hover:text-nav-blue"
                    >
                      For Advocates
                    </Link>
                  </li>
                </ul>
              </nav>

              <div className="mt-12 md:hidden block">
                <h4 className=" mt-12 text-base leading-[20.8px] text-black-500-custom md:text-[20px] font-bold md:leading-7 mb-4">
                  Free Tools
                </h4>
                <nav>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/resources"
                        className="text-[14px] font-medium leading-[130%] text-[#5A5A5A] hover:text-nav-blue"
                      >
                        Global Black <br /> Business Resources
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/calendar"
                        className="text-[14px] font-medium leading-[130%] text-[#5A5A5A] hover:text-nav-blue"
                      >
                        Global Black <br />
                        Business Events Calendar
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>

            {/* colum 2 */}
            <div className="w-fit">
              <h4 className=" text-base leading-[20.8px] text-black-500-custom md:text-[20px] font-bold md:leading-7 mb-4">
                The Company
              </h4>
              <nav>
                <ul className="space-y-2">
                  <li className="overflow-hidden">
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="flex items-center gap-2 w-full text-left text-sm group font-medium text-[#5A5A5A] hover:text-nav-blue"
                    >
                      About Us
                      <ChevronDown
                        className={`ml-2 transition-all group-hover:fill-nav-blue fill-[#5A5A5A] ${
                          isMenuOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                      />
                    </button>

                    <ul
                      className={`ml-4 space-y-2 transition-all ${
                        isMenuOpen ? 'max-h-screen mt-2' : 'max-h-0'
                      }`}
                    >
                      <li>
                        <Link
                          href="/about"
                          className="text-sm font-medium text-[#5A5A5A] hover:text-nav-blue"
                        >
                          Who We Are
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/about#all-welcome"
                          className="text-sm font-medium text-[#5A5A5A] hover:text-nav-blue"
                        >
                          What We Are Not
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/about#how-we-can-help-you"
                          className="text-sm font-medium text-[#5A5A5A] hover:text-nav-blue"
                        >
                          How We Can Help You
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/about#why-we-created"
                          className="text-sm font-medium text-[#5A5A5A] hover:text-nav-blue"
                        >
                          Why This Is Critical
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/about#key-values"
                          className="text-sm font-medium text-[#5A5A5A] hover:text-nav-blue"
                        >
                          Our Values
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/about"
                          className="text-sm font-medium text-[#5A5A5A] hover:text-nav-blue"
                        >
                          Our Vision
                        </Link>
                      </li>
                    </ul>
                  </li>

                  <li>
                    <Link
                      href="/founder"
                      className="text-sm font-medium text-[#5A5A5A] hover:text-nav-blue"
                    >
                      Meet the Founder
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/what-we-offer"
                      prefetch={false}
                      className="text-sm font-medium text-[#5A5A5A] hover:text-nav-blue"
                    >
                      What We Offer
                    </Link>
                  </li>

                 
                  <li>
                    <Link
                      href="/how-you-can-help-us"
                      className="text-sm font-medium text-[#5A5A5A] hover:text-nav-blue"
                    >
                      How You Can Help Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/feedback"
                      className="text-sm font-medium text-[#5A5A5A] hover:text-nav-blue"
                    >
                      We Need Your Feedback
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-sm font-medium text-[#5A5A5A] hover:text-nav-blue"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/insights"
                      className="text-sm font-medium text-[#5A5A5A] hover:text-nav-blue"
                    >
                      Articles and Insights
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
            

            {/* column 3 */}
            <div className="">
              <h4 className=" text-base leading-[20.8px] text-black-500-custom md:text-[20px] font-bold md:leading-7 mb-4">
                Fund
              </h4>
              <nav>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/fund"
                      className="text-[14px] font-medium leading-[130%] text-[#5A5A5A] hover:text-nav-blue"
                    >
                      The Black Wealth Fund
                    </Link>
                  </li>
                </ul>
              </nav>

            <div className="mt-16 hidden md:block">
              <h4 className="  text-base leading-[2.8px] text-black-500-custom md:text-[20px] font-bold md:leading-7 mb-4">
                Free Tools
              </h4>
              <nav>
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="/resources"
                      className="text-[14px] font-medium leading-[130%] text-[#5A5A5A] hover:text-nav-blue"
                    >
                      Global Black Business Resources
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/calendar"
                      className="text-[14px]  font-medium leading-[130%] text-[#5A5A5A] hover:text-nav-blue"
                    >
                      Global Black Business Events Calendar
                    </Link>
                  </li>
                </ul>
                </nav>
              </div>
            </div>

            {/* column 4*/}
            <div className="">
              <h4 className=" text-base leading-[20.8px] text-black-500-custom md:text-[20px] font-bold md:leading-7 mb-4">
                Check Us Out
              </h4>
              <nav>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={handleWatchDemoClick}
                      className="text-[14px] font-medium leading-[130%] text-[#5A5A5A] hover:text-nav-blue border-none outline-none"
                    >
                      Demo Our Platform
                    </button>
                  </li>
                  <li>
                    <Link
                      href="/pricing"
                      prefetch={false}
                      className="text-[14px] font-medium leading-[130%] text-[#5A5A5A] hover:text-nav-blue"
                    >
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signin"
                      className="text-[14px] font-medium leading-[130%] text-[#5A5A5A] hover:text-nav-blue"
                    >
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signup"
                      prefetch={false}
                      className="text-[14px] font-medium leading-[130%] text-[#5A5A5A] hover:text-nav-blue"
                    >
                      Sign Up
                    </Link>
                  </li>
                </ul>

                {isOpen && (
                  <DemoVideoDialog isOpen={isOpen} handleClose={handleClose} />
                )}
              </nav>
            </div>
          </div>
        </div>
        <FooterForm />
      </footer>
    </div>
  );
}

import React from 'react';
import Image from 'next/image';
import { ContactTopListing } from './components/contactTop';
import Accordion from '../../../components/marketing/Accordion/Accordion.js';
import { StarIcon } from '../../../components/marketing/StarIcon/StarIcon';
import { topListingData } from '../../../data/marketing';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export const metadata = {
  title: ' Orisuun | Contact Us ',
  description: '',
  // keywords: '',
  alternates: {
    canonical: 'https://orisuun.com/contact',
  },
  openGraph: {
    title: 'Orisuun | Contact Us',
    description: 'Get in touch with Orisuun - Your Ecosystem for Black Business Growth',
    url: 'https://orisuun.com/contact',
    siteName: 'Orisuun',
    images: [
      {
        url: 'https://orisuun.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact Orisuun',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Orisuun | Contact Us',
    description: 'Get in touch with Orisuun - Your Ecosystem for Black Business Growth',
    images: ['https://orisuun.com/og-image.jpg'],
  },
};

const ContactUs = () => {
  return (
    <>
      <div className="w-full ">
        <div className="flex flex-col items-center small-500:px-4 w-full">
          <div className="flex flex-col justify-center items-center w-full ">
            <div className="relative ">
              <StarIcon
                className={
                  'opacity-50 xl:w-[500px] xl:h-[552px] lg:w-[400px] lg:h-[552px] md:w-[430px] md:h-[380px] w-[300px] h-[352px] mt-6 lg:-top-8 md:-right-[120px] lg:-right-[120px] xl:-right-[220px] xl:-top-7 md:-top-0 sm:-right-[140px] small-500:hidden'
                }
              />
              <h1 className="xl:w-[784px] lg:w-[734px] md:w-[584px] text-center mt-[60px] small-500:mt-[60px] lg:mt-[91px] m-0 text-blue-strong xl:text-[64px] lg:text-[50px] text-[36px] font-semibold leading-110 mb-[24px] z-30">
                We Want to Get to know You
              </h1>
              <p className="text-blu-ray-300 xl:text-[20px] lg:text-[18px] text-[16px] text-center leading-150 font-medium h-[60px] mb-[80px]">
                Do you have a comment or suggestion for us?{' '}
                <span className="block">Make sure your voice is heard</span>
              </p>
            </div>

            <div className="flex justify-center z-20 w-full">
              <div className="sm:mx-4 lg:mx-10 xl:mx-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                {topListingData.map((item) => (
                  <ContactTopListing
                    key={item.id}
                    svg={item.svg}
                    header={item.header}
                    paragraph={item.paragraph}
                    email={item.email}
                    bgColor={item.id === 2 ? 'bg-[#F2F7FC]' : 'bg-white'}
                    addCurve={
                      item.id === 2 ? (
                        <Image
                          alt="curve"
                          src={`${staticUrl}/contact-svgs/general-curve.svg`}
                          width={220}
                          height={220}
                          className="absolute right-0 top-0"
                        />
                      ) : null
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-[150px] mb-[200px] bg-blueBg flex w-full">
          <div className="w-full xl:mx-20 lg:mx-16 mx-10 small-500:mx-4 mt-[100px] text-white flex md:flex-col lg:flex-row flex-col">
            <div className="absolute left-0 bottom-0 hidden lg:block">
              <Image alt="half-clip" src={`${staticUrl}/contact-svgs/half-star.png`} width={620} height={620} />
            </div>
            <div className="w-full xl:mb-0 lg:mb-0 mb-20 small-500:mb-[65px] lg:mr-10">
              <p className="font-semibold leading-110 md:text-[40px] text-[24px] mb-[24px] max-w-[470px] ">
                But first, maybe you will find some answers here?
              </p>
              <p className="font-medium text-[20px] small-500:text-[16px] leading-150 opacity-70 max-w-[307px]">
                Here are the answers to our most frequently asked questions.
              </p>
            </div>
            <div className="ml-auto w-full mb-20 small-500:mb-10">
              <Accordion />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;

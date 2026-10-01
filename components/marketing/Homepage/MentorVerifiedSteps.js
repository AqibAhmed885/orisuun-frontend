'use client';

import Image from 'next/image';
import mentorVerifiedSteps from '../../../public/home/images/mentorVerifiedSteps.png';
import Link from 'next/link';

export default function MentorVerifiedSteps({ userType }) {
  const steps = [
    "Must have been the CEO or Founder of a profitable company generating over $1 million in annual revenue for at least one year.",
    "Must be a C-suite executive or direct report to the CEO at a large, publicly traded company.",
    "Must hold a recognized certification in business, executive, or leadership coaching from an accredited institution.",
  ];

  return (
    <section className="w-full bg-[#F2F7FC] py-16 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-12 mb-12">
      <div className='w-[95%] flex md:flex-row flex-col mx-auto justify-between'>
        <div className='w-full md:max-w-[43%]'>
          <h2 className="hidden md:block text-[30px] md:text-[40px] font-[450px] text-[#001E5F] mb-6">
            Steps to Get Verified and Stand Out as a Mentor
          </h2>
          <p className="block md:hidden w-full text-[24px] font-[450px] text-[#001E5F] mb-6">
            What You Need to Qualify for a Verified Strategy Consultant Account
          </p>
          <p className="block text-[#5B657B] text-[20px] mb-6">
            To maintain the integrity and quality of our mentorship network, verified mentor accounts must meet at least one of the following criteria:
          </p>
          <ul className="space-y-4 mb-8">
            {steps.map((step, index) => (
              <li key={index} className="flex items-start text-[#5B657B] text-[16px] gap-1">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.0013 1.66602C5.4013 1.66602 1.66797 5.39935 1.66797 9.99935C1.66797 14.5993 5.4013 18.3327 10.0013 18.3327C14.6013 18.3327 18.3346 14.5993 18.3346 9.99935C18.3346 5.39935 14.6013 1.66602 10.0013 1.66602ZM7.74297 13.5743L4.7513 10.5827C4.67415 10.5055 4.61295 10.4139 4.5712 10.3131C4.52944 10.2123 4.50795 10.1043 4.50795 9.99518C4.50795 9.88607 4.52944 9.77803 4.5712 9.67723C4.61295 9.57643 4.67415 9.48483 4.7513 9.40768C4.82845 9.33053 4.92005 9.26933 5.02085 9.22758C5.12165 9.18582 5.22969 9.16433 5.3388 9.16433C5.44791 9.16433 5.55595 9.18582 5.65675 9.22758C5.75756 9.26933 5.84915 9.33053 5.9263 9.40768L8.33464 11.8077L14.068 6.07435C14.2238 5.91853 14.4351 5.831 14.6555 5.831C14.8758 5.831 15.0872 5.91853 15.243 6.07435C15.3988 6.23016 15.4863 6.44149 15.4863 6.66185C15.4863 6.8822 15.3988 7.09353 15.243 7.24935L8.91797 13.5743C8.84087 13.6516 8.7493 13.7129 8.64849 13.7547C8.54768 13.7965 8.43961 13.8181 8.33047 13.8181C8.22133 13.8181 8.11326 13.7965 8.01245 13.7547C7.91164 13.7129 7.82006 13.6516 7.74297 13.5743Z" fill="#447DFC" />
                </svg>
                <span>{step}</span>
              </li>
            ))}
          </ul>
          <Link href="/signup?profile=mentors">
            <button className="bottom-auto w-[200px] text-lg px-1 py-3 bg-[#2357C6] mt-[1rem] text-white font-semibold rounded-full hover:bg-[#8ba8e7] transition">
              Join the community
            </button>
          </Link>
        </div>
        <div className='w-full md:max-w-[57%] mt-8 md:mt-0'>
          <Image src={mentorVerifiedSteps} height={200} width={700} alt='Dr. Michael Chen' />
        </div>
      </div>
    </section>
  );
};

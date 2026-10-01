'use client';

import Image from 'next/image'
import React from 'react'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { Button } from '@/components/marketing';

const LandingFooter = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setMessage('Please fill in First name, Last name and Email.');
      setIsSuccess(false);
      setShowNotification(true);
      return;
    }

    // build payload: send full name and ProfileTypeId = 10
    const payload = {
      ProfileTypeId: 1,
      Name: `${firstName.trim()} ${lastName.trim()}`,
      Email: email.trim(),
    };


    setSubmitting(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_APP_BASE_URL || 'https://api.orisuun.com';
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';

      const res = await fetch(`${apiBase}/api/Newsletter/Subscribe`, {
        method: 'POST',
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
          XApiKey: apiKey,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `Request failed with status ${res.status}`);
      }

      // success
      setFirstName('');
      setLastName('');
      setEmail('');
      setMessage('Successfully subscribed!');
      setIsSuccess(true);
      setShowNotification(true);
    } catch (error: any) {
      console.error('Subscribe error:', error);
      setMessage('Subscription failed. Please try again later.');
      setIsSuccess(false);
      setShowNotification(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className='w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-24'>
        <div className="w-full lg:max-w-[95%] mobile:h-32 xl:max-w-[1200px] h-[300px] md:h-[372px] 3xl:h-[410px] 2k:h-[496px] 3xl:max-w-[1400px] 2k:max-w-[1700px] sm:max-w-[739px] sm:h-[370px] md:max-w-[95%] small-500:h-[250px] relative small-500:w-[95%]">
          <Image
            className=""
            src="/home/images/webp/orisuunFooter.webp"
            loading="lazy"
            fill
            alt="Orisuun official black logo"
            sizes="(max-width: 768px) 95vw, (max-width: 1200px) 95vw, 1400px"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejmoRoFqBsHITYCbL5yjJ1gLJjdQTe1E7qr7rnYoelRlvOtMVAeILVNJ9CRmPvyj/2Q=="
          />
        </div>

      </div>

      <div className="mb-12 mx-auto ">
        <Transition
          show={showNotification}
          enter="transition ease-out duration-300"
          enterFrom="transform opacity-0 -translate-y-4"
          enterTo="transform opacity-100 translate-y-0"
          leave="transition ease-in duration-200"
          leaveFrom="transform opacity-100 translate-y-0"
          leaveTo="transform opacity-0 -translate-y-4"
          afterLeave={() => setShowNotification(false)}
        >
          <div
            className={`fixed top-4 right-4 text-white px-4 py-2 rounded-md shadow-lg z-[1000] ${isSuccess ? 'bg-green-500' : 'bg-red-500'
              }`}
          >
            {message}
          </div>
        </Transition>

        <h6 className="text-xl font-bold text-blue-strong">
          Let us keep you up-to-date on all of our insights
        </h6>
        <p className="text-gray-600 text-sm font-medium mt-1 mb-4">
          Subscribe to our newsletters and be smarter than all your friends.
        </p>

        <div className="flex flex-col xl:flex-row xl:items-center justify-between">
          <form
            className="flex flex-col md:flex-row gap-3"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              className="placeholder:text-[#B1B1B0] text-sm font-medium border-[#8D8D8D] border outline-none w-full md:w-[180px] px-4 py-3 bg-transparent rounded-md"
              name="firstName"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <input
              type="text"
              className="placeholder:text-[#B1B1B0] text-sm font-medium border-[#8D8D8D] border outline-none w-full md:w-[180px] px-4 py-3 bg-transparent rounded-md"
              name="lastName"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="email"
              className="placeholder:text-[#B1B1B0] text-sm font-medium border-[#8D8D8D] border outline-none w-full md:w-[180px] px-4 py-3 bg-transparent rounded-md"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              onClick={submitting}
              disabled={submitting}
              className={`rounded-[68px] mt-2 md:mt-0 md:rounded-md ${submitting ? 'opacity-60 pointer-events-none' : ''}`}
            >
              <span className="mr-2 ">Subscribe</span>
              <Image
                src="/icons/ArrowRight.svg"
                width={24}
                height={24}
                loading="lazy"
                alt="Orisuun official black logo"
              />
            </Button>
          </form>
          <div className="flex md:max-w-full justify-center text-center xl:self-center xl:items-center mx-auto md:mx-0 md:justify-normal gap-3 flex-wrap mt-[60px] md:mt-6 xl:mt-0 text-[#5A5A5A] text-sm font-medium small-500:w-full small-500:flex-col">
            <div className="flex sm:gap-3 small-500:items-start px-6 small-500:justify-center gap-6 text-[14px]">
              <Link href="/contact">Contact</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
            <p className="mb-10 text-[14px] xl:mb-0">
              © Copyright&nbsp; {new Date().getFullYear().toString()}&nbsp;
              Orisuun. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingFooter
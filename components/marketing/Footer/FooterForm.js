'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { Button } from '../Button';
import ProfileType from './ProfileType';
import { submitNewsletterSignup } from '@/app/api/marketing/newsletter';

export const FooterForm = () => {
  const [selectedProfileType, setSelectedProfileType] = useState('');
  const [name, setName] = useState('');
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

  const handleProfileTypeChange = (type) => {
    setSelectedProfileType(type);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name || !email || !selectedProfileType) {
      setMessage('Please fill in all fields.');
      setIsSuccess(false);
      setShowNotification(true);
      return;
    }

    try {
      setSubmitting(true);
      await submitNewsletterSignup({ name, email, profileType: selectedProfileType });
      setName('');
      setEmail('');
      setSelectedProfileType('');
      setMessage('Successfully subscribed!');
      setIsSuccess(true);
      setShowNotification(true);
    } catch (err) {
      setMessage(err?.message || 'Subscription failed. Please try again.');
      setIsSuccess(false);
      setShowNotification(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12 mx-auto ">
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

      <h6 className="text-xl font-bold text-[#0A193A]">
        Let us keep you up-to-date on all of our insights
      </h6>
      <p className="text-[#4B5B7D] text-sm font-medium mt-1 mb-4">
        Subscribe to our newsletters and be smarter than all your friends.
      </p>

      <div className="flex flex-col xl:flex-row xl:items-center justify-between">
        <form
          className="flex flex-col md:flex-row gap-3"
          onSubmit={handleSubmit}
        >
          <ProfileType
            selectedProfileType={selectedProfileType}
            onProfileTypeChange={handleProfileTypeChange}
          />
          <input
            type="text"
            className="placeholder:text-[#B1B1B0] text-sm font-medium border-[#8D8D8D] border outline-none w-full md:w-[180px] px-4 py-3 bg-transparent rounded-md"
            name="Name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
          />
          <input
            type="email"
            className="placeholder:text-[#B1B1B0] text-sm font-medium border-[#8D8D8D] border outline-none w-full md:w-[180px] px-4 py-3 bg-transparent rounded-md"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
          />
          <Button
            type="submit"
            className="rounded-[68px] mt-2 md:mt-0 md:rounded-md"
            disabled={submitting}
          >
            <span className="mr-2">{submitting ? 'Subscribing…' : 'Subscribe'}</span>
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
  );
};

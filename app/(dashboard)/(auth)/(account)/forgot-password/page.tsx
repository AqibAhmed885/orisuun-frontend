'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import backgroundSrc from '@/public/images/horizon.png';
import LogoFullBlack from '@/icons/logo-full-black';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { sendForgotPasswordMail } from '../../../../api/auth/auth';
const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loader, setLoader] = useState(false);

  const onSubmit = async () => {
    setLoader(true);
    try {
      const response = await sendForgotPasswordMail(email);
      toast.success(response.data.Message);
      setEmail('');
    } catch (error) {
      toast.error(error?.response?.data?.Message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="relative w-full h-screen">
      <Image
        src={backgroundSrc}
        alt="Background"
        quality={100}
        priority
        fill
        className="object-cover"
      />

      {/* Card Container */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4">
        <div className="relative w-full bg-white rounded-lg shadow-xl p-10">
          {/* Logo */}
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
            <LogoFullBlack />
          </div>

          {/* Card Content */}
          <div>
            <div className="mb-10">
              <h5 className="font-semibold text-xl mb-2">Forgot password?</h5>
              <p className="text-sm text-gray-600">
                {`No worries, we'll send you reset instructions.`}
              </p>
            </div>

            <form className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <Button
                type="button"
                className="w-full py-2 font-normal"
                title="Reset Password"
                disabled={loader}
                onClick={onSubmit}
              ></Button>
            </form>
          </div>
          <p className="text-center mt-10 text-h9 2xl:text-scaled-h9 text-black-400 font-medium">
            Back to{' '}
            <Link href={'/signin'}>
              <span className="text-omblue-700"> Sign in</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

'use client';

import React, { useCallback, useEffect, useState } from 'react';
import VerificationSteps from './components/verification-steps/verification-steps';
import VerificationStart from './components/verification-start';
import Close from '@/icons/close';
import { useDispatch } from 'react-redux';
import { checkUserVerificationStatus } from '@/server-actions/verification';
import { addUserVerificationData } from '@/data/slices/user-slice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { steps } from '../../../../../../data/dashboard/verification';;
const VerificationPage = () => {
  const [step, setStep] = useState(0);
  const [width, setWidth] = useState(0);
  const router = useRouter();
  useEffect(() => {
    setWidth(Math.round(((step / steps.length) * 100 * 100) / 100));
  }, [step]);
  const dispatch = useDispatch()
  const currentUser = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userData'))
  const getCurrentUserVerificationDetailsData = useCallback(async () => {
    try {
      if (currentUser.Id !== null) {
        const result = await checkUserVerificationStatus({
          Id: currentUser.Id,
        });
        if (result.success) {
          dispatch(addUserVerificationData(result.data.data.Result));
        } else {
          if (
            result.message &&
            result.message.toLowerCase().includes('this feature is not for')
          ) {
            toast.error(result.message);
          }
        }
      }
    } catch (error) {
      console.error(error, 'Error');
    }
  }, [step]);
  useEffect(() => {
    if (currentUser) {
      getCurrentUserVerificationDetailsData();
    }
  }, [step]);

  return (
    <>
      <div className="w-full md:hidden">
        <div className="relative flex items-center justify-between px-4 py-6 w-100 md:hidden">
          <p className="mx-auto font-semibold text-blue-600 text-h7 2xl:text-scaled-h7">
            {steps[step - 1]?.name || 'Verification'}
          </p>
          <Close className="absolute -translate-y-1/2 right-2 top-1/2" onClick={() => router.back()} />
        </div>
        ``
        <div
          className={`relative z-10 h-1 overflow-hidden rounded-md bg-omblue-100 w-full`}
        >
          <div
            className={`absolute inset-0 z-10 h-1 bg-omblue-600 transition-all duration-300 ease-in-out`}
            style={{ width: `${width}%` }}
          ></div>
        </div>
      </div>
      {step === 0 ? (
        <VerificationStart step={step} setStep={setStep} />
      ) : (
        <VerificationSteps steps={steps} step={step} setStep={setStep} />
      )}
    </>
  );
};

export default VerificationPage;

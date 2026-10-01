'use client';

import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { ProfileDetails } from '../ProfileDetails.js';
import { Button } from '../../../../../../../components/marketing/index.js';
import { methodSchema } from '../../../../../../../utils/marketing/schemas.js';
import Orisuun from '../../../../../../../public/home/icons/Orisunn-LOGO.svg';
import { PaymentMethod } from '../PaymentMethod.js';
import Image from 'next/image.js';
import { toast } from 'react-toastify';
const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`

export const Methods = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(methodSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const requestData = {
        Email: data.email,
        BlackWealthContributionId: data.subscriptionKey,
      };

      // const result = await CancelBWFSubscription(requestData);
      const result = await axios.post(
        `${apiEndpoint}/Marketing/CancelBwfSubscription`,
        requestData,
        {
          headers: {
            XApiKey:
              'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
          },
        }
      );
      if (result.status == 200) {
        toast.success('Your monthly donation has been cancelled successfully.', { containerId: "containerA" });
      }
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.Message || 'Something went wrong', { containerId: "containerA" })
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full lg:h-[411px] h-full flex flex-col lg:flex-row small-1000:px-4">
      <CancelSubscriptionDetails />
      <div className="h-full lg:pt-[92px] lg:px-[58px] pt-10 overflow-y-auto overflow-x-hidden shadow-md">
        <div className="h-full lg:w-[443px] w-full flex flex-col ">
          <Suspense>
            <form onSubmit={handleSubmit(onSubmit)} className="lg:space-y-6 ">
              <div className="space-y-2 mb-[66px]">
                <p className="text-sm text-[#6E6E6E] font-medium">
                  Subscription details
                </p>
                <div className=" w-full">
                  <ProfileDetails
                    register={register}
                    errors={errors}
                    includeEmail={true}
                    includeFirstName={false}
                    includeLastName={false}
                    includeSubcriptionKey={true}
                    includePassword={false}
                  />
                </div>
              </div>
              <Button
                className="w-full h-12 bg-[#DC3545]"
                disabled={loading}
                type="submit"
              >
                {loading ? 'Submitting...' : 'Cancel subscription'}
              </Button>
            </form>
            <button
              onClick={onClose}
              className="text-sm underline text-[#6E6E6E] mt-4 text-center font-medium outline-none border-none cursor-pointer"
            >
              Keep subscription
            </button>
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export const CancelSubscriptionDetails = () => {
  return (
    <section className="lg:bg-[#F2F7FC] h-full w-full lg:w-1/2 lg:p-10 pt-4 rounded-tl-[20px] rounded-bl-[20px]">
      <div className="flex flex-col items-start gap-8">
        <Image src={Orisuun} alt="Orisuun" width={131} height={38} />
        <div className="lg:w-[320px] flex flex-col gap-2">
          <h2 className="text-blue-strong text-[24px] font-bold leading-150 drop-shadow-xl">
            We’re sorry to see you go!
          </h2>
          <p className="tracking-tight text-blu-ray-300 text-[15px] font-medium leading-[18px]">
            Remember, you can renew your subscription at any time, and continue to help Black-owned businesses.
          </p>
        </div>
      </div>
    </section>
  );
};

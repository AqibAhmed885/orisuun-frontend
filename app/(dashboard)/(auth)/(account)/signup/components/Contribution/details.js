'use client';

import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MonthlyDetails } from './monthlyDetails.js';
import { ProfileDetails } from '../ProfileDetails.js';
import { Button } from '../../../../../../../components/marketing/index.js';
import { detailsSchema } from '../../../../../../../utils/marketing/schemas.js';
import { bwfService } from '../../../../../../api/auth/auth.ts';
import PaymentForm from '@/components/ui/payment-form.tsx';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Script from 'next/script.js';
import { toast } from 'react-toastify';
import { Router } from 'next/router';
import { PaymentMethod } from '../PaymentMethod.js';

// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_BWF_PUBLIC_KEY
// );

export const Details = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [stripeClientSecrect, SetStripeClientSecret] = useState(null);
  const [stripePaymentIntent, SetStripePaymentIntent] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState('100');
  const [paypalDetails, setPaypalDetails] = useState(null);
  const [bwfDetails, setBwfDetails] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(detailsSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const requestData = {
        FirstName: data.firstName,
        LastName: data.lastName,
        City: data.city,
        Email: data.email,
        Amount: Number(selectedAmount),
      };

      const response = await bwfService.createSubscription(requestData);

      if (response.status === 200) {
        toast.success(response?.data?.Message || 'Subscription created successfully', { containerId: "containerA" });
        const customerData = {
          FirstName: data.firstName,
          LastName: data.lastName,
          CityName: data.city,
          Email: data.email,
          StripeCustomerId: response?.data?.Result?.bwfPaymentRecord?.StripeCustomerId,
          StripeSubscriptionId: response?.data?.Result?.bwfPaymentRecord?.StripeSubscriptionId
        };

        await bwfService.createCustomer(customerData);
      }

      SetStripeClientSecret(response.data?.Result?.paymentIntent?.ClientSecret);
      SetStripePaymentIntent(response.data?.Result?.paymentIntent);
      setPaypalDetails(response.data?.Result?.paypalSubscription);
      setBwfDetails(response.data?.Result?.bwfPaymentRecord);
      setShowPaymentMethod(true);
    } catch (error) {
      setError(error.message);
      toast.error(error.response?.data?.Message || 'Failed to create subscription', { containerId: "containerA" });
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="lg:max-w-[1117px] lg:h-[785px] h-full w-full small-1000:px-4 small-1000:pt-4 small-1000:pb-6">
      <Script
      strategy="lazyOnload"
        src={`https://www.paypal.com/sdk/js?client-id=${process?.env?.NEXT_PUBLIC_PAYPAL_CLIENT_ID
          }&vault=true&intent=subscription`}
        data-sdk-integration-source="button-factory"
      ></Script>
      <section className="w-full h-full flex small-1000:flex-col small-1000:overflow-y-scroll hide-scrollbar">
        <MonthlyDetails />
        <div className="h-full lg:pt-[92px] small-1000:w-full lg:px-[58px] overflow-y-auto hide-scrollbar overflow-x-hidden">
          <div className="h-full lg:w-[443px] w-full flex flex-col gap-10 ">
            <Suspense>
              {showPaymentMethod ? (
                <div className="pb-[42px]">
                  {stripeClientSecrect && (
                    <Elements stripe={loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)}>
                      <PaymentForm
                        paymentClientSecret={stripeClientSecrect}
                        paymentAmount={`$${bwfDetails.Amount.toString()}`}
                        paymentDuration={'Month'}
                        paymentIntent={stripePaymentIntent}
                        paypalPlanID={paypalDetails?.id}
                        paymentType={'BWFSubscription'}
                      />
                    </Elements>
                  )}
                  <Elements stripe={loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)}>
                    {' '}
                    <PaymentMethod />
                  </Elements>
                </div>
              ) : (
                <div className="pb-[42px]">
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 lg:space-y-6"
                  >
                    <div className="space-y-2">
                      <p className="text-sm text-[#6E6E6E] font-medium small-1000:hidden">
                        Personal details
                      </p>
                      <p className="text-sm lg:hidden text-[#6E6E6E] font-medium">
                        Profile details
                      </p>
                      <div className=" w-full">
                        <ProfileDetails
                          register={register}
                          errors={errors}
                          includeCity={true}
                          includeAmount={true}
                          includePassword={false}
                          includeContribution={true}
                          setSelectedAmount={setSelectedAmount}
                          selectedAmount={selectedAmount}
                        />
                      </div>
                    </div>
                    <Button
                      className="w-full h-12"
                      disabled={loading}
                      type="submit"
                    >
                      {loading ? 'Submitting...' : 'Proceed to payment'}
                    </Button>
                  </form>
                  <p className="text-sm text-[#6E6E6E] mt-4 text-center font-medium">
                    All contributions are made on a monthly basis
                  </p>
                </div>
              )}
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
};

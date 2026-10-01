import React, { useEffect, useRef, useState } from 'react';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { contributeSchema } from '@/utils/marketing/schemas';
import axios from 'axios';
import { toast } from 'react-toastify';
import { apiEndpoint, cn } from '@/utils/utils';
import { BankAccount } from '../../../app/(dashboard)/(auth)/(account)/signup/components/BankAcount';
import Input from '@/components/ui/input';
import { bankAccountTypes } from '@/data/marketing';
import Radio from '@/components/ui/radio';
import useOutsideClick from '@/hooks/useOutsideClick';
import Visa from '@/icons/cards/visa';
import MasterCard from '@/icons/cards/master-card';
import MaestroCard from '@/icons/cards/maestro-card';
import Amex from '@/icons/cards/amex';
import Image from 'next/image';
import clsx from 'clsx';
import Divider from '@/components/ui/divider';
import Button from '@/components/ui/button';
import ApplePayPayment from '../../../app/(dashboard)/(auth)/(account)/signup/components/ApplePayPayment';
import { 
  // loadStripe, 
  Stripe, Token } from '@stripe/stripe-js';

interface IFundCampaignPropos {
  campaignId: number;
  handleNewContribution: (any) => void;
  amount?: number;
  isAmountFixed: boolean;
  onSucess?: () => void;
}

const cardsmenu = [
  { name: 'Dinners Club', path: '/images/vector/cards/dinners-club.svg' },
  { name: 'OB', path: '/images/vector/cards/ob.svg' },
  { name: 'Discover', path: '/images/vector/cards/discover.svg' },
  { name: 'JCB', path: '/images/vector/cards/jcb.svg' },
  { name: 'UnionPay', path: '/images/vector/cards/union-pay.svg' },
  { name: 'Star', path: '/images/vector/cards/star.svg' },
  { name: 'NYCE', path: '/images/vector/cards/nyce.svg' },
  { name: 'Pulse', path: '/images/vector/cards/pulse.svg' },
  { name: 'Acel', path: '/images/vector/cards/acel.svg' },
];

const FundCampaign: React.FC<IFundCampaignPropos> = ({
  campaignId,
  handleNewContribution,
  amount,
  onSucess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoader] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // Default to card
  const [selectedAccountType, setSelectedAccountType] = useState('Checking'); // Bank account type selection
  const [showCard, setShowCard] = useState(false);
  const cardRef = useRef(null);
  const [applePayOrGooglePayToken, setApplePayOrGooglePayToken] =
    useState<Token>(null);

  useOutsideClick(cardRef, () => setShowCard(false));

  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));

  const {
    register,
    handleSubmit: handleCardSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(contributeSchema),
    defaultValues: {
      amount: amount || null,
    },
  });

  useEffect(() => {
    setValue('amount', amount);
  }, [amount]);

  const resetAllFields = () => {
    reset(); // Reset all form fields
    if (elements) {
      const cardNumberElement = elements.getElement(CardNumberElement);
      const cardExpiryElement = elements.getElement(CardExpiryElement);
      const cardCvcElement = elements.getElement(CardCvcElement);

      cardNumberElement?.clear();
      cardExpiryElement?.clear();
      cardCvcElement?.clear();
    }
  };

  const cardSubmit = async (data) => {
    try {
      if (!stripe || !elements) {
        return;
      }
      setLoader(true);
      const cardNumberElement = elements.getElement(CardNumberElement);

      const { error, token } = await stripe.createToken(cardNumberElement, {
        name: data.fullName,
      });

      if (!token) {
        toast.error('Payment Failed!');
        console.error(error);
        setLoader(false);
        return;
      }

      const response = await verifyPayment(data, token.id);
      if (response.status === 200) {
        reset();
        resetAllFields();
        if (onSucess) onSucess();
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message || 'Payment Failed!!');
    } finally {
      setLoader(false);
    }
  };

  const bankSubmit = async (data) => {
    try {
      setLoader(true);
      const { token, error } = await stripe.createToken('bank_account', {
        country: 'US',
        currency: 'usd',
        routing_number: data.routingNumber,
        account_number: data.accountNumber,
        account_holder_name: data.nameOnAccount,
        account_holder_type: 'individual',
      });

      if (error) {
        toast.error(error?.message || 'Invalid Payment Method Failed!!');
        return;
      }
      const response = await verifyPayment(data, token.id);
      if (response.status === 200) {
        reset();
        resetAllFields();
        if (onSucess) onSucess();
      } else {
        toast.error(response?.data?.Message || 'Payment Failed!!');
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message || 'Payment Failed!!');
    } finally {
      setLoader(false);
    }
  };

  const verifyPayment = async (data, transactionId: string) => {
    const response = await axios.post(
      `${apiEndpoint}/Campaign/CreateCampaignContributionV1`,
      {
        CampaignId: campaignId,
        FullName: data.fullName,
        Location: data?.location,
        Amount: data?.amount,
        TransactionId: transactionId,
        UserId: currentUser?.Id,
        IsPrivate: false,
      },
      {
        headers: {
          XApiKey:
            'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
        },
      }
    );

    if (response.status === 200) {
      handleNewContribution(response.data.Result);
    }
    return response;
  };

  const handlePayemntViaGooglePayOrApplePay = async () => {
    if (applePayOrGooglePayToken) {
      setLoader(true);
      await verifyPayment({ amount }, applePayOrGooglePayToken?.id);
    }
  };

  useEffect(() => {
    if (applePayOrGooglePayToken && applePayOrGooglePayToken.id)
      handlePayemntViaGooglePayOrApplePay();
  }, [applePayOrGooglePayToken]);

  const handlePayment = (data) => {
    if (paymentMethod === 'card') {
      cardSubmit(data);
    } else {
      bankSubmit(data);
    }
  };

  return (
    <>
      <form onSubmit={handleCardSubmit(handlePayment)} className="space-y-4">
        <div className="w-full space-y-4">
          <h2 className="text-h2 text-center lg:!text-left lg:text-5xl text-blue-strong font-medium leading-[120%%]">
            Payment Details
          </h2>

          <div className="space-y-8">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-[#6E6E6E]">
                Payment methods
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 justify-center items-center">
              <div className="grid-cols-1 paypal_btn">
                {/* <Elements stripe={stripePromise}> */}
                <ApplePayPayment
                  amount={amount * 100}
                  // setToken={setApplePayOrGooglePayToken}
                  // onError={(error) => {
                  //   toast.error('Payment Failed');
                  // }}
                />
                {/* </Elements> */}
              </div>
              {/* <div className="grid-cols-1 paypal_btn">
                <Elements stripe={stripePromise}>
                  <ApplePayPayment
                    amount={amount}
                    setToken={setApplePayOrGooglePayToken}
                    onError={(error) => {}}
                  />
                </Elements>
              </div> */}
            </div>

            <Divider text="or" />
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 items-center justify-between py-3">
                <Radio
                  // {...register('payment_option')}
                  id="card"
                  value="card"
                  label="Credit Cards"
                  checked={paymentMethod === 'card'}
                  labelClasses="mobile:gap-2.5 gap-5"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setPaymentMethod('card');
                    }
                  }}
                />
                <div className="relative flex gap-2">
                  <Visa />
                  <MasterCard />
                  <MaestroCard />
                  <Amex />
                  <p
                    className="text-[#6e6e6e] text-h7 2xl:text-scaled-h7 cursor-pointer"
                    onClick={() => setShowCard(!showCard)}
                  >
                    + more
                  </p>
                  <div
                    className={cn(
                      'absolute right-0 flex-wrap items-center justify-center w-64 gap-3 p-3 bg-white shadow-md bottom-8 rounded-xl',
                      showCard ? 'flex' : 'hidden'
                    )}
                    ref={cardRef}
                  >
                    {cardsmenu.map((card, index) => (
                      <Image
                        key={index}
                        src={card.path}
                        alt={card.name}
                        width={34}
                        height={24}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {paymentMethod === 'card' && (
                <>
                  <div className="stripe-input border bg-white px-4 py-3 rounded-md w-full">
                    <CardNumberElement options={{ showIcon: true }} />
                  </div>
                  <div className="flex items-center w-full gap-4">
                    <div className="stripe-input border bg-white px-4 py-3 rounded-md w-full">
                      <CardExpiryElement />
                    </div>
                    <div className="stripe-input border bg-white px-4 py-3 rounded-md w-full">
                      <CardCvcElement />
                    </div>
                  </div>
                </>
              )}

              <div className="py-3">
                <Radio
                  // {...register('payment_option')}
                  id="bank_account"
                  value="bank_account"
                  label="Bank Account (ACH Transaction)"
                  checked={paymentMethod === 'bank_account'}
                  labelClasses="mobile:gap-2.5 gap-5"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setPaymentMethod('bank_account');
                    }
                  }}
                />
              </div>
              {paymentMethod === 'bank_account' && (
                <BankAccount
                  register={register}
                  errors={errors}
                  selectedAccountType={selectedAccountType}
                  setSelectedAccountType={setSelectedAccountType}
                  bankAccountTypes={bankAccountTypes}
                />
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              title={loading ? 'Loading...' : 'Pay'}
              type="submit"
              disabled={loading}
              className="bg-nav-blue font-semibold text-white py-2.5 px-4 rounded-xl"
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default FundCampaign;

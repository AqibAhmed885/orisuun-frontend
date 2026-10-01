'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PaymentSchemaFormData, paymentSchema } from '@/utils/schema';
import { paymentAction, verifyPaypalPayment } from '@/server-actions/payment';
import Radio from './radio';
import Input from './input';
import Button from './button';
import Lock from '@/icons/lock';
import Visa from '@/icons/cards/visa';
import MasterCard from '@/icons/cards/master-card';
import MaestroCard from '@/icons/cards/maestro-card';
import Amex from '@/icons/cards/amex';
import Image from 'next/image';
import { apiEndpoint, cn } from '@/utils/utils';
import useOutsideClick from '@/hooks/useOutsideClick';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  PaymentRequestButtonElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import Modal from './modal/modal';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import ApplePayPayment from '../../app/(dashboard)/(auth)/(account)/signup/components/ApplePayPayment';
import axios from 'axios';

interface PayPalNamespace {
  Buttons: (config: PayPalButtonConfig) => {
    render: (selector: string) => void;
  };
}

interface PayPalButtonConfig {
  style: {
    shape: string;
    color: string;
    layout: string;
    label: string;
    height?: string;
  };
  createSubscription?: (data: any, actions: any) => Promise<string>;
  createOrder?: (data: any, actions: any) => Promise<string>;
  onApprove: (data: any, actions: any) => void;
  onError?: any;
}

// declare global {
//   interface Window {
//     paypal?: PayPalNamespace;
//   }
// }

const cards = [
  { name: 'Dinners Club', path: './images/vector/cards/dinners-club.svg' },
  { name: 'OB', path: './images/vector/cards/ob.svg' },
  { name: 'Discover', path: './images/vector/cards/discover.svg' },
  { name: 'JCB', path: './images/vector/cards/jcb.svg' },
  { name: 'UnionPay', path: './images/vector/cards/union-pay.svg' },
  { name: 'Star', path: './images/vector/cards/star.svg' },
  { name: 'NYCE', path: './images/vector/cards/nyce.svg' },
  { name: 'Pulse', path: './images/vector/cards/pulse.svg' },
  { name: 'Acel', path: './images/vector/cards/acel.svg' },
];
type PaymentFormProps = {
  paymentClientSecret: string;
  paymentAmount: string;
  paymentDuration: string;
  paymentIntent: any;
  paypalPlanID: any;
  paymentType: 'SignupSubscription' | 'BWFSubscription' | 'VerificationFee';
};

// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
// );

const PaymentForm: React.FC<PaymentFormProps> = ({
  paymentClientSecret,
  paymentAmount,
  paymentDuration,
  paymentIntent,
  paypalPlanID,
  paymentType,
}) => {
  const [showCard, setShowCard] = useState(false);
  const cardRef = useRef(null);
  const paypalButtonRef = useRef<HTMLDivElement>(null);
  useOutsideClick(cardRef, () => setShowCard(false));
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [verification, setVerification] = useState('');
  const [verificationModal, setVerificationModal] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const router = useRouter();
  const [applePayPaymentRequest, setApplePayPaymentRequest] = useState<
    any | null
  >(null);
  const [googlePayPaymentRequest, setGooglePayPaymentRequest] = useState<
    any | null
  >(null);
  const [token, setToken] = useState<any>();
  const [loading, setLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<PaymentSchemaFormData>({
    resolver: zodResolver(paymentSchema),
  });

  const handlePaymentSuccess = () => {
    switch (paymentType) {
      case 'SignupSubscription':
        {
          toast.success('Subscription payment successful');
          toast.info('You can now log in to your account');
          router.push('/signin');
        }
        break;
      case 'BWFSubscription':
        {
          toast.success('Your BWF subscription payment was successful');
          toast.info('Your subscription has been activated');
        }
        break;
      case 'VerificationFee':
        {
          toast.success('Verification fee payment successful');
          toast.info('You can start submitting your documents');
        }
        break;
      default:
        toast.success('Payment successful');
    }
  };

  const onSubmit = async (formData: PaymentSchemaFormData) => {
    try {
      setLoading(true);
      const result = await paymentAction(formData);
      if (result.success) {
        //
        // Handle successful payment (e.g., show a success message, redirect user)
      } else {
        // console.error('Payment failed:', result.errors);
        // Handle validation errors (e.g., display error messages to the user)
      }

      if (formData.payment_option === 'card') {
        await handleCardPayment(formData);
        setLoading(false);
      } else if (formData.payment_option === 'bank_account') {
        await handleUsBankPayment(formData);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('An error occurred during payment:', error);
      // Handle any unexpected errors
    }
  };

  const handleCardPayment = async (formData: any) => {
    if (!stripe || !elements) {
      console.error('Stripe or Elements not loaded');
      return;
    }

    // const cardElement = elements.getElement('cardNumber');
    const cardElement = elements.getElement(CardNumberElement);
    const cardExpiryElement = elements.getElement(CardExpiryElement);
    const cardCVCElement = elements.getElement(CardCvcElement);

    if (!cardElement) {
      console.error('Card Element not found');
      return;
    }

    const response = await stripe.confirmCardPayment(paymentClientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: formData.card_name,
        },
      },
    });

    if (response.error) {
      console.error('Payment failed:', response.error.message);
      setLoading(false);
      // Handle error here
    } else if (response.paymentIntent.status === 'succeeded') {
      //  Handle Different scenarios of toast messages  based on payment Types total there are three BWFPayments, SignupSubscription, VerificationFee
      handlePaymentSuccess();
      setLoading(false);
      // toast.success('Payment Successfull, You can Now login');
      // router.push('/signin');
      // Handle successful payment here
    }
  };

  const handleUsBankPayment = async (formData: any) => {
    if (!stripe) {
      console.error('Stripe or Elements not loaded');
      return;
    }

    await stripe
      .confirmUsBankAccountPayment(paymentClientSecret, {
        payment_method: {
          us_bank_account: {
            account_holder_type: 'individual',
            routing_number: formData.routing_number,
            account_number: formData.account_number,
          },
          billing_details: {
            name: formData.bank_name,
            email: 'amancustomer+test_email@yopmail.com', // Replace with the user's email
          },
        },
      })
      .then(({ paymentIntent, error }) => {
        if (error) {
          console.error(error.message);
          setLoading(false);
          // Handle error here
        } else {
          handleUsBankPaymentIntent(paymentIntent);
          setLoading(false);
        }
      });
  };

  const handleUsBankPaymentIntent = (paymentIntent: any) => {
    if (paymentIntent.status === 'requires_action') {
      if (paymentIntent.next_action.type === 'verify_with_microdeposits') {
        const verificationUrl =
          paymentIntent.next_action.verify_with_microdeposits
            .hosted_verification_url;
        if (verificationUrl) {
          setVerificationModal(true);
          setVerification(verificationUrl);
          pollPaymentIntentStatus();
        }
      } else {
        // Handle other types of actions if needed
      }
    } else if (paymentIntent.status === 'succeeded') {
      // Handle successful payment here
    } else {
      // Handle other payment statuses if needed
    }
  };

  const pollPaymentIntentStatus = useCallback(async () => {
    if (!stripe || !paymentClientSecret) return;

    setIsPolling(true);
    const pollInterval = setInterval(async () => {
      try {
        const { paymentIntent } = await stripe.retrievePaymentIntent(
          paymentClientSecret
        );

        if (
          paymentIntent != undefined &&
          paymentIntent.status === 'processing'
        ) {
          clearInterval(pollInterval);
          setIsPolling(false);
          setVerificationModal(false);
          toast.info(
            'Verification application submitted successfully. Process may take up to five (5) business days'
          );
          setTimeout(() => {
            //  Handle Different scenarios of toast messages  based on payment Types total there are three BWFPayments, SignupSubscription, VerificationFee

            router.push('/signin');
          }, 1500);
        }
      } catch (error) {
        console.error('Error polling payment intent:', error);
        clearInterval(pollInterval);
        setIsPolling(false);
      }
    }, 5000); // Poll every 5 seconds

    return () => {
      clearInterval(pollInterval);
      setIsPolling(false);
    };
  }, [stripe, paymentClientSecret, router]);

  const handleApplePay = async () => {
    if (!stripe) {
      console.error('Stripe has not loaded yet.');
      return;
    }

    const paymentRequest = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Total',
        amount: parseInt(paymentAmount.replace(/[^0-9.-]+/g, '')) * 100, // Convert payment amount to cents
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    const elements = stripe.elements();
    const prButton = elements.create('paymentRequestButton', {
      paymentRequest,
    });

    paymentRequest.canMakePayment().then((result) => {
      if (result) {
        setApplePayPaymentRequest(paymentRequest);
        // prButton.mount('#apple-pay-button');
      } else {
        console.error('Apple Pay is not available on this device/browser.');
      }
    });

    paymentRequest.on('paymentmethod', async (ev) => {
      try {
        const { paymentIntent, error: confirmError } =
          await stripe.confirmCardPayment(
            paymentClientSecret,
            { payment_method: ev.paymentMethod.id },
            { handleActions: false }
          );

        if (confirmError) {
          ev.complete('fail');
          console.error('Payment failed:', confirmError.message);
        } else {
          ev.complete('success');
          handlePaymentSuccess(); // Call the success handler
        }
      } catch (error) {
        ev.complete('fail');
        console.error('An error occurred during payment:', error);
      }
    });
  };

  const handleGooglePay = async () => {
    if (!stripe) {
      console.error('Stripe has not loaded yet.');
      return;
    }

    const paymentRequest = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Total',
        amount: parseInt(paymentAmount.replace(/[^0-9.-]+/g, '')) * 100, // Convert payment amount to cents
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    const elements = stripe.elements();
    const prButton = elements.create('paymentRequestButton', {
      paymentRequest,
      style: {
        paymentRequestButton: {
          type: 'default',
          theme: 'dark',
          height: '48px',
          buttonSpacing: '4px',
        },
      },
    });

    paymentRequest.canMakePayment().then((result) => {
      if (result) {
        setGooglePayPaymentRequest(paymentRequest);
        // prButton.mount('#google-pay-button');
      } else {
        console.error('Google Pay is not available on this device/browser.');
      }
    });

    paymentRequest.on('paymentmethod', async (ev) => {
      try {
        const { paymentIntent, error: confirmError } =
          await stripe.confirmCardPayment(
            paymentClientSecret,
            { payment_method: ev.paymentMethod.id },
            { handleActions: false }
          );

        if (confirmError) {
          ev.complete('fail');
          console.error('Payment failed:', confirmError.message);
        } else {
          ev.complete('success');
          handlePaymentSuccess(); // Call the success handler
        }
      } catch (error) {
        ev.complete('fail');
        console.error('An error occurred during payment:', error);
      }
    });
  };

  useEffect(() => {
    if (stripe) {
      handleApplePay();
      handleGooglePay();
    }
  }, [stripe]);

  const watchPaymentOption = watch('payment_option');

  const renderCardFields = () => {
    return (
      <div className="w-full space-y-4">
        <Input
          {...register('card_name')}
          placeholder="Name on card"
          error={errors.card_name?.message}
        />
        <div className="stripe-input border bg-white focus:border-omblue-500 focus:bg-[#f3f7f9] text-h9 2xl:text-scaled-h9 font-medium px-4 py-3 rounded-md w-full">
          <CardNumberElement options={{ showIcon: true }} />
        </div>
        <div className="flex items-center w-full gap-[18px]">
          <div className="stripe-input border bg-white focus:border-omblue-500 focus:bg-[#f3f7f9] text-h9 2xl:text-scaled-h9 font-medium px-4 py-3 rounded-md w-full">
            <CardExpiryElement />
          </div>
          <div className="stripe-input border bg-white focus:border-omblue-500 focus:bg-[#f3f7f9] text-h9 2xl:text-scaled-h9 font-medium px-4 py-3 rounded-md w-full">
            <CardCvcElement />
          </div>
        </div>
      </div>
    );
  };

  const renderBankFields = () => {
    return (
      <div className="space-y-4">
        <Input
          {...register('bank_name')}
          placeholder="Name on Account"
          error={errors.bank_name?.message}
        />
        <Input
          {...register('routing_number')}
          placeholder="ACH Routing Number"
          error={errors.routing_number?.message}
        />
        <Input
          {...register('account_number')}
          placeholder="Account Number"
          error={errors.account_number?.message}
        />
        <Input
          {...register('confirm_account_number')}
          placeholder="Confirm account number"
          error={errors.confirm_account_number?.message}
        />
      </div>
    );
  };

  useEffect(() => {
    const loadPayPalButton = async () => {
      if (paymentType === 'VerificationFee') {
        if (window.paypal && paypalPlanID && paypalButtonRef.current) {
          paypalButtonRef.current.innerHTML = '';
          const buttonConfig: any = {
            style: {
              shape: 'rect',
              color: 'white',
              layout: 'horizontal',
              label: 'paypal',
            },
            onClick: function (data: any, actions: any) {
              // Track PayPal click in GTM
              if (typeof window !== 'undefined' && window.dataLayer) {
                window.dataLayer.push({
                  event: 'paypal_click',
                  event_category: 'payment',
                  event_label: 'PayPal Button Click',
                  timestamp: new Date().toISOString(),
                });
              }
              return actions.order.validate();
            },
            createOrder: function (data: any, actions: any) {
              return Promise.resolve(paypalPlanID);
            },
            onApprove: async function (data: any, actions: any) {
              try {
                const requestData = {
                  SubscriptionId: data.subscriptionID,
                  PaymentType: paymentType,
                };
                const response = await verifyPaypalPayment(requestData);
                handlePaymentSuccess();
              } catch (error) {
                console.error('Payment verification error:', error);
                toast.error(
                  'Paypal payment verification failed. Please contact support'
                );
              }
            },
            onError: function (err: any) {
              console.error('PayPal error:', err);
              toast.error('An error occurred with PayPal. Please try again');
            },
          };

          window.paypal
            .Buttons(buttonConfig)
            .render('#paypal-button-container');
        }
      } else {
        if (window.paypal && paypalPlanID && paypalButtonRef.current) {
          paypalButtonRef.current.innerHTML = '';
          const buttonConfig: any = {
            style: {
              shape: 'rect',
              color: 'white',
              layout: 'horizontal',
              label: 'paypal',
            },
            onClick: function (data: any, actions: any) {
              // Track PayPal click in GTM
              if (typeof window !== 'undefined' && window.dataLayer) {
                window.dataLayer.push({
                  event: 'paypal_click',
                  event_category: 'payment',
                  event_label: 'PayPal Button Click',
                  timestamp: new Date().toISOString(),
                });
              }
              return actions.order.validate();
            },
            createSubscription: function (data: any, actions: any) {
              return Promise.resolve(paypalPlanID);
            },
            onApprove: async function (data: any, actions: any) {
              try {
                const requestData = {
                  SubscriptionId: data.subscriptionID,
                  PaymentType: paymentType,
                };
                const response = await verifyPaypalPayment(requestData);
                handlePaymentSuccess();
              } catch (error) {
                console.error('Payment verification error:', error);
                toast.error(
                  'Paypal payment verification failed. Please contact support'
                );
              }
            },
            onError: function (err: any) {
              console.error('PayPal error:', err);
              toast.error('An error occurred with PayPal. Please try again');
            },
          };

          window.paypal
            .Buttons(buttonConfig)
            .render('#paypal-button-container');
        }
      }
    };

    if (document.readyState === 'complete') {
      loadPayPalButton();
    } else {
      window.addEventListener('load', loadPayPalButton);
    }

    return () => {
      window.removeEventListener('load', loadPayPalButton);
    };
  }, [paymentType, paypalPlanID]);

  useEffect(() => {
    (async () => {
      try {
        const registerData = JSON.parse(localStorage.getItem('registerUser'));
        if (token && token?.id) {
          const res = await axios.post(
            `${apiEndpoint}/UserVerification/GetPaySubscription`,
            {
              CustomerId: registerData?.paymentIntent?.CustomerId,
              PlanId: registerData?.BillingPlanId,
              Token: token?.id,
            },
            {
              headers: {
                XApiKey:
                  'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
              },
            }
          );

          if (res.status == 200) {
            toast.success(res.data?.Message || 'Registration done!');
          }
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.Message ||
          'There was a server error while registering (contact support)'
        );
      }
    })();
  }, [token]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <p className="mb-3">Payment methods</p>

          <div className="flex md:flex-row flex-col items-center gap-[14px]">
            <Elements stripe={loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)}>
              <ApplePayPayment
                amount={Number(paymentAmount?.split('$')[1])}
                // setToken={setToken}
                // onError={(error) => console.error('Payment error:', error)}
              />
            </Elements>
            {/* {googlePayPaymentRequest && (
              <div className="w-full border border-brand-primary rounded-lg py-4 px-8 mb-10 flex items-center justify-center">
                <PaymentRequestButtonElement
                  options={{
                    paymentRequest: applePayPaymentRequest,
                    style: {
                      paymentRequestButton: {
                        type: 'default',
                        theme: 'dark',
                        height: '48px',
                      },
                    },
                  }}
                />
              </div>
            )} */}

            <div
              ref={paypalButtonRef}
              id="paypal-button-container"
              data-gtm-event="paypal-click"
              className="w-full rounded-lg  max-h-[64px] flex items-center justify-center"
            ></div>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative px-3 text-gray-500 bg-white">Or</div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-3">
            <Radio
              {...register('payment_option')}
              id="card"
              value="card"
              label="Credit Cards"
              checked={watchPaymentOption === 'card'}
              onChange={(e) => {
                if (e.target.checked) {
                  setValue('payment_option', 'card');
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
                {cards.map((card, index) => (
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
          {watchPaymentOption === 'card' && renderCardFields()}
          <div className="py-3">
            <Radio
              {...register('payment_option')}
              id="bank_account"
              value="bank_account"
              label="Bank Account"
              checked={watchPaymentOption === 'bank_account'}
              onChange={(e) => {
                if (e.target.checked) {
                  setValue('payment_option', 'bank_account');
                }
              }}
            />
          </div>
          {errors.payment_option && (
            <p className="text-sm text-red-500">
              {errors.payment_option.message}
            </p>
          )}
        </div>

        {watchPaymentOption === 'bank_account' && renderBankFields()}

        <div className={cn('w-full py-3', { hidden: !watchPaymentOption })}>
          <div className="flex items-center justify-between gap-2 mb-5 text-[#001e5f]">
            <h6 className="font-semibold text-h6 2xl:text-scaled-h6">Total</h6>
            <p className="font-semibold text-h6 2xl:text-scaled-h6">
              {paymentAmount}
              <span className="font-medium text-h9 2xl:text-scaled-h9">
                / {paymentDuration}
              </span>
            </p>
          </div>
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className="min-w-full mb-5 btn-secondary rounded-3xl"
            title="Start My FREE Trial"
          />
          <div className="flex items-center justify-center gap-2">
            <Lock />
            <p>Payments are secure and encrypted</p>
          </div>
        </div>
      </form>
      <Modal
        setShowModal={setVerificationModal}
        showModal={verificationModal}
        title="Confirm your bank account"
      >
        <iframe
          src={verification}
          className="w-full h-full border-0"
          title="Paymemt form"
        ></iframe>
      </Modal>
    </>
  );
};

export default PaymentForm;

import React, { useEffect, useState, useRef } from 'react';
import { PaymentRequestButtonElement, useStripe } from '@stripe/react-stripe-js';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

const CashAppPayment = ({ amount, setToken, onError }) => {
  const stripe = useStripe();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userIdFromQuery = searchParams?.get('userId');

  // Keep the PaymentRequest instance in a ref so it is created only once
  const paymentRequestRef = useRef(null);
  // Refs to keep the latest callbacks available to the event handler without re-attaching
  const setTokenRef = useRef(setToken);
  const onErrorRef = useRef(onError);
  const lastAmountRef = useRef(null);
  // State used to control when the button should render (only after canMakePayment resolves true)
  const [isAvailable, setIsAvailable] = useState(false);

  // Keep refs up to date if callbacks change
  useEffect(() => { setTokenRef.current = setToken; }, [setToken]);
  useEffect(() => { onErrorRef.current = onError; }, [onError]);

  // Initialize the PaymentRequest once when `stripe` becomes available
  useEffect(() => {
    if (!stripe) return;
    if (paymentRequestRef.current) return; // already initialized

    function validAmount(amount) {
      if (typeof amount === 'string') {
        amount = amount.trim();
        if (amount === '') return 0;
      }
      const numAmount = parseFloat(amount);
      return Number.isFinite(numAmount) && numAmount > 0 ? Math.round(numAmount * 100) : 0; // cents
    }

    const newAmount = validAmount(amount);

    const pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Total',
        amount: newAmount,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    paymentRequestRef.current = pr;

    const paymentMethodHandler = async (ev) => {
      try {
        const paymentMethodId = ev?.paymentMethod?.id;
        if (!paymentMethodId) {
          throw new Error('Missing PaymentMethod ID from wallet');
        }

        const registerUser = JSON.parse(typeof window !== 'undefined' ? (localStorage.getItem('registerUser') || '{}') : '{}');
        const userId = registerUser?.user?.Id || userIdFromQuery;
        const planId = registerUser?.BillingPlanId ? `${registerUser?.BillingPlanId}` : 52;

        const resp = await fetch('/api/UserVerification/GetVerificationPaymentIntent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            UserId: userId,
            PlanId: planId,
            PaymentMethod: paymentMethodId,
            PaymentMethodType: 'stripe',
          }),
        });

        const result = await resp.json();

        if (result?.statusCode === 200) {
          ev.complete('success');
          localStorage.setItem(
            'signupAuthData',
            JSON.stringify({
              Email: registerUser?.Email || registerUser?.email || registerUser?.user?.Email || '',
              Password: registerUser?.Password || registerUser?.password || '',
              SignedUpWith: registerUser?.SignedUpWith || 'manual',
              Token: registerUser?.Token || '',
            })
          );
          const amt = result?.result?.paymentIntent?.amount;
          const trialEnd = result?.result?.trialEnd;
          if (amt && trialEnd) {
            toast.success(`Trial started! You'll be charged $${(amt / 100).toFixed(2)} on ${new Date(trialEnd * 1000).toLocaleDateString()}`, { containerId: 'containerA' });
          } else {
            toast.success('Payment successful!', { containerId: 'containerA' });
          }
          router.push('/signup-thank-you');
        } else {
          ev.complete('fail');
          const msg = result?.message || 'Payment failed';
          toast.error(msg, { containerId: 'containerA' });
        }
      } catch (error) {
        console.error('Wallet payment error:', error);
        ev.complete('fail');
        onErrorRef.current?.(error);
        toast.error('An error occurred during payment', { containerId: 'containerA' });
      }
    };

    pr.canMakePayment()
      .then((result) => {
        // Stripe's Payment Request API primarily supports Apple/Google Pay.
        // If Cash App Pay is supported by the environment, Stripe may expose it similarly.
        // We attempt to show the button when canMakePayment returns a truthy result.
        if (result) {
          setIsAvailable(true);
          pr.on('paymentmethod', paymentMethodHandler);
          lastAmountRef.current = newAmount;
        } else {
          setIsAvailable(false);
        }
      })
      .catch((error) => {
        console.error('Error checking Cash App payment capability:', error);
        onErrorRef.current?.(error);
        setIsAvailable(false);
      });

    return () => {
      try {
        if (paymentRequestRef.current) {
          // Try to remove event listener in the most compatible way
          if (typeof paymentRequestRef.current.off === 'function') {
            paymentRequestRef.current.off('paymentmethod', paymentMethodHandler);
          } else if (typeof paymentRequestRef.current.removeListener === 'function') {
            paymentRequestRef.current.removeListener('paymentmethod', paymentMethodHandler);
          } else if (typeof paymentRequestRef.current.removeAllListeners === 'function') {
            paymentRequestRef.current.removeAllListeners();
          }
          paymentRequestRef.current = null;
        }
      } catch (err) {
        console.error('Failed to clean up paymentRequest', err);
      }
    };
  }, [stripe]);

  // Update the payment total when `amount` changes without re-creating the PaymentRequest
  useEffect(() => {
    function validAmount(amount) {
      if (typeof amount === 'string') {
        amount = amount.trim();
        if (amount === '') return 0;
      }
      const numAmount = parseFloat(amount);
      return Number.isFinite(numAmount) && numAmount > 0 ? Math.round(numAmount * 100) : 0; // cents
    }

    const newAmount = validAmount(amount);
    if (paymentRequestRef.current && lastAmountRef.current !== newAmount) {
      if (typeof paymentRequestRef.current.update === 'function') {
        try {
          paymentRequestRef.current.update({ total: { label: 'Total', amount: newAmount } });
          lastAmountRef.current = newAmount;
        } catch (e) {
          // update might not be supported; ignore if it fails
          console.warn('Failed to update payment total on existing PaymentRequest', e);
        }
      }
    }
  }, [amount]);

  if (!isAvailable || !paymentRequestRef.current) {
    return null;
  }

  return (
    <PaymentRequestButtonElement
      options={{
        paymentRequest: paymentRequestRef.current,
        style: {
          paymentRequestButton: {
            type: 'buy', // Use 'buy' type for Cash App
            theme: 'dark',
            height: '48px',
          },
        },
      }}
    />
  );
};

export default CashAppPayment;

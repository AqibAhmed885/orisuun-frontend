import { PaymentRequestButtonElement, useStripe } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const ApplePayButton = ({ amount }) => {
  const stripe = useStripe();
  const router = useRouter();
  const [paymentRequest, setPaymentRequest] = useState(null);

  useEffect(() => {
    if (!stripe || !amount || amount <= 0) return;

    const pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Total',
        amount: Math.round(amount * 100),
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then(result => {
      if (result) setPaymentRequest(pr);
    });

    const handlePaymentMethod = async (ev) => {
      try {
        const registerUser = JSON.parse(localStorage.getItem('registerUser') || '{}');

        const res = await fetch('/api/UserVerification/GetVerificationPaymentIntent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: registerUser?.user?.Id,
            planId: registerUser?.BillingPlanId,
            paymentMethod: ev.paymentMethod.id,
            paymentMethodType: 'stripe',
          }),
        });

        const data = await res.json();

        if (!data?.clientSecret) {
          ev.complete('fail');
          toast.error('Payment failed');
          return;
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(
          data.clientSecret,
          { payment_method: ev.paymentMethod.id },
          { handleActions: false }
        );

        if (error) {
          ev.complete('fail');
          toast.error(error.message);
          return;
        }

        ev.complete('success');

        // Handle additional actions if required
        if (paymentIntent.status === 'requires_action') {
          await stripe.confirmCardPayment(data.clientSecret);
        }

        localStorage.setItem(
          'signupAuthData',
          JSON.stringify({
            Email: registerUser?.Email || registerUser?.email || registerUser?.user?.Email || '',
            Password: registerUser?.Password || registerUser?.password || '',
            SignedUpWith: registerUser?.SignedUpWith || 'manual',
            Token: registerUser?.Token || '',
          })
        );

        toast.success('Payment successful');
        router.push('/signup-thank-you');

      } catch (err) {
        ev.complete('fail');
        toast.error('Wallet payment failed');
      }
    };

    pr.on('paymentmethod', handlePaymentMethod);

    return () => {
      pr.off('paymentmethod', handlePaymentMethod);
    };
  }, [stripe, amount, router]);

  if (!paymentRequest) return null;

  return (
    <PaymentRequestButtonElement
      options={{
        paymentRequest,
        style: {
          paymentRequestButton: {
            type: 'default',
            theme: 'light-outline',
            height: '48px',
          },
        },
      }}
    />
  );
};

export default ApplePayButton;
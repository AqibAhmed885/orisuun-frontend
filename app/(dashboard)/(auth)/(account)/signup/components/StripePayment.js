import React, { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY );

const StripePayment = () => {
    useEffect(() => {
        (async () => {
            const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

            if (!stripe) {
                console.error('Stripe failed to load.');
                return;
            }

            const expressCheckoutOptions = {
                buttonType: {
                    applePay: 'buy',
                    googlePay: 'buy',
                }
            }
            const elements = stripe.elements({
                locale: 'en',
                mode: 'payment',
                amount: 1099,
                currency: 'usd',
            })
            const expressCheckoutElement = elements.create(
                'expressCheckout',
                expressCheckoutOptions
            )
            expressCheckoutElement.mount('#express-checkout-element')

        })()
    }, []);

    return (
        <div className='border border-[#B2B3B3] rounded-lg py-3 px-4 grid place-items-center'>
            <h1>Pay with Apple Pay or Google Pay</h1>
            <div id="express-checkout-element"></div>
        </div>
    );
};

export default StripePayment;

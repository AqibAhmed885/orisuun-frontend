'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyPaypalPayment } from '@/server-actions/payment';
import Link from 'next/link';

// import { Button } from '@/components/ui/button'; 

function SuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('processing');
    const [message, setMessage] = useState('Verifying your payment...');

    useEffect(() => {
        // Determine status from URL params or just assume success if we landed here
        // PayPal usually sends tokens like ?subscription_id=... or ?token=...
        const subscriptionId = searchParams.get('subscription_id');
        const token = searchParams.get('token');

        if (subscriptionId || token) {
            // Poll the backend to verify PayPal payment
            const verifyPayment = async () => {
                try {
                    // Call backend to verify the PayPal payment
                    const verificationData = {
                        subscription_id: subscriptionId,
                        token: token
                    };
                    
                    const result = await verifyPaypalPayment(verificationData);
                    
                    if (result?.success) {
                        setStatus('success');
                        setMessage('Payment Successful!');

                        // Auto-redirect to thank you page after 2 seconds (same as Stripe flow)
                        setTimeout(() => {
                            router.push('/signup-thank-you');
                        }, 2000);
                    } else {
                        setStatus('error');
                        setMessage(result?.message || 'Payment verification failed. Please contact support.');
                    }
                } catch (error) {
                    console.error('Payment verification error:', error);
                    setStatus('error');
                    setMessage('An error occurred while verifying your payment. Please contact support.');
                }
            };

            verifyPayment();
        } else {
            setStatus('error');
            setMessage('Invalid payment information received.');
        }
    }, [searchParams, router]);

    return (
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
            {status === 'processing' && (
                <>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Processing Payment</h2>
                    <p className="text-gray-600 mb-6">{message}</p>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                </>
            )}

            {status === 'success' && (
                <>
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                        <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
                    <p className="text-gray-600 mb-8">Your account has been verified. Redirecting you to the welcome page...</p>
                    <button
                        onClick={() => router.push('/signup-thank-you')}
                        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded hover:bg-blue-700 transition duration-300"
                    >
                        Continue
                    </button>
                </>
            )}

            {status === 'error' && (
                <>
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                        <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
                    <p className="text-gray-600 mb-8">{message}</p>
                    <button
                        onClick={() => router.push('/signup')}
                        className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded hover:bg-gray-300 transition duration-300"
                    >
                        Return to Signup
                    </button>
                </>
            )}
        </div>
    );
}

export default function PayPalSuccessPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <Suspense fallback={<div>Loading...</div>}>
                <SuccessContent />
            </Suspense>
        </div>
    );
}

'use client';

import { useRouter } from 'next/navigation';

export default function PayPalCancelPage() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
                    <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Cancelled</h2>
                <p className="text-gray-600 mb-8">You have cancelled the PayPal payment process. No charges have been made.</p>
                <div className="flex flex-col space-y-3">
                    <button
                        onClick={() => router.push('/signup')}
                        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded hover:bg-blue-700 transition duration-300"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded hover:bg-gray-300 transition duration-300"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        </div>
    );
}

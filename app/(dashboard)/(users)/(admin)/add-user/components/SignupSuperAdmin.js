'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Suspense, useState } from 'react';

import { Profile } from '../../../../(auth)/(account)/signup/components/Profile';
import { PaymentMethod } from '../../../../(auth)/(account)/signup/components/PaymentMethod';
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
import { ProfileSuperAdmin } from './ProfileSuperAdmin';
import { AdminAccountForm } from './AdminAccountForm';

export default function SignUpSuperAdmin() {
  const [page, setPage] = useState(0);
  const [activeTab, setActiveTab] = useState('platform-user');
  // const stripePromise = loadStripe(
  //   process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
  // );

  return (
    <Suspense>
      <main className=" relative  mx-auto">
        <div className="w-full py-8 h-full overflow-y-scroll hide-scrollbar">
          <div className="w-full lg:w-full m-auto">
            <header className="pb-8 w-[85%] md:min-w-[490px] md:max-w-[80%] mx-auto">
              <Link href="/">
                <Image
                  src="/logo.svg"
                  className=""
                  width={150}
                  height={55}
                  alt="logo"
                />
              </Link>
            </header>

            {/* Tabs Navigation */}
            <div className="w-[85%] md:min-w-[490px] md:max-w-[80%] mx-auto mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('platform-user')}
                    className={`
                      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                      ${activeTab === 'platform-user'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    Add Platform User
                  </button>
                  <button
                    onClick={() => setActiveTab('admin-account')}
                    className={`
                      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                      ${activeTab === 'admin-account'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    Create Admin Account
                  </button>
                </nav>
              </div>
            </div>

            <section className="w-[85%] md:min-w-[490px] md:max-w-[80%] mx-auto">
              <Suspense>
                {activeTab === 'platform-user' ? (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Add Platform User</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Create a new user account for the platform with subscription plan
                      </p>
                    </div>
                    <ProfileSuperAdmin setPage={setPage} />
                  </div>
                ) : (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Create Admin Account</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Create a lower-level admin account with specific permissions
                      </p>
                    </div>
                    <AdminAccountForm />
                  </div>
                )}
              </Suspense>
            </section>
          </div>
        </div>
      </main>
    </Suspense>
  );
}

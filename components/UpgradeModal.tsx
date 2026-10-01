'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  blockedPath?: string | null;
}

export default function UpgradeModal({ isOpen, onClose, blockedPath }: UpgradeModalProps) {
  const router = useRouter();

  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));

  const handleUpgradeNow = () => {
    router.push(`/payment?userId=${currentUser?.Id}`); // Redirect to payment page
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-start mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-semibold leading-6 text-gray-900"
                  >
                    Upgrade to Unlock
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-4">
                    This feature is available to Premium members only.
                  </p>

                  <div className="bg-olblue-100 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">
                      Your Free Access Includes:
                    </h4>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li>✓ View member discounts</li>
                      <li>✓ Communities & Chat</li>
                      <li>✓ Connections</li>
                      <li>✓ Reviews</li>
                      <li>✓ Search</li>
                      <li>✓ Leaderboard</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-olblue-500 to-olblue-600 rounded-lg p-4 text-white mb-6">
                    <h4 className="text-sm font-semibold mb-2">
                      Upgrade to Premium for:
                    </h4>
                    <ul className="space-y-1 text-sm">
                      <li>✓ Fundraising campaigns</li>
                      <li>✓ Business development opportunities</li>
                      <li>✓ Co-founder matching</li>
                      <li>✓ Transactions & escrow services</li>
                      <li>✓ Advanced verification</li>
                      <li>✓ And much more!</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    className="flex-1 justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Maybe Later
                  </button>
                  <button
                    type="button"
                    className="flex-1 justify-center rounded-md border border-transparent bg-omblue-600 px-4 py-2 text-sm font-medium text-white hover:bg-omblue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-omblue-500 focus-visible:ring-offset-2"
                    onClick={handleUpgradeNow}
                  >
                    Upgrade Now
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

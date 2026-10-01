"use client";

import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useSelector } from 'react-redux';
import CheckoutClient from './CheckoutClient';
import CheckoutProfile from './CheckoutProfile';
import type { RootState } from '@/data/store';

const bookingStripeKey =
  process.env.NEXT_PUBLIC_STRIPE_ESCROW_PUBLIC_KEY ||
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;

const stripePromise = bookingStripeKey ? loadStripe(bookingStripeKey) : null;

export default function BookingCheckoutPage() {
  const draft = useSelector((state: RootState) => state.booking.draft);

  const planLabel = draft?.planLabel ?? 'One-time';
  const durationLabel = draft ? `${draft.durationMinutes} min` : '';
  const totalPrice = draft?.totalPrice ?? 0;
  const scheduledDay = draft?.scheduledDay ?? '';
  const scheduledStart = draft?.scheduledStartTime
    ? new Date(draft.scheduledStartTime).toLocaleString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit',
      })
    : '';
  const cancellationWindowHours = draft?.cancellationWindowHours ?? 24;
  const cancellationFeePercentage = draft?.cancellationFeePercentage ?? 0;
  const cancellationWindowLabel = `${cancellationWindowHours} ${
    cancellationWindowHours === 1 ? 'hour' : 'hours'
  }`;
  const cancellationRules = [
    `Cancellations must be submitted at least ${cancellationWindowLabel} before the session.`,
    cancellationFeePercentage > 0
      ? `Cancellations made within ${cancellationWindowLabel} of the session are subject to a ${cancellationFeePercentage}% late cancellation fee.`
      : 'This provider does not charge a late cancellation fee.',
  ];

  return (
    <Elements stripe={stripePromise}>
      <main className="min-h-screen px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-12 text-sm font-semibold border-b text-slate-700">
            Book 1:1 video consultation
          </div>

          <div className="grid gap-10 lg:grid-cols-[480px_minmax(0,1fr)] lg:items-start divide-x-2 divide-[#EAECF0]">
            <aside>
              <div className="rounded-[24px] border border-slate-200 p-4">
                <div className="flex gap-4">
                  <div className="w-full">
                    <CheckoutProfile
                      providerName={draft?.providerName}
                      providerAvatar={draft?.providerAvatar}
                      providerProfileTypeId={draft?.providerProfileTypeId}
                      providerIsVerified={draft?.providerIsVerified}
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-900">
                      {planLabel}
                    </h1>
                  </div>
                  <div className="rounded-2xl bg-[#D2EBFF] border border-omblue-100 px-4 text-nowrap py-1 text-center text-base font-semibold text-slate-700 shadow-sm">
                    <div>{draft?.meetingType === 'Ongoing Advisory Plan' ? 'Advisory' : 'One time'}</div>
                    {durationLabel && <div className="text-xs font-medium text-slate-500">({durationLabel})</div>}
                  </div>
                </div>

                {scheduledStart && (
                  <div className="mt-5 flex items-center justify-between gap-4 border-b border-slate-200 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0)">
                          <path d="M14.5 16H1.5C0.67 16 0 15.33 0 14.5V2.5C0 1.67 0.67 1 1.5 1H14.5C15.33 1 16 1.67 16 2.5V14.5C16 15.33 15.33 16 14.5 16ZM1.5 2C1.22 2 1 2.22 1 2.5V14.5C1 14.78 1.22 15 1.5 15H14.5C14.78 15 15 14.78 15 14.5V2.5C15 2.22 14.78 2 14.5 2H1.5Z" fill="black" />
                          <path d="M4.5 4C4.22 4 4 3.78 4 3.5V0.5C4 0.22 4.22 0 4.5 0C4.78 0 5 0.22 5 0.5V3.5C5 3.78 4.78 4 4.5 4ZM11.5 4C11.22 4 11 3.78 11 3.5V0.5C11 0.22 11.22 0 11.5 0C11.78 0 12 0.22 12 0.5V3.5C12 3.78 11.78 4 11.5 4ZM15.5 6H0.5C0.22 6 0 5.78 0 5.5C0 5.22 0.22 5 0.5 5H15.5C15.78 5 16 5.22 16 5.5C16 5.78 15.78 6 15.5 6Z" fill="black" />
                        </g>
                        <defs><clipPath id="clip0"><rect width="16" height="16" fill="white" /></clipPath></defs>
                      </svg>
                      <span className="font-medium">{scheduledStart} ({durationLabel})</span>
                    </div>
                    <button type="button" className="text-sm font-semibold text-slate-800 underline decoration-slate-400 decoration-1 underline-offset-4">
                      Edit
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4">
                  <span className="text-sm font-medium text-slate-700">Total</span>
                  <span className="text-3xl font-bold tracking-tight text-slate-900">${totalPrice}</span>
                </div>
              </div>

              <section className="mt-8">
                <h2 className="text-lg font-semibold text-omblue-950">Cancellation</h2>
                <ul className="mt-3 space-y-3 text-sm leading-6 text-[#101828]">
                  {cancellationRules.map((rule) => (
                    <li key={rule} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-omblue-900" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </aside>

            <section className="sm:px-10">
              <h2 className="text-[34px] font-bold tracking-tight text-omblue-950">Complete payment</h2>
              <CheckoutClient />
            </section>
          </div>
        </div>
      </main>
    </Elements>
  );
}

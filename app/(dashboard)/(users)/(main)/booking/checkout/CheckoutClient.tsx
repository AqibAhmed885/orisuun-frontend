"use client";

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import useCurrentUser from '@/hooks/useCurrentUser';
import { createBooking } from '@/utils/providerBookingApi';
import type { RootState } from '@/data/store';

const STRIPE_ELEMENT_STYLE = {
  style: {
    base: { fontSize: '14px', color: '#0f172a', '::placeholder': { color: '#94a3b8' } },
    invalid: { color: '#ef4444' },
  },
};

export default function CheckoutClient() {
  const { user } = useCurrentUser();
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const draft = useSelector((state: RootState) => state.booking.draft);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setName(user.name || user.fullName || user.displayName || '');
    setEmail(user.email || user.Email || '');
    setCompany(user.company || user.Company || '');
    setPhone(user.phone || user.Phone || user.mobile || '');
  }, [user]);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();

    if (!stripe || !elements || !draft) return;
    setSubmitting(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardNumberElement);
      const { paymentMethod, error: stripeError } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement!,
        billing_details: { name },
      });

      if (stripeError || !paymentMethod) {
        setError(stripeError?.message || 'Card error. Please try again.');
        return;
      }

      const bookerUserId = user?.Id || user?.id || user?.userId || '';
      const switchTeamData = typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('switchTeamData') || 'null')
        : null;
      const bookerTeamId = switchTeamData?.isActive ? String(switchTeamData.teamId) : undefined;

      const response = await createBooking({
        BookerUserId: bookerUserId,
        BookerTeamId: bookerTeamId,
        ProviderUserId: draft.providerUserId,
        ProviderTeamId: draft.providerTeamId || undefined,
        MeetingType: draft.meetingType,
        MeetingTypeId: draft.meetingTypeId,
        PackageId: draft.packageId || undefined,
        TopicId: draft.topicId || undefined,
        MeetingDurationMinutes: draft.durationMinutes,
        ScheduledStartTime: draft.scheduledStartTime,
        ScheduledEndTime: draft.scheduledEndTime,
        MeetingPurpose: draft.meetingPurpose,
        BasePrice: draft.basePrice,
        TotalPrice: draft.totalPrice,
        Currency: draft.currency,
        PaymentMethodId: paymentMethod.id,
        ReferralDocumentUrls: draft.referralDocumentUrls ?? [],
        Email: draft.inviteEmails ?? [],
      });

      const bookingId =
        response?.Result?.Id ||
        response?.Result?.BookingId ||
        response?.Id ||
        response?.BookingId ||
        '';

      router.push(bookingId ? `/booking/confirm?bookingId=${encodeURIComponent(bookingId)}` : '/booking/confirm');
    } catch (err: any) {
      setError(err?.response?.data?.Message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const cards = [
    { id: 1, brand: 'Visa', image: '/booking/visa.svg' },
    { id: 2, brand: 'Stripe', image: '/booking/stripe.svg' },
    { id: 3, brand: 'Paypal', image: '/booking/paypal.svg' },
    { id: 4, brand: 'Mastercard', image: '/booking/master.svg' },
    { id: 5, brand: 'Google Pay', image: '/booking/g-pay.svg' },
  ];

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
      <section>
        <h3 className="text-2xl font-semibold text-slate-900">Personal details</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="h-12 rounded-lg border-slate-200 px-4 text-sm" containerClass="w-full" />
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@company.com" className="h-12 rounded-lg border-slate-200 px-4 text-sm" containerClass="w-full" />
          <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name" className="h-12 rounded-lg border-slate-200 px-4 text-sm" containerClass="w-full" />
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter number" className="h-12 rounded-lg border-slate-200 px-4 text-sm" containerClass="w-full" />
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-semibold text-slate-900">Card details</h3>
        <div className="mt-4 space-y-4">
          <div className="h-12 rounded-lg border border-slate-200 px-4 flex items-center">
            <CardNumberElement options={{ ...STRIPE_ELEMENT_STYLE, placeholder: '•••• •••• •••• ••••' }} className="w-full" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-12 rounded-lg border border-slate-200 px-4 flex items-center">
              <CardExpiryElement options={STRIPE_ELEMENT_STYLE} className="w-full" />
            </div>
            <div className="h-12 rounded-lg border border-slate-200 px-4 flex items-center">
              <CardCvcElement options={STRIPE_ELEMENT_STYLE} className="w-full" />
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold text-slate-900">Payment methods</h3>
        <div className="mt-4 flex gap-4">
          {cards.map((card) => (
            <div key={card.id} className="flex flex-col items-center justify-center space-y-2">
              <img src={card.image} alt={card.brand} className="h-12 w-[70px]" />
            </div>
          ))}
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">{error}</div>
      )}

      <div className="space-y-4">
        <Button
          type="submit"
          title={submitting ? 'Processing…' : `Confirm & Pay $${draft?.totalPrice ?? ''}`}
          disabled={submitting || !stripe}
          className="h-14 w-full rounded-full bg-[#295fd1] text-base shadow-[0_16px_30px_rgba(41,95,209,0.25)] hover:bg-[#224fb0] disabled:opacity-60"
        />
      </div>
    </form>
  );
}

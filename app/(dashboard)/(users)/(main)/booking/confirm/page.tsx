import type { Metadata } from 'next';
import BookingConfirmClient from './BookingConfirmClient';

type BookingConfirmPageProps = {
  searchParams?: {
    bookingId?: string;
  };
};

export const metadata: Metadata = {
  title: 'Orisuun | Booking Confirmed',
  description: 'Your booking details and payment status.',
};

export default function BookingConfirmPage({ searchParams }: BookingConfirmPageProps) {
  return <BookingConfirmClient bookingId={searchParams?.bookingId || ''} />;
}

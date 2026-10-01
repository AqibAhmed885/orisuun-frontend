import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orisuun | Complete Your Payment',
  description: 'Complete your payment to activate your Orisuun membership.',
};

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

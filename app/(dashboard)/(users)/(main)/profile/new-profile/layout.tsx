import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orisuun | Complete Your Profile',
  description: 'Complete your profile to get the most out of Orisuun.',
};

export default function NewProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

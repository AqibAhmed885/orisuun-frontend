import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orisuun | Dashboard',
  description: 'Your Orisuun dashboard - stay updated with feeds, events, and more.',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

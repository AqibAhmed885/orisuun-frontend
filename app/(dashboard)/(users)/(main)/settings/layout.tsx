import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orisuun | Welcome',
  description: 'Welcome to Orisuun - Complete your onboarding and get started.',
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

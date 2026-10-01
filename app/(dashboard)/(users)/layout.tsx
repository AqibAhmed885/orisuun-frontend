import Layout from '@/layout';
import React from 'react';

export const metadata = {
  title: 'Orisuun',
  description: 'User dashboard for Orisuun',
  icons: {
    icon: [
      { url: '/crown96.png', sizes: '96x96' },
      { url: '/crown192.png', sizes: '192x192' },
      { url: '/crown256.png', sizes: '256x256' },
    ],
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Layout>{children}</Layout>
    </>
  );
}

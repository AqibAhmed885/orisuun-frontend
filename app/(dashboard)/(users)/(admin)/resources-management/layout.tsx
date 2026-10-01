import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orisuun | Resources Management',
  description: 'Admin panel for managing platform resources',
  robots: {
    index: false,
  },
};

export default function ResourcesManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

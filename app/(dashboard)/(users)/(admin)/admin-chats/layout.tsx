import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Chats - Orisuun',
  description: 'Super Admin Chat Management',
};

export default function AdminChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

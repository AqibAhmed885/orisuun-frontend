import '@/styles/global.css';
export const metadata = {
  title: 'Global Black Business Events',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='bg-[#0A193A]'>{children}</body>
    </html>
  )
}

import PaymentsPageClient from './PaymentsPageClient';

export const metadata = {
    title: 'Orisuun | Complete Your Payment',
    description: 'Complete your payment to activate your Orisuun membership.',
    alternates: {
        canonical: 'https://orisuun.com/payments',
    },
};

export default function PaymentsPage() {
    return <PaymentsPageClient />;
}

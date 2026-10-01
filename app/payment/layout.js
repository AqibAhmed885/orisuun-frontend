export const metadata = {
    title: 'Orisuun | Complete Your Payment',
    description: 'Complete your payment to activate your Orisuun membership.',
};

export default function PaymentLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <main>{children}</main>
            </body>
        </html>
    );
}

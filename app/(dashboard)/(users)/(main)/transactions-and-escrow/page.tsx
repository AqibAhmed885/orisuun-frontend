import TransactionAndEscrow from "./TransactionAndEscrow";

export const metadata = {
  title: 'Orisuun | Transactions and Escrow',
  description: 'Manage your transactions and escrow services on Orisuun.',
};

const Page = () => {
  return (
    <>
      <TransactionAndEscrow />
    </>
  );
}

export default Page;
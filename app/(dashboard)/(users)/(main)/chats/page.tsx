import Chats from "./Chats";

export const metadata = {
  title: 'Orisuun | Chats',
  description: 'View user chats and messages.',
  // You can add more meta fields here
};

const Page = () => {
  return (
    <>
      <Chats />
    </>
  );
}

export default Page;
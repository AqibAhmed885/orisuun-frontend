import Community from "./Community";


export const metadata = {
  title: 'Orisuun | Communities',
  description: 'Manage your communities and engagement.',
  robots: {
    index: false,
  },
}

const Page = () => {
  return (
    <div >
      <Community />
    </div>
  );
}

export default Page;
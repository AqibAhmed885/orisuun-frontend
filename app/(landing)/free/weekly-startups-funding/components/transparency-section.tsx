import Image from 'next/image';
import Link from 'next/link';
import TransparencyCard from './transparency-card';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

type TransparencyItem = {
  title: string;
  description: string | JSX.Element;
};

const transparencyItems: TransparencyItem[] = [
  {
    title: 'Who Qualifies',
    description:
      "Eligible members must have an active subscription and a completed profile.\n\nThat's it. A completed profile gets you one entry every week.",
  },
  {
    title: 'How Entries Work',
    description:
      'Entries are earned through defined qualifying activity on the platform, and reset each week.\n\nPlatform activity is verified. Members who try to game the system will be disqualified.',
  },
  {
    title: 'How Winners Are Chosen',
    description:
      'Weekly winners are selected randomly from the eligible entry pool.\n\nWe use a cryptographic algorithm for true randomness.',
  },
  {
    title: 'How the System Works (Public)',
    description:
      <>
        <p>
          We have{' '}
          <Link href='/weekly-startups-funding/rules' className='text-blue-500 underline'>
            published
          </Link>{' '}
          the selection framework so the process is clear.
        </p>
        <p className='mt-4'> Membership gets you one entry. Each activity increases your chances with additional entries.</p>
      </>
  },
  {
    title: 'Who Won (Published Weekly)',
    description:
      "We publish weekly winners as the program runs.\n\nSee who won in your feed each week. Maybe will be you.",
  },
  {
    title: 'How You Get Paid',
    description:
      "Funds are sent directly and securely to the winner's bank account or online wallet.\n\nFunds are sent no later than 72 hours after selection period.",
  },
];

export default function TransparencySection() {
  return (
    <section className='relative overflow-hidden bg-[#F5F6F9] py-14 md:py-[90px]'>
      <Image
        src={`${staticUrl}/landing/weekly-giveaway/transparent-bg.svg`}
        alt=''
        width={871}
        height={656}
        className='pointer-events-none absolute -left-[310px] bottom-0 opacity-50 hidden md:block'
      />

      <div className='relative z-10 mx-auto w-full max-w-[1440px] px-4 md:px-6'>
        <div className='max-w-[740px]'>
          <h2 className='text-[34px] leading-[1.1] md:text-[64px] md:leading-[1.1] font-semibold text-[#0F1116]'>
            Transparent. Structured. Accountable.
          </h2>
          <p className='mt-4 md:mt-5 max-w-[571px] text-base md:text-xl leading-[1.5] text-[#0F1116]'>
            We want members to understand exactly how winners are selected and how the program is run.
          </p>
        </div>

        <div className='mt-8 md:mt-10 -mx-4 px-4 flex gap-2 md:ml-0 ml-2 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible'>
          {transparencyItems.map((item) => (
            <div key={item.title} className='min-w-[86%] sm:min-w-[68%] snap-start lg:min-w-0'>
              <TransparencyCard
                title={item.title}
                description={item.description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import clsx from 'clsx';
import { CardsNodes } from '../../cards/nodes';
import { CardsNodesSectionsHoverProvider } from '../../cards/nodes/sections/context/hover';
import { CardsNodesSectionsOpenProvider } from '../../cards/nodes/sections/context/open';
import Image from 'next/image';
import Link from 'next/link';
import ChevronRight from '../../../icons/chevron-right';
import { cn } from '../../../utils/utils';

const mobilePathImageData = [
  {
    title: 'The Experts',
    description:
      'Those recognized and credentialed individuals (or small organizations) who can confidently claim to be among the top of their field.',
    link: '/experts',
    image: `${process.env.NEXT_PUBLIC_STATIC_URL}/about/images/crown-box.svg`,
  },
  {
    title: 'The Management Consultants',
    description:
      'Those accomplished and practicing strategy consultants currently or recently employed at a national-level management consulting firm. Students at select graduate-level business schools also qualify.',
    link: '/strategy-consultants',
    image: `${process.env.NEXT_PUBLIC_STATIC_URL}/about/images/person-chart-box.svg`,
  },
  {
    title: 'The People',
    description:
      'They are the customers, clients, and advocates for our Black-owned business members.',
    link: '/advocates',
    image: `${process.env.NEXT_PUBLIC_STATIC_URL}/about/images/handshake-box.svg`,
  },
  {
    title: 'The Professionals',
    description:
      'Those currently licensed and practicing in regulated fields such as law, accounting, architecture, information technology, engineering, finance, journalism, marketing, and many others.',
    link: '/professionals',
    image: `${process.env.NEXT_PUBLIC_STATIC_URL}/about/images/bag-box.svg`,
    paddingTop: 40,
  },
  {
    title: 'The Mentors',
    description:
      'Those accomplished business people who have succeeded in starting or running a business.',
    link: '/mentors',
    image: `${process.env.NEXT_PUBLIC_STATIC_URL}/about/images/people-box.svg`,
    paddingTop: 20,
  },
  {
    title: 'The Partners',
    description:
      'Large and multinational corporations willing to support Black-owned businesses through our Discount Portal or Fundraising Matching system.',
    link: '/partners',
    image: `${process.env.NEXT_PUBLIC_STATIC_URL}/about/images/people-clap-box.svg`,
    paddingTop: 30,
  },
  {
    title: 'The Investors',
    description:
      'Those established and professional investors and institutions actively searching for impactful investment opportunities.',
    link: '/investors',
    image: `${process.env.NEXT_PUBLIC_STATIC_URL}/about/images/money-flow-box.svg`,
    paddingTop: 20,
  },
  {
    title: 'The Black-Owned Businesses',
    description:
      'Those privately-owned businesses around the world with at least 25% Black ownership. These businesses may operate in any industry and be any size.',
    link: '/black-owned-businesses',
    image: `${process.env.NEXT_PUBLIC_STATIC_URL}/about/images/people-behind-box.svg`,
    paddingTop: 5,
  },
];

const Who = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userType', 'userType');
  }
  return (
    <section className={clsx(`relative mb-[100px] `)}>
      <div className="md:pt-[50px] px-4 md:px-[80px]  flex flex-col justify-center items-center rounded-[25px]">
        <div className="h-auto md:h-[90px]">
          <h4 className="text-center text-[#5B657B] pb-4 text-base font-semibold leading-[110%] uppercase">
            There’s A Place For You Here
          </h4>
          <h3 className="text-blue-strong text-center text-3xl leading-[28.8px] md:text-[48px] font-medium md:leading-[110%]">
            How Orisuun Works
          </h3>
          <div className="h-[16px]" />
          <h4 className="text-[20px] leading-[30px] font-[450px] text-center text-[#5B657B]">
            The Ecosystem
          </h4>
        </div>
        <div className="hidden md:block h-[68px]" />
        <div className="hidden md:block">
          <CardsNodesSectionsHoverProvider>
            <CardsNodesSectionsOpenProvider>
              <CardsNodes />
            </CardsNodesSectionsOpenProvider>
          </CardsNodesSectionsHoverProvider>
        </div>

        <div
          className="flex flex-col gap-6 pt-12 items-center relative h-[1546px]  md:hidden bg-no-repeat bg-center"
          style={{
            backgroundImage: `url(${process.env.NEXT_PUBLIC_STATIC_URL}/about/images/mobile-dotted-path.svg)`,
          }}
        >
          {mobilePathImageData.map((data, index) => (
            <div
              key={index}
              style={{ paddingTop: data.paddingTop ?? 0 }}
              className={cn(
                'relative flex items-start',
                index % 2 !== 0 && 'flex-row-reverse mr-[-13%]',
                index % 2 === 0 && 'flex-row ml-[-13%]'
              )}
            >
              <Image
                className={`pt-2 min-w-[62px] min-h-[54px] ${index % 2 === 0 ? 'ml-[3.8rem]' : 'mr-12 mt-2'}
  ${data.title === 'The Professionals' ? '-mt-[20px]' : ''} ${data.title === 'The Partners' ? '-mt-[6px]' : ''} ${data.title === 'The People' && 'pt-5', data.title === 'The Professionals' && '-mt-10', data.title === 'The Partners' && 'mt-5', data.title === 'The People' && 'mt-[.8rem]'}`}
                src={data.image}
                alt={data.title}
                width={62}
                height={54}
                loading="lazy"
              />
              <Image
                className={cn(
                  'mt-[27px] -translate-y-1/2',
                  index % 2 === 0 ? ' mr-[15px] ' : 'mr-2.5 ml-[15px] ',
                  data.title === 'The Management Consultants' && 'pt-7',
                  data.title === 'The People' && 'pt-7',
                  data.title === 'The Professionals' && 'mt-2',
                  data.title === 'The Mentors' && 'mt-8',
                  data.title === 'The Investors' && 'mt-8',
                  data.title === 'The Black-Owned Businesses' && 'mt-9',
                )}
                src={`${process.env.NEXT_PUBLIC_STATIC_URL}/about/images/mobile-dotted-path-dot.svg`}
                alt="dotted-path-dot"
                width={14}
                height={14}
                loading="lazy"
              />
              <div
                className={cn(
                  'flex flex-col gap-1 max-w-[230px]',
                  index % 2 !== 0 ? 'items-end' : 'items-start',
                  data.title === 'The Professionals' && '-mt-4',
                  data.title === 'The Partners' && '-mt-3',
                  data.title === 'The Black-Owned Businesses' && '-mt-1',
                )}
              >
                <p
                  className={cn(
                    'text-base mr-auto  font-semibold leading-[17.6px] text-[#001E5F]',
                    index % 2 !== 0 ? 'text-right' : 'text-left',
                    data.title === 'The Management Consultants' && 'pt-6',
                    data.title === 'The People' && 'pt-6',
                    data.title === 'The Professionals' && 'pt-2',
                    data.title === 'The Mentors' && 'pt-4',
                    data.title === 'The Partners' && 'pt-3',
                    data.title === 'The Investors' && 'pt-5',
                    data.title === 'The Experts' && 'pt-2',
                    data.title === 'The Black-Owned Businesses' && 'pt-6',
                    index % 2 !== 0 && data.title !== 'The People' && 'mt-2'
                  )}
                >
                  {data.title}
                </p>
                <p
                  className={cn(
                    'text-[#5B657B] text-medium text-sm',
                    index % 2 !== 0 ? 'text-left' : 'text-left'
                  )}
                >
                  {data.description}
                </p>
                <Link
                  href={data.link}
                  prefetch={false}
                  className="text-[#2357C6] mr-auto flex items-center text-sm leading-[16.8px] font-[450px]"
                >
                  Learn more
                  <ChevronRight width={18} height={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Who;

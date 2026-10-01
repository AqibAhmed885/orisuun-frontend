import Image from 'next/image';
import type { MatchingDataSectionContent } from '@/data/marketing/cofounderMatchingData';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

const cardIcons = [
  {
    icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 20C19 20.2652 18.8946 20.5196 18.7071 20.7071C18.5196 20.8946 18.2652 21 18 21H14C13.7348 21 13.4804 20.8946 13.2929 20.7071C13.1054 20.5196 13 20.2652 13 20V18H3V30H29V18H19V20Z" fill="#003153" />
      <path d="M17 15H15V19H17V15Z" fill="#003153" />
      <path d="M23 6V4C23 3.46957 22.7893 2.96086 22.4142 2.58579C22.0391 2.21071 21.5304 2 21 2H11C10.4696 2 9.96086 2.21071 9.58579 2.58579C9.21071 2.96086 9 3.46957 9 4V6H2V16H13V14C13 13.7348 13.1054 13.4804 13.2929 13.2929C13.4804 13.1054 13.7348 13 14 13H18C18.2652 13 18.5196 13.1054 18.7071 13.2929C18.8946 13.4804 19 13.7348 19 14V16H30V6H23ZM11 4H21V6H11V4Z" fill="#003153" />
    </svg>
,
  },
  {
    icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M26.666 17.3337H17.3327V16.0003H21.3327V13.3337C21.3296 12.5034 21.1327 11.6854 20.7577 10.9447C20.3827 10.2039 19.84 9.56098 19.1727 9.06699C19.7015 8.37796 19.9917 7.53553 19.9993 6.66699C19.9993 5.60613 19.5779 4.58871 18.8278 3.83857C18.0776 3.08842 17.0602 2.66699 15.9993 2.66699C14.9385 2.66699 13.9211 3.08842 13.1709 3.83857C12.4208 4.58871 11.9993 5.60613 11.9993 6.66699C12.007 7.53553 12.2972 8.37796 12.826 9.06699C12.1587 9.56098 11.616 10.2039 11.241 10.9447C10.866 11.6854 10.6691 12.5034 10.666 13.3337V16.0003H14.666V17.3337H5.33268V21.3337H2.66602V29.3337H10.666V21.3337H7.99935V20.0003H14.666V21.3337H11.9993V29.3337H19.9993V21.3337H17.3327V20.0003H23.9993V21.3337H21.3327V29.3337H29.3327V21.3337H26.666V17.3337Z" fill="#003153" />
    </svg>
,
  },
  {
    icon: <svg width="25" height="32" viewBox="0 0 25 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 15.4067L9.84375 17.4247C9.6875 17.554 9.53125 17.5607 9.375 17.4448C9.21875 17.3289 9.16667 17.1799 9.21875 16.9978L10.2344 13.7379L7.5 11.5647C7.36979 11.4353 7.33073 11.2868 7.38281 11.1192C7.4349 10.9515 7.55208 10.8672 7.73437 10.8662H11.0938L12.1094 7.68392C12.1615 7.50282 12.2917 7.41227 12.5 7.41227C12.7083 7.41227 12.8385 7.50282 12.8906 7.68392L13.9062 10.8662H17.2266C17.4089 10.8662 17.5328 10.9505 17.5984 11.1192C17.6641 11.2879 17.6313 11.4364 17.5 11.5647L14.7266 13.7379L15.7422 16.9978C15.7943 17.1789 15.7422 17.3279 15.5859 17.4448C15.4297 17.5618 15.2734 17.555 15.1172 17.4247L12.5 15.4067ZM12.5 29.4938L5.19531 31.8999C4.67448 32.081 4.19896 32.0163 3.76875 31.7059C3.33854 31.3954 3.12396 30.9815 3.125 30.464V20.6069C2.13542 19.5203 1.36719 18.2784 0.820313 16.8813C0.273438 15.4843 0 13.9966 0 12.4185C0 8.95164 1.21094 6.01519 3.63281 3.60911C6.05469 1.20304 9.01042 0 12.5 0C15.9896 0 18.9453 1.20304 21.3672 3.60911C23.7891 6.01519 25 8.95164 25 12.4185C25 13.9966 24.7266 15.4843 24.1797 16.8813C23.6328 18.2784 22.8646 19.5203 21.875 20.6069V30.464C21.875 30.9815 21.6599 31.3954 21.2297 31.7059C20.7995 32.0163 20.3245 32.081 19.8047 31.8999L12.5 29.4938ZM19.1406 19.0158C20.9635 17.2047 21.875 15.0056 21.875 12.4185C21.875 9.83128 20.9635 7.63218 19.1406 5.82115C17.3177 4.01013 15.1042 3.10461 12.5 3.10461C9.89583 3.10461 7.68229 4.01013 5.85938 5.82115C4.03646 7.63218 3.125 9.83128 3.125 12.4185C3.125 15.0056 4.03646 17.2047 5.85938 19.0158C7.68229 20.8268 9.89583 21.7323 12.5 21.7323C15.1042 21.7323 17.3177 20.8268 19.1406 19.0158Z" fill="#003153" />
    </svg>
,
  },
];

const defaultSectionContent: MatchingDataSectionContent = {
  title: 'High-Stakes Matching, Handled by Data',
  description:
    'Our proprietary matching tool scans beyond the surface. We cross-reference business needs against active board-member posts and deep-profile expertise to deliver a ranked list of the most relevant candidates or companies.',
  cards: [
    {
      title: 'For Businesses',
      body: 'Post your specific boardroom gaps, whether it is ESG, Finance, or Tech, and receive a curated, scored list of candidates ready to serve.',
    },
    {
      title: 'For Leaders',
      body: 'Your profile and active Board Availability posts are automatically surfaced to companies whose needs match your unique professional DNA.',
    },
    {
      title: 'Relevancy Scoring',
      body: 'Do not waste time on near-misses. See exactly why each match is ranked where it is based on your specific criteria.',
    },
  ],
};

export default function DataMatchingSection({ content = defaultSectionContent }: { content?: MatchingDataSectionContent }) {
  const titleParts = content.title.includes('Founders') ? content.title.split('Founders') : null;
  const matchingUnionBackground = `url("${staticUrl}/matching/Union%20(2).svg")`;

  return (
    <section className="mt-2 bg-white px-2 md:px-0">
      <div className="flex flex-col items-center justify-center gap-6 rounded-[8px] bg-[#eef1f7] px-5 py-9 md:min-h-[70vh] md:rounded-[11px] md:px-0 md:py-0">
        <div className="text-center">
          <h2
            className="mx-auto max-w-[285px] text-center text-2xl font-medium leading-[100%] tracking-[0.02em] text-[#141821] md:max-w-none md:text-[42px] md:font-normal md:leading-[1.08] md:tracking-normal"
          >
            {titleParts ? (
              <>
                {titleParts[0]}
                <span
                  className="inline-block bg-[image:var(--matching-union-bg)] bg-[length:100%_100%] bg-center bg-no-repeat px-2"
                  style={{ '--matching-union-bg': matchingUnionBackground } as React.CSSProperties}
                >
                  Founders
                </span>
                {titleParts[1]}
              </>
            ) : (
              content.title
            )}
          </h2>
          <p
            className="mx-auto mt-4 max-w-[285px] text-center text-sm font-normal leading-[150%] tracking-[-0.003em] text-[#657086] md:max-w-xl md:text-base md:leading-[1.42] md:tracking-wide"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {content.description}
          </p>
        </div>

        <div className="mx-auto mt-6 grid max-w-[1020px] overflow-hidden  border border-[#D5DAE5] bg-white lg:grid-cols-3">
          {content.cards.map(({ title, body, icon }, index) => (
            <article
              key={title}
              className={`min-h-[270px] bg-gradient-to-tr from-white from-[40%] via-white  to-[#0095FF]/30  px-8 py-9 text-left ${
                index > 0 ? 'border-t border-[#D5DAE5] lg:border-l lg:border-t-0' : ''
              }`}
            >
              {icon ? (
                <Image src={icon} alt={`${title} icon`} width={32} height={32} className="h-8 w-8 object-contain" />
              ) : (
                cardIcons[index]?.icon
              )}

              <div className="mt-12">
                <h3 className="text-lg font-semibold leading-tight text-[#001E5F]">
                  {title}
                </h3>
                <p className="mt-4 max-w-[440px] text-sm leading-[1.35] text-[#657086]">
                  {body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

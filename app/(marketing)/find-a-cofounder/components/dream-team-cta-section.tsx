import Image from 'next/image';
import Link from 'next/link';
import type { MatchingCtaSectionContent } from '@/data/marketing/cofounderMatchingData';

export default function DreamTeamCtaSection({ content }: { content: MatchingCtaSectionContent }) {
  return (
    <section className="bg-white p-4 flex items-center justify-center tracking-wide min-h-[600px] ">
      <div className="relative mx-auto aspect-[1140/380] flex md:items-center p-12 overflow-hidden rounded-[35px] min-h-[560px] md:min-h-[380px] bg-[#061a3a]">
        <div className=" text-white ">
          <h2
            className="text-3xl max-w-[460px]  font-normal leading-[105%]     md:text-4xl"
          >
            {content.title}
          </h2>
          <p
            className="mt-2 max-w-[250px] text-base font-normal  tracking-wider text-[#C9C9C9] sm:mt-3 sm:max-w-[400px] "
          >
            {content.description}
          </p>
          <Link
            href={content.cta.href}
            className="mt-3 inline-flex h-8 items-center justify-center rounded-[4px] bg-[#d9e8ff] px-4 text-[10px] font-medium text-[#071b37] transition hover:bg-white sm:mt-5 sm:h-9 sm:px-6 sm:text-xs"
          >
            {content.cta.label}
          </Link>
        </div>
        <div className="absolute hidden md:block top-0 right-0 aspect-[477/382]  h-full w-full overflow-hidden rounded-r-[24px]">
          <Image
            src={`${process.env.NEXT_PUBLIC_STATIC_URL}/founder/images/cta.svg`}
            alt={content.imageAlt}
            fill
            sizes="(max-width: 640px) 145px, (max-width: 768px) 210px, 225px"
            className="object-contain object-right"
          />
        </div>

        <div className="absolute md:hidden block right-0  h-full w-full overflow-hidden rounded-r-[24px]">
          <Image
            src={`${process.env.NEXT_PUBLIC_STATIC_URL}/booking/mobilecta.svg`}
            alt={content.imageAlt}
            fill
            sizes="(max-width: 640px) 145px, (max-width: 768px) 210px, 225px"
            className="object-contain "
          />
        </div>
      </div>
    </section>
  );
}

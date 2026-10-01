import Image from 'next/image';
import Link from 'next/link';

import {
  discountPortalWorksGroups,
  discountPortalWorksHeader,
} from '@/data/marketing/discount';

export default function HowPortalWorksSection({ groups = discountPortalWorksGroups }) {
  return (
    <section className=" bg-white py-2">
      <div className=" rounded-[10px] bg-[#E8EBF2] px-5 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-[620px] text-center">
          <h2 className="text-2xl font-medium  text-[#111827] md:text-[42px]">
            {discountPortalWorksHeader.title}
          </h2>
          <p className="mx-auto mt-2 max-w-[480px] text-base tracking-wide text-[#667085]">
            {discountPortalWorksHeader.description}
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-[1180px] space-y-2">
          {groups.map((group) => (
            <div key={group.title} className="rounded-[8px] bg-[#DDE1EA] px-5 py-6 md:px-8">
              <div className="flex flex-col gap-4 border-b border-spacing-4 border-dotted border-[#B9BECA] pb-5 md:flex-row md:items-center md:justify-between">
                <p className="text-lg tracking-wide text-[#111827]">{group.title}</p>
                {group.ctaHref && group.ctaLabel ? (
                  <Link
                    href={group.ctaHref}
                    className="inline-flex w-max rounded bg-[#061832] px-3 tracking-wide py-1.5 text-base  text-white transition hover:bg-[#102B52]"
                  >
                    {group.ctaLabel}
                  </Link>
                ) : null}
              </div>

              <div className="grid gap-8 pt-8 md:grid-cols-3 md:gap-12">
                {group.items.map(({ icon, text }) => (
                  <div key={text}>
                    <div className='bg-[#CECDD9] flex items-center justify-center w-16 h-12 rounded-lg'>
                      {icon}
                    </div>
                  
                    <p className="mt-3 max-w-[260px] text-base tracking-wide   text-[#4E5969]">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

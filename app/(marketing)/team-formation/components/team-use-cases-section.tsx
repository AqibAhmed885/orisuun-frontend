import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { teamUseCasesSectionData } from '@/data/teamFormLandingData';

function renderUseCaseTitle(title: string, emphasizedPhrases?: string[]) {
  if (!emphasizedPhrases || emphasizedPhrases.length === 0) {
    return title;
  }

  const sorted = [...emphasizedPhrases].sort((a, b) => b.length - a.length);
  const escaped = sorted.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'g');

  return title.split(regex).map((part, index) => {
    const isEmphasized = sorted.includes(part);
    return isEmphasized ? (
      <span key={`${part}-${index}`} className="font-medium md:font-semibold">
        {part}
      </span>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    );
  });
}

export default function TeamUseCasesSection() {
  const s = teamUseCasesSectionData;

  return (
    <section className="bg-white px-2 pb-16  sm:px-6 lg:px-8 lg:pb-24">
      <div className=" ">
        <p
          className="mx-auto w-fit rounded-sm bg-[#D8E9FF] tracking-widest px-1 text-xs md:text-[16px] font-medium  text-[#245284]"
        >
          {s.eyebrow}
        </p>

        <h2
          className="mx-auto mt-3 max-w-[520px] text-center text-2xl md:text-[44px] font-medium leading-[1.1] tracking-wide text-[#061A35]"
        >
          {s.title}
        </h2>

        <p
          className="mx-auto mt-4 max-w-[740px] text-center text-[16px] font-normal leading-[150%] tracking-wide text-[#5D6D83]"
        >
          {s.subtitle}
        </p>

        <div className="mt-10 space-y-8">
          {s.useCases.map((item, index) => (
            <article key={item.title} className={`grid gap-3 rounded-[14px] ${index === 0 ? 'bg-[#E3E1EF66]' : ''}  p-3 sm:p-4 lg:grid-cols-[54%_46%]`}>
              <div className="relative aspect-[16/11]  ">
                <Image
                  src={item.image} alt={item.imageAlt} fill className="object-contain" sizes="(min-width: 1024px) 52vw, 100vw" />
                <div className="absolute inset-0 " />
                {/* <p
                  className="absolute left-7 top-1/2 -translate-y-1/2 text-[56px] font-semibold leading-[100%] tracking-[0em] text-white/90"
                >
                  {item.imageLabel}
                </p> */}
              </div>

              <div className="flex flex-col justify-between px-1 py-2 sm:px-2">
                <div>
                  <h3
                    className="text-[28px]  text-[#061A35]"
                  >
                    {renderUseCaseTitle(item.title, item.emphasizedPhrases)}
                  </h3>

                  <p
                    className="mt-3 text-[16px] font-normal  tracking-wide text-[#5D6D83]"
           
                  >
                    {item.description}
                  </p>
                </div>

                <button
                  type="button"
                  className="mt-6 inline-flex w-full items-center justify-start gap-2 text-left text-[14px] font-medium leading-[100%] tracking-[0em] text-[#2A5A8B] transition hover:text-[#1B4570] sm:w-fit"
                  style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'normal', verticalAlign: 'middle' }}
                >
                  {item.cta}
                  <ArrowRight size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

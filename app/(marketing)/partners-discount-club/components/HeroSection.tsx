import Link from 'next/link';

export default function HeroSection({ content })  {
  return (
    <section className="overflow-hidden bg-[#B8D8F8]  md:h-[830px] h-[710px] px-2">
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col md:flex-row items-center gap-12 justify-center h-full ">
          <h1
            className={`max-w-[680px] align-middle text-[42px] font-medium leading-none tracking-[-1.72px] text-[#0B3658] md:text-[55px] ${content.titleClassName || ''}`}
            style={content.titleStyle}
          >
            {content.title}
          </h1>

          <div className="pb-1 md:pb-3">
            <p className="max-w-[520px] text-sm font-medium  text-[#284A66] md:text-base">
              {content.description}
            </p>

            <Link
              href={content.ctaHref}
              className="mt-5 inline-flex rounded bg-[#071B3A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#11345F]"
            >
              {content.ctaLabel}
            </Link>
          </div>
        </div>

        <div className="relative  flex justify-center ">
          <img
            src={content.image}
            alt={content.imageAlt}
            className="w-full max-w-[1120px] hidden md:block translate-y-1 md:translate-y-2"
          />
          <img
            src={content.imageMobile}
            alt={content.imageAlt}
            className="w-full  md:hidden block translate-y-1 md:translate-y-2"
          />
        </div>
      </div>
    </section>
  );
}

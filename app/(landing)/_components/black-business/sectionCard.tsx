import Image from 'next/image';
import React from 'react';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

type Props = {
  title?: string;
  subtitle?: string;
  heading?: string;
  // allow single paragraph or multiple paragraphs
  paragraph?: string | string[];
  ctaText?: string;
  ctaHref?: string;
  imageUrl?: string;
  imageAlt?: string;
  right?: boolean;
};

export const SectionCard: React.FC<Props> = ({
  title = 'Connections. Capital. Confidence.',
  subtitle = "Orisuun is more than a listing — it's a growth ecosystem. Get matched with investors, advisors, and opportunities tailored for you",
  heading = '',
  paragraph = '',
  imageUrl = `${staticUrl}/leading-pages/black-business/section-card-image.png`,
  imageAlt = 'Illustration',
  ctaText = 'Find opportunities',
  ctaHref = '#',
  right = false,
}) => {
  return (
    <section className="w-full bg-white py-16 md:py-20">
      <div className="max-w-[100rem] mx-auto px-6">
        {title && (
          <div className="text-center mb-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#0F3B77]">
              {title}
            </h2>
            {subtitle && React.createElement('p', { className: 'text-gray-500 mt-3 max-w-3xl mx-auto' }, subtitle)}
          </div>
        )}

        <div
          className={`flex flex-col items-center gap-8 md:gap-12 ${
            right ? 'md:flex-row-reverse' : 'md:flex-row'
          }`}
        >
          {/* Text block */}
          <div className="w-full md:w-1/2">
            {heading && (
              <h3 className={`text-2xl md:text-3xl font-semibold mb-4 ${right ? 'md:text-left' : ''}`}>
                {heading}
              </h3>
            )}

            <div className={`space-y-4 text-gray-600 ${right ? 'md:text-left' : 'md:text-left'} text-left`}>
              {Array.isArray(paragraph)
                ? paragraph.map((p, i) => (
                    <p key={i} className="leading-relaxed">
                      {p}
                    </p>
                  ))
                : (
                    <p className="leading-relaxed">{paragraph}</p>
                  )}
            </div>

            <div className="mt-6">
              <a
                href={ctaHref}
                className="inline-block bg-[#2357C6] text-white px-5 py-3 rounded-full font-medium hover:bg-[#1e4bb2] transition"
                aria-label={ctaText}
              >
                {ctaText}
              </a>
            </div>
          </div>

          {/* Image block */}
          <div className="w-full md:w-1/2">
            <div className="relative w-full aspect-[16/10] md:aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionCard;

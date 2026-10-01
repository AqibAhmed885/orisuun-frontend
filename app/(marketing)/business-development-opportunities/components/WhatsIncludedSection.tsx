'use client';

import { useLayoutEffect, useRef } from 'react';
import { Activity, ArrowRight, CircleCheck } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';



export default function WhatsIncludedSection({includedCards}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const leftContentRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLParagraphElement | null>(null);
  const arrowRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const leftContent = leftContentRef.current;
    const intro = introRef.current;
    const arrow = arrowRef.current;
    const cards = cardRefs.current.filter(Boolean) as HTMLElement[];

    if (!section || !leftContent || !intro || !arrow || !cards.length) return;

    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reducedMotion) {
        gsap.set([leftContent, intro, cards], { clearProps: 'all' });
        return;
      }

      gsap.from(leftContent.children, {
        autoAlpha: 0,
        y: 34,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 72%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from(intro, {
        autoAlpha: 0,
        y: 42,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: intro,
          start: 'top 86%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.to(arrow, {
        rotate: 360,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 35%',
          end: 'bottom 75%',
          scrub: 1,
        },
      });

      cards.forEach((card) => {
        const icon = card.querySelector('[data-card-icon]');
        const tags = card.querySelectorAll('[data-card-tag]');

        gsap.fromTo(
          card,
          {
            autoAlpha: 0.28,
            y: 110,
            scale: 0.955,
          },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 92%',
              end: 'top 52%',
              scrub: 1,
            },
          }
        );

        gsap.from(icon, {
          rotate: -18,
          scale: 0.72,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top 86%',
            end: 'top 60%',
            scrub: 1,
          },
        });

        gsap.from(tags, {
          autoAlpha: 0,
          x: 24,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 66%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white px-5 py-20 md:px-8 md:py-28 lg:px-10">
      <div className="mx-auto grid max-w-[1380px] gap-12 lg:grid-cols-[43%_57%] lg:items-start lg:gap-16">
        <div ref={leftContentRef} className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-[14px] font-medium uppercase tracking-wide text-[#647087] md:text-base">
            What&apos;s included
          </p>

          <div className="mt-5 flex items-start justify-between gap-6">
            <h2 className="max-w-[480px] text-[38px] font-medium leading-[1.03] tracking-wide text-[#11151D] md:text-[30px] lg:text-[38px]">
              A cleaner path from search to closed deal
            </h2>
            <div
              // ref={arrowRef}
              className="mt-1 hidden h-[92px] w-[92px] shrink-0 items-center justify-center rounded-full bg-[#00395D] text-white sm:flex"
            >
              <ArrowRight aria-hidden="true" className="h-12 w-12" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <div>
          <p
            ref={introRef}
            className="max-w-[700px] text-2xl font-normal leading-[1.08] tracking-wide text-[#677389] md:text-3xl"
          >
            Orisuun gives Black-owned businesses the structure, connections, and support needed to
            turn interest into real business development momentum.
          </p>

          <div className="mt-10 space-y-6 md:mt-12">
            {includedCards.map((card, index) => (
              <article
                key={card.title}
                ref={(element) => {
                  cardRefs.current[index] = element;
                }}
                className="relative min-h-[360px] overflow-hidden rounded-[16px] border border-[#002C4D36] bg-[#F2F2F575] pl-7 pr-7 pt-28 shadow-[0_14px_36px_rgba(28,48,76,0.035)] md:min-h-[390px] md:pl-[122px] md:pr-10 md:pt-9"
              >
                <div
                  // data-card-icon
                  className="absolute left-0 top-0 flex h-[88px] w-[88px] items-center justify-center bg-[#D8E5F6] text-[#071B2D] md:h-[94px] md:w-[94px]"
                >
                  <svg width="47" height="47" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.76562 24.5177H11.5349L18.7464 8.65234L30.2849 38.9408L37.4964 24.5177H43.2656" stroke="#04171D" stroke-width="2.88462" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>

                <h3 className="text-xl font-medium leading-[1.08] tracking-wide text-[#07142D] md:text-2xl">
                  {card.title}
                </h3>
                <p className="mt-4 max-w-[610px] text-lg tracking-wide text-[#657087] md:text-xl">
                  {card.description}
                </p>

                <ul className="mt-5 flex flex-col items-start gap-3">
                  {card.tags.map((tag) => (
                    <li
                      key={tag}
                      data-card-tag
                      className="inline-flex w-fit items-center gap-2 rounded-full bg-[#E4E8F2] px-2.5 py-1 text-[13px] leading-none tracking-wide text-[#2F3647] md:text-sm"
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.1" y="0.1" width="17.8" height="17.8" rx="8.9" stroke="#2F3647" stroke-width="0.2" />
                        <path d="M7.5011 13.3125H7.48985C7.3271 13.3095 7.17335 13.2353 7.06835 13.11L3.31835 8.61002C3.11885 8.37152 3.1511 8.01677 3.39035 7.81802C3.62885 7.61927 3.98285 7.65077 4.1831 7.89002L7.51685 11.8905L13.8326 4.87352C14.0411 4.64252 14.3966 4.62452 14.6276 4.83152C14.8586 5.03927 14.8773 5.39477 14.6696 5.62652L7.9196 13.1265C7.81235 13.245 7.66085 13.3125 7.5011 13.3125Z" fill="#2F3647" />
                      </svg>


                      <span className="whitespace-nowrap">{tag}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

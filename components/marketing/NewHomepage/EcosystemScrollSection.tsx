'use client';

import { members } from '@/data/marketing/ecosystem';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { ReactNode, useLayoutEffect, useRef } from 'react';

function GlassLabel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`absolute z-30 flex max-w-[260px] flex-col rounded-[2.5px] border border-[#d8ecff]/80 bg-[#eaf5ff]/90 text-center text-[12px] font-medium leading-tight text-[#14223a] shadow-[0_0_0_3px_rgba(201,229,255,0.22),0_8px_24px_rgba(5,20,44,0.25)] backdrop-blur-md md:rounded-[8px] md:px-3 md:py-1 md:text-sm ${className}`}
    >
      {children}
    </div>
  );
}

const finalLines = [
  { x1: 630, y1: 415, x2: 450, y2: 230 },
  { x1: 810, y1: 415, x2: 1000, y2: 230 },
  { x1: 810, y1: 415, x2: 1150, y2: 375 },
  { x1: 810, y1: 415, x2: 1020, y2: 540 },
  { x1: 720, y1: 405, x2: 720, y2: 655 },
  { x1: 630, y1: 415, x2: 440, y2: 530 },
  { x1: 630, y1: 415, x2: 280, y2: 395 },
];

const finalLinesMobile = [
  { x1: 570, y1: 385, x2: 360, y2: 290 },
  { x1: 850, y1: 385, x2: 1200, y2: 290 },
  { x1: 850, y1: 385, x2: 1260, y2: 360 },
  { x1: 850, y1: 385, x2: 1170, y2: 440 },
  { x1: 720, y1: 390, x2: 720, y2: 490 },
  { x1: 570, y1: 385, x2: 360, y2: 440 },
  { x1: 570, y1: 385, x2: 210, y2: 360 },
];

const finalLabels = [
  {
    id: 'experts',
    label: 'Subject Matter Experts',
    className: 'md:left-[20%] md:top-[26%] top-[37%] left-[8%] text-[8px]',
  },
  {
    id: 'investors',
    label: 'Investors',
    className: 'md:right-[25%] md:top-[26%] top-[37%] right-[12%] text-[8px]',
  },
  {
    id: 'partners',
    label: 'Partners',
    className: 'md:right-[15%] md:top-[47%] top-[46%] right-[5%] text-[8px]',
  },
  {
    id: 'mentors',
    label: 'Mentors',
    className: 'md:right-[25%] md:bottom-[26%] bottom-[40%] right-[12%] text-[8px]',
  },
  {
    id: 'people',
    label: (
      <>
        The People:
        <br />
        Customers, Clients, & Advocates
      </>
    ),
    className: 'left-1/2 md:top-[82%] top-[65%] w-[270px] -translate-x-1/2 text-[8px]',
  },
  {
    id: 'consultants',
    label: 'Strategy Consultants',
    className: 'md:left-[20%] md:bottom-[26%] bottom-[40%] left-[8%] text-[8px]',
  },
  {
    id: 'professionals',
    label: 'Professionals',
    className: 'md:left-[12%] md:top-[50%] top-[46%] left-[3%] text-[8px]',
  },
];

export default function EcosystemScrollSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.config({
      ignoreMobileResize: true,
    });

    gsap.ticker.lagSmoothing(1000, 16);

    const section = sectionRef.current;
    const container = containerRef.current;

    let refreshFrame = 0;
    let scrollTrigger: ReturnType<typeof ScrollTrigger.create> | null = null;

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isMobile = window.matchMedia('(max-width: 767px)').matches;

      const memberBitsSelector = [
        '.ecosystem-member-icon',
        '.ecosystem-member-label',
        '.ecosystem-member-text',
        '.ecosystem-member-path',
        '.ecosystem-member-secondary-path',
      ].join(', ');

      const allMemberBits = container.querySelectorAll(memberBitsSelector);
      const allMemberLabels = container.querySelectorAll('.ecosystem-member-label');
      const allMemberIcons = container.querySelectorAll('.ecosystem-member-icon');
      const allMemberTexts = container.querySelectorAll('.ecosystem-member-text');
      const allMemberPaths = container.querySelectorAll(
        '.ecosystem-member-path, .ecosystem-member-secondary-path'
      );

      const finalMap = container.querySelector('.ecosystem-final-map');
      const finalMapLines = container.querySelectorAll('.ecosystem-final-line');
      const finalMapLabels = container.querySelectorAll('.ecosystem-final-label');

      const core = container.querySelector('.ecosystem-core');
      const coreDesc = container.querySelector('.ecosystem-core-desc');

      const getMember = (id: string) =>
        container.querySelector<HTMLElement>(`[data-member-id="${id}"]`);

      const getMemberParts = (id: string) => {
        const root = getMember(id);

        return {
          root,
          icon: root?.querySelector('.ecosystem-member-icon') ?? null,
          label: root?.querySelector('.ecosystem-member-label') ?? null,
          text: root?.querySelector('.ecosystem-member-text') ?? null,
          paths:
            root?.querySelectorAll(
              '.ecosystem-member-path, .ecosystem-member-secondary-path'
            ) ?? [],
        };
      };

      /**
       * Performance only.
       * IMPORTANT: Path SVG wrappers ko transform nahi de rahe.
       * Is se path positions same rahengi.
       */
      gsap.set(
        [
          core,
          coreDesc,
          allMemberIcons,
          allMemberLabels,
          allMemberTexts,
          finalMap,
          finalMapLines,
          finalMapLabels,
        ],
        {
          willChange: 'transform, opacity',
          force3D: true,
        }
      );

      if (prefersReducedMotion || isMobile) {
        gsap.set(allMemberIcons, { autoAlpha: 0 });
        gsap.set(allMemberTexts, { autoAlpha: 0 });
        gsap.set(allMemberPaths, { autoAlpha: 0 });
        gsap.set(allMemberLabels, { autoAlpha: 0 });

        gsap.set(finalMap, { autoAlpha: 1 });
        gsap.set(finalMapLines, { autoAlpha: 0.85 });
        gsap.set(finalMapLabels, { autoAlpha: 1, y: 0 });

        gsap.set(core, { autoAlpha: 1, scale: 1, y: 0 });
        gsap.set(coreDesc, { autoAlpha: 0, y: -8 });

        return;
      }

      gsap.set(allMemberBits, { autoAlpha: 0 });
      gsap.set(finalMap, { autoAlpha: 0 });
      gsap.set(finalMapLines, { autoAlpha: 0 });
      gsap.set(finalMapLabels, { autoAlpha: 0, y: 10 });

      gsap.set(core, {
        autoAlpha: 1,
        scale: 1.24,
        y: 14,
        transformOrigin: 'center center',
      });

      gsap.set(coreDesc, {
        autoAlpha: 0,
        y: 14,
      });

      gsap.set(allMemberIcons, {
        y: 14,
        scale: 0.94,
        transformOrigin: 'center center',
      });

      gsap.set(allMemberTexts, {
        y: 12,
      });

      const getScrollDistance = () => {
        const width = window.innerWidth;

        if (width >= 1536) return 9200;
        if (width >= 1280) return 8400;
        if (width >= 1024) return 7600;
        if (width >= 768) return 6900;

        return 6200;
      };

      const tl = gsap.timeline({
        defaults: {
          ease: 'power2.inOut',
          overwrite: 'auto',
        },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScrollDistance()}`,
          scrub: 2.2,
          pin: section,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: false,
        },
      });
      scrollTrigger = tl.scrollTrigger ?? null;

      const pause = (duration = 0.6) => {
        tl.to({}, { duration });
      };

      const hideCoreText = (position?: string | number) => {
        if (!coreDesc) return;

        tl.to(
          coreDesc,
          {
            autoAlpha: 0,
            y: -8,
            duration: 0.48,
            ease: 'power2.inOut',
          },
          position
        );
      };

      const hideAllMemberTextsExcept = (activeId?: string, position?: string | number) => {
        const textsToHide = members
          .filter((member) => member.id !== activeId)
          .map((member) => getMemberParts(member.id).text)
          .filter(Boolean);

        if (!textsToHide.length) return;

        tl.to(
          textsToHide,
          {
            autoAlpha: 0,
            y: -8,
            duration: 0.45,
            ease: 'power2.inOut',
          },
          position
        );
      };

      const showMember = (id: string, position?: string | number) => {
        const { icon, label, text, paths } = getMemberParts(id);

        hideCoreText(position);
        hideAllMemberTextsExcept(id, '<');

        tl.to(
          [icon, label].filter(Boolean),
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.82,
            stagger: 0.12,
            ease: 'power3.out',
          },
          position
        );

        /**
         * Paths only fade.
         * No x/y/scale/clearProps.
         */
        tl.to(
          paths,
          {
            autoAlpha: 1,
            duration: 0.72,
            ease: 'power2.inOut',
          },
          '>-0.12'
        );

        if (text) {
          tl.to(
            text,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.72,
              ease: 'power3.out',
            },
            '>-0.12'
          );
        }
      };

      const hideMember = (id: string, position?: string | number) => {
        const { root } = getMemberParts(id);
        if (!root) return;

        const iconLabelText = root.querySelectorAll(
          '.ecosystem-member-icon, .ecosystem-member-label, .ecosystem-member-text'
        );

        const paths = root.querySelectorAll(
          '.ecosystem-member-path, .ecosystem-member-secondary-path'
        );

        tl.to(
          iconLabelText,
          {
            autoAlpha: 0,
            y: -8,
            duration: 0.65,
            ease: 'power2.inOut',
          },
          position
        );

        tl.to(
          paths,
          {
            autoAlpha: 0,
            duration: 0.65,
            ease: 'power2.inOut',
          },
          '<'
        );
      };

      const hideMemberPaths = (id: string, position?: string | number) => {
        const { paths } = getMemberParts(id);

        tl.to(
          paths,
          {
            autoAlpha: 0,
            duration: 0.65,
            ease: 'power2.inOut',
          },
          position
        );
      };

      const hideMemberText = (id: string, position?: string | number) => {
        const { text } = getMemberParts(id);
        if (!text) return;

        tl.to(
          text,
          {
            autoAlpha: 0,
            y: -8,
            duration: 0.5,
            ease: 'power2.inOut',
          },
          position
        );
      };

      const showFinalMap = (position?: string | number) => {
        tl.to(
          container.querySelectorAll(
            '.ecosystem-member-icon, .ecosystem-member-text, .ecosystem-member-label'
          ),
          {
            autoAlpha: 0,
            y: -8,
            duration: 0.65,
            ease: 'power2.inOut',
          },
          position
        );

        tl.to(
          container.querySelectorAll(
            '.ecosystem-member-path, .ecosystem-member-secondary-path'
          ),
          {
            autoAlpha: 0,
            duration: 0.65,
            ease: 'power2.inOut',
          },
          '<'
        );

        hideCoreText('<');

        tl.to(
          core,
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.inOut',
          },
          '<'
        );

        tl.to(
          finalMap,
          {
            autoAlpha: 1,
            duration: 0.85,
            ease: 'power2.inOut',
          },
          '>-0.1'
        );

        tl.to(
          finalMapLines,
          {
            autoAlpha: 0.85,
            duration: 0.8,
            stagger: 0.075,
            ease: 'power2.inOut',
          },
          '>'
        );

        tl.to(
          finalMapLabels,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.07,
            ease: 'power3.out',
          },
          '<0.12'
        );
      };

      /**
       * More breathing space at start.
       */
      pause(1);

      /**
       * STEP 1: Core intro
       */
      tl.to(core, {
        scale: 1,
        y: 0,
        duration: 1.25,
        ease: 'power3.out',
      });

      tl.to(
        coreDesc,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          ease: 'power3.out',
        },
        '>-0.22'
      );

      pause(0.8);

      /**
       * STEP 2: Investors
       */
      showMember('investors');

      pause(0.5);

      tl.to(
        [
          getMemberParts('investors').icon,
          getMemberParts('investors').label,
        ].filter(Boolean),
        {
          x: -75,
          duration: 0.78,
          ease: 'power2.inOut',
        },
        '>'
      );

      pause(0.35);

      hideMemberPaths('investors');

      pause(0.35);

      /**
       * STEP 2 continued: Partners
       */
      showMember('partners');

      pause(0.8);

      /**
       * STEP 3: Hide investors/partners, show mentors
       */
      hideMember('investors');
      hideMember('partners', '<');

      pause(0.35);
      showMember('mentors');

      pause(0.8);

      /**
       * STEP 4: Hide mentors, show people
       */
      hideMember('mentors');

      pause(0.35);
      showMember('people');

      pause(0.8);

      /**
       * STEP 5: Hide people, show professionals
       */
      hideMember('people');

      pause(0.35);
      showMember('professionals');

      pause(0.55);

      hideMemberText('professionals');

      pause(0.35);

      /**
       * STEP 5 continued: Consultants
       */
      showMember('consultants');

      pause(0.8);

      /**
       * STEP 6: Hide professionals/consultants, show experts
       */
      hideMember('professionals');
      hideMember('consultants', '<');

      pause(0.35);
      showMember('experts');

      pause(0.9);

      /**
       * STEP 7: Final clean map
       */
      hideMember('experts');

      pause(0.4);
      showFinalMap();

      pause(1);

      refreshFrame = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, containerRef);

    return () => {
      if (refreshFrame) {
        cancelAnimationFrame(refreshFrame);
      }
      scrollTrigger?.kill(true);
      scrollTrigger = null;
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto grid w-full place-items-center overflow-hidden px-0 py-0 md:min-h-screen lg:min-h-screen xl:min-h-[100svh]"
    >
      <div
        ref={containerRef}
        className="relative h-[560px] w-full max-w-[1440px] 3xl:max-w-[1600px] 2k:max-w-[1800px] overflow-hidden bg-[#0F1C37] text-white md:h-screen md:rounded-[20px] lg:h-screen xl:h-[760px] 2xl:h-[960px]"
      >
        <div className="absolute inset-0">
          <Image
            src="/homepage-new/ecobg.svg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority={false}
          />
        </div>

        <div className="absolute inset-y-0 left-1/2 z-10 w-full max-w-[1440px] -translate-x-1/2">
          <div className="relative z-20 mx-auto max-w-[920px] px-5 pt-5 text-center md:pt-6 lg:pt-5">
            <p className="mx-auto inline-block bg-[#d8ecff] px-2 text-[15px] font-medium uppercase tracking-[0.18em] text-[#42516a]">
              There&apos;s a place for you here
            </p>

            <h2 className="mt-2 text-2xl font-medium leading-[1.1] tracking-normal text-white sm:text-[42px] lg:text-[42px]">
              The ecosystem built around
              <br />
              Black-owned business growth.
            </h2>
          </div>

          {/* Final clean map overlay desktop */}
          <div className="ecosystem-final-map pointer-events-none absolute inset-0 z-[18] hidden md:block">
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 1440 760"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {finalLines.map((line, index) => (
                <line
                  key={`ecosystem-final-line-${index}`}
                  className="ecosystem-final-line"
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="#DBECFF"
                  strokeWidth="1.25"
                  strokeDasharray="3 3"
                  strokeLinecap="round"
                />
              ))}
            </svg>

            {finalLabels.map((item) => (
              <GlassLabel
                key={item.id}
                className={`ecosystem-final-label ${item.className}`}
              >
                {item.label}
              </GlassLabel>
            ))}
          </div>

          {/* Final clean map overlay mobile */}
          <div className="ecosystem-final-map pointer-events-none absolute inset-0 z-[18] block md:hidden">
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 1440 760"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {finalLinesMobile.map((line, index) => (
                <line
                  key={`ecosystem-final-line-${index}`}
                  className="ecosystem-final-line"
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="#DBECFF"
                  strokeWidth="1.25"
                  strokeDasharray="3 3"
                  strokeLinecap="round"
                />
              ))}
            </svg>

            {finalLabels.map((item) => (
              <GlassLabel
                key={item.id}
                className={`ecosystem-final-label ${item.className}`}
              >
                {item.label}
              </GlassLabel>
            ))}
          </div>

          {/* Center core */}
          <div className="ecosystem-core absolute left-1/2 top-[40%] z-20 flex -translate-x-1/2 flex-col items-center md:top-1/2 md:-translate-y-1/2">
            <div className="relative h-[65px] w-[100px] md:h-[170px] md:w-[180px]">
              <Image
                src="/homepage-new/ecosystem/bob.svg"
                alt=""
                fill
                sizes="320px"
                className="object-contain drop-shadow-[0_30px_45px_rgba(42,119,210,0.32)]"
              />

              <GlassLabel className="bottom-0 left-1/2 w-max -translate-x-1/2 text-[8px]">
                Black-Owned Businesses
              </GlassLabel>
            </div>

            <p className="ecosystem-core-desc mt-4 max-w-[650px] text-center text-base text-[#A8B0C0]">
              Black-owned business are at the center of our platform&apos;s ecosystem.
              <br />
              All of our tools, access, and resources are designed for their growth
            </p>
          </div>

          {/* Animated members */}
          {members.map((member) => (
            <div
              key={member.id}
              data-member-id={member.id}
              className="ecosystem-member absolute inset-0 z-20"
            >
              <div className="ecosystem-member-path">{member.pathSvg}</div>

              <div className="ecosystem-member-secondary-path">
                {member.secondaryPathSvg}
              </div>

              <div className={`ecosystem-member-icon absolute z-20 ${member.iconClass}`}>
                <Image
                  src={member.icon}
                  alt=""
                  fill
                  sizes="140px"
                  className="object-contain"
                />
              </div>

              <GlassLabel className={`ecosystem-member-label ${member.labelClass}`}>
                {member.label}
              </GlassLabel>

              {member.text ? (
                <p
                  className={`ecosystem-member-text absolute z-20 text-center text-[15px] text-[#A8B0C0] ${member.textClass ?? ''
                    }`}
                >
                  {member.text}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

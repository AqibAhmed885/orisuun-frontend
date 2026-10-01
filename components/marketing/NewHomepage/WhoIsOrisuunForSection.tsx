'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

type Bubble = {
  src?: string;
  alt?: string;
  className: string;
  imageClassName?: string;
};

const copyPanels = [
  {
    highlight: 'Black-owned businesses',
    text: 'that want to be discovered, supported, and taken seriously.',
    description:
      'For founders who want access to customers, investors, mentors, experts, partners, and opportunities beyond their immediate network.',
  },
  {
    highlight: 'Investors & Partners',
    text: 'looking for promising Black-owned businesses to grow with.',
    description:
      'For people and organizations that want to provide capital, partnerships, discounts, or business development opportunities to founders ready to grow.',
  },
  {
    highlight: 'Mentors & Consultants',
    text: 'who want to help founders grow with practical guidance.',
    description:
      'For advisors, operators, experts, and professionals who want to share experience, build authority, and support Black-owned businesses with real strategic direction.',
  },
  {
    highlight: 'Professionals',
    text: 'who have vital services and experience for our business members.',
    description:
      'For professionals who want to share specialized services, build meaningful relationships, and help Black-owned businesses move with confidence.',
  },
];

const bubbles: Bubble[] = [
  {
    src: '/homepage-new/who/2.svg',
    alt: 'Business founder profile illustration',
    className:
      'left-[-18%] top-[8%] size-[200px] md:left-[2%] md:top-[18%] md:size-[190px] lg:size-[230px]',
    imageClassName: 'scale-[1.55]',
  },
  {
    className:
      'left-[29%] top-[26%] size-[26px] md:left-[20%] md:top-[47%] md:size-[92px] lg:size-[90px] bg-[#282637]',
  },
  {
    className:
      'bottom-[16%] left-[35%] size-[30px] md:left-[30%] md:bottom-[28%] md:size-[60px] bg-[#282637]',
  },
  {
    className:
      'left-[43%] top-[10%] size-[85px] md:left-[44%] md:top-[3%] md:size-[170px] bg-[#282637]',
  },
  {
    className:
      'left-[50%] bottom-[30%] size-[72px] md:left-[56%] md:top-[22%] md:size-[60px] bg-[#282637]',
  },
  {
    className:
      'right-[12%] top-[18%] size-[50px] md:right-[18%] md:top-[10%] md:size-[92px] bg-[#282637]',
  },
  {
    src: '/homepage-new/who/3.svg',
    alt: 'Business collaboration illustration',
    className:
      'bottom-[23%] left-[2%] right-auto top-auto size-[120px] md:left-auto md:right-[2%] md:top-[40%] md:bottom-auto md:size-[190px] lg:size-[230px]',
    imageClassName: 'scale-[1.45]',
  },
];

export default function WhoIsOrisuunForSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    let mainScrollTrigger: ReturnType<typeof ScrollTrigger.create> | null = null;
    let refreshFrame: number | null = null;
    let refreshTimer: number | null = null;
    let isKilled = false;

    const cleanupFns: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const stage = section.querySelector<HTMLElement>('.who-stage');
      const introBubble = section.querySelector<HTMLElement>('.who-intro-bubble');
      const finalBubbles = Array.from(
        section.querySelectorAll<HTMLElement>('.who-final-bubble')
      );

      const imageBubbles = finalBubbles.filter(
        (bubble) => bubble.dataset.bubbleType === 'image'
      );

      const dotBubbles = finalBubbles.filter(
        (bubble) => bubble.dataset.bubbleType !== 'image'
      );

      const copyRail = section.querySelector<HTMLElement>('.who-copy-rail');
      const copyTrack = section.querySelector<HTMLElement>('.who-copy-track');
      const panels = Array.from(section.querySelectorAll<HTMLElement>('.who-copy-panel'));
      const highlightFills = Array.from(
        section.querySelectorAll<HTMLElement>('.who-highlight-fill')
      );
      const introCopy = section.querySelector<HTMLElement>('.who-intro-copy');

      const lockedHighlightProgress = new Map<number, number>();

      if (
        !stage ||
        !introBubble ||
        !copyRail ||
        !copyTrack ||
        !introCopy ||
        panels.length === 0
      ) {
        return;
      }

      gsap.set([section, stage], {
        backgroundColor: '#F2F8FF',
      });

      const getScrollDistancePx = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        if (width >= 1536) return height * 3.7;
        if (width >= 1280) return height * 3.45;
        if (width >= 1024) return height * 3.25;
        if (width >= 768) return height * 3.05;

        return height * 2.85;
      };

      const getIntroMoveY = () => {
        const introHeight = introCopy.offsetHeight || 260;

        /**
         * Title ko fade nahi karna.
         * Isko viewport ke upar move karna hai.
         */
        return -(window.innerHeight * 0.55 + introHeight);
      };

      const getCopyStartY = () => {
        const width = window.innerWidth;

        if (width >= 1280) return stage.offsetHeight * 0.76;
        if (width >= 768) return stage.offsetHeight * 0.68;

        return stage.offsetHeight * 0.62;
      };

      const getPanelHeight = () => {
        return panels[0]?.offsetHeight || 380;
      };

      const getTotalPanelMove = () => {
        return -(getPanelHeight() * (panels.length - 1));
      };

      const prepareIntroBubble = () => {
        gsap.set(introBubble, {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          transformOrigin: 'center center',
        });

        const stageRect = stage.getBoundingClientRect();
        const bubbleRect = introBubble.getBoundingClientRect();

        const centerX = stageRect.left + stageRect.width / 2;
        const centerY = stageRect.top + stageRect.height / 2;

        const isMobile = window.innerWidth < 768;

        const targetCenterX =
          stageRect.left + stageRect.width * (isMobile ? 0.82 : 0.62);

        const targetCenterY =
          stageRect.top + stageRect.height * (isMobile ? 0.87 : 0.89);

        const currentCenterX = bubbleRect.left + bubbleRect.width / 2;
        const currentCenterY = bubbleRect.top + bubbleRect.height / 2;

        introBubble.dataset.bottomX = `${targetCenterX - currentCenterX}`;
        introBubble.dataset.bottomY = `${targetCenterY - currentCenterY}`;
        introBubble.dataset.centerX = `${centerX - currentCenterX}`;
        introBubble.dataset.centerY = `${centerY - currentCenterY}`;
      };

      const prepareFinalBubbles = () => {
        gsap.set(finalBubbles, {
          x: 0,
          y: 0,
          scale: 1,
          clearProps: 'transform',
        });

        const stageRect = stage.getBoundingClientRect();

        const centerX = stageRect.left + stageRect.width / 2;
        const clusterY = stageRect.top + stageRect.height * 0.74;

        const imageStartOffsets = {
          left: { x: -170, y: -18 },
          right: { x: 170, y: 34 },
        };

        const dotStartOffsets = [
          { x: -122, y: -118 },
          { x: -48, y: -16 },
          { x: 58, y: -146 },
          { x: 136, y: -48 },
          { x: 8, y: 58 },
        ];

        finalBubbles.forEach((bubble) => {
          const bubbleRect = bubble.getBoundingClientRect();
          const bubbleCenterX = bubbleRect.left + bubbleRect.width / 2;
          const bubbleCenterY = bubbleRect.top + bubbleRect.height / 2;

          const isImageBubble = bubble.dataset.bubbleType === 'image';
          const dotBubbleIndex = isImageBubble ? 0 : dotBubbles.indexOf(bubble);

          let offsetX = 0;
          let offsetY = 0;

          if (isImageBubble) {
            const finalSide = bubbleCenterX < centerX ? 'left' : 'right';
            const imageStartOffset = imageStartOffsets[finalSide];

            const originX = centerX + imageStartOffset.x;
            const originY = clusterY + imageStartOffset.y;

            offsetX = originX - bubbleCenterX;
            offsetY = originY - bubbleCenterY;
          } else {
            const dotStartOffset = dotStartOffsets[dotBubbleIndex] ?? { x: 0, y: 0 };
            const mobileScale = window.innerWidth < 768 ? 0.62 : 1;

            const originX = centerX + dotStartOffset.x * mobileScale;
            const originY = clusterY + dotStartOffset.y * mobileScale;

            offsetX = originX - bubbleCenterX;
            offsetY = originY - bubbleCenterY;
          }

          bubble.dataset.centerX = `${offsetX}`;
          bubble.dataset.centerY = `${offsetY}`;

          gsap.set(bubble, {
            autoAlpha: isImageBubble ? 0.88 : 0,
            scale: isImageBubble ? 0.82 : 0.35,
            x: offsetX,
            y: offsetY,
            transformOrigin: 'center center',
          });
        });
      };

      const updatePanelFocus = () => {
        const viewportCenter = window.innerHeight / 2;
        const focusDistance = Math.min(window.innerHeight * 0.38, 360);

        panels.forEach((panel, index) => {
          const rect = panel.getBoundingClientRect();
          const panelCenter = rect.top + rect.height / 2;
          const distance = Math.abs(panelCenter - viewportCenter);

          const isLastPanel = index === panels.length - 1;

          let focusProgress = gsap.utils.clamp(
            0,
            1,
            1 - distance / focusDistance
          );

          if (isLastPanel && panelCenter <= viewportCenter + 24) {
            focusProgress = 1;
          }

          const scale = gsap.utils.interpolate(0.3, 1, focusProgress);
          const opacity = gsap.utils.interpolate(0.01, 1, focusProgress);
          const y = gsap.utils.interpolate(28, 0, focusProgress);

          gsap.set(panel, {
            scale,
            y,
            autoAlpha: opacity,
            transformOrigin: 'center center',
          });

          if (highlightFills[index]) {
            const isBelowViewport = rect.top > window.innerHeight;
            const hasReachedFocusLine = panelCenter <= viewportCenter + 24;

            let highlightProgress = focusProgress;

            /**
             * Reverse scroll mein panel viewport ke neeche chala jaye
             * to highlight reset ho jaye.
             */
            if (isBelowViewport) {
              lockedHighlightProgress.set(index, 0);
              highlightProgress = 0;
            }

            /**
             * Panel center pass kar jaye to highlight lock rahe.
             */
            else if (hasReachedFocusLine) {
              const previousProgress = lockedHighlightProgress.get(index) ?? 0;
              const lockedProgress = Math.max(previousProgress, focusProgress);

              lockedHighlightProgress.set(index, lockedProgress);
              highlightProgress = lockedProgress;
            }

            /**
             * Panel visible hai but center tak nahi aaya,
             * to normal focus progress use hoga.
             */
            else {
              highlightProgress = focusProgress;
            }

            gsap.set(highlightFills[index], {
              scaleX: highlightProgress,
              transformOrigin: 'left center',
            });
          }
        });
      };

      const prepareAnimationState = () => {
        lockedHighlightProgress.clear();

        prepareIntroBubble();
        prepareFinalBubbles();

        /**
         * Intro title reset.
         * Important: opacity always 1 rahegi, fade nahi hogi.
         * xPercent bhi GSAP mein lock hai taake Tailwind translate overwrite hone se
         * title/copy right-left shift na ho.
         */
        gsap.set(introCopy, {
          xPercent: -50,
          y: 0,
          autoAlpha: 1,
        });

        gsap.set(copyRail, {
          xPercent: -50,
          autoAlpha: 0,
          y: 96,
        });

        gsap.set(copyTrack, {
          y: getCopyStartY(),
        });

        gsap.set(panels, {
          scale: 0.76,
          y: 28,
          autoAlpha: 0.38,
          transformOrigin: 'center center',
        });

        gsap.set(highlightFills, {
          scaleX: 0,
          transformOrigin: 'left center',
        });

        updatePanelFocus();
      };

      prepareAnimationState();

      gsap.set(
        [
          stage,
          introCopy,
          introBubble,
          copyRail,
          copyTrack,
          ...finalBubbles,
          ...panels,
          ...highlightFills,
        ],
        {
          willChange: 'transform, opacity',
          force3D: true,
        }
      );

      const hardRefresh = () => {
        if (isKilled) return;

        prepareAnimationState();
        ScrollTrigger.refresh();
        updatePanelFocus();
      };

      const scheduleRefresh = () => {
        if (isKilled) return;

        if (refreshTimer !== null) {
          window.clearTimeout(refreshTimer);
        }

        refreshTimer = window.setTimeout(() => {
          if (refreshFrame !== null) {
            cancelAnimationFrame(refreshFrame);
          }

          refreshFrame = requestAnimationFrame(hardRefresh);
        }, 160);
      };

      const timeline = gsap.timeline({
        defaults: {
          ease: 'none',
          overwrite: 'auto',
        },
        onUpdate: updatePanelFocus,
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScrollDistancePx()}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 0,
          fastScrollEnd: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
          refreshPriority: 2,

          onRefreshInit: () => {
            prepareAnimationState();
          },

          onUpdate: () => {
            updatePanelFocus();
          },

          onRefresh: () => {
            updatePanelFocus();
          },
        },
      });

      mainScrollTrigger = timeline.scrollTrigger ?? null;

      timeline
        .addLabel('introMove')
        .to(
          introCopy,
          {
            xPercent: -50,
            y: getIntroMoveY,
            autoAlpha: 1,
            duration: 0.65,
            ease: 'none',
          },
          'introMove'
        )
        .to(
          introBubble,
          {
            x: () => Number(introBubble.dataset.bottomX ?? 0),
            y: () => Number(introBubble.dataset.bottomY ?? 0),
            scale: 0.88,
            duration: 1.05,
            ease: 'none',
          },
          'introMove'
        )
        .to(
          imageBubbles,
          {
            x: 0,
            y: 0,
            duration: 1.1,
            scale: 1,
            autoAlpha: 1,
            stagger: 0.08,
            ease: 'none',
          },
          'introMove'
        )
        .to(
          dotBubbles,
          {
            autoAlpha: 0.32,
            scale: 0.72,
            duration: 0.28,
            stagger: 0.035,
            ease: 'none',
          },
          'introMove+=0.08'
        )
        .to(
          dotBubbles,
          {
            x: 0,
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.95,
            stagger: 0.035,
            ease: 'none',
          },
          'introMove+=0.12'
        )
        .addLabel('textScrollStart', 'introMove+=0.05')
        .to(
          copyRail,
          {
            xPercent: -50,
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: 'none',
            onUpdate: updatePanelFocus,
          },
          'textScrollStart'
        );

      const panelStepDuration = 0.82;
      const totalTextDuration = panelStepDuration * (panels.length - 1);

      timeline.to(
        copyTrack,
        {
          y: getTotalPanelMove,
          duration: totalTextDuration,
          ease: 'none',
          onUpdate: updatePanelFocus,
        },
        'textScrollStart'
      );

      window.addEventListener('resize', scheduleRefresh, { passive: true });
      window.addEventListener('orientationchange', scheduleRefresh, { passive: true });

      cleanupFns.push(() => {
        window.removeEventListener('resize', scheduleRefresh);
        window.removeEventListener('orientationchange', scheduleRefresh);
      });

      const images = Array.from(section.querySelectorAll('img'));

      images.forEach((image) => {
        if (!image.complete) {
          image.addEventListener('load', scheduleRefresh, { once: true });
          image.addEventListener('error', scheduleRefresh, { once: true });

          cleanupFns.push(() => {
            image.removeEventListener('load', scheduleRefresh);
            image.removeEventListener('error', scheduleRefresh);
          });
        }
      });

      document.fonts?.ready.then(scheduleRefresh).catch(() => undefined);

      refreshFrame = requestAnimationFrame(hardRefresh);
    }, section);

    return () => {
      isKilled = true;

      if (refreshTimer !== null) {
        window.clearTimeout(refreshTimer);
      }

      if (refreshFrame !== null) {
        cancelAnimationFrame(refreshFrame);
      }

      cleanupFns.forEach((cleanup) => cleanup());

      if (mainScrollTrigger) {
        mainScrollTrigger.kill(true);
        mainScrollTrigger = null;
      }

      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative z-[30] isolate mt-2 overflow-hidden bg-[#F2F8FF]">
      <div className="who-stage relative min-h-screen overflow-hidden bg-[#F2F8FF] sm:min-h-[820px] md:min-h-[820px] lg:min-h-[840px] xl:min-h-[100svh]">
        <div className="who-intro-copy absolute left-1/2 top-[44%] z-20 w-full max-w-[720px] -translate-x-1/2 -translate-y-1/2 px-5">
          <h2 className="text-[58px] font-medium leading-[1.08] tracking-normal text-[#082765] sm:text-[78px] lg:text-[88px]">
            Who is
            <br />
            <span className="relative inline-block px-4">
              <svg
                width="588"
                height="100"
                viewBox="0 0 588 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-x-0 bottom-[8%] top-[0.2%] -z-10 h-[110%] w-full -rotate-1"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M408.613 1.91925C387.966 1.44164 370.595 0.932802 361.629 0.481141C343.918 -0.411089 301.9 -0.0278062 268.253 1.34433C242.387 2.39527 199.998 5.02233 161.514 7.72521C150.753 7.53768 139.854 7.30294 129.112 7.02142C33.1553 4.50698 20.8471 4.88295 15.9914 10.4768C10.9612 16.275 10.9422 16.7684 15.7432 16.9462C17.0603 16.9949 18.4114 17.3458 19.567 17.8827C17.4242 18.681 16.184 19.6346 15.2446 20.7844C15.0352 21.0409 14.8347 21.2873 14.6433 21.524C7.24632 19.9444 6.17894 20.8349 7.37278 27.2038C7.64028 28.6305 7.6173 30.2734 7.35466 31.955C6.6351 32.5257 6.43317 33.5405 6.58859 35.126C5.86941 37.3215 4.78671 39.3899 3.45761 40.9211C-1.49897 46.6315 -1.36111 47.1187 5.40091 47.7923L5.72052 47.8237C5.11435 49.2675 4.35221 50.5969 3.46826 51.6788C-1.34505 57.5699 -1.19523 58.0519 5.58042 58.4747C9.59142 58.7247 13.88 58.7463 15.1105 58.5229C16.131 58.3373 19.6084 61.141 23.4115 65.1048C20.4943 65.6099 21.4798 66.3929 25.6315 68.2914C26.08 68.4966 26.5195 68.7158 26.9486 68.9469C28.9648 71.0311 31.1001 72.7324 33.3537 74.0503C35.6898 76.8572 36.1086 79.4094 33.1573 79.5361C24.5368 79.9061 35.1813 86.9112 55.2455 94.0721C77.0764 101.864 78.296 101.87 184.72 94.7077C207.393 93.182 230.706 91.4149 251.872 89.6534C263.76 90.2279 278.145 90.7141 292.854 91.0395C304.024 91.6941 315.351 92.2609 325.885 92.6729C388.004 95.1115 543.23 96.2536 522.548 94.1199C504.953 92.3046 514.112 88.535 541.938 86.1395C556.283 84.9044 568.556 82.1064 569.212 79.9219C569.868 77.7372 574.223 76.0913 578.89 76.2641C585.207 76.4981 587.423 74.6649 587.561 69.0906C587.613 66.9646 587.249 65.2813 586.3 63.8919C587.505 62.7088 588 60.881 588 58.2181C588 53.1781 585.721 50.7091 578.896 48.915C581.886 48.8098 582.557 48.4195 581.252 47.4111C582.198 46.5026 582.068 44.6978 581.326 41.5907C581.073 40.5337 580.975 39.3412 581.013 38.0907C582.067 37.828 582.06 37.4168 581.104 36.7428C581.444 33.46 582.642 29.9768 584.41 27.5939C588.927 21.5053 588.768 21.0299 582.159 20.8904C578.538 20.8142 574.69 20.9437 573.193 21.1813C572.174 19.7969 569.394 17.8544 565.207 15.5993C564.233 14.6504 563.228 13.619 562.23 12.5351C556.576 6.39984 550.069 3.42071 542.718 3.60275C541.076 3.64345 538.949 3.67112 536.404 3.68679C521.242 -0.699466 502.895 -0.320757 415.462 1.75128C413.184 1.80525 410.901 1.86128 408.613 1.91925ZM50.0757 26.5512C49.7124 26.6329 49.3524 26.7151 48.9962 26.798C48.1192 26.5712 47.2474 26.3341 46.3844 26.0871C47.6219 26.2299 48.8546 26.3851 50.0757 26.5512ZM27.0043 16.2079C28.9644 15.9303 31.2548 15.6818 33.9445 15.4573C28.9896 15.109 26.859 15.2676 27.0043 16.2079Z"
                  fill="#F5D8D0"
                  fillOpacity="0.83"
                />
              </svg>

              <span className="absolute inset-x-0 bottom-[8%] top-[18%] -z-10 -rotate-1 rounded-[48%] bg-[#f6d9d3]" />
              Orisuun For?
            </span>
          </h2>
        </div>

        <div className="who-intro-bubble absolute bottom-[12%] right-[-20%] top-auto z-40 size-[200px] origin-center overflow-hidden rounded-full will-change-transform md:bottom-auto md:right-[-8%] md:top-[26%] md:size-[320px] lg:size-[370px]">
          <Image
            src="/homepage-new/who/1.svg"
            alt="Business owner illustration"
            fill
            sizes="370px"
            className="scale-[1.45] object-cover"
            priority={false}
          />
        </div>

        <div className="pointer-events-none absolute inset-0 z-40">
          {bubbles.map((bubble) => (
            <div
              key={`${bubble.src ?? 'dot'}-${bubble.className}`}
              data-bubble-type={bubble.src ? 'image' : 'dot'}
              className={`who-final-bubble absolute overflow-hidden rounded-full will-change-transform ${bubble.className}`}
            >
              {bubble.src ? (
                <Image
                  src={bubble.src}
                  alt={bubble.alt ?? ''}
                  fill
                  sizes="(max-width: 768px) 190px, 330px"
                  className={`object-cover ${bubble.imageClassName ?? ''}`}
                />
              ) : null}
            </div>
          ))}
        </div>

        <div className="who-copy-rail absolute left-1/2 top-[42%] z-30 w-full max-w-[900px] -translate-x-1/2 -translate-y-1/2 px-5 text-center md:top-1/2">
          <div className="mx-auto h-[330px] max-w-[540px] xl:max-w-[680px] overflow-visible md:h-[380px]">
            <div className="who-copy-track will-change-transform">
              {copyPanels.map((panel) => (
                <div
                  key={panel.highlight}
                  className="who-copy-panel flex h-[330px] flex-col items-center justify-center md:h-[380px]"
                >
                  <h2 className="text-2xl font-medium leading-[1.12] tracking-normal text-[#102b61] lg:text-[36px] md:leading-[1.08] xl:text-5xl">
                    <span className="who-highlight relative inline-block -rotate-1 overflow-hidden px-2">
                      <span className="who-highlight-fill absolute inset-0 origin-left scale-x-0 bg-[#bddaff]" />
                      <span className="relative z-10">{panel.highlight}</span>
                    </span>{' '}
                    {panel.text}
                  </h2>

                  <p className="mx-auto mt-5 max-w-[640px] text-[15px] leading-[1.35] text-[#7b8798] md:mt-6 md:max-w-[720px] md:text-[18px] md:leading-[1.45]">
                    {panel.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Link
          href="/signup"
          prefetch={false}
          className="absolute bottom-8 left-5 z-40 inline-flex h-[58px] min-w-[210px] md:min-w-[272px] items-center justify-between rounded-lg bg-[#002B4C] px-8 text-[17px] font-medium text-white transition hover:bg-[#0b4a77] sm:bottom-10 sm:left-8"
        >
          Start Free Trial!
          <ArrowRight size={24} />
        </Link>
      </div>
    </section>
  );
}

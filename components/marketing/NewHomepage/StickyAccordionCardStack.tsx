'use client';

import Image from 'next/image';
import { ReactNode, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function GlassLabel({
    children,
    className = '',
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`absolute z-30 flex max-w-[240px] flex-col rounded-[1.5px] bg-[#eaf5ff]/90 text-center font-semibold text-[#14223a] shadow-[0_0_0_2px_rgba(201,229,255,0.22),0_4px_18px_rgba(5,20,44,0.25)] backdrop-blur-md lg:rounded-[3px] lg:px-0.5 lg:py-0.5 ${className}`}
        >
            {children}
        </div>
    );
}

type MemberNodeProps = {
    icon: string;
    label: ReactNode;
    className: string;
    iconClassName?: string;
    labelClassName?: string;
};

function MemberNode({
    icon,
    label,
    className,
    iconClassName = '',
    labelClassName = '',
}: MemberNodeProps) {
    return (
        <div className={`absolute z-20 flex flex-col items-center gap-1 ${className}`}>
            <Image
                src={icon}
                alt=""
                width={72}
                height={72}
                className={`h-6 w-6 object-contain min-[640px]:h-8 min-[640px]:w-8 lg:h-10 lg:w-10 ${iconClassName}`}
            />
            <GlassLabel
                className={`relative !max-w-[150px] !px-1 !py-0 !text-[6px] min-[640px]:!text-[9px] lg:!text-[12px] ${labelClassName}`}
            >
                {label}
            </GlassLabel>
        </div>
    );
}

function EcosystemCore({
    large = false,
    className = '',
}: {
    large?: boolean;
    className?: string;
}) {
    return (
        <div
            className={`absolute left-1/2 z-20 flex -translate-x-1/2 flex-col items-center ${large ? '-translate-y-1/2 top-[40%]' : '-translate-y-1/2 lg:top-[50%]'
                } ${className}`}
        >
            <div
                className={`relative ${large
                    ? 'h-[100px] w-[120px] min-[640px]:h-[130px] min-[640px]:w-[155px] lg:h-[160px] lg:w-[190px]'
                    : 'h-[90px] w-[100px] min-[640px]:h-[105px] min-[640px]:w-[115px] lg:h-[120px] lg:w-[130px]'
                    }`}
            >
                <Image
                    src="/homepage-new/ecosystem/bob.svg"
                    alt="Black-owned businesses"
                    fill
                    className="object-contain"
                />
            </div>

            <GlassLabel
                className={`relative lg:-mt-4 -mt-5 whitespace-nowrap font-semibold ${large
                    ? '!px-2 !py-0.5 !text-[8px] min-[640px]:!text-[11px] lg:!text-sm'
                    : 'px-1.5 !py-0 !text-[7px] min-[640px]:!text-[9px] lg:!text-[10px]'
                    }`}
            >
                Black-Owned Businesses
            </GlassLabel>
        </div>
    );
}

const ecosystemCards = [
    { title: 'Investment', accent: '#30c7ad' },
    { title: 'Access & Advice', accent: '#e9efad' },
    { title: 'Discounts', accent: '#f8a17f' },
    { title: 'Community & Customers', accent: '#6ab3e6' },
] as const;

function CardHeader({ title }: { title: string }) {
    return (
        <div className="absolute inset-x-0 top-2 z-30 flex flex-col items-center text-[#E8E9E7]">
            <h3 className="text-2xl font-semibold leading-none tracking-[-0.03em] lg:text-[32px]">
                {title}
            </h3>

            <span className="mt-1 rounded-full bg-[#d8ebff] px-3 py-0.5 text-[8px] font-medium uppercase tracking-[0.18em] text-[#4d5362]">
                There&apos;s a place for you here
            </span>
        </div>
    );
}

function QuarterArc({ side }: { side: 'left' | 'right'; color: string }) {
    return (
        <div
            className={`absolute lg:top-[12%] top-[10%] overflow-hidden ${side === 'right' ? 'right-[50%]' : 'left-[50%]'
                }`}
        >
            {side === 'right' && (
                <svg
                    width="280"
                    height="270"
                    viewBox="0 0 305 300"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-48 min-[640px]:w-64 lg:w-full"
                >
                    <path
                        d="M108.648 299.384C115.652 195.181 200.118 112.482 304.271 109.707L302.172 0C139.169 3.9175 7.31653 135.074 -0.000976562 299.032L108.648 299.384Z"
                        fill="#FAAB89"
                    />
                </svg>
            )}

            {side === 'left' && (
                <svg
                    width="270"
                    height="270"
                    viewBox="0 0 303 302"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-48 min-[640px]:w-64 lg:w-full"
                >
                    <path
                        d="M302.269 301.038C295.942 136.141 163.675 3.92793 0.00292969 0L2.10547 109.861C104.757 114.73 187.32 197.275 193.619 300.686L302.269 301.038Z"
                        fill="#2DC8A7"
                    />
                </svg>
            )}
        </div>
    );
}

/**
 * 640px–1023px par arc-member nodes ko fixed card-edge offsets ke bajaye
 * arc ki visual center-line ke saath align kiya gaya hai.
 */
function CardArtwork({ index }: { index: number }) {
    if (index === 0) {
        return (
            <>
                <QuarterArc side="left" color="#30c7ad" />

                <MemberNode
                    icon="/homepage-new/ecosystem/investor.svg"
                    label="Investors"
                    className="xl:right-[38%] xl:top-[18%] md:right-[38%] md:top-[20%] top-[20%] right-[33%] sm:right-[38%] sm:top-[20%]"
                    labelClassName="ml-5 lg:!text-[12px] p-1"
                />

                <MemberNode
                    icon="/homepage-new/ecosystem/partner.svg"
                    label="Partners"
                    className="lg:right-[27%] lg:top-[36%] md:right-[24%] md:top-[36%] right-[10%] top-[35%] sm:right-[24%] sm:top-[40%]"
                    labelClassName="ml-5 lg:!text-[12px] p-1"
                />

                <EcosystemCore className="top-[45%]" />

                <p className="absolute lg:bottom-[8%] lg:left-[4%] bottom-[10%] left-[15%] z-20 lg:max-w-[330px] max-w-[310px] text-left text-[14px] leading-[1.55] text-[#b8c0cf]">
                    <strong className="text-[#d5d9e0]">
                        Black-owned businesses are at the center of our platform&apos;s ecosystem.
                    </strong>{' '}
                    Secure traditional debt or equity by connecting directly with professional investors.
                    Or, launch a rewards-based crowdfunding campaign open to everyone—with opportunities
                    to find corporate partners who will sponsor and match your entire fundraising total.
                </p>
            </>
        );
    }

    if (index === 1) {
        return (
            <>
                <div className="absolute lg:bottom-5 bottom-[32%] left-1/2 -translate-x-1/2 overflow-hidden">
                    <svg
                        width="560"
                        height="276"
                        viewBox="0 0 620 316"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-[320px] min-[640px]:w-[500px] lg:w-[560px]"
                    >
                        <path
                            d="M329.481 315.181C491.614 305.013 619.999 168.814 619.999 2.29004C619.999 1.52603 619.996 0.762726 619.99 0L619.975 4.91992L511.485 4.56934C510.341 110.155 429.791 196.468 327.379 205.316L329.481 315.181Z"
                            fill="#E7EEB5"
                        />
                        <path
                            d="M309.999 315.79C311.499 315.79 312.996 315.778 314.49 315.757L312.391 206.051C311.595 206.06 310.797 206.065 309.999 206.065C199.035 206.065 109.02 115.358 108.501 3.26465L0 2.91406C0.333031 175.768 138.997 315.79 309.999 315.79Z"
                            fill="#E7EEB5"
                        />
                    </svg>
                </div>

                <MemberNode
                    icon="/homepage-new/ecosystem/partner.svg"
                    label="Partners"
                    className="sm:top-[32%] sm:left-[28%] lg:top-[50%] lg:left-[24%] md:left-[28%] md:top-[32%]  top-[32%] left-[16%] "
                    labelClassName="lg:ml-5 lg:!text-[12px] p-1"
                />

                <MemberNode
                    icon="/homepage-new/ecosystem/expert.svg"
                    label="Domain Experts"
                    className="sm:top-[42%] sm:left-[26%] lg:top-[64%] lg:left-[24%] md:left-[25%] md:top-[40%]  top-[40%] left-[13%]"
                    labelClassName="ml-10 lg:!text-[12px] p-1"
                />

                <MemberNode
                    icon="/homepage-new/ecosystem/pro.svg"
                    label="Professionals"
                    className="sm:top-[49%] sm:left-[40%] lg:top-[80%] lg:left-[36%] md:left-[40%] md:top-[49%]  top-[49%] left-[36%]"
                    labelClassName="lg:ml-10 ml-2 lg:!text-[12px] p-1"
                />

                <MemberNode
                    icon="/homepage-new/ecosystem/mentor.svg"
                    label="Mentors"
                    className="sm:top-[49%] sm:right-[42%] lg:top-[80%] lg:right-[36%] md:right-[40%] md:top-[49%]  top-[48%] right-[36%]"
                    labelClassName="lg:mr-8 mr-0 lg:!text-[12px] p-1"
                />

                <MemberNode
                    icon="/homepage-new/ecosystem/consultant.svg"
                    label="Strategists"
                    className="sm:top-[40%] sm:right-[28.5%] lg:top-[66%] lg:right-[28%] md:right-[28%] md:top-[40%]  top-[40%] right-[18%]"
                    labelClassName="lg:mr-2 mr-2 lg:!text-[11px] "
                />

                <MemberNode
                    icon="/homepage-new/ecosystem/investor.svg"
                    label="Investors"
                    className="sm:top-[32%] sm:right-[28%] lg:top-[51%] lg:right-[24%] md:right-[26%] md:top-[32%]  top-[32%] right-[16%] "
                    labelClassName="lg:mr-4 mr-2 lg:!text-[12px] p-1"
                />

                <EcosystemCore className="top-[35%]" />

                <p className="absolute lg:right-[4%] left-[10%] lg:top-[18%] bottom-[10%] z-20 lg:max-w-[325px] max-w-[320px] text-left text-[14px] leading-[1.55] text-[#b8c0cf]">
                    <strong className="text-[#d5d9e0]">
                        Connecting specialized expertise with all of the businesses that need it.
                    </strong>{' '}
                    Use our integrated calendar to completely skip the scheduling runaround. Business
                    owners can instantly book direct, affordable sessions with top-tier professionals,
                    mentors, and corporate strategists on their own timeline. Whether you are looking for
                    enterprise-grade counsel or looking to provide it, this is where you connect.
                </p>
            </>
        );
    }

    if (index === 2) {
        return (
            <>
                <QuarterArc side="right" color="#f8a17f" />

                <MemberNode
                    icon="/homepage-new/ecosystem/partner.svg"
                    label="Partners"
                    className="sm:top-[20%] sm:left-[40%] lg:top-[16%] lg:left-[40%] md:left-[38%] md:top-[22%]  top-[20%] left-[35%]"
                    labelClassName="!text-[7px] p-1 min-[640px]:max-[1023px]:!ml-0 lg:!text-[12px]"
                />

                <MemberNode
                    icon="/homepage-new/ecosystem/advocate.svg"
                    label={
                        <>
                            The people: <br /> Customers &amp; Advocates
                        </>
                    }
                    className="sm:top-[32%] sm:left-[22.5%] lg:top-[36%] lg:left-[23.7%] md:left-[22.5%] md:top-[32%]  top-[32%] left-[8.5%]"
                    labelClassName="!text-[5.5px] min-[640px]:max-[1023px]:!ml-0 lg:!text-[8px]"
                />

                <EcosystemCore className="top-[45%]" />

                <p className="absolute bottom-[8%] lg:right-[4%] right-[10%] z-20 lg:max-w-[330px] max-w-[320px] text-left text-[14px] leading-[1.55] text-[#b8c0cf]">
                    <strong className="text-[#d5d9e0]">
                        Keep more revenue, and drive new sales.
                    </strong>{' '}
                    Manage your costs and your customer acquisition in one place. Instantly access
                    discounts on products your business already relies on, provided by partners looking to
                    support the community. Then, turn around and offer your own custom incentives on the
                    platform to encourage other members to give your business a shot.
                </p>
            </>
        );
    }

    return (
        <>
            <EcosystemCore large className="!top-[28%] lg:!top-[30%]" />

            <div className="absolute inset-x-[10%] top-[50%] z-20 text-left text-[12px] leading-[1.45] text-[#b8c0cf] lg:inset-x-[15%] lg:top-[52%] lg:text-[13px] lg:leading-[1.5]">
                <p>
                    <strong className="text-[#d5d9e0]">
                        Build your network, drive real-world discovery, and get rewarded.
                    </strong>{' '}
                    Use built-in feeds and social posting tools to drive visibility for your business.
                    Take control of the conversation with topic-specific community rooms that any member
                    can create and moderate.
                </p>

                <p className="mt-3">
                    Beyond professional networking, our platform is filled with members explicitly looking
                    to support Black-owned businesses in their neighborhoods and when they travel. Plus,
                    our commitment to your growth includes an automatic entry into our weekly{' '}
                    <strong>$1,000 giveaway</strong> for all business members—just join to be eligible.
                </p>
            </div>
        </>
    );
}

const CARD_HEIGHT_FALLBACK = 580;

const DESKTOP_PEEK = 6;
const MOBILE_PEEK = 10;

const STACK_MAX_WIDTH = 980;
const STACK_GAP = 22;
const DESKTOP_SCROLL_DISTANCE = 0.95;
const MOBILE_SCROLL_DISTANCE = 1.02;

const BOTTOM_STICKY_OFFSET = 0.03;

const TABLET_CARD_WIDTH = 640;
const SMALL_SCREEN_BREAKPOINT = 640;
const SMALL_SCREEN_CARD_WIDTH = 420;

const DESKTOP_HEADER_TOP_EXTRA_SPACE = 96;
const MOBILE_HEADER_TOP_EXTRA_SPACE = 68;

const DESKTOP_HEADER_BOTTOM_GAP = 52;
const MOBILE_HEADER_BOTTOM_GAP = 40;

const ACTIVE_CARD_BOTTOM_SAFE_SPACE = 18;

/**
 * 1024px se neeche mobile layout use hoga.
 * Is se 806px / tablet responsive screen par desktop artwork break nahi hoga.
 */
const MOBILE_BREAKPOINT = 1024;

/**
 * Fresh reload / hydration se pehle browser cards ko isi fallback position par paint karega.
 * Is se cards top-left par overlap nahi karte.
 * GSAP mount ke baad exact measured bottom sticky position apply kar deta hai.
 */
const INITIAL_CARD_Y = 230;

export default function StickyAccordionCardStack() {
    const pinSectionRef = useRef<HTMLDivElement | null>(null);
    const stageRef = useRef<HTMLDivElement | null>(null);
    const stackRef = useRef<HTMLDivElement | null>(null);
    const titleRef = useRef<HTMLDivElement | null>(null);
    const cardRefs = useRef<HTMLDivElement[]>([]);

    useLayoutEffect(() => {
        const pinSection = pinSectionRef.current;
        const stage = stageRef.current;
        const stack = stackRef.current;
        const title = titleRef.current;
        const cardElements = cardRefs.current.filter(Boolean);

        if (!pinSection || !stage || !stack || !title || cardElements.length === 0) {
            return;
        }

        let refreshFrame: number | null = null;
        let refreshTimer: number | null = null;
        let scrollTrigger: ReturnType<typeof ScrollTrigger.create> | null = null;
        let isKilled = false;

        const cleanupFns: Array<() => void> = [];

        const ctx = gsap.context(() => {
            const isMobileView = () => window.innerWidth < MOBILE_BREAKPOINT;

            const getResponsiveCardWidth = () => {
                return window.innerWidth < SMALL_SCREEN_BREAKPOINT
                    ? SMALL_SCREEN_CARD_WIDTH
                    : TABLET_CARD_WIDTH;
            };

            const getStackWidth = () => {
                return isMobileView() ? `${getResponsiveCardWidth()}px` : '100%';
            };

            const getStackMaxWidth = () => {
                return isMobileView() ? getResponsiveCardWidth() : STACK_MAX_WIDTH;
            };

            const getStackMinWidth = () => {
                return isMobileView() ? getResponsiveCardWidth() : 0;
            };

            const applyResponsiveWidths = () => {
                const width = getStackWidth();
                const maxWidth = getStackMaxWidth();

                gsap.set(stack, {
                    width,
                    minWidth: getStackMinWidth(),
                    maxWidth,
                });

                gsap.set([title, ...cardElements], {
                    width,
                    minWidth: getStackMinWidth(),
                    maxWidth,
                });
            };

            gsap.set(stack, {
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                x: 0,
                xPercent: 0,
                marginLeft: 'auto',
                marginRight: 'auto',
                width: getStackWidth(),
                minWidth: getStackMinWidth(),
                maxWidth: getStackMaxWidth(),
                willChange: 'transform',
                force3D: true,
            });

            gsap.set(title, {
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                x: 0,
                xPercent: 0,
                marginLeft: 'auto',
                marginRight: 'auto',
                width: getStackWidth(),
                minWidth: getStackMinWidth(),
                maxWidth: getStackMaxWidth(),
                zIndex: cardElements.length + 10,
                willChange: 'transform',
                force3D: true,
            });

            gsap.set(cardElements, {
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                x: 0,
                xPercent: 0,
                marginLeft: 'auto',
                marginRight: 'auto',
                width: getStackWidth(),
                minWidth: getStackMinWidth(),
                maxWidth: getStackMaxWidth(),
                willChange: 'transform',
                force3D: true,
                transformOrigin: 'center center',
            });

            cardElements.forEach((card, index) => {
                gsap.set(card, {
                    zIndex: cardElements.length - index,
                });
            });

            const getLayoutValues = () => {
                const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
                const titleHeight = title.getBoundingClientRect().height || 120;

                const cardHeight =
                    cardElements[0]?.getBoundingClientRect().height || CARD_HEIGHT_FALLBACK;

                const stageHeight = stage.getBoundingClientRect().height;
                const peek = isMobile ? MOBILE_PEEK : DESKTOP_PEEK;

                const headerTopExtraSpace = isMobile
                    ? MOBILE_HEADER_TOP_EXTRA_SPACE
                    : DESKTOP_HEADER_TOP_EXTRA_SPACE;

                const headerBottomGap = isMobile
                    ? MOBILE_HEADER_BOTTOM_GAP
                    : DESKTOP_HEADER_BOTTOM_GAP;

                const openStep = cardHeight + STACK_GAP;
                const expansionAmount = openStep - peek;

                const firstCardOffset = titleHeight + headerBottomGap;
                const bottomOffset = stageHeight * BOTTOM_STICKY_OFFSET;

                const cardStickyY = Math.max(
                    0,
                    stageHeight - cardHeight - bottomOffset - ACTIVE_CARD_BOTTOM_SAFE_SPACE
                );

                const headerStickyY = cardStickyY + headerTopExtraSpace;

                const stackHeight =
                    titleHeight +
                    headerBottomGap +
                    cardHeight +
                    Math.max(cardElements.length - 1, 0) * peek;

                return {
                    isMobile,
                    cardHeight,
                    peek,
                    openStep,
                    expansionAmount,
                    firstCardOffset,
                    stackHeight,
                    headerStickyY,
                    cardStickyY,
                };
            };

            let layoutValues = getLayoutValues();

            const updateLayoutValues = () => {
                applyResponsiveWidths();
                layoutValues = getLayoutValues();
            };

            const updateStack = (progress: number) => {
                if (isKilled) return;

                const {
                    peek,
                    openStep,
                    expansionAmount,
                    firstCardOffset,
                    stackHeight,
                    headerStickyY,
                    cardStickyY,
                } = layoutValues;

                const totalCards = cardElements.length;
                const totalSteps = Math.max(totalCards - 1, 1);
                const scrollStep = progress * totalSteps;

                gsap.set(stack, {
                    height: stackHeight,
                    x: 0,
                    xPercent: 0,
                });

                gsap.set(title, {
                    y: 0,
                    x: 0,
                    xPercent: 0,
                });

                cardElements.forEach((card, cardIndex) => {
                    if (cardIndex === 0) {
                        gsap.set(card, {
                            y: firstCardOffset,
                            x: 0,
                            xPercent: 0,
                            scale: 1,
                        });
                        return;
                    }

                    const cardOpenProgress = gsap.utils.clamp(
                        0,
                        1,
                        scrollStep - (cardIndex - 1)
                    );

                    let cumulativeExpansion = 0;

                    for (let i = 1; i <= cardIndex; i += 1) {
                        cumulativeExpansion +=
                            expansionAmount * gsap.utils.clamp(0, 1, scrollStep - (i - 1));
                    }

                    const collapsedY = firstCardOffset + cardIndex * peek;
                    const currentY = collapsedY + cumulativeExpansion;

                    gsap.set(card, {
                        y: currentY,
                        x: 0,
                        xPercent: 0,
                        scale: gsap.utils.interpolate(1, 1, cardOpenProgress),
                    });
                });

                const maxVirtualY = (totalCards - 1) * openStep;
                const activeCardVirtualY = gsap.utils.clamp(
                    0,
                    maxVirtualY,
                    scrollStep * openStep
                );

                const stickyShiftProgress = gsap.utils.clamp(0, 1, progress * 1.35);

                const currentStickyY = gsap.utils.interpolate(
                    headerStickyY,
                    cardStickyY,
                    stickyShiftProgress
                );

                gsap.set(stack, {
                    y: currentStickyY - firstCardOffset - activeCardVirtualY,
                    x: 0,
                    xPercent: 0,
                });
            };

            const hardRefresh = () => {
                if (isKilled) return;

                updateLayoutValues();
                ScrollTrigger.refresh();
                updateStack(scrollTrigger?.progress ?? 0);
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

            updateLayoutValues();
            updateStack(0);

            scrollTrigger = ScrollTrigger.create({
                trigger: pinSection,
                start: 'top top',
                end: () => {
                    updateLayoutValues();

                    const { openStep, isMobile } = layoutValues;
                    const scrollPerCard =
                        openStep * (isMobile ? MOBILE_SCROLL_DISTANCE : DESKTOP_SCROLL_DISTANCE);

                    return `+=${(cardElements.length - 1) * scrollPerCard}`;
                },
                pin: true,
                pinSpacing: true,
                anticipatePin: 0,
                fastScrollEnd: true,
                invalidateOnRefresh: true,
                refreshPriority: 10,
                scrub: 0.55,

                onRefreshInit: () => {
                    updateLayoutValues();
                },

                onUpdate: (self) => {
                    updateStack(self.progress);
                },

                onRefresh: (self) => {
                    updateLayoutValues();
                    updateStack(self.progress);
                },
            });

            window.addEventListener('resize', scheduleRefresh, { passive: true });
            window.addEventListener('orientationchange', scheduleRefresh, { passive: true });

            cleanupFns.push(() => {
                window.removeEventListener('resize', scheduleRefresh);
                window.removeEventListener('orientationchange', scheduleRefresh);
            });

            const images = Array.from(pinSection.querySelectorAll('img'));

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
        }, pinSection);

        return () => {
            isKilled = true;

            if (refreshTimer !== null) {
                window.clearTimeout(refreshTimer);
            }

            if (refreshFrame !== null) {
                cancelAnimationFrame(refreshFrame);
            }

            cleanupFns.forEach((cleanup) => cleanup());

            if (scrollTrigger) {
                scrollTrigger.kill(true);
                scrollTrigger = null;
            }

            ctx.revert();
        };
    }, []);

    return (
        <section
            className="relative z-[30] isolate overflow-visible bg-white"
        >
            <div
                ref={pinSectionRef}
                className="relative z-[30] h-[820px] w-full overflow-visible bg-white px-0 lg:h-[860px] lg:px-8"
            >
                <div ref={stageRef} className="absolute inset-0 z-[20]  overflow-visible">
                    <div
                        ref={stackRef}
                        className="relative mx-auto w-[420px] min-w-[420px] max-w-[420px] min-[640px]:w-[640px] min-[640px]:min-w-[640px] min-[640px]:max-w-[640px] lg:w-full lg:min-w-0 lg:max-w-[980px]"
                    >
                        <div
                            ref={titleRef}
                            className="-mt-6 flex w-[420px] min-w-[420px] max-w-[420px] flex-col items-center px-2 text-center min-[640px]:w-[640px] min-[640px]:min-w-[640px] min-[640px]:max-w-[640px] lg:w-full lg:min-w-0 lg:max-w-[980px]"
                            style={{
                                zIndex: ecosystemCards.length + 10,
                                transform: 'translate3d(0, 0, 0)',
                            }}
                        >
                            <p className="text-base font-normal uppercase tracking-[-0.035em] text-[#98A4B9] lg:text-lg">
                                The Orisuun Ecosystem
                            </p>

                            <h2 className="mt-2 whitespace-nowrap text-3xl text-[#080B12] lg:text-[clamp(42px,5vw,42px)]">
                                <span className="relative inline-block px-[0.16em] text-white">
                                    <svg
                                        width="96"
                                        height="37"
                                        viewBox="0 0 96 37"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="absolute inset-x-[-0.12em] top-[-0.1em] z-0 h-[1.18em] w-[calc(100%+0.20em)]"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M66.7124 0.710123C63.3414 0.533405 60.5053 0.345137 59.0415 0.178022C56.1499 -0.152103 49.2899 -0.0102883 43.7965 0.497401C39.5734 0.886249 32.6527 1.85826 26.3697 2.85833C24.6128 2.78894 22.8332 2.70209 21.0796 2.59792C5.41311 1.66758 3.40361 1.80669 2.61084 3.87641C1.78959 6.02174 1.78648 6.2043 2.57031 6.27009C2.78535 6.28811 3.00595 6.41795 3.19461 6.61659C2.84476 6.91198 2.64229 7.26482 2.48891 7.69022C2.45472 7.78512 2.422 7.87629 2.39074 7.96387C1.18307 7.37943 1.00881 7.70892 1.20372 10.0654C1.24739 10.5933 1.24364 11.2011 1.20076 11.8234C1.08328 12.0345 1.05031 12.41 1.07569 12.9966C0.95827 13.8089 0.781503 14.5743 0.564508 15.1408C-0.24473 17.2537 -0.222222 17.4339 0.881781 17.6832L0.933963 17.6948C0.834997 18.229 0.710564 18.7208 0.566247 19.1212C-0.219599 21.3009 -0.19514 21.4792 0.91109 21.6357C1.56595 21.7281 2.26612 21.7361 2.46701 21.6535C2.63363 21.5848 3.20138 22.6222 3.82229 24.0888C3.346 24.2757 3.50691 24.5654 4.18473 25.2678C4.25796 25.3437 4.32972 25.4248 4.39978 25.5103C4.72894 26.2815 5.07757 26.911 5.4455 27.3986C5.82691 28.4372 5.89528 29.3815 5.41344 29.4283C4.00601 29.5653 5.74389 32.1571 9.01967 34.8067C12.5839 37.6896 12.783 37.6917 30.1584 35.0418C33.8601 34.4773 37.6663 33.8235 41.1219 33.1718C43.0628 33.3843 45.4114 33.5642 47.8129 33.6846C49.6365 33.9268 51.4859 34.1365 53.2057 34.289C63.3476 35.1913 88.6905 35.6138 85.314 34.8244C82.4414 34.1527 83.9366 32.7579 88.4797 31.8716C90.8217 31.4146 92.8255 30.3794 92.9326 29.5711C93.0396 28.7628 93.7507 28.1538 94.5126 28.2177C95.5441 28.3043 95.9058 27.626 95.9283 25.5635C95.9368 24.7769 95.8773 24.1541 95.7225 23.64C95.9193 23.2023 96 22.526 96 21.5407C96 19.6759 95.6279 18.7624 94.5136 18.0985C95.0018 18.0596 95.1113 17.9152 94.8983 17.5421C95.0528 17.206 95.0316 16.5382 94.9104 15.3886C94.8691 14.9975 94.853 14.5563 94.8592 14.0935C95.0314 13.9964 95.0303 13.8442 94.8741 13.5948C94.9297 12.3802 95.1252 11.0914 95.4138 10.2098C96.1514 7.95697 96.1253 7.78106 95.0463 7.72944C94.4551 7.70126 93.827 7.74916 93.5825 7.83707C93.4161 7.32485 92.9623 6.60613 92.2787 5.77175C92.1197 5.42064 91.9557 5.03902 91.7926 4.63799C90.8696 2.36794 89.8071 1.26566 88.607 1.33302C88.3389 1.34808 87.9917 1.35832 87.5761 1.36411C85.1006 -0.258802 82.1054 -0.11868 67.8305 0.647974C67.4587 0.667943 67.0859 0.688673 66.7124 0.710123ZM8.17563 9.82396C8.11631 9.85416 8.05754 9.88458 7.99938 9.91526C7.85619 9.83136 7.71386 9.74362 7.57296 9.65223C7.77501 9.70507 7.97626 9.76248 8.17563 9.82396ZM4.40886 5.99691C4.72888 5.89423 5.10282 5.80225 5.54196 5.7192C4.733 5.59033 4.38514 5.64901 4.40886 5.99691Z"
                                            fill="#58A3FE"
                                        />
                                    </svg>

                                    <span className="relative z-10">Plug in</span>
                                </span>{' '}
                                to a global network
                            </h2>

                            <p className="mt-3 max-w-xl text-center text-base font-normal leading-[1.4] tracking-[-0.015em] text-[#5B657B] lg:text-lg">
                                Built entirely for your growth. Explore the four pillars of our ecosystem
                                designed to
                                <br className="hidden lg:block" /> connect Black-owned businesses with
                                capital, enterprise-grade expertise, and a dedicated community
                            </p>
                        </div>

                        {ecosystemCards.map((card, cardIndex) => (
                            <div
                                key={`${card.title}-${cardIndex}`}
                                ref={(el) => {
                                    if (el) {
                                        cardRefs.current[cardIndex] = el;
                                    }
                                }}
                                className="absolute left-0 top-0 h-[580px] w-[420px] min-w-[420px] max-w-[420px] overflow-hidden rounded-lg border-b border-[#6AB3E6] bg-[#143f91] px-4 ecosystem-gradient min-[640px]:w-[640px] min-[640px]:min-w-[640px] min-[640px]:max-w-[640px] lg:w-full lg:min-w-0 lg:max-w-[980px] lg:rounded-[16px]"
                                style={{
                                    zIndex: ecosystemCards.length - cardIndex,
                                    transform: `translate3d(0, ${INITIAL_CARD_Y + cardIndex * MOBILE_PEEK
                                        }px, 0)`,
                                }}
                            >
                                <CardHeader title={card.title} />
                                <CardArtwork index={cardIndex} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
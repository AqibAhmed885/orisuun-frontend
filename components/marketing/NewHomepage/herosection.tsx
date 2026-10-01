'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

const RoleSelectionModal = dynamic(() => import('./RoleSelectionModal'), {
    ssr: false,
});

type HeroButton = {
    label: string;
    href: string;
    variant?: 'primary' | 'secondary';
    openRoleModal?: boolean;
};

type HeroSlide = {
    title: string | JSX.Element;
    description: string;
    buttons: HeroButton[];
    bgimage?: string;
    bgimageMobile?: string;
};

type SlideDirection = 'forward' | 'backward';

const heroSlides: HeroSlide[] = [
    {
        title: (<span className="flex flex-col gap-1">
            <span>Connecting Business Owners and </span>
            <span>Growth-Minded Collaborators</span>
        </span>),
        description:
            'We connect Black-owned businesses with a vast network of investors, mentors, clients, and professionals eager to support their journey.',
        buttons: [
            { label: "I'm a Business Owner", href: '/signup?profile=black-owned-businesses', variant: 'primary' },
            { label: "I'm a Collaborator", href: '/signup', variant: 'secondary', openRoleModal: true },
        ],
        bgimage: '/homepage-new/bg-hero-1.optimized.webp',
        bgimageMobile: '/homepage-new/bgm_hero-1.optimized.webp',
    },
    {
        title: (<span className="flex flex-col gap-1">
            <span>We Fund One Black-Owned Business </span>
            <span>Every Week!</span>
        </span>),
        description:
            'We fund Black-owned businesses directly. One member wins a $1K cash giveaway to fuel their growth, every week.',
        buttons: [
            { label: 'Start Free Trial', href: '/signup', variant: 'primary' },
        ],
        bgimage: '/homepage-new/bg-hero-2.svg',
        bgimageMobile: '/homepage-new/bgm_hero-18.optimized.webp',
    },
    {
        title: 'Host Your Own Community',
        description:
            'Start dedicated chat and discussion rooms focused on the business topics you care about most.',
        buttons: [
            { label: 'Build Your Community', href: '/signup?profile=black-owned-businesses', variant: 'primary' },
        ],
        bgimage: '/homepage-new/bg-hero-3.svg',
        bgimageMobile: '/homepage-new/bgm_hero-17.optimized.webp',
    },
    {
        title: (
            <span className="flex flex-col gap-1">
                <span>Create Your Team.</span>
                <span>Boost Your Offerings with Bundles.</span>
            </span>
        ),
        description:
            'Band together with trusted peers to deliver comprehensive products without adding permanent overhead.',
        buttons: [
            { label: 'Form a Team', href: '/what-we-offer', variant: 'primary' },
        ],
        bgimage: '/homepage-new/bg-hero-4.svg',
        bgimageMobile: '/homepage-new/bgm_hero-14.optimized.webp',
    },

    {
        title: (
            <span className="flex flex-col gap-1">
                <span>Your Run Your Business.</span>
                <span>We&apos;ll Help the Right People Find It.</span>
            </span>
        ),
        description:
            'Orisuun connects Black-owned businesses to the people who mater - investors, mentors, clients, and supporters - all for $5/month',
        buttons: [
            { label: 'Start Free Trial!', href: '/signup', variant: 'primary' },
        ],
        bgimage: '/homepage-new/bg-hero-5.svg',
        bgimageMobile: '/homepage-new/bgm_hero-5.optimized.webp',
    },
    {
        title: (
            <span className="flex flex-col gap-1">
                <span>Business Development Opportunities.</span>
                <span>Matched Automatically.</span>
            </span>
        ),
        description:
            'We align your business goals with members who have the exact opportunities, skills, and connections you are seeking. ',
        buttons: [
            { label: 'Tell Us What You Need', href: '/signup', variant: 'primary' },
        ],
        bgimage: '/homepage-new/bg-hero-6.svg',
        bgimageMobile: '/homepage-new/bgm_hero-19.optimized.webp',
    },
    {
        title: (
            <span className="flex flex-col gap-1">
                <span>Book Elite Guidance Directly.</span>
                <span>Skip the Back and Forth.</span>
            </span>
        ),
        description:
            'No gatekeepers. No expensive firms. Seamlessly book and pay for dedicated sessions with top-tier investors, mentors, and pros on your own terms.',
        buttons: [
            { label: 'Book a Session Today', href: '/what-we-offer', variant: 'primary' },
        ],
        bgimage: '/homepage-new/bg-hero-7.svg',
        bgimageMobile: '/homepage-new/bgm_hero-4.optimized.webp',
    },
    {
        title: (
            <span className="flex flex-col gap-1">
                <span>Attract Customers With Discounts.</span>
            </span>
        ),
        description:
            'Share special perks with the entire network to turn Orisuun members into your newest customers.',
        buttons: [
            { label: 'Offer a Discount', href: '/what-we-offer', variant: 'primary' },
        ],
        bgimage: '/homepage-new/bg-hero-8.svg',
        bgimageMobile: '/homepage-new/bgm_hero-10.optimized.webp',
    },
    {
        title: (
            <span className="flex flex-col gap-1">
                <span>Partner Perks.</span>
                <span>Save on Products You Already Use.</span>
            </span>
        ),
        description:
            'Stop paying retail price. Access partner perks designed specifically to save your business serious cash.',
        buttons: [
            { label: 'Start Saving', href: '/signup', variant: 'primary' },
        ],
        bgimage: '/homepage-new/bg-hero-9.svg',
        bgimageMobile: '/homepage-new/bgm_hero-16.optimized.webp',
    },
    {
        title: 'Next-Gen Crowdfunding',
        description:
            'Combine community-backed rewards with corporate sponsorships to supercharge your next raise. ',
        buttons: [
            { label: 'Launch Your Campaign', href: '/signup', variant: 'primary' },
        ],
        bgimage: '/homepage-new/bg-hero-10.svg',
        bgimageMobile: '/homepage-new/bgm_hero-15.optimized.webp',
    },
];

const MOBILE_HIDDEN_SLIDE_INDEXES = new Set([0, 3, 4, 5]);
const MOBILE_SLIDE_INDEXES = heroSlides
    .map((_, index) => index)
    .filter((index) => !MOBILE_HIDDEN_SLIDE_INDEXES.has(index));

const SLIDE_DURATION = 10000;

function HeroBackground({
    src,
    className,
}: {
    src: string;
    className: string;
}) {
    return (
        <div
            aria-hidden="true"
            data-hero-background="true"
            className={className}
            style={{ backgroundImage: `url("${src}")` }}
        />
    );
}

function HeroCta({
    button,
    onOpenModal,
}: {
    button: HeroButton;
    onOpenModal?: () => void;
}) {
    const isPrimary = button.variant !== 'secondary';

    const cls = `inline-flex h-10 w-full items-center tracking-wide justify-center rounded-md border px-5 text-sm font-medium transition sm:w-auto sm:px-6 ${isPrimary
        ? 'border-[#0d1f45] bg-[#0d1f45] text-white hover:bg-[#13284f]'
        : 'border-[#0d1f45] text-[#0d1f45] hover:bg-[#f2f6fb]'
        }`;

    if (button.openRoleModal) {
        return (
            <button type="button" className={cls} onClick={onOpenModal}>
                {button.label}
            </button>
        );
    }

    return (
        <Link
            href={button.href}
            prefetch={
                button.href.startsWith('/what-we-offer') ||
                button.href.startsWith('/signup')
                    ? false
                    : undefined
            }
            className={cls}
        >
            {button.label}
        </Link>
    );
}

const HeroSection = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const [previousSlide, setPreviousSlide] = useState<number | null>(null);
    const [slideDirection, setSlideDirection] = useState<SlideDirection>('forward');
    const [showRoleModal, setShowRoleModal] = useState(false);

    const slide = heroSlides[activeSlide];
    const mobileSlide =
        heroSlides[
            MOBILE_HIDDEN_SLIDE_INDEXES.has(activeSlide)
                ? MOBILE_SLIDE_INDEXES[0]
                : activeSlide
        ];
    const previousMobileSlide =
        previousSlide !== null && !MOBILE_HIDDEN_SLIDE_INDEXES.has(previousSlide)
            ? heroSlides[previousSlide]
            : null;

    const goToNext = useCallback(() => {
        setSlideDirection('forward');
        setActiveSlide((current) => {
            setPreviousSlide(current);

            if (window.matchMedia('(max-width: 1023px)').matches) {
                const mobilePosition = MOBILE_SLIDE_INDEXES.indexOf(current);
                return MOBILE_SLIDE_INDEXES[
                    (mobilePosition + 1) % MOBILE_SLIDE_INDEXES.length
                ];
            }

            return (current + 1) % heroSlides.length;
        });
    }, []);

    const goToPrevious = useCallback(() => {
        setSlideDirection('backward');
        setActiveSlide((current) => {
            setPreviousSlide(current);

            if (window.matchMedia('(max-width: 1023px)').matches) {
                const mobilePosition = MOBILE_SLIDE_INDEXES.indexOf(current);
                if (mobilePosition === -1) {
                    return MOBILE_SLIDE_INDEXES[MOBILE_SLIDE_INDEXES.length - 1];
                }
                return MOBILE_SLIDE_INDEXES[
                    (mobilePosition - 1 + MOBILE_SLIDE_INDEXES.length) %
                        MOBILE_SLIDE_INDEXES.length
                ];
            }

            return (current - 1 + heroSlides.length) % heroSlides.length;
        });
    }, []);

    useEffect(() => {
        const timer = window.setTimeout(goToNext, SLIDE_DURATION);

        return () => window.clearTimeout(timer);
    }, [activeSlide, goToNext]);

    return (
        <section className="pt-1.5">
            {/* Desktop layout: background image approach (lg and above) */}
            <div className="relative hidden w-full overflow-hidden rounded-2xl md:aspect-[1260/820] lg:block xl:h-auto xl:min-h-0">
                {previousSlide !== null ? (
                    <HeroBackground
                        src={heroSlides[previousSlide].bgimage ?? ''}
                        className="absolute inset-0 size-full bg-cover bg-left"
                    />
                ) : null}
                <HeroBackground
                    key={slide.bgimage ?? activeSlide}
                    src={slide.bgimage ?? ''}
                    className={`${previousSlide !== null ? 'hero-bg-crossfade' : ''} absolute inset-0 size-full bg-cover bg-left`}
                />

                <div className="absolute inset-x-1 bottom-1 z-20 flex min-h-[34.2%] max-w-[984px] items-center rounded-[10px] border border-[#24364c]/40 bg-white/80 px-10 py-2 xl:py-8 shadow-[0_14px_40px_rgba(4,12,28,0.12)] backdrop-blur-sm lg:max-w-[64.4%] xl:max-w-[64.4%] 2xl:max-w-[64.4%]">
                    <p className="absolute -top-3 rounded-[8px] bg-[#58A3FE] px-3 py-1 text-base font-semibold text-white">
                        Largest Black-Owned Business Network
                    </p>

                    <div className="grid w-full items-end gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-8">
                        <div
                            key={activeSlide}
                            className={
                                slideDirection === 'forward'
                                    ? 'hero-slide-forward'
                                    : 'hero-slide-backward'
                            }
                        >
                            <h1 className="text-2xl font-medium tracking-tight text-[#000716] sm:text-3xl md:text-[38px] lg:text-[32px] xl:text-5xl">
                                {slide.title}
                            </h1>

                            <p className="sm:mt-0 lg:mt-3 max-w-[620px] text-sm leading-[1.45] text-[#202a3f] sm:text-base md:text-lg lg:text-base xl:text-xl">
                                {slide.description}
                            </p>

                            <div className="mt-4 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap md:gap-4">
                                {slide.buttons.map((button) => (
                                    <HeroCta
                                        key={`${activeSlide}-${button.label}`}
                                        button={button}
                                        onOpenModal={() => setShowRoleModal(true)}
                                    />
                                ))}
                            </div>

                        </div>

                        <div className="z-10 ml-auto flex w-fit flex-row-reverse items-end justify-end gap-3 justify-self-end lg:absolute lg:right-8 lg:bottom-8 lg:ml-0 lg:w-auto lg:flex-col lg:gap-4">
                            <button
                                type="button"
                                onClick={goToNext}
                                aria-label="Next hero slide"
                                className="group relative grid size-10 shrink-0 place-items-center rounded-full text-[#0d1f45] transition sm:size-11 lg:size-10"
                            >
                                <svg
                                    key={`progress-${activeSlide}`}
                                    className="absolute inset-0 size-full -rotate-90"
                                    viewBox="0 0 64 64"
                                    aria-hidden="true"
                                >
                                    <circle
                                        cx="32"
                                        cy="32"
                                        r="30"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeOpacity="0.18"
                                        strokeWidth="1.5"
                                    />
                                    <circle
                                        className="hero-progress-ring"
                                        cx="32"
                                        cy="32"
                                        r="30"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeWidth="2.5"
                                    />
                                </svg>

                                <svg
                                    className="relative z-10"
                                    width="23"
                                    height="23"
                                    viewBox="0 0 23 23"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M15.762 11.164L15.9141 11.3438L15.7606 11.5225L11.9813 15.9206L11.5622 15.5605L14.9507 11.6172L6.70988 11.5966L6.71128 11.044L14.9543 11.0647L11.5829 7.07848L12.0048 6.72168L15.762 11.164Z"
                                        fill="#0A1733"
                                    />
                                </svg>
                            </button>

                            <button
                                type="button"
                                onClick={goToPrevious}
                                aria-label="Previous hero slide"
                                className="grid size-10 shrink-0 rotate-180 place-items-center rounded-full border border-[#dce3ec] text-[#0d1f45] transition hover:border-[#0d1f45] sm:size-11 lg:size-10"
                            >
                                <svg
                                    width="23"
                                    height="23"
                                    viewBox="0 0 23 23"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M15.762 11.164L15.9141 11.3438L15.7606 11.5225L11.9813 15.9206L11.5622 15.5605L14.9507 11.6172L6.70988 11.5966L6.71128 11.044L14.9543 11.0647L11.5829 7.07848L12.0048 6.72168L15.762 11.164Z"
                                        fill="#0A1733"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile layout: stacked image + text card (below lg) */}
            <div
                className="relative block aspect-[520/780] mt-14 w-full overflow-hidden rounded-b-2xl backdrop-blur-3xl lg:hidden"
            >
                {previousMobileSlide ? (
                    <HeroBackground
                        src={previousMobileSlide.bgimageMobile ?? previousMobileSlide.bgimage ?? ''}
                        className="absolute inset-0 size-full bg-cover bg-bottom"
                    />
                ) : null}
                <HeroBackground
                    key={mobileSlide.bgimageMobile ?? mobileSlide.bgimage ?? activeSlide}
                    src={mobileSlide.bgimageMobile ?? mobileSlide.bgimage ?? ''}
                    className={`${previousSlide !== null ? 'hero-bg-crossfade' : ''} absolute inset-0 size-full bg-cover bg-bottom`}
                />
                {/* Background Overlay */}
                {/* <div className="absolute inset-0 bg-black/20" /> */}

                {/* Content */}
                <div className="absolute inset-x-1 bottom-2  z-20">
                    <div className="rounded-[10px] flex bg-white/80  px-4 py-5  sm:px-6 sm:py-6">
                        {/* Badge */}
                        <p className="absolute -top-3 left-2 tracking-wide rounded-[8px] bg-[#58A3FE] px-3 py-1 text-sm md:text-base font-semibold text-white">
                            Largest Black-Owned Business Network
                        </p>

                        <div className="grid w-full gap-4 md:gap-6 items-center justify-center">
                            {/* Animated Content */}
                            <div
                                key={`mobile-${activeSlide}`}
                                className={
                                    slideDirection === "forward"
                                        ? "hero-slide-forward"
                                        : "hero-slide-backward"
                                }
                            >
                                <h1 className="mt-4 text-[20px] font-medium leading-[0.9]  tracking-wide text-nowrap text-[#000716] sm:text-3xl">
                                    {mobileSlide.title}
                                </h1>

                                <p className="md:mt-3 mt-2 text-sm leading-[1.2] tracking-wider text-[#243047] sm:text-base">
                                    {mobileSlide.description}
                                </p>

                                <div className="md:mt-5 mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                                    {mobileSlide.buttons.map((button) => (
                                        <HeroCta
                                            key={`mobile-${activeSlide}-${button.label}`}
                                            button={button}
                                            onOpenModal={() => setShowRoleModal(true)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="flex items-center justify-end gap-3 mt-2">
                                {/* Previous */}
                                <button
                                    type="button"
                                    onClick={goToPrevious}
                                    aria-label="Previous hero slide"
                                    className="grid h-10 w-10 rotate-180 place-items-center rounded-full border border-[#CCD0D3] text-[#0d1f45] transition hover:border-[#0d1f45] sm:h-11 sm:w-11"
                                >
                                    <svg
                                        width="23"
                                        height="23"
                                        viewBox="0 0 23 23"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M15.762 11.164L15.9141 11.3438L15.7606 11.5225L11.9813 15.9206L11.5622 15.5605L14.9507 11.6172L6.70988 11.5966L6.71128 11.044L14.9543 11.0647L11.5829 7.07848L12.0048 6.72168L15.762 11.164Z"
                                            fill="#0A1733"
                                        />
                                    </svg>
                                </button>

                                {/* Next + Progress Ring */}
                                <button
                                    type="button"
                                    onClick={goToNext}
                                    aria-label="Next hero slide"
                                    className="group relative grid h-10 w-10 place-items-center rounded-full  text-[#0d1f45] transition sm:h-11 sm:w-11"
                                >
                                    <svg
                                        key={`mobile-progress-${activeSlide}`}
                                        className="absolute inset-0 h-full w-full -rotate-90"
                                        viewBox="0 0 64 64"
                                        aria-hidden="true"
                                    >
                                        <circle
                                            cx="32"
                                            cy="32"
                                            r="30"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeOpacity="0.18"
                                            strokeWidth="1.5"
                                        />
                                        <circle
                                            className="hero-progress-ring"
                                            cx="32"
                                            cy="32"
                                            r="30"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeWidth="2.5"
                                        />
                                    </svg>

                                    <svg
                                        className="relative z-10"
                                        width="23"
                                        height="23"
                                        viewBox="0 0 23 23"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M15.762 11.164L15.9141 11.3438L15.7606 11.5225L11.9813 15.9206L11.5622 15.5605L14.9507 11.6172L6.70988 11.5966L6.71128 11.044L14.9543 11.0647L11.5829 7.07848L12.0048 6.72168L15.762 11.164Z"
                                            fill="#0A1733"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showRoleModal ? (
                <RoleSelectionModal
                    show={showRoleModal}
                    onClose={() => setShowRoleModal(false)}
                />
            ) : null}

            <style jsx>{`
                .hero-bg-crossfade {
                    animation: hero-bg-crossfade 700ms ease-in-out;
                }

                .hero-slide-forward {
                    animation: hero-slide-forward 700ms cubic-bezier(0.22, 1, 0.36, 1);
                }

                .hero-slide-backward {
                    animation: hero-slide-backward 700ms cubic-bezier(0.22, 1, 0.36, 1);
                }

                @keyframes hero-slide-forward {
                    from {
                        opacity: 0;
                        transform: translateX(34px);
                    }

                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes hero-slide-backward {
                    from {
                        opacity: 0;
                        transform: translateX(-34px);
                    }

                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes hero-bg-crossfade {
                    from {
                        opacity: 0;
                    }

                    to {
                        opacity: 1;
                    }
                }

                .hero-progress-ring {
                    stroke-dasharray: 188.5;
                    stroke-dashoffset: 188.5;
                    animation: hero-progress ${SLIDE_DURATION}ms linear forwards;
                }

                @media (min-width: 1024px) and (prefers-reduced-motion: reduce) {
                    .hero-bg-crossfade,
                    .hero-slide-forward,
                    .hero-slide-backward,
                    .hero-progress-ring {
                        animation: none;
                    }
                }

                @keyframes hero-progress {
                    from {
                        stroke-dashoffset: 188.5;
                    }

                    to {
                        stroke-dashoffset: 0;
                    }
                }
            `}</style>
        </section>
    );
};

export default HeroSection;

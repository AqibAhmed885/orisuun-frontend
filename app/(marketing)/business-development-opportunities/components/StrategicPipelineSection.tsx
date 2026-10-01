"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function StrategicPipelineSection({ headingWords, description }: { headingWords: string[]; description: string }) {
    const sectionRef = useRef<HTMLElement | null>(null);
    const pinRef = useRef<HTMLDivElement | null>(null);
    const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const paragraphRef = useRef<HTMLParagraphElement | null>(null);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const section = sectionRef.current;
        const pin = pinRef.current;
        const paragraph = paragraphRef.current;
        const words = wordRefs.current.filter(Boolean) as HTMLSpanElement[];

        if (!section || !pin || !words.length) return;

        const ctx = gsap.context(() => {
            const prefersReducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            if (prefersReducedMotion) {
                gsap.set(words, { color: "#00365c" });
                gsap.set(paragraph, { opacity: 1, y: 0 });
                return;
            }

            gsap.set(words, {
                color: "#c7cbd0",
                willChange: "color, transform",
            });

            gsap.set(words.slice(0, 2), {
                color: "#00365c",
            });

            gsap.set(paragraph, {
                opacity: 0.65,
                y: 24,
                willChange: "transform, opacity",
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "+=180%",
                    pin,
                    scrub: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                },
            });

            tl.to(
                paragraph,
                {
                    opacity: 1,
                    y: 0,
                    ease: "none",
                    duration: 0.25,
                },
                0
            );

            tl.to(
                words,
                {
                    color: "#00365c",
                    ease: "none",
                    stagger: {
                        each: 0.12,
                        from: "start",
                    },
                    duration: 0.5,
                },
                0
            );

            tl.to(
                words,
                {
                    scale: 1.01,
                    ease: "none",
                    stagger: {
                        each: 0.12,
                        from: "start",
                    },
                    duration: 0.15,
                },
                0
            );

            tl.to(
                words,
                {
                    scale: 1,
                    ease: "none",
                    stagger: {
                        each: 0.12,
                        from: "start",
                    },
                    duration: 0.15,
                },
                0.15
            );
        }, section);

        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-[280vh] w-full bg-white"
        >
            <div
                ref={pinRef}
                className="relative flex h-screen w-full items-center overflow-hidden bg-white"
            >
                <div className="mx-auto w-full flex flex-col justify-between max-w-[1440px] px-6 sm:px-10 lg:gap-20 lg:px-20">
                    <div className="flex items-center">
                        <h2 className="max-w-[760px] text-[24px] font-normal leading-[1.15] t text-[#c7cbd0] sm:text-[36px] lg:text-[56px] tracking-wider xl:text-[65px]">
                            {headingWords.map((word, index) => (
                                <span
                                    key={`${word}-${index}`}
                                    ref={(el) => {
                                        wordRefs.current[index] = el;
                                    }}
                                    className="inline-block pr-[0.18em]"
                                >
                                    {word}
                                </span>
                            ))}
                        </h2>
                    </div>

                    <div className="flex items-end justify-end">
                        <p
                            ref={paragraphRef}
                            className="max-w-[740px] text-sm font-normal   text-[#53617a] sm:text-base tracking-wider lg:text-xl"
                        >
                            {description}
                            
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
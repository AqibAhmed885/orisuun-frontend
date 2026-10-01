"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const textItems = [
    {
        before: "",
        highlight: "Meet people building,",
        after: " not broadcasting.",
    },
    {
        before: "Get advice from ",
        highlight: "experience,",
        after: " not ego.",
    },
    {
        before: "Find the ",
        highlight: "voices",
        after: " your business actually needs.",
    },
];

export default function ScrollHighlightSection() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const textPinRef = useRef<HTMLDivElement | null>(null);
    const headingRefs = useRef<Array<HTMLHeadingElement | null>>([]);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const section = sectionRef.current;
        const textPin = textPinRef.current;

        if (!section || !textPin) return;

        const ctx = gsap.context(() => {
            const headings = headingRefs.current.filter(
                Boolean
            ) as HTMLHeadingElement[];

            if (!headings.length) return;

            const getGap = () => {
                if (window.innerWidth < 640) return window.innerHeight * 0.3;
                if (window.innerWidth < 1024) return window.innerHeight * 0.35;
                return window.innerHeight * 0.4;
            };

            const renderTextState = (progress: number) => {
                const maxIndex = headings.length - 1;
                const activePosition = progress * maxIndex;
                const gap = getGap();

                headings.forEach((heading, index) => {
                    const distance = index - activePosition;
                    const absDistance = Math.abs(distance);

                    const activeAmount = gsap.utils.clamp(
                        0,
                        1,
                        1 - absDistance / 0.58
                    );

                    const brush =
                        heading.querySelector<SVGSVGElement>(".highlight-brush");

                    gsap.set(heading, {
                        y: distance * gap,
                        xPercent: -50,
                        yPercent: -50,
                        scale: gsap.utils.interpolate(0.84, 1.08, activeAmount),
                        opacity: gsap.utils.interpolate(0.26, 1, activeAmount),
                        color: gsap.utils.interpolate("#a7a9ba", "#05060a", activeAmount),
                        zIndex: Math.round(activeAmount * 10),
                        transformOrigin: "center center",
                        force3D: true,
                    });

                    if (brush) {
                        gsap.set(brush, {
                            opacity: activeAmount,
                            scaleX: gsap.utils.interpolate(0.7, 1, activeAmount),
                            scaleY: gsap.utils.interpolate(0.74, 1, activeAmount),
                            transformOrigin: "center center",
                            force3D: true,
                        });
                    }
                });
            };

            gsap.set(headings, {
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "100%",
                willChange: "transform, opacity, color",
            });

            headings.forEach((heading) => {
                const brush = heading.querySelector<SVGSVGElement>(".highlight-brush");

                if (brush) {
                    gsap.set(brush, {
                        opacity: 0,
                        scaleX: 0.7,
                        scaleY: 0.74,
                    });
                }
            });

            renderTextState(0);

            const pinTrigger = ScrollTrigger.create({
                trigger: section,
                start: "top top",
                end: "bottom bottom",
                pin: textPin,
                pinSpacing: false,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            });

            const animationTrigger = ScrollTrigger.create({
                trigger: section,
                start: "top top",
                end: "bottom bottom",

                // Directly linked with scroll speed. No delayed lag.
                scrub: true,

                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    renderTextState(self.progress);
                },
                onRefresh: (self) => {
                    renderTextState(self.progress);
                },
            });

            const onResize = () => {
                ScrollTrigger.refresh();
            };

            window.addEventListener("resize", onResize);

            return () => {
                window.removeEventListener("resize", onResize);
                pinTrigger.kill();
                animationTrigger.kill();
            };
        }, section);

        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-[240vh] w-full overflow-hidden bg-white"
        >
            <div className="absolute left-1/2 top-4 h-[calc(100%-16px)] w-full -translate-x-1/2 overflow-hidden rounded-t-[310px] bg-[#eff1f8]" />

            <div
                ref={textPinRef}
                className="pointer-events-none relative z-10 h-screen w-full overflow-hidden px-4"
            >
                <div className="relative h-full w-full">
                    {textItems.map((item, index) => (
                        <h2
                            key={index}
                            ref={(el) => {
                                headingRefs.current[index] = el;
                            }}
                            className="mx-auto max-w-[1440px] text-center text-[clamp(34px,4.7vw,42px)] font-normal"
                        >
                            <span className="inline-block">
                                {item.before}

                                <span className="relative isolate inline-flex px-[0.04em]">
                                    {index === 0 && (
                                        <svg
                                            width="423"
                                            height="54"
                                            viewBox="0 0 423 54"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="highlight-brush absolute bottom-[0.04em] left-[-0.16em] right-[-0.16em] top-[0.08em] z-0 h-full size-[100%]"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M293.952 1.0364C279.098 0.778483 266.602 0.503713 260.151 0.259816C247.41 -0.221988 217.183 -0.0150153 192.978 0.725937C174.37 1.29344 143.876 2.71206 116.192 4.17161C108.45 4.07035 100.609 3.94358 92.8818 3.79157C23.8515 2.43377 14.9972 2.63679 11.504 5.65747C7.88538 8.78849 7.87167 9.05492 11.3254 9.15094C12.273 9.17724 13.245 9.36674 14.0762 9.65664C12.5347 10.0877 11.6426 10.6027 10.9668 11.2236C10.8161 11.3621 10.6719 11.4951 10.5342 11.6229C5.21291 10.77 4.44505 11.2509 5.30389 14.6901C5.49632 15.4605 5.4798 16.3476 5.29085 17.2557C4.77321 17.5639 4.62794 18.1119 4.73975 18.9681C4.22238 20.1536 3.4435 21.2706 2.48737 22.0974C-1.07834 25.181 -0.979166 25.4441 3.88535 25.8079L4.11528 25.8248C3.6792 26.6044 3.13092 27.3223 2.49503 27.9065C-0.967609 31.0878 -0.859835 31.348 4.01449 31.5764C6.89995 31.7113 9.9851 31.723 10.8703 31.6024C11.6044 31.5021 14.1061 33.0162 16.842 35.1566C14.7433 35.4294 15.4523 35.8521 18.439 36.8774C18.7616 36.9882 19.0778 37.1065 19.3865 37.2313C20.8369 38.3568 22.373 39.2755 23.9942 39.9872C25.6748 41.5029 25.9761 42.8811 23.853 42.9495C17.6515 43.1493 25.309 46.932 39.7429 50.799C55.4478 55.0064 56.3252 55.0095 132.886 51.1421C149.196 50.3183 165.967 49.364 181.193 48.4128C189.746 48.723 200.094 48.9856 210.676 49.1613C218.711 49.5148 226.86 49.8209 234.438 50.0434C279.125 51.3602 390.793 51.9769 375.915 50.8248C363.257 49.8445 369.846 47.8089 389.864 46.5153C400.183 45.8484 409.012 44.3375 409.484 43.1578C409.956 41.9781 413.089 41.0893 416.446 41.1826C420.991 41.309 422.585 40.319 422.684 37.3089C422.722 36.1609 422.46 35.2519 421.777 34.5016C422.644 33.8628 423 32.8757 423 31.4378C423 28.7162 421.36 27.3829 416.451 26.4141C418.602 26.3573 419.084 26.1465 418.146 25.602C418.826 25.1114 418.733 24.1368 418.199 22.459C418.017 21.8882 417.946 21.2443 417.973 20.569C418.732 20.4271 418.727 20.2051 418.039 19.8411C418.284 18.0684 419.145 16.1875 420.417 14.9007C423.667 11.6129 423.552 11.3561 418.798 11.2808C416.193 11.2397 413.425 11.3096 412.348 11.4379C411.615 10.6903 409.615 9.64139 406.603 8.42363C405.902 7.9112 405.18 7.35425 404.461 6.76896C400.394 3.45591 395.713 1.84718 390.425 1.94548C389.243 1.96746 387.713 1.98241 385.882 1.99087C374.975 -0.377712 361.777 -0.173209 298.878 0.945691C297.24 0.974835 295.597 1.00509 293.952 1.0364ZM36.0239 14.3377C35.7625 14.3818 35.5035 14.4261 35.2473 14.4709C34.6163 14.3485 33.9892 14.2204 33.3683 14.087C34.2586 14.1642 35.1454 14.2479 36.0239 14.3377ZM19.4266 8.75224C20.8366 8.60239 22.4843 8.46815 24.4193 8.34694C20.8548 8.15886 19.322 8.24451 19.4266 8.75224Z"
                                                fill="#BAD9FF"
                                            />
                                        </svg>
                                    )}

                                    {index === 1 && (
                                        <svg
                                            width="246"
                                            height="54"
                                            viewBox="0 0 246 54"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="highlight-brush absolute bottom-[0.04em] left-[-0.16em] right-[-0.16em] top-[0.08em] z-0 h-full size-[100%]"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M170.951 1.0364C162.312 0.778483 155.045 0.503713 151.294 0.259816C143.884 -0.221988 126.305 -0.0150153 112.228 0.725937C101.407 1.29344 83.6724 2.71206 67.5724 4.17161C63.0703 4.07035 58.5101 3.94358 54.0164 3.79157C13.8711 2.43377 8.72176 2.63679 6.69029 5.65747C4.58582 8.78849 4.57785 9.05492 6.58642 9.15094C7.13747 9.17724 7.70274 9.36674 8.18618 9.65664C7.28971 10.0877 6.77086 10.6027 6.37784 11.2236C6.29023 11.3621 6.20637 11.4951 6.12627 11.6229C3.03162 10.77 2.58506 11.2509 3.08453 14.6901C3.19644 15.4605 3.18683 16.3476 3.07695 17.2557C2.77591 17.5639 2.69143 18.1119 2.75645 18.9681C2.45557 20.1536 2.0026 21.2706 1.44655 22.0974C-0.62712 25.181 -0.569444 25.4441 2.25956 25.8079L2.39328 25.8248C2.13968 26.6044 1.82082 27.3223 1.45101 27.9065C-0.562723 31.0878 -0.500046 31.348 2.33467 31.5764C4.01274 31.7113 5.80694 31.723 6.32172 31.6024C6.74867 31.5021 8.20354 33.0162 9.79462 35.1566C8.57413 35.4294 8.98646 35.8521 10.7234 36.8774C10.911 36.9882 11.0949 37.1065 11.2744 37.2313C12.1179 38.3568 13.0113 39.2755 13.9541 39.9872C14.9314 41.5029 15.1067 42.8811 13.8719 42.9495C10.2654 43.1493 14.7187 46.932 23.1129 50.799C32.2462 55.0064 32.7565 55.0095 77.281 51.1421C86.7665 50.3183 96.5198 49.364 105.375 48.4128C110.349 48.723 116.367 48.9856 122.521 49.1613C127.194 49.5148 131.933 49.8209 136.34 50.0434C162.328 51.3602 227.27 51.9769 218.617 50.8248C211.256 49.8445 215.088 47.8089 226.729 46.5153C232.731 45.8484 237.865 44.3375 238.14 43.1578C238.414 41.9781 240.236 41.0893 242.189 41.1826C244.832 41.309 245.759 40.319 245.816 37.3089C245.838 36.1609 245.686 35.2519 245.289 34.5016C245.793 33.8628 246 32.8757 246 31.4378C246 28.7162 245.046 27.3829 242.191 26.4141C243.442 26.3573 243.723 26.1465 243.177 25.602C243.573 25.1114 243.518 24.1368 243.208 22.459C243.102 21.8882 243.061 21.2443 243.077 20.569C243.518 20.4271 243.515 20.2051 243.115 19.8411C243.257 18.0684 243.758 16.1875 244.498 14.9007C246.388 11.6129 246.321 11.3561 243.556 11.2808C242.041 11.2397 240.432 11.3096 239.805 11.4379C239.379 10.6903 238.216 9.64139 236.464 8.42363C236.057 7.9112 235.636 7.35425 235.219 6.76896C232.853 3.45591 230.131 1.84718 227.055 1.94548C226.368 1.96746 225.479 1.98241 224.414 1.99087C218.07 -0.377712 210.395 -0.173209 173.816 0.945691C172.863 0.974835 171.907 1.00509 170.951 1.0364ZM20.9501 14.3377C20.798 14.3818 20.6474 14.4261 20.4984 14.4709C20.1315 14.3485 19.7668 14.2204 19.4057 14.087C19.9235 14.1642 20.4392 14.2479 20.9501 14.3377ZM11.2977 8.75224C12.1178 8.60239 13.076 8.46815 14.2013 8.34694C12.1283 8.15886 11.2369 8.24451 11.2977 8.75224Z"
                                                fill="#BAD9FF"
                                            />
                                        </svg>
                                    )}

                                    <span className="relative">{item.highlight}</span>
                                </span>

                                {item.after}
                            </span>
                        </h2>
                    ))}
                </div>
            </div>

            <style jsx global>{`
        .sticky-highlight-bg {
          border-radius: 52% 52% 0 0 / 18% 18% 0 0;
        }

        .highlight-brush {
          will-change: transform, opacity;
        }

        @media (max-width: 1024px) {
          .sticky-highlight-bg {
            border-radius: 50% 50% 0 0 / 14% 14% 0 0;
          }
        }

        @media (max-width: 640px) {
          .sticky-highlight-bg {
            width: 100%;
            top: 0;
            height: 100%;
            border-radius: 48% 48% 0 0 / 9% 9% 0 0;
          }
        }
      `}</style>
        </section>
    );
}
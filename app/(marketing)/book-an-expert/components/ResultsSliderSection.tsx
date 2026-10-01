"use client";

import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useEffect, useRef } from "react";

const testimonials = [
  {
    quote:
      "I was struggling with my supply chain for 6 months. One 30-minute session with an Operations SME saved me $12k in shipping costs.",
    name: "Marcus",
    role: "CEO and Founder Big Dreamers",
  },
  {
    quote:
      "Our pitch deck was close, but not investor-ready. A single audit helped us tighten the story and walk into meetings with confidence.",
    name: "Janelle",
    role: "Founder, Bright Ledger",
  },
  {
    quote:
      "I needed a legal gut check before signing a vendor agreement. The expert flagged two clauses I would have completely missed.",
    name: "Andre",
    role: "Owner, Northline Foods",
  },
  {
    quote:
      "The session turned a vague growth problem into three practical moves we could make the same week.",
    name: "Maya",
    role: "COO, Kinfolk Studio",
  },
];

function TestimonialCard({ quote, name, role }: (typeof testimonials)[number]) {
  return (
    <article className="flex h-[350px] w-full max-w-[560px] flex-col justify-between rounded-[34px] bg-[#edf3fb] px-7 pt-10 pb-4 sm:px-10 sm:pb-6 lg:h-[340px] lg:px-16 lg:pb-10 lg:pt-14">
      <div>
        <svg
          width="87"
          height="70"
          viewBox="0 0 87 70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.17">
            <path
              d="M38.4219 69.2803H-0.00265121V30.8171L15.4058 0.000274658H34.5601L19.2289 30.8171H38.4219V69.2803Z"
              fill="#2357C6"
            />
            <path
              d="M86.0938 69.28H47.6692V30.8169L63.0777 3.05176e-05H82.232L66.9008 30.8169H86.0938V69.28Z"
              fill="#2357C6"
            />
          </g>
        </svg>

        <p className="mt-4 max-w-[680px] text-base leading-[1.45] text-[#68748a] sm:text-xl">
          {quote}
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-1 sm:mt-6 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div>
          <h3 className="text-xl font-bold text-[#08286c]">{name}</h3>
          <p className="mt-2 text-base text-[#08286c] sm:text-lg">{role}</p>
        </div>

        <div className="flex gap-2 text-[#2357C6]" aria-label="5 star rating">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className="h-6 w-6 fill-current"
              strokeWidth={1}
            />
          ))}
        </div>
      </div>
    </article>
  );
}

export default function ResultsSliderSection() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const card = slider.querySelector<HTMLElement>("[data-testimonial-card]");
    const cardWidth = card?.offsetWidth ?? 560;
    const gap = 32;
    const scrollAmount = cardWidth + gap;

    const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
    const nextScrollLeft = slider.scrollLeft + direction * scrollAmount;

    if (direction === 1 && nextScrollLeft >= maxScrollLeft - 10) {
      slider.scrollTo({
        left: 0,
        behavior: "smooth",
      });
      return;
    }

    if (direction === -1 && nextScrollLeft <= 0) {
      slider.scrollTo({
        left: maxScrollLeft,
        behavior: "smooth",
      });
      return;
    }

    slider.scrollBy({
      left: direction * scrollAmount,
      behavior: "smooth",
    });
  };

  const startAutoSlide = () => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);

    autoSlideRef.current = setInterval(() => {
      scrollByCard(1);
    }, 3500);
  };

  const stopAutoSlide = () => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
      autoSlideRef.current = null;
    }
  };

  useEffect(() => {
    startAutoSlide();

    return () => {
      stopAutoSlide();
    };
  }, []);

  return (
    <section className="mt-10 overflow-hidden bg-black px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[1160px]">
        <h2 className="text-center text-3xl font-medium leading-[1.08] tracking-normal text-[#08286c] sm:text-5xl">
          Results, Not Just Advice.
        </h2>

        <div
          ref={sliderRef}
          onMouseEnter={stopAutoSlide}
          onMouseLeave={startAutoSlide}
          className="mt-14 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex gap-[24px]">
            {testimonials.map((testimonial) => (
              <div
                key={`${testimonial.name}-${testimonial.role}`}
                data-testimonial-card
                className="w-[min(78vw,560px)] shrink-0"
              >
                <TestimonialCard {...testimonial} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Previous testimonial"
            className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D3E3F7] bg-white text-black transition hover:bg-[#F2F7FC] sm:h-16 sm:w-16"
          >
            <ChevronLeft aria-hidden="true" size={24} strokeWidth={2} />
          </button>

          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Next testimonial"
            className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D3E3F7] bg-white text-black transition hover:bg-[#F2F7FC] sm:h-16 sm:w-16"
          >
            <ChevronRight aria-hidden="true" size={24} strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  );
}
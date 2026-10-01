'use client';

import { Button } from "@/components/marketing";
import Image from "next/image";
import { useState } from "react";
import seedrandom from "seedrandom";

export const HeroSection = ({
  heroItems =[], images =[], href
 }) => {

  const safeItems = Array.isArray(heroItems) ? heroItems : [];
  const safeImages = Array.isArray(images) ? images : [];
  const total = Math.min(safeItems.length, safeImages.length);
  const initialSeed =  Date.now().toString();

  const getConsistentSeed = () => {
    return initialSeed || `${Date.now()}`;
  };

  const rng = seedrandom(getConsistentSeed());

  const [selectedIndex] = useState(() =>
    total > 0 ? Math.floor(rng() * total) : 0
  );

  const selectedHero = safeItems[selectedIndex];
  const selectedImage = safeImages[selectedIndex];

  if (!selectedHero || !selectedImage) return null;

  return (
    <section className="min-h-[80vh] bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 py-8 md:py-12 lg:py-16">

        <div className="flex flex-col items-center gap-8">

          {/* Text */}
          <div className="w-full max-w-4xl text-center">

            <h1 className="text-4xl sm:text-5xl lg:text-[3.3rem] tracking-wide font-[450] text-blue-strong leading-tight mb-4">
              {selectedHero.heading}
            </h1>

            <p className="text-lg leading-6 font-medium text-[#5B657B] mb-6 px-4">
              {selectedHero.subheading}
            </p>

            <Button
              variant="primary"
              onClick={() => {
                window.location.href = href || "/signup";
              }}
              className="inline-block bg-[#2357C6] text-white px-6 py-2 font-semibold rounded-full hover:bg-[#1e4bb2] transition-colors"
            >
              Claim your profile now!
            </Button>

          </div>

          {/* Image */}
          <div className="w-full h-56 md:h-[60vh] lg:mt-6 relative overflow-hidden">

            <Image
              src={selectedImage}
              alt="Business profile"
              fill
              priority
              sizes="(max-width:768px) 100vw, (max-width:1200px) 80vw, 60vw"
              className="object-contain"
            />

          </div>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;
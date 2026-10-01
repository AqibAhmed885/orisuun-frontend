"use client";

import Image from "next/image";
import React, { memo, useState, lazy, Suspense } from "react";
import AddResource from "./add-resource";
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

// Lazy load the heavy form modal
const AddResourceForm = lazy(() => import("./resource-form"));

const HeroSection = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <section className="bg-white w-full">
      <div className=" px-6 pt-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Big headline */}
          <div className="md:col-span-7 ">
            <h1 className="font-[600] text-[#052A64] space-y-10 tracking-wide text-6xl md:text-[155px] leading-[100%] md:leading-[140px]">
              <span className="block">BLACK</span>
              <span className="block">BUSINESS</span>
            </h1>
            <h1 className="text-[#052A64] mt-6 tracking-wider font-normal space-y-10 text-5xl md:text-9xl">
              <span className="block">GLOBAL</span>
              <span className="block">RESOURCES</span>
              <span className="block">TRACKER</span>
            </h1>
          </div>
          <Image
            src={`${staticUrl}/resources/resourcefull.svg`}
            alt="Decorative Card"
            width={220}
            height={220}
            priority
            className="absolute md:right-1/4 -mr-4 right-8 w-36 md:w-56 md:-bottom-10 -bottom-16 "
          />
          {/* Right: Decorative vertical card (rotated on large screens) */}
          <div className="lg:col-span-5 hidden  md:flex justify-end items-center ">
            <AddResource onClick={() => setOpenModal(true)} />
          </div>
        </div>
      </div>
      {openModal && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/40 z-[1000] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div></div>}>
          <AddResourceForm showModal={openModal} setShowModal={setOpenModal} />
        </Suspense>
      )}
    </section>
  );
};

export default memo(HeroSection);

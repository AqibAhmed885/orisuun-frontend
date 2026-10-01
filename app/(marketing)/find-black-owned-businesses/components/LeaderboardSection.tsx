'use client'
import Image from 'next/image'
import React, { useState } from 'react'

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export default function LeaderboardSection() {
  

  return (
    <section className="max-w-7xl mx-auto px-6 pt-20 " aria-label="Community leaderboard">
      <div className="text-center mb-12">
        <h2 className="text-2xl lg:text-5xl font-semibold text-[#001E5F] mb-3">
          See if you can make it to the <br />
          <span className="text-omblue-500">top</span> of our Leaderboard
        </h2>
        <h3 className="text-xl text-[#5B657B]">Top reviewers, top supporters, top givers</h3>
      </div>

      {/* Filter Section */}
      <div className="">
        <Image
          src={`${staticUrl}/find/leaderboard.svg`}
          alt="Leaderboard Filters"
          width={1200}
          height={200}
          className="w-full h-auto"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          loading="lazy"
        />
      </div>
    </section>
  )
}

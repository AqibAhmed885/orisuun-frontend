'use client'

import React from 'react'
import dynamic from 'next/dynamic'

// 1. Dynamically import all components to prevent 'use client' directive issues
const HowItWorks = dynamic(() => import('./how-it-work/how-to-work-section').then(mod => ({ default: mod.HowItWorks })), {
  ssr: true,
  loading: () => <div style={{ minHeight: '400px' }} />
})

const FindMeFAQ = dynamic(() => import('./faq').then(mod => ({ default: mod.FindMeFAQ })), {
  ssr: true,
  loading: () => <div style={{ minHeight: '300px' }} />
})

// 2. Sirf unhe dynamic rakhein jo bahut heavy hain ya jinme animations zyada hain
const SocialSection = dynamic(() => import('./socialSection'), {
  ssr: true, // SSR true rakhein taaki initial HTML bane
  loading: () => <div style={{ minHeight: '400px' }} />
})

const JoinEveryone = dynamic(() => import('./join-everyone'), {
  ssr: true,
  loading: () => <div style={{ minHeight: '200px' }} />
})

const LeaderboardSection = dynamic(() => import('./LeaderboardSection'), {
  ssr: true,
  loading: () => <div style={{ minHeight: '300px' }} />
})

const TryOrisuunCTA = dynamic(() => import('./TryOrisuunCTA'), {
  ssr: true,
  loading: () => <div style={{ minHeight: '250px' }} />
})

const StatsSection = dynamic(() => import('./StatsSection'), {
  ssr: true,
  loading: () => <div style={{ minHeight: '200px' }} />
})

interface ClientComponentsWrapperProps {
  businessCounter: number
  advocatesCounter: number
  faqList: Array<{
    title: string
    content: string
  }>
}

export default function ClientComponentsWrapper({
  businessCounter,
  advocatesCounter,
  faqList
}: ClientComponentsWrapperProps) {
  return (
    <>
      {/* FAQ aur Stats ko bina Suspense ke rakhein taaki Googlebot turant read kare */}
      <HowItWorks />

      <SocialSection />

      <JoinEveryone />

      <StatsSection businessCounter={businessCounter} advocatesCounter={advocatesCounter} />

      <LeaderboardSection />

      <FindMeFAQ faqList={faqList} />

      <TryOrisuunCTA />
    </>
  )
}
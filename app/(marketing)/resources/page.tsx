import React from 'react'
import ResourcesNavigator from './components/ResourcesNavigator'

export const metadata = {
  title: 'Orisuun | Global Black Business Resources Tracker',
  description: 'Explore our comprehensive resources including blogs, tutorials, and documentation to help you get the most out of Orisuun.',
  // keywords: 'Orisuun, resources, blogs, tutorials, documentation',
  alternates: {
    canonical: 'https://orisuun.com/resources',
  },
  openGraph: {
    title: 'Find Business Accelerators, Grants, and Financing by Location and Deadline',
    description: 'Search a consistently updated database of accelerators, grants, government and school- sponsored programs',
    url: 'https://orisuun.com/resources',
    siteName: 'Orisuun',
    images: [
      {
        url: 'https://orisuun.com/og/resources630.png',
        width: 1200,
        height: 630,
        alt: 'Orisuun Global Black Business Resources',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Business Accelerators, Grants, and Financing by Location and Deadline',
    description: 'Search a consistently updated of accelerators, grants, government and school- sponsored programs, specialty financing, and competitions—organized by city, country, and deadline.',
    images: ['https://orisuun.com/og/resources675.png'],
    domain: 'orisuun.com',
    url: 'https://orisuun.com/resources',
    creator: '@orisuun',
  },
}

const Page = () => {
  return (
    <div className="min-h-screen pb-72 mt-12">
      <ResourcesNavigator initialSlugs={[]} />
    </div>
  )
}

export default Page

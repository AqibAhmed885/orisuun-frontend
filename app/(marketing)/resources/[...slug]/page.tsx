import React from 'react';
import ResourcesNavigator from '../components/ResourcesNavigator';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const slugs = resolvedParams.slug || [];
  
  // Build a descriptive title based on the path
  let title = 'Orisuun | Global Black Business Resources';
  let description = 'Explore our comprehensive resources including grants, accelerators, competitions, and more.';
  
  if (slugs.length > 0) {
    const formattedPath = slugs
      .map(s => s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))
      .join(' - ');
    title = `${formattedPath} | Orisuun Resources`;
    description = `Find business resources in ${formattedPath}`;
  }
  
  const canonicalPath = slugs.length > 0 ? `/resources/${slugs.join('/')}` : '/resources';
  
  return {
    title,
    description,
    alternates: {
      canonical: `https://orisuun.com${canonicalPath}`,
    },
    openGraph: {
      title,
      description,
      url: `https://orisuun.com${canonicalPath}`,
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
      title,
      description,
      images: ['https://orisuun.com/og/resources675.png'],
      domain: 'orisuun.com',
      url: `https://orisuun.com${canonicalPath}`,
      creator: '@orisuun',
    },
  };
}

const Page = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const slugs = resolvedParams.slug || [];
  
  return (
    <div className="min-h-screen pb-72 mt-24">
      <ResourcesNavigator initialSlugs={slugs} />
    </div>
  );
};

export default Page;

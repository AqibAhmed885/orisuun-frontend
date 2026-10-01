import React from 'react';
import SingleBlog from './components/blog';
import { Metadata } from 'next';
import StructuredDataInjector from '@/components/StructuredDataInjector';
import { getStructuredData } from '@/lib/structuredData';
import { getBlogBySlug } from '@/app/api/marketing/blog';
import { createBlogSlug, humanizeBlogSlug } from '@/lib/blog-slug';
import { notFound, permanentRedirect } from 'next/navigation';

async function getResolvedBlog(name: string) {
  try {
    const data = await getBlogBySlug(name);
    return data?.Result || data || null;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { name: string } }): Promise<Metadata> {
  const blog = await getResolvedBlog(params.name);
  const canonicalSlug = blog?.Title ? createBlogSlug(blog.Title) : createBlogSlug(params.name || '');
  const displayName = blog?.Title || humanizeBlogSlug(params.name || '');
  const description =
    blog?.BlogDescription ||
    "Stay updated with Orisuun's latest articles, data-driven insights and expert commentary on building, scaling and sustaining Black-owned businesses. Dive into our deep-dive posts, actionable strategies and thought leadership to drive impact and growth.";
  const canonicalUrl = `https://orisuun.com/insights/${encodeURIComponent(canonicalSlug)}`;

  return {
    title: `Orisuun | ${displayName} Article`,
    description,
    // keywords: 'Orisuun, insights, articles, Black-owned business, business growth, entrepreneurship, Black entrepreneurship, data insights, business scaling, thought leadership, business strategy, community impact',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      url: canonicalUrl,
      title: `Orisuun | ${displayName} Article`,
      description,
      siteName: 'Orisuun',
      type: 'article',
      locale: 'en_US',
      images: [
        {
          url: blog?.BlogBannerImage || 'https://orisuun.com/og/blog_index630.png',
          width: 1200,
          height: 630,
          alt: `Orisuun | ${displayName} Article`,
        },
      ],
    },
  };
}

const Page = async ({ params }: { params: { name: string } }) => {
  const blog = await getResolvedBlog(params.name);

  if (!blog) {
    notFound();
  }

  const canonicalSlug = createBlogSlug(blog.Title || params.name || '');
  if (params.name !== canonicalSlug) {
    permanentRedirect(`/insights/${canonicalSlug}`);
  }

  const canonicalUrl = `https://orisuun.com/insights/${encodeURIComponent(canonicalSlug)}`;
  const structuredData = getStructuredData({
    pageId: 'webpage',
    pageUrl: canonicalUrl,
    pageTitle: blog.Title || 'Orisuun Article',
    pageDescription: blog.BlogDescription || '',
    blogPost: {
      title: blog.Title || 'Orisuun Article',
      description: blog.BlogDescription || '',
      datePublished: blog.CreatedAt
        ? new Date(blog.CreatedAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      dateModified: blog.UpdatedAt
        ? new Date(blog.UpdatedAt).toISOString().split('T')[0]
        : undefined,
      authorName: blog.AuthorName || 'Orisuun Team',
      image: blog.BlogBannerImage || undefined,
    },
  });

  return (
    <>
      <StructuredDataInjector structuredData={structuredData} />

      <SingleBlog blog={blog} />
    </>
  );
};

export default Page;

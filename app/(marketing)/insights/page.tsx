import BlogPage from './components/blog-page';
import StructuredDataInjector from '@/components/StructuredDataInjector';
import { getStructuredData } from '@/lib/structuredData';
import { getAllBlogs } from '@/app/api/marketing/blog';
import { Article } from '@/data/marketing/articalsTypes';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export const metadata = {
  title: 'Orisuun | Articles and Insights',
  description: "Stay updated with Orisuun's latest articles, data-driven insights and expert commentary on building, scaling and sustaining Black-owned businesses. Dive into our deep-dive posts, actionable strategies and thought leadership to drive impact and growth.",
  // keywords: 'Orisuun, insights, articles, Black-owned business, business growth, entrepreneurship, Black entrepreneurship, data insights, business scaling, thought leadership, business strategy, community impact',
  alternates: {
    canonical: 'https://orisuun.com/insights',
  },
  openGraph: {
    title: 'Analysis, Perspective, Guides from Orisuun',
    description:
      "Research-backed analysis, perspective, and practical guides informed by what’s happening across the global Black business community.",
    url: 'https://orisuun.com/insights',
    siteName: 'Orisuun',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://orisuun.com/og/blog_index630.png',
        width: 1200,
        height: 630,
        alt: 'Orisuun Insights',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Analysis, Perspective, Guides from Orisuun',
    description:
      "Research-backed analysis, perspective, and practical guides informed by what’s happening across the global Black business community.",
    images: ['https://orisuun.com/og/blog_index675.png'],
    domain: 'orisuun.com',
    url: 'https://orisuun.com/insights',
    creator: '@orisuun',
  },
  metadataBase: new URL('https://orisuun.com'),
};

export default async function Page() {
  let articles: Article[] = [];

  try {
    const blogs = await getAllBlogs();

    if (!blogs || !Array.isArray(blogs)) {
      console.warn('Page: getAllBlogs returned non-array:', typeof blogs, blogs);
    } else if (blogs.length === 0) {
      console.warn('Page: No blogs returned from API');
    } else {
      articles = blogs
        .map((blog: any) => ({
          id: blog.Id,
          title: blog.Title,
          description: blog.BlogDescription,
          image: blog.AuthorPicture || `${staticUrl}/placeholder.svg`,
          date: new Date(blog.CreatedAt).toLocaleDateString(),
          readTime: '5 min read',
          tag: blog.Tags || 'Blog',
          featured: blog.BlogStatus === 'Published',
          banner: blog.BlogBannerImage || `${staticUrl}/placeholder.svg`,
          popular: blog.IsPopular || false,
        }))
        .filter((article: any) => article.title && article.id) // Filter out invalid articles
        .sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));

      console.log('Page: Successfully loaded', articles.length, 'articles');
    }
  } catch (error) {
    console.error('Error fetching blogs for insights page:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
  }

  const structuredData = getStructuredData({
    pageId: 'webpage',
    pageUrl: 'https://orisuun.com/insights',
    pageTitle: 'Orisuun | Articles and Insights',
    pageDescription: 'Articles and insights from Orisuun.',
    isBlogIndex: true,
  });

  return (
    <>
      {/* Structured Data - Rendered First */}
      <StructuredDataInjector structuredData={structuredData} />

      <BlogPage initialArticles={articles} />
    </>
  );
}

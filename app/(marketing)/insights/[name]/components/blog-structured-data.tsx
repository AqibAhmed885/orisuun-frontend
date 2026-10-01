'use client';

import { useEffect, useState } from 'react';
import { getBlogBySlug } from '@/app/api/marketing/blog';
import StructuredDataInjector from '@/components/StructuredDataInjector';
import { getStructuredData } from '@/lib/structuredData';

export default function BlogStructuredData({ params }: { params: { name: string } }) {
  const [structuredData, setStructuredData] = useState<any>(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      const slug = params?.name;

      if (!slug || typeof slug !== 'string') {
        return;
      }

      try {
        const data = await getBlogBySlug(slug);
        const blog = data?.Result || data || null;

        if (!blog) return;

        const pageUrl = `https://orisuun.com/insights/${encodeURIComponent(slug)}`;
        
        // Generate structured data from blog data
        const sd = getStructuredData({
          pageId: 'webpage',
          pageUrl,
          pageTitle: blog.Title || blog.title || 'Orisuun Article',
          pageDescription: blog.BlogDescription || blog.shortDescription || '',
          blogPost: {
            title: blog.Title || blog.title || 'Orisuun Article',
            description: blog.BlogDescription || blog.shortDescription || '',
            datePublished: blog.CreatedAt ? new Date(blog.CreatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            dateModified: blog.UpdatedAt ? new Date(blog.UpdatedAt).toISOString().split('T')[0] : undefined,
            authorName: blog.AuthorName || blog.authorName || 'Orisuun Team',
            image: blog.BlogBannerImage || blog.banner || undefined,
          },
        });

        setStructuredData(sd);
      } catch (err) {
        console.error('Error fetching blog data for structured data:', err);
      }
    };

    fetchBlogData();
  }, [params]);

  if (!structuredData) return null;

  return <StructuredDataInjector structuredData={structuredData} />;
}

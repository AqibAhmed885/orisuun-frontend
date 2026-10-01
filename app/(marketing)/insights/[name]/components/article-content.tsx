import React from 'react';
import Image from 'next/image';
import AsianTop30Svg from './AsianTop30.svg';
import whiteBussinessTop20Svg from './whiteBussinessTop20.svg';
import BObCanandaSvg from './BObCananda.svg';
import BObUkSvg from './BObUk.svg';
import EmployerSvg from './Employer.svg';
import DemographicsSvg from './Demographics..svg';
import BobTop30USSvg from './BobTop30US.svg';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

// Map SVG base filenames to their current-build static import src paths.
// The blog HTML in the API contains hardcoded /_next/static/media/ paths from
// a previous build whose hashes may differ. This mapping ensures we always
// resolve to the correct path for the running build.
const svgMap: Record<string, string> = {
  'BobTop30US': BobTop30USSvg.src,
  'AsianTop30': AsianTop30Svg.src,
  'whiteBussinessTop20': whiteBussinessTop20Svg.src,
  'BObCananda': BObCanandaSvg.src,
  'BObUk': BObUkSvg.src,
  'Employer': EmployerSvg.src,
  'Demographics.': DemographicsSvg.src, // filename has double-dot: Demographics..svg
};

const ArticleContent = ({ blog }: { blog: any }) => {
  const contents = Array.isArray(blog?.BlogContents) ? blog.BlogContents : [];

  if (!contents || contents.length === 0) {
    // fallback to BlogDescription if there are no BlogContents
    const html = blog?.BlogDescription || '';
    return (
      <div className="xl:px-56 px-5">
        <div className="blog-content" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    );
  }

  const slugifyHeading = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  const normalizeImageSrc = (src: string) => {
    let nextSrc = src || '';

    if (nextSrc.includes('/_next/image') && nextSrc.includes('.svg')) {
      try {
        const url = new URL(nextSrc, 'https://orisuun.com');
        const originalUrl = url.searchParams.get('url');
        if (originalUrl) {
          nextSrc = decodeURIComponent(originalUrl);
        }
      } catch {
        const match = nextSrc.match(/[?&]url=([^&]+)/);
        if (match) nextSrc = decodeURIComponent(match[1]);
      }
    }

    if (nextSrc.includes('/_next/static/media/')) {
      const filenameMatch = nextSrc.match(/\/([^/]+)\.[a-f0-9]+\.svg$/i);
      if (filenameMatch && svgMap[filenameMatch[1]]) {
        nextSrc = svgMap[filenameMatch[1]];
      }
    }

    if (nextSrc.startsWith('/') && !nextSrc.startsWith('/_next/')) {
      return `${staticUrl}${nextSrc}`;
    }

    return nextSrc;
  };

  // Function to add IDs to headings and fix SVG image sources
  const processHtml = (html: string) => {
    if (!html) return '';

    let headingIndex = 0;

    const withNormalizedImages = html.replace(
      /<img\b([^>]*?)\bsrc=(['"])(.*?)\2([^>]*)>/gi,
      (_match, before, quote, src, after) => `<img${before}src=${quote}${normalizeImageSrc(src)}${quote}${after}>`
    );

    return withNormalizedImages.replace(
      /<(h[1-6])(\b[^>]*)>([\s\S]*?)<\/\1>/gi,
      (match, tagName, attributes, innerHtml) => {
        if (/\sid=(['"]).*?\1/i.test(attributes)) {
          return match;
        }

        const textContent = innerHtml.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').trim();
        const slug = slugifyHeading(textContent) || `heading-${headingIndex++}`;

        return `<${tagName}${attributes} id="${slug}">${innerHtml}</${tagName}>`;
      }
    );
  };

  return (
    <div className="xl:px-56 px-5 space-y-6">
      {contents
        .slice()
        .sort((a: any, b: any) => (a.SortOrder ?? 0) - (b.SortOrder ?? 0))
        .map((content: any, idx: number) => {
          const type = (content.ContentType || '').toLowerCase();
          switch (type) {
            case 'text':
            case 'paragraph': {
              const html = content.Content || '';
              const processedHtml = processHtml(html); // <-- Add IDs + fix SVG sources
              return (
                <div key={content.Id ?? idx} className="blog-content lg:text-[17px] text-blue-300 font-medium tracking-wide ">
                  <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
                </div>
              );
            }

            case 'image': {
              const src = normalizeImageSrc(content.FileUrl || content.Content || '');
              const isSvg = typeof src === 'string' && (src.endsWith('.svg') || src.includes('.svg'));
              return (
                <div key={content.Id ?? idx} className="flex justify-center">
                  {/* Use unoptimized for SVGs to avoid Next.js image optimizer 400 errors on large SVGs */}
                  <Image
                    src={src}
                    alt={content.ContentFileName || content.Content || 'image'}
                    width={800}
                    height={480}
                    className="max-w-full h-auto rounded"
                    unoptimized={isSvg}
                  />
                </div>
              );
            }

            case 'video': {
              const src = content.FileUrl || content.Content || '';
              // If it's a YouTube embed URL, render iframe
              if (typeof src === 'string' && src.includes('youtube')) {
                return (
                  <div key={content.Id ?? idx} className="flex justify-center">
                    <div className="w-full max-w-4xl aspect-video">
                      <iframe
                        src={src}
                        title={content.Content || 'video'}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full rounded"
                      />
                    </div>
                  </div>
                );
              }
              // otherwise use HTML5 video
              return (
                <div key={content.Id ?? idx} className="flex justify-center">
                  <video controls src={src} className="max-w-full h-auto rounded" />
                </div>
              );
            }

            case 'file':
            case 'pdf':
            default: {
              const fileUrl = content.FileUrl || content.Content || '';
              if (fileUrl) {
                return (
                  <div key={content.Id ?? idx} className="mt-4">
                    <a href={fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                      {content.Content || content.ContentFileName || 'View file'}
                    </a>
                  </div>
                );
              }
              // fallback: plain text
              return (
                <div key={content.Id ?? idx} className="text-blue-300 font-medium lg:text-[17px] tracking-wide">
                  {content.Content}
                </div>
              );
            }
          }
        })}
    </div>
  );
};

export default ArticleContent;

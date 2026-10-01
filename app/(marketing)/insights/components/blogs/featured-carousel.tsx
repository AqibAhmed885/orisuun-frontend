'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Article } from '../../../../../data/marketing/articalsTypes';
import Button from '@/components/ui/button';
import ArrowLeft from '@/icons/arrow-left';
import Link from 'next/link';
import { articles } from '@/data/articals';
import { createBlogSlug } from '@/lib/blog-slug';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export function FeaturedCarousel({ articles }: { articles: Article[] }) {
  const featuredArticles = articles.filter((article) => article.featured);
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!featuredArticles.length) return null;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredArticles.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length
    );
  };

  return (
    <div className="relative bg-[#F2F7FC] rounded-xl p-4 lg:!p-10 mobile:h-[517px] lg:h-[644px] xl:mt-[60px] 3xl:lg:h-[700px] 4xl:h-[768px] lg:max-h-[644px] 3xl:max-h-[700px] 4xl:max-h-[768px]">
      <Link href={`/insights/${createBlogSlug(featuredArticles[currentSlide]?.title || '')}`}>
        <div className="flex xs:flex-col lg:!flex-row p-0 relative h-full">
          <div className="lg:h-full xl:flex-1 overflow-hidden ">
            <Image
              src={featuredArticles[currentSlide]?.banner || `${staticUrl}/placeholder.svg`}
              alt={featuredArticles[currentSlide]?.title }
              height={600}
              width={600}
              className="object-cover  h-full rounded-lg"
            />
          </div>
          <div className="flex flex-col justify-center absolute lg:!left-[calc(48%-624px/2+219.5px)] mobile:bottom-0 lg:!top-[calc(50%-480px/2)] p-5 lg:!p-0 rounded-xl lg:w-[624px] lg:h-[480px] my-auto bg-white">
            <div className=" flex flex-col max-w-[464px] max-h-[354px] h-full m-auto mobile:space-y-4 space-y-5">
              <div className="flex justify-between">
                <p className="lg:text-xl font-medium text-blue-300 leading-150">
                  {/* {featuredArticles[currentSlide]?.tag} */}
                </p>
                <p className="lg:text-xl font-medium text-blue-300 leading-150">
                  {featuredArticles[currentSlide]?.readTime || '5 min read'}
                </p>
              </div>
              <div className="flex-1 space-y-6">
                <h2 className="text-2xl lg:!text-[40px] leading-110 text-blue-strong font-semibold">
                  {featuredArticles[currentSlide]?.title }
                </h2>
                <p className="text-xl font-medium text-blue-300 leading-150 line-clamp-2">
                  {featuredArticles[currentSlide]?.description }
                </p>
              </div>
              <div className="flex mobile:flex-col mobile:items-start items-center justify-between mobile:pt-2 mobile:gap-6">
                <Button
                  title="Read more"
                  className="rounded-full !min-w-max !ml-0 !max-w-max px-5 mobile:px-4 mobile:py-1.5 mobile:text-sm mobile:h-8 mobile:max-w-max h-11"
                />
                <div className="flex mobile:justify-between mobile:w-full gap-2">
                  <Button
                    variant="ghost"
                    startIcon={
                      <ArrowLeft className="mobile:w-[18px] mobile:h-[18px] w-5 h-5  !text-nav-blue" />
                    }
                    onClick={prevSlide}
                    className="!min-w-max max-w-max w-5 !p-0"
                  />
                  <Button
                    variant="ghost"
                    startIcon={
                      <ArrowLeft className="mobile:w-[18px] mobile:h-[18px] w-5 h-5  !text-nav-blue rotate-180" />
                    }
                    onClick={nextSlide}
                    className="!min-w-max max-w-max w-5 !p-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

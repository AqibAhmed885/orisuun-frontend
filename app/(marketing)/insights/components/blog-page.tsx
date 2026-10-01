'use client';

import { ArticlesGrid } from './blogs/article-grid';
import { BlogsHeader } from './blogs/blogs-header';
import { FeaturedCarousel } from './blogs/featured-carousel';
import Subscribe from './blogs/subscribe';
import { Article } from '../../../../data/marketing/articalsTypes'; // Keep for type

// Shimmer components
const ShimmerCarousel = () => (
  <div className="relative bg-[#F2F7FC] rounded-xl p-4 lg:!p-10 mobile:h-[517px] lg:h-[644px] xl:mt-[60px] 3xl:lg:h-[700px] 4xl:h-[768px] lg:max-h-[644px] 3xl:max-h-[700px] 4xl:max-h-[768px]">
    <div className="flex xs:flex-col lg:!flex-row p-0 relative h-full">
      <div className="lg:h-full xl:flex-1">
        <div className="bg-gray-200 animate-pulse rounded-lg mobile:h-[244px] 3xl:h-full 3xl:w-auto 3xl:max-w-[660px] 4xl:max-w-[731px]"></div>
      </div>
      <div className="flex flex-col justify-center absolute lg:!left-[calc(48%-624px/2+219.5px)] mobile:bottom-0 lg:!top-[calc(50%-480px/2)] p-5 lg:!p-0 rounded-xl lg:w-[624px] lg:h-[480px] my-auto bg-white">
        <div className="flex flex-col max-w-[464px] max-h-[354px] h-full m-auto mobile:space-y-4 space-y-5">
          <div className="flex justify-between">
            <div className="bg-gray-200 animate-pulse h-5 w-20 rounded"></div>
            <div className="bg-gray-200 animate-pulse h-5 w-20 rounded"></div>
          </div>
          <div className="flex-1 space-y-6">
            <div className="bg-gray-200 animate-pulse h-10 w-full rounded"></div>
            <div className="bg-gray-200 animate-pulse h-6 w-full rounded"></div>
            <div className="bg-gray-200 animate-pulse h-6 w-3/4 rounded"></div>
          </div>
          <div className="flex mobile:flex-col mobile:items-start items-center justify-between mobile:pt-2 mobile:gap-6">
            <div className="bg-gray-200 animate-pulse h-11 w-24 rounded-full"></div>
            <div className="flex gap-2">
              <div className="bg-gray-200 animate-pulse h-5 w-5 rounded"></div>
              <div className="bg-gray-200 animate-pulse h-5 w-5 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);



export default function BlogPage({ initialArticles = [] }: { initialArticles?: Article[] }) {
  const articles = initialArticles;
  const featuredArticles = articles.filter((article) => article.featured);

  return (
    <div className="mobile:p-4 p-6 xl:!p-20 mobile:space-y-32 mt-10 pb-[100px] xl:!space-y-[100px] mb-24">
      <div className='mobile:space-y-6'>
        <BlogsHeader />
        {featuredArticles.length ? <FeaturedCarousel articles={featuredArticles} /> : <ShimmerCarousel />}
      </div>
      <ArticlesGrid articles={articles} loading={false} />
      <Subscribe />
    </div>
  );
}

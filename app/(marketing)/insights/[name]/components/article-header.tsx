'use  client';
import ArrowLeft from '@/icons/arrow-left';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

const ArticleHeader = ({ blog }) => {
  return (
    <>
      <div>

      </div>
      <div className="text-blue-700 mobile:mb-5 mb-6  xl:px-56 px-5">
        <Link
          href="/insights"
          className="mobile:text-base text-xl font-semibold !leading-150 flex items-center gap-1 text-nav-blue hover:underline"
        >
          <ArrowLeft className="w-5 h-5 text-nav-blue" /> Back to articles
        </Link>
      </div>
      <div className="space-y-6 mobile:!mt-5">
        <span className="flex items-center relative">
          <h1 className="mobile:text-h2 text-5xl flex-1 !leading-110 font-semibold  xl:px-56 px-5 text-blue-strong">
            {blog?.Title}
          </h1>
        </span>
        <div className="text-gray-500 mt-2 text-base lg:!text-xl flex mobile:flex-wrap mobile:justify-between gap-x-8 gap-y-4 items-center">
          {/* <Badge title="Tag Name" className="mobile:text-sm text-base h-10" /> */}
          <span className=" !leading-150 font-semibold text-blue-300 flex gap-3 items-center xl:px-56 px-5">
            <Image
              src={blog?.AuthorPicture || `${staticUrl}/blog/writer.png`}
              alt="writer"
              width={100}  // Reduced from 100
              height={100} // Reduced from 100
              className="
    rounded-full
    object-cover
    aspect-square
    w-[40px]    // Default small size
    h-[40px]
    mobile:w-[20px]  // Even smaller on mobile
    mobile:h-[20px]
  "
            />
            {blog?.AuthorName}
          </span>
        </div>
      </div>
    </>
  );
};

export default ArticleHeader;

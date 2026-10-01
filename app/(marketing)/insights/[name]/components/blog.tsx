import React from 'react';
import ArticleContent from './article-content';
import ArticleHeader from './article-header';
import ArticleAuthor from './article-author';
import { MoreArticles } from '../../components/blogs/more-articles';
import TableOfContents from './table-of-contents';

const SingleBlog = ({ blog }) => {
  return (
    <>
      <div className='flex justify-end'>
        <div className=" max-w-[1440px] mx-auto mobile:space-y-10 sm:pt-20 pb-[100px] space-y-[60px]  sm:!px-16 3xl:!px-0">
          {/* Header */}
          <ArticleHeader blog={blog} />
          <ArticleContent blog={blog} />
          <ArticleAuthor blog={blog} />
          <MoreArticles articles={blog} />
        </div>
        <div className='xl:pt-[20%] pt-[10%] hidden xl:block'>
          <TableOfContents content={blog?.BlogContents} />
        </div>
      </div>
    </>
  );
};

export default SingleBlog;
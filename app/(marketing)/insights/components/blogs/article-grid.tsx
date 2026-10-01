import Image from 'next/image';
import { Article } from '../../../../../data/marketing/articalsTypes';
import Link from 'next/link';
import { createBlogSlug } from '@/lib/blog-slug';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export function ArticlesGrid({ articles, loading }: { articles: Article[], loading: boolean }) {
  const visibleArticles = articles;

  if (loading) {
    return <div className="flex justify-center items-center h-32">Loading articles...</div>;
  }

  return (
    <div className="space-y-8 lg:!space-y-10">
      <h2 className="mobile:text-2xl text-[40px] font-semibold text-blue-strong">
        All Articles
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleArticles.map((article) => (
          <Link href={`/insights/${createBlogSlug(article.title)}`} key={article.id}>
            <div className="rounded-xl mobile:p-4 p-[26px] space-y-4 border flex flex-col border-gray-300-custom overflow-hidden h-full">
              <div className="relative">
                <Image
                  src={article.banner || `${staticUrl}/placeholder.svg`}
                  alt={article.title}
                  width={356}
                  height={225}
                  className="object-cover rounded-lg lg:h-[225px] w-full"
                />
              </div>
              <div className="flex flex-col gap-3 items-start flex-1">
                <span className="text-sm text-blue-300 font-medium flex items-center">
                  {article.date}&nbsp;•&nbsp;{article.readTime}
                </span>
                <h3 className="mobile:text-xl text-2xl leading-150 font-semibold text-blue-strong">
                  {article.title}
                </h3>
                <p className="lg:text-xl font-medium text-blue-300 leading-150 mb-3 flex-1">
                  {article.description}
                </p>
                {/* <Badge title={article.tag} className="mobile:text-sm" /> */}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

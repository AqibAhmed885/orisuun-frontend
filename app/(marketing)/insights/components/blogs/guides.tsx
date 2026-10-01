import Image from 'next/image';
import Badge from '@/components/ui/badge';
import { Article } from '../../../../../data/marketing/articalsTypes';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

export function Guides({ articles }: { articles: Article[] }) {
  const displayedArticles = articles.slice(0, 2);

  return (
    <div className=''>
      <h2 className="mobile:text-2xl  text-[40px] font-semibold text-blue-strong">
        Guides
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {displayedArticles.map((article) => (
          <div
            key={article.id}
            className="rounded-xl flex mobile:flex-col gap-6 items-start mobile:p-4 p-6 border border-gray-300-custom overflow-hidden"
          >
            <div className="relative  mobile:w-full w-1/2 h-full">
              <Image
                src={article.image || `${staticUrl}/placeholder.svg`}
                alt={article.title}
                width={356}
                height={225}
                className="object-cover rounded-lg lg:h-[259px] w-full"
              />
            </div>
            <div className="flex flex-col gap-3 h-full items-start mobile:w-full w-1/2">
              <span className="text-sm leading-none text-blue-300 font-medium flex items-center">
                {article.date}&nbsp;•&nbsp;{article.readTime}
              </span>
              <h3 className="text-2xl leading-150 font-semibold text-blue-strong">
                {article.title}
              </h3>
              <p className="lg:text-xl flex-1 font-medium text-blue-300 leading-150">
                {article.description}
              </p>
              <Badge title={article.tag} className="mobile:text-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

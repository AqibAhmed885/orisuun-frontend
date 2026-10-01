import ChevronRight from '@/icons/chevron-right';
import { cn } from '@/utils/utils';
import Link from 'next/link';
import React from 'react';

const Breadcrumbs = ({
  breadcrumbs,
}: {
  breadcrumbs: { title: string; url?: string }[];
}) => {
  return (
    <div className={cn('flex')}>
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={index} className={cn('flex items-center gap-1')}>
          <Link href={breadcrumb.url ?? ''}>
            <p
              className={
                index === breadcrumbs.length - 1
                  ? 'text-omblue-500 text-h9 2xl:text-scaled-h9 font-medium'
                  : 'text-blue-300 text-h9 2xl:text-scaled-h9 font-medium'
              }
            >
              {breadcrumb.title}
            </p>
          </Link>
          <ChevronRight
            className={
              index === breadcrumbs.length - 1 ? 'hidden' : 'text-blue-300'
            }
          />
        </div>
      ))}
    </div>
  );
};

export default Breadcrumbs;

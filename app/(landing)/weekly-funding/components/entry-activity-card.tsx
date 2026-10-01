import { ReactNode } from 'react';

type EntryActivityCardProps = {
  title: string;
  entries?: string;
  description?: string;
  icon?: ReactNode;
  iconClassName?: string;
  color?: string;
};

export default function EntryActivityCard({
  title,
  entries,
  description,
  icon,
  iconClassName = '',
  color = '#EEF0F5',
}: EntryActivityCardProps) {
  const isFeature = Boolean();

  return (
    <article
      className={
        isFeature
          ? 'rounded-[10px] border border-[#E3E3E3] bg-white p-6 md:p-7  min-h-[220px]'
          : 'rounded-[10px] border border-[#E3E3E3] bg-white px-5 py-4'
      }
    >
      <div className='flex items-start justify-between gap-4'>
        {icon ? (
          <div
            className={`h-[60px] w-[60px] shrink-0 rounded-[10px] border flex items-center justify-center ${iconClassName}`}
          >
            {icon}
          </div>
        ) : (
          <div />
        )}

        {entries && (
          <span
            className='rounded-full px-3 py-1 md:text-xs text-[8px] font-semibold tracking-wide text-[#0F1116]'
            style={{ backgroundColor: color }}
          >
            {entries}
          </span>
        )}
      </div>

      <h3 className='mt-4 md:text-xl text-lg font-semibold text-[#0F1116]'>{title}</h3>
      {description ? <p className='mt-2 flex text-base text-[#5B657B]'>{description}</p> : null}
    </article>
  );
}
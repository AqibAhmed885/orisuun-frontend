import { cn } from '@/utils/utils';
import React from 'react';

interface IProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  text: string;
}

const Chip: React.FC<IProps> = ({ text, className, ...rest }) => {
  return (
    <div
      className={cn(
        'bg-olblue-100 text-h10 2xl:text-scaled-h10 font-medium text-olblue-900 px-2 py-1 rounded-md',
        className
      )}
      {...rest}
    >
      {text}
    </div>
  );
};

export default Chip;

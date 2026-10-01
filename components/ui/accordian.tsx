import ChevronDownLg from '@/icons/chevron-down-lg';
import { FC, ReactNode, useState } from 'react';

interface AccordionProps {
  title: string;
  children: ReactNode;
  headerClasses?: string;
  bodyClasses?: string;
  className?: string;
}

const Accordion: FC<AccordionProps> = ({ title, children, headerClasses, bodyClasses, className }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`p-4 ${isOpen ? 'pb-7' : 'pb-4'}  ${className}  rounded-2xl bg-white shadow-blur`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left text-lg flex items-center justify-between leading-6 bg-white ${isOpen && 'border-b pb-3'} rounded-t-2xl  font-semibold text-blue-500 ${headerClasses}`}
      >
        {title}
        <ChevronDownLg className={` transition-all fill-blue-500 ${isOpen ? '' : 'rotate-180'} `}/>
      </button>

      {isOpen && (
        <div className={` bg-white pt-4 ${bodyClasses}`}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;

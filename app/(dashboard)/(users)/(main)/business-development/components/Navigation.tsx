import { Select } from '@headlessui/react';
import Link from 'next/link';
import Button from '@/components/ui/button';
import { cn } from '@/utils/utils';

interface NavigationProps {
  selected: string;
  setSelected: (value: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ selected, setSelected }) => (
  <div className="flex items-center justify-between gap-4 mb-6">
    <div className="hidden md:flex items-center gap-6 text-h7 2xl:text-scaled-h7">
      <button
        onClick={() => setSelected('Seeking')}
        className={cn(
          'cursor-pointer border-b-2',
          selected === 'Seeking'
            ? 'border-omblue-600 text-omblue-600 font-semibold'
            : 'text-[#797B82] border-transparent font-medium'
        )}
      >
        <p className="px-4 py-3">Opportunities We Are Seeking</p>
      </button>
      <button
        onClick={() => setSelected('Facilitate')}
        className={cn(
          'cursor-pointer border-b-2',
          selected === 'Facilitate'
            ? 'border-omblue-600 text-omblue-600 font-semibold'
            : 'text-[#797B82] border-transparent font-medium'
        )}
      >
        <p className="px-4 py-3">Opportunities We Can Facilitate</p>
      </button>
    </div>

    <Select
      className={'text-omblue-600 md:hidden flex-1 w-full focus-visible:outline-none'}
    >
      <option className="text-h9 2xl:text-scaled-h9 font-semibold">
        Opportunities We Are Seeking
      </option>
      <option className="text-h9 2xl:text-scaled-h9 font-semibold">
        Opportunities We Can Facilitate
      </option>
    </Select>

    <Link href={'/business-development/create'}>
      <Button title="Create New"></Button>
    </Link>
  </div>
);

export default Navigation;
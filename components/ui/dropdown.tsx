import ChevronDownLg from '@/icons/chevron-down-lg';
import React, { useState, ReactNode } from 'react';

interface DropdownProps<T> {
  items: T[]; // Array of items (generic type)
  selected?: T; // Currently selected item
  onSelect: (item: T) => void; // Callback when an item is selected
  renderItem: (item: T) => ReactNode; // Function to render each item
  placeholder?: string; // Optional placeholder text
  className?: string;
  border?: boolean;
  iconSize?: string;
  wrapperClass?: string;
  searchable?: boolean;
  getItemLabel?: (item: T) => string;
  searchPlaceholder?: string;
}

const Dropdown = <T,>({
  items,
  selected,
  onSelect,
  renderItem,
  placeholder = 'Select an option',
  border = true,
  className,
  wrapperClass,
  iconSize,
  searchable = false,
  getItemLabel,
  searchPlaceholder,
}: DropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const getLabel = (item: T) => (getItemLabel ? getItemLabel(item) : String(item));
  const filtered = query
    ? items.filter((it) => getLabel(it).toLowerCase().includes(query.toLowerCase()))
    : items;

  return (
    <div className={`relative inline-block w-60 ${className}`}>
      {/* Dropdown Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex justify-between items-center px-4  ${wrapperClass} ${
          border ? 'border focus-within:border-omblue-600' : 'border-none'
        } cursor-pointer text-sm`}
      >
        <span className={`${!selected && 'text-black-200'}`}>
          {selected ? renderItem(selected) : placeholder}
        </span>
        <ChevronDownLg
          className={` ${iconSize} transition-all ${
            isOpen ? '' : 'rotate-180'
          } `}
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 w-full max-h-60 overflow-auto mt-1 bg-white border rounded-md shadow-lg p-2">
          {searchable && (
            <div className="px-2 mb-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder || 'Search...'}
                className="w-full px-3 py-2 border rounded text-sm"
              />
            </div>
          )}
          <ul className="max-h-56 overflow-auto">
            {filtered.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  onSelect(item);
                  setIsOpen(false);
                  setQuery('');
                }}
                className={`px-3 py-1 cursor-pointer text-sm hover:bg-gray-100 ${item === selected ? 'bg-omblue-100' : ''
                  }`}
              >
                {renderItem(item)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;

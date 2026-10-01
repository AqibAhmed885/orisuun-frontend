'use client';

import React, { useState } from 'react';
import { cn } from '@/utils/utils';
import Input from './input';
import SearchIcon from '@/icons/sidebar/search-icon';

interface Option {
  value: string;
  label: string;
}

interface AutocompleteProps {
  options: Option[];
  onChange: (selectedOption: Option | null) => void;
  value: Option | null;
  placeholder?: string;
  error?: string;
  containerClass?: string;
  disabled?: boolean;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  options,
  onChange,
  value,
  placeholder = 'Select...',
  error,
  containerClass,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  const handleOptionClick = (option: Option) => {
    setInputValue(option.label);
    onChange(option);
    setIsOpen(false);
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className={cn('relative', containerClass)}>
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        error={error}
        disabled={disabled}
        icon={<SearchIcon className="w-5 h-5" />}
        iconClasses="text-gray-500"
        className="rounded text-sm leading-5 min-w-[150px]"
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul
          className={cn(
            'absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-md max-h-60 overflow-y-auto mt-1'
          )}
        >
          {filteredOptions.map((option) => (
            <li
              key={option.value}
              className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;

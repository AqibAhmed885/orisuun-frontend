'use client';

import { cn } from '@/utils/utils';
import React, {
  forwardRef,
  InputHTMLAttributes,
  useState,
  useEffect,
  useRef,
  KeyboardEvent,
  useCallback,
} from 'react';

interface ChipInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  error?: string;
  containerClass?: string;
  value?: string[];
  onChange?: (value: string[]) => void;
}

const ChipInput = forwardRef<HTMLInputElement, ChipInputProps>(
  (
    { className, error, containerClass, value = [], onChange, ...rest },
    ref
  ) => {
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const addChip = useCallback(
      (chip: string) => {
        if (chip.trim() !== '') {
          const newValue = [...value, chip.trim()];
          onChange?.(newValue);
          setInputValue('');
        }
      },
      [onChange, value]
    );

    useEffect(() => {
      // Add chip when component loses focus
      const handleBlur = () => {
        if (inputValue.trim() !== '') {
          addChip(inputValue);
        }
      };

      const currentInputRef = inputRef.current;
      currentInputRef?.addEventListener('blur', handleBlur);

      return () => {
        currentInputRef?.removeEventListener('blur', handleBlur);
      };
    }, [addChip, inputValue]);

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' || event.key === ',') {
        event.preventDefault();
        addChip(inputValue);
      }
    };

    const handleRemoveChip = (index: number) => {
      const newValue = value.filter((_, i) => i !== index);
      onChange?.(newValue);
    };

    return (
      <div className={cn('relative md:w-auto w-full', containerClass)}>
        <div
          className={cn(
            'flex items-center border rounded-md transition-colors duration-200 ring-0',
            isFocused ? 'border-omblue-500' : 'border-gray-600',
            error ? 'border-danger-500' : ''
          )}
        >
          <div className="flex flex-wrap items-center flex-grow p-3 gap-2">
            {value.map((chip, index) => (
              <span
                key={index}
                className="bg-omblue-50 text-omblue-500 px-3.5 py-2 text-h9 2xl:text-scaled-h9 rounded-md flex items-center"
              >
                {chip}
                <button
                  type="button"
                  className="ml-1 text-omblue-500 focus:outline-none"
                  onClick={() => handleRemoveChip(index)}
                >
                  &times;
                </button>
              </span>
            ))}
            <input
              ref={(node) => {
                if (typeof ref === 'function') {
                  ref(node);
                } else if (ref) {
                  ref.current = node;
                }
                inputRef.current = node;
              }}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={cn(
                'flex-grow outline-none bg-transparent text-h9 2xl:text-scaled-h9',
                className
              )}
              {...rest}
            />
          </div>
        </div>
        {error && (
          <span className="text-danger-400 text-xs mt-2 m-1">{error}</span>
        )}
      </div>
    );
  }
);

ChipInput.displayName = 'ChipInput';

export default ChipInput;

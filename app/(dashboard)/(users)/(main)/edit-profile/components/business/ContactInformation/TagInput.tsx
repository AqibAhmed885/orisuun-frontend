'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';

const TagInput = ({ maxTags = 5 }) => {
  const { setValue, watch, formState: { errors } } = useFormContext();
  const tags = watch('SearchTags') || [];

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const value = e.target.value.trim();
      if (value && !tags.includes(value) && tags.length < maxTags) {
        setValue('SearchTags', [...tags, value]);
        e.target.value = '';
      }
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setValue('SearchTags', newTags);
  };

  return (
    <div className="space-y-2">
      <label className="block text-[16px] font-semibold text-black">Search Tags</label>

      <div className="w-full">
        <input
          type="text"
          placeholder="Add related keywords for your business"
          className="w-full text-[16px] font-normal text-gray-500 px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          onKeyDown={handleKeyDown}
        />

        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-1 bg-[#EFF8FF] text-[#194185] px-3 py-1 rounded-md text-md border border-[#B2DDFF] mt-2"
            >
              {tag}
              <button
                type="button"
                className="text-blue-500 hover:text-blue-700"
                onClick={() => removeTag(tag)}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>
      <p className="text-[14px] text-[#4B5563]">Helps members find you – add up to {maxTags} tags</p>
      {typeof errors.SearchTags?.message === 'string' && <p className="text-red-600 text-[14px]">{errors.SearchTags.message}</p>}
    </div>
  );
};

export default TagInput;

import Add from '@/icons/add';
import KeyboardArrowDown from '@/icons/keyboard-arrow-down';
import React, { useState, useCallback, useMemo } from 'react';

type Industry = {
  label: string;
  value: string;
  subIndustries?: Industry[];
};

interface MultiChipsProps {
  industry: Industry;
  onSelect: (value: string) => void;
  selectedIndustries: string[];
  level?: number;
  isFirst?: boolean;
}

const MultiChips: React.FC<MultiChipsProps> = ({
  industry,
  onSelect,
  selectedIndustries,
  level = 0,
  isFirst = false,
}) => {
  const [expanded, setExpanded] = useState(
    level === 1 || (level === 0 && isFirst)
  );


  const isIndustrySelected = useCallback(
    (ind: Industry): boolean => {
      if (selectedIndustries.includes(ind.value)) return true;
      return ind.subIndustries
        ? ind.subIndustries.some(isIndustrySelected)
        : false;
    },
    [selectedIndustries]
  );

  const toggleExpand = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (level === 0) {
        setExpanded((prev) => !prev);
      }
    },
    [level]
  );

  const handleSelect = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect(industry.value);
    },
    [industry.value, onSelect]
  );

  const chipStyle = useMemo(() => {
    const baseStyle =
      'flex items-center justify-between gap-2 py-2 rounded-md ';
    if (level === 0) return baseStyle + 'border-transparent bg-white';
    if (level === 1) return baseStyle + 'border-transparent bg-white';
    return (
      baseStyle +
      (isIndustrySelected(industry)
        ? 'border border-omblue-500 bg-olblue-50 text-omblue-500 px-3 py-2.5'
        : 'border border-[#D2D4DA] px-3 py-2.5')
    );
  }, [level, isIndustrySelected, industry]);

  const labelStyle = useMemo(() => {
    if (level === 0)
      return 'text-h5 2xl:text-scaled-h5 font-semibold text-blue-500';
    if (level === 1) return 'text-md font-medium text-blue-300';
    return isIndustrySelected(industry)
      ? 'text-h7 2xl:text-scaled-h7 font-semibold text-omblue-500'
      : 'text-h7 2xl:text-scaled-h7 font-semibold text-black-400';
  }, [level, isIndustrySelected, industry]);

  const renderContent = () => {
    if (level === 1 || (level === 0 && expanded)) {
      return (
        <div className="mt-2">
          {industry.subIndustries?.map((subIndustry, index) => (
            <MultiChips
              key={subIndustry.value}
              industry={subIndustry}
              onSelect={onSelect}
              selectedIndustries={selectedIndustries}
              level={level + 1}
              isFirst={index === 0}
            />
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mb-2">
      <div
        className={`${chipStyle} ${level === 2 ? 'cursor-pointer' : ''}`}
        onClick={level === 2 ? handleSelect : toggleExpand}
      >
        <span className={labelStyle}>{industry.label}</span>
        <div className="flex items-center space-x-2">
          {industry.subIndustries && level === 0 && (
            <button className="text-blue-500" onClick={toggleExpand}>
              <KeyboardArrowDown
                className={`w-6 h-6 transition-transform ${
                  expanded ? '' : 'rotate-180'
                }`}
              />
            </button>
          )}
          {level === 2 && (
            <Add
              className={`w-5 h-5 transition-transform ${
                isIndustrySelected(industry)
                  ? 'rotate-45 text-omblue-500'
                  : 'text-black-400'
              }`}
            />
          )}
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default MultiChips;

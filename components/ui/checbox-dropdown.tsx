import React, { useEffect, useState } from 'react';

interface Option {
  id: string | number;
  label: string;
}

interface AccordionSection {
  title: string;
  options: Option[];
}

interface MultiSectionCheckboxAccordionProps {
  sections: AccordionSection[];
  selectedOptions: string[];
  onChange: (selectedIds: string[]) => void;
  defaultClosedSections?: string[]; // New prop for sections to be closed by default
  controlledOpenSections?: string[]; // Prop for external control over open sections
}

const MultiSectionCheckboxAccordion: React.FC<MultiSectionCheckboxAccordionProps> = ({
  sections,
  selectedOptions,
  onChange,
  defaultClosedSections = [], // Initialize with an empty array to keep all sections open by default
  controlledOpenSections,
}) => {
  const [openSections, setOpenSections] = useState<string[]>(
    sections.map(section => section.title).filter(title => !defaultClosedSections.includes(title))
  );

  useEffect(() => {
    if (controlledOpenSections) {
      setOpenSections(controlledOpenSections);
    }
  }, [controlledOpenSections]);

  const toggleSection = (title: string) => {
    if (controlledOpenSections) return; // Skip toggling if controlled externally

    setOpenSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const handleCheckboxChange = (optionId: string) => {
    const updatedSelection = selectedOptions.includes(optionId)
      ? selectedOptions.filter((id) => id !== optionId)
      : [...selectedOptions, optionId];
    onChange(updatedSelection);
  };

  return sections.map((section) => (
    <div key={section.title} className="border-b border-gray-200 last:border-b-0">
      <button
        className="w-full py-3 text-left bg-white hover:bg-gray-50 focus:outline-none flex justify-between items-center"
        onClick={() => toggleSection(section.title)}
      >
        <span className="font-semibold text-gray-800">{section.title}</span>
        <svg
          className={`w-5 h-5 transition-transform ${openSections.includes(section.title) ? '' : 'transform rotate-180'
            }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {openSections.includes(section.title) && (
        <div className="py-2">
          {section.options?.map((option: any) => (
            <label key={option.id} className="flex items-center py-2">
              <input
                type="checkbox"
                className="form-checkbox w-full h-full max-h-5 max-w-5 2xl:w-scaled-5 2xl:h-scaled-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                checked={selectedOptions.includes(option.id)}
                onChange={() => handleCheckboxChange(option.id)}
              />
              <span className="ml-2 text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  ));
};

export default MultiSectionCheckboxAccordion;

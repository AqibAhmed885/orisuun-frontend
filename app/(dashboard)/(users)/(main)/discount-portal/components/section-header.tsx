import ChevronRight from "@/icons/chevron-right";

interface SectionHeaderProps {
  title: string;
  onViewAll?: () => void;
  isExpanded?: boolean;
}

const SectionHeader = ({ title, onViewAll, isExpanded = false }: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-4 mb-5">
      <h6 className="text-h3 2xl:text-scaled-h3 font-semibold text-blue-500">
        {title}
      </h6>
      <button
        type="button"
        className="flex items-center cursor-pointer"
        onClick={onViewAll}
        aria-expanded={isExpanded}
      >
        <p className="text-h9 2xl:text-scaled-h9 font-semibold text-omblue-600">
          {isExpanded ? 'Show all sections' : 'View all'}
        </p>
        <ChevronRight className={`w-6 h-6 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
};

export default SectionHeader;

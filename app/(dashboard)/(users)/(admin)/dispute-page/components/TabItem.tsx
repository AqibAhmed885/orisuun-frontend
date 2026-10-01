import { cn } from "@/utils/utils";

interface TabItemProps {
    label: string;
    isSelected: boolean;
    onClick: () => void;
  }
  
  const TabItem = ({ label, isSelected, onClick }: TabItemProps) => {
    return (
      <p
        onClick={onClick}
        className={cn(
          'cursor-pointer border-b-2 text-h7 2xl:text-scaled-h7 font-medium mb-4 xl:mb-0 me-4 px-3 pb-2',
          isSelected
            ? 'font-semibold text-omblue-600 border-omblue-600'
            : 'text-[##797B82] border-transparent'
        )}
      >
        {label}
      </p>
    );
  };
  
  export default TabItem;
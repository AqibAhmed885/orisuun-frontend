interface FilterOption {
    id: string;
    label: string;
    checked: boolean;
}

interface ColumnHeaderProps {
    title: string;
    columnType: string;
    onFilterChange?: (options: FilterOption[], sortOrder: 'asc' | 'desc') => void;
    MatchType: number
    filterValues?: { geographic: string[], primary: "", quaternary: "", relevantIndustries: string[], secondary: "", tertiary: "" }
    handleGeographyChange?
    handleIndustryChange?
    includedOptions?
    setIncludedOptions?
}

const ColumnHeader = ({ title, columnType, MatchType, filterValues, handleGeographyChange, handleIndustryChange, includedOptions, setIncludedOptions }: ColumnHeaderProps) => 
{ 
};

export default ColumnHeader;
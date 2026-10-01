interface FilterOption {
    id: string;
    label: string;
    checked: boolean;
}

interface FilterPopupProps {
    filterOptions;
    showSort: boolean;
    columnType: string;
    onApply?: (type: string, options: FilterOption[], sortOrder: 'asc' | 'desc') => void;
    MatchType: number;
}

const FilterPopup = ({
    filterOptions: initialOptions,
    showSort,
    columnType,
    MatchType,
    onApply
}: FilterPopupProps) => 
{
};

export default FilterPopup;
import { useEffect, useState } from "react";
import Image from "next/image";
import AscIcon from '@/public/postSearch/icomoon-free_arrow-up.png'
import DscIcon from '@/public/postSearch/icomoon-free_arrow-up (1).png'

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
    orderBy?: {
        memberName: 'asc' | 'desc';
        industry?: 'asc' | 'desc';
        strategy: 'asc' | 'desc';
    }
    setOrderBy?: React.Dispatch<
        React.SetStateAction<{
            memberName: 'asc' | 'desc';
            industry?: 'asc' | 'desc';
            strategy: 'asc' | 'desc';
        }>
    >;
}

const FilterPopup = ({
    filterOptions: initialOptions,
    showSort,
    columnType,
    MatchType,
    onApply,
    orderBy,
    setOrderBy
}: FilterPopupProps) => {
    const [filterOptions, setFilterOptions] = useState(initialOptions);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>();
    const [autoApply, setAutoApply] = useState(true);

    const handleFilterChange = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newOptions = filterOptions.map(option =>
            option.id === id ? { ...option, checked: !option.checked } : option
        );

        setFilterOptions(newOptions);
        if (autoApply && onApply) {
            onApply(columnType, newOptions, sortOrder);
        }
    };

    const handleSelectAll = (checked: boolean, e: React.MouseEvent) => {
        e.stopPropagation();
        const newOptions = filterOptions.map(option => ({
            ...option,
            checked
        }));
        setFilterOptions(newOptions);

        if (autoApply && onApply) {
            onApply(columnType, newOptions, sortOrder);
        }
    };

    const handleApply = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onApply) {
            onApply(columnType, filterOptions, sortOrder);
        }
    };

    useEffect(() => {
        if (columnType == 'memberName') {
            setSortOrder(orderBy.memberName)
        }
        if (columnType == 'industry' && showSort) {
            setSortOrder(orderBy.industry)
        }
        if (columnType == 'strategy') {
            setSortOrder(orderBy.strategy)
        }
    }, [])

    const handleSortChange = (order: 'asc' | 'desc', e: React.MouseEvent) => {
        e.stopPropagation();
        setSortOrder(order);
        if (columnType == 'memberName') {
            if (order == 'asc') {
                setOrderBy({
                    ...orderBy,
                    memberName: 'asc'
                });
            }
            if (order == 'desc') {
                setOrderBy({
                    ...orderBy,
                    memberName: 'desc'
                });
            }
        }
        if (columnType == 'industry') {
            if (order == 'asc') {
                setOrderBy({
                    ...orderBy,
                    industry: 'asc'
                });
            }
            if (order == 'desc') {
                setOrderBy({
                    ...orderBy,
                    industry: 'desc'
                });
            }
        }
        if (columnType == 'strategy') {
            if (order == 'asc') {
                setOrderBy({
                    ...orderBy,
                    strategy: 'asc'
                });
            }
            if (order == 'desc') {
                setOrderBy({
                    ...orderBy,
                    strategy: 'desc'
                });
            }
        }
        if (autoApply && onApply) {
            onApply(columnType, filterOptions, order);
        }
    };


    const handleAutoApplyChange = (e: React.MouseEvent) => {
        e.stopPropagation();
        setAutoApply(!autoApply);
    };

    const handleModalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div className="w-[375.8px] bg-white border-2 border-gray-300 py-5 rounded-3xl max-h-[calc(100vh-30px)] overflow-y-auto shadow-lg overflow-hidden">
            <div className="p-4" onClick={handleModalClick}>
                {showSort && (
                    <div>
                        <h3 className="text-[15px] text-start font-semibold text-black mb-2">Sort by</h3>
                        <div className="w-[325.8px] h-[41px] flex gap-2">
                            <button
                                className={`transition-all duration-300 ease-in-out transform font-semibold rounded-full w-[126.6px] h-[36px] flex-1 py-1 text-[12px] border ${sortOrder === 'asc'
                                    ? 'bg-[#F1F1F1] border-blue-200 text-black'
                                    : 'bg-white border-gray-200 text-black'
                                    }`}
                                onClick={(e) => handleSortChange('asc', e)}
                            >
                                <div className="flex items-center text-[15px] justify-center gap-1">
                                    <Image
                                        src={AscIcon}
                                        alt="Ascending sort icon"
                                        width={16.4}
                                        height={16.4}
                                        className="shrink-0"
                                    />
                                    Ascending
                                </div>
                            </button>
                            <button
                                className={`transition-all duration-300 ease-in-out transform font-semibold flex-1 py-2 rounded-full w-[126.6px] h-[36px] text-[12px] border ${sortOrder === 'desc'
                                    ? 'bg-[#F1F1F1] border-blue-200 text-blue-700'
                                    : 'bg-white border-gray-200 text-black'
                                    }`}
                                onClick={(e) => handleSortChange('desc', e)}
                            >
                                <div className="flex items-center text-[15px] justify-center gap-1">
                                    <Image
                                        src={DscIcon}
                                        alt="Ascending sort icon"
                                        width={16.4}
                                        height={16.4}
                                        className="shrink-0"
                                    />
                                    Descending
                                </div>
                            </button>
                        </div>
                    </div>
                )}
                {((MatchType == 2 || MatchType == 1002) && columnType == 'industry') ? (
                    ""
                ) :
                    (<>
                        <div className="mb-4">
                            <h3 className="text-[15px] text-start font-semibold text-black mb-2">Filter</h3>
                            <div className="space-y-2 w-[335.6px] rounded-xl shadow-lg bg-[#F1F1F1] max-h-[calc(100vh-500px)] overflow-y-auto">
                                <div className="flex items-center p-2 hover:bg-gray-50 rounded">
                                    <input
                                        type="checkbox"
                                        id="select-all"
                                        checked={filterOptions.every(option => option.checked)}
                                        onChange={(e) => handleSelectAll(e.target.checked, e as unknown as React.MouseEvent)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-[22px] h-[22px] text-blue-600 border-gray-300 rounded"
                                    />
                                    <label htmlFor="select-all" className="ml-2 font-[500] text-[17px] text-black">
                                        (Select All)
                                    </label>
                                </div>

                                {filterOptions.map(option => (
                                    <div key={option.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                                        <input
                                            type="checkbox"
                                            id={option.id}
                                            checked={option.checked}
                                            onChange={(e) => handleFilterChange(option.id, e as unknown as React.MouseEvent)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-[28px] h-[28px] text-blue-600 border-gray-300 rounded"
                                        />
                                        <label htmlFor={option.id} className="ml-2 font-[500] text-[17px] text-black">
                                            <p>
                                                {option.label.length > 27
                                                    ? option.label.slice(0, 27) + '...'
                                                    : option.label}
                                            </p>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>)}

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="auto-apply"
                            checked={autoApply}
                            onChange={(e) => handleAutoApplyChange(e as unknown as React.MouseEvent)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label htmlFor="auto-apply" className="ml-2 font-medium text-[13px] text-black">
                            Auto Apply
                        </label>
                    </div>
                    {!autoApply && (
                        <button
                            onClick={handleApply}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                        >
                            Apply
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilterPopup;
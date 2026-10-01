import { useState, useRef, useEffect } from 'react';
import FilterPopup from './Popups/FilterPopup';
import { ChevronDown } from 'react-feather';
import { MemberName, Strategy, Tactics, RoleSough } from './filterOptions'

interface FilterOption {
    id: string;
    label: string;
    checked: boolean;
}

interface ColumnHeaderProps {
    title: string;
    columnType: string;
    onFilterChange?: (columnType: string, sortOrder: 'asc' | 'desc') => void;
    MatchType: number
    includedOptions?
    results?
    setIncludedOptions?
    orderBy?: {
        memberName: 'asc' | 'desc';
        industry: 'asc' | 'desc';
        strategy: 'asc' | 'desc';
    }
    setOrderBy?: React.Dispatch<
        React.SetStateAction<{
            memberName: 'asc' | 'desc';
            industry: 'asc' | 'desc';
            strategy: 'asc' | 'desc';
        }>
    >;
}

const ColumnHeader = ({ title, columnType, MatchType, includedOptions, setIncludedOptions, onFilterChange, orderBy, setOrderBy, results }: ColumnHeaderProps) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [countryOptions, setCountryOptions] = useState([]);
    const [industryOptions, setIndustryOptions] = useState([]);
    const [memberNameOptions, setMemberNameOptions] = useState(MemberName);
    const [strategyOptions, setStrategyOptions] = useState([]);
    const [tacticsOptions, setTacticOptions] = useState(Tactics);
    const [roleSoughtOptions, setRoleSoughtOptions] = useState(RoleSough);
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setIsPopupOpen(false);
            }
        };

        if (isPopupOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPopupOpen]);

    useEffect(() => {
        const options = MemberName.map(item => ({
            id: item.id,
            label: item.label,
            checked: includedOptions.memberName?.includes(item.id) ?? false
        }));
        setMemberNameOptions(options);

        const options1 = Strategy.map(item => ({
            id: item.id,
            label: item.label,
            checked: includedOptions.strategy?.includes(item.label) ?? false
        }));
        if (results) {
            if (results.length > 0 && results[0].MatchType === 1) {
                const strategyNames = [...new Set(results.map(r => r.StrategyName))];
                setStrategyOptions(
                    options1.filter(s => strategyNames.includes(s.label))
                );
            }
        }
        else {
            setStrategyOptions(options1);
        }

        const options2 = Tactics.map(item => ({
            id: item.id,
            label: item.label,
            checked: includedOptions.tactics?.includes(item.id) ?? false
        }));
        if (results) {
            if (results.length > 0 && results[0].MatchType === 1) {
                const tacticsNames = Array.from(
                    new Set(results.flatMap(r => r.Tactics || []))
                ).sort((a, b) => String(a).localeCompare(String(b)));
                setTacticOptions(
                    options2.filter(s => tacticsNames.includes(s.id))
                );
            }
        }
        else {
            setTacticOptions(options2);
        }

        const options3 = RoleSough.map(item => ({
            id: item.id,
            label: item.label,
            checked: includedOptions.roleSought?.includes(item.id) ?? false
        }));
        if(results){
            if (results.length > 0 && results[0].MatchType === 2) {
                const roleSoughtNames = Array.from(
                    new Set(results.flatMap(r => r.RoleSought || []))
                ).sort((a, b) => String(a).localeCompare(String(b)));
                setRoleSoughtOptions(
                    options3.filter(s => roleSoughtNames.includes(s.id))
                );
            }
        }
        else{
            setRoleSoughtOptions(options3);
        }

        if (results) {
            const allLocations = results.flatMap(r => r.BusinessLocation || []);
            const uniqueLocationsMap = new Map();
            allLocations.forEach(loc => {
                if (!uniqueLocationsMap.has(loc.id)) {
                    uniqueLocationsMap.set(loc.id, loc);
                }
            });
            const uniqueLocations = Array.from(uniqueLocationsMap.values());
            const option4 = uniqueLocations
                .sort((a, b) => a.value.localeCompare(b.value))
                .map(item => ({
                    id: item.id,
                    label: item.value,
                    checked: includedOptions.country?.includes(item.id) ?? false
                }));
            setCountryOptions(option4);
        }

        if (results && results[0].MatchType === 1) {
            const allIndustries = results.flatMap(r => r.ChildIndustries || []);
            const uniqueIndustriesMap = new Map();
            allIndustries.forEach(loc => {
                if (!uniqueIndustriesMap.has(loc.Id)) {
                    uniqueIndustriesMap.set(loc.Id, loc);
                }
            });
            const uniqueIndustries = Array.from(uniqueIndustriesMap.values());
            const option5 = uniqueIndustries
                .sort((a, b) => a.IndustryName.localeCompare(b.IndustryName))
                .map(item => ({
                    id: item.Id,
                    label: item.IndustryName,
                    checked: includedOptions.industry?.includes(item.Id) ?? false
                }));
            setIndustryOptions(option5);
        }
    }, [includedOptions])

    var getFilterOptions = () => {
        switch (columnType) {
            case 'memberName':
                return memberNameOptions

            case 'region':
                return countryOptions

            case 'strategy':
                return strategyOptions

            case 'tactics':
                return tacticsOptions

            case 'industry':
                return industryOptions

            case 'roleSought':
                return roleSoughtOptions;
            default:
                return [];
        }
    };

    const handleApply = (type: string, options, order: 'asc' | 'desc') => {
        const newFilter = options
            .filter(item => item.checked)
            .map(item => item.id);
        if (type == 'industry' && MatchType == 1) {
            setIncludedOptions((prev) => {
                const updatedIndustries = newFilter || [];
                return { ...prev, industry: updatedIndustries };
            });
        }
        else if (type == 'region') {
            setIncludedOptions((prev) => {
                const updatedCountries = newFilter || [];
                return { ...prev, country: updatedCountries };
            });
        }
        else if (type == 'memberName') {
            setIncludedOptions((prev) => {
                const updatedMembers = newFilter || [];
                return { ...prev, memberName: updatedMembers };
            });
        }
        else if (type == 'strategy') {
            const newFilter1 = options
                .filter(item => item.checked)
                .map(item => item.label);
            setIncludedOptions((prev) => {
                const updatedStrategies = newFilter1 || [];
                return { ...prev, strategy: updatedStrategies };
            });
        }
        else if (type == 'tactics') {
            setIncludedOptions((prev) => {
                const updatedTactics = newFilter || [];
                return { ...prev, tactics: updatedTactics };
            });
        }
        else if (type == 'roleSought') {
            setIncludedOptions((prev) => {
                const updatedRoleSought = newFilter || [];
                return { ...prev, roleSought: updatedRoleSought };
            });
        }
        if (onFilterChange) {
            onFilterChange(type, order);
        }
    };

    return (
        <div className="flex gap-2 cursor-pointer hover:bg-gray-100 p-3 rounded transition-colors duration-200">
            <div
                className="relative flex items-center"
                ref={popupRef}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsPopupOpen(!isPopupOpen);
                }}
            >
                <span className="font-semibold text-sm text-black">{title}</span>
                <ChevronDown size={16} className="text-black" />
                {isPopupOpen && (
                    <div className="absolute top-full left-0 z-50 mt-1">
                        {MatchType == 1 ? (
                            <FilterPopup
                                key={columnType}
                                filterOptions={getFilterOptions()}
                                showSort={['memberName', 'strategy'].includes(columnType)}
                                columnType={columnType}
                                onApply={handleApply}
                                MatchType={MatchType}
                                orderBy={orderBy}
                                setOrderBy={setOrderBy}
                            />
                        ) : (
                            <FilterPopup
                                key={columnType}
                                filterOptions={getFilterOptions()}
                                showSort={['memberName', 'strategy', 'industry'].includes(columnType)}
                                columnType={columnType}
                                onApply={handleApply}
                                MatchType={MatchType}
                                orderBy={orderBy}
                                setOrderBy={setOrderBy}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ColumnHeader;
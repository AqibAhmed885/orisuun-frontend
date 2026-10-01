'use client';

import React, { useEffect, useState } from 'react';
import { getAllIndustries } from '@/server-actions/profile';
import { useFormContext } from 'react-hook-form';

interface IndustryNode {
    Id: number;
    name: string;
    children?: IndustryNode[];
}

interface IndustrySelectorProps {
    onChange: (selected: number[]) => void;
}

const IndustrySelector: React.FC<IndustrySelectorProps> = ({ onChange }) => {
    const { trigger, watch } = useFormContext();
    const previousIndustries = watch('Industries');
    const [selectedIndustries, setSelectedIndustries] = useState<number[]>([]);
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
    const [industryTree, setIndustryTree] = useState<IndustryNode[]>([]);
    const [industryType, setIndustryType] = useState<'service' | 'goods'>('service');

    useEffect(()=>{
        if(previousIndustries){
            setSelectedIndustries(previousIndustries)
        }
    },[previousIndustries]);
    
    const findIndustryNameById = (id: number, nodes: IndustryNode[]): string | null => {
        for (const node of nodes) {
            if (node.Id === id) return node.name;
            if (node.children) {
                const found = findIndustryNameById(id, node.children);
                if (found) return found;
            }
        }
        return null;
    };

    const toggleSelect = (id: number) => {
        const updated = selectedIndustries.includes(id)
            ? selectedIndustries.filter(i => i !== id)
            : selectedIndustries.length < 3 ? [...selectedIndustries, id] : selectedIndustries;
        setSelectedIndustries(updated);
        onChange(updated);
        trigger('Industries');
    };

    const toggleExpand = (key: string) => {
        setExpandedCategories(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const renderSubIndustries = (nodes: IndustryNode[], path = '') => (
        <div className="bg-[#F5F8FF] px-6 py-3 space-y-3">
            {nodes.map((node) => {
                const currentPath = `${path}/${node.name}`;
                if (node.children && node.children.length > 0) {
                    return (
                        <div key={currentPath}>
                            <div
                                className="text-[14px] font-semibold text-gray-700 cursor-pointer flex justify-between items-center py-2"
                                onClick={() => toggleExpand(currentPath)}
                            >
                                {node.name}
                                <span>
                                    {expandedCategories[currentPath] ? (
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M15 12.5L10 7.5L5 12.5" stroke="#2D65DD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M5 7.5L10 12.5L15 7.5" stroke="#101828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </span>
                            </div>
                            {expandedCategories[currentPath] &&
                                renderSubIndustries(node.children, currentPath)}
                        </div>
                    );
                }

                return (
                    <label key={node.Id} className="relative flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selectedIndustries.includes(node.Id)}
                            onChange={() => toggleSelect(node.Id)}
                            className="peer appearance-none w-[20px] h-[20px] border border-gray-300 rounded-[6px] bg-white checked:bg-[#2357C6] checked:border-[#2357C6] focus:outline-none focus:ring-2 focus:ring-[#2357C6]"
                        />
                        <svg
                            className="absolute left-0 top-0 w-[20px] h-[20px] text-white pointer-events-none opacity-0 peer-checked:opacity-100"
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M5 10l3 3 7-7" />
                        </svg>
                        <span className="ml-3 text-[14px] font-medium text-gray-800">{node.name}</span>
                    </label>
                );
            })}
        </div>
    );

    const buildIndustryTree = (
        parentId: number,
        allIndustries: { Id: number; Name: string; ParentId: number }[]
    ): IndustryNode[] => {
        return allIndustries
            .filter(industry => industry.ParentId === parentId)
            .map(industry => ({
                Id: industry.Id, // ✅ use 'Id' to match everywhere else
                name: industry.Name,
                children: buildIndustryTree(industry.Id, allIndustries),
            }));
    };

    useEffect(() => {
        const fetchIndustries = async () => {
            try {
                const response = await getAllIndustries();
                if (response.success) {
                    const {
                        LevelTwoIndustries,
                        LevelThreeIndustries,
                        LevelFourIndustries,
                    } = response.data;

                    const all = [
                        ...LevelTwoIndustries,
                        ...LevelThreeIndustries,
                        ...LevelFourIndustries,
                    ];

                    const rootId = industryType === 'goods' ? 1 : 155;
                    const tree = buildIndustryTree(rootId, all);
                    setIndustryTree(tree);
                }
            } catch (error) {
                console.error('Error fetching industries:', error);
            }
        };

        fetchIndustries();
    }, [industryType]);

    const [isDropdownOpen, setIsDropdownOpen] = useState(true);
    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    return (
        <div className="w-full mt-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => setIndustryType('service')}
                    className={`w-full rounded-lg border px-4 py-3 text-left text-[16px] font-semibold transition-colors ${industryType === 'service'
                        ? 'border-[#B2DDFF] bg-[#EFF8FF] text-[#194185]'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    Service-Producing Industries
                </button>
                <button
                    type="button"
                    onClick={() => setIndustryType('goods')}
                    className={`w-full rounded-lg border px-4 py-3 text-left text-[16px] font-semibold transition-colors ${industryType === 'goods'
                        ? 'border-[#B2DDFF] bg-[#EFF8FF] text-[#194185]'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    Goods-Producing Industries
                </button>
            </div>

            <div className="relative w-full">
                <button
                    type="button"
                    onClick={toggleDropdown}
                    className="flex w-full items-center justify-between gap-3 rounded-lg border border-gray-300 px-4 py-3 text-left shadow-sm min-h-[3rem]"
                >
                    <div className="flex flex-1 flex-wrap gap-2 items-center">
                        {selectedIndustries.map((id) => {
                            const name = findIndustryNameById(id, industryTree);
                            return (
                                <span
                                    key={id}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        toggleSelect(id);
                                    }}
                                    className="bg-[#F0F7FF] text-[#1E4CD4] px-4 py-2 rounded-[6px] text-[12px] font-medium cursor-pointer"
                                >
                                    {name} ✕
                                </span>
                            );
                        })}
                        <span className="text-gray-500 text-[16px] placeholder-gray-400">
                            Select industry that fits
                        </span>
                    </div>
                    <span className="text-gray-400 flex-shrink-0">
                        <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                            <path d="M6.00011 4.47656L10.1251 0.351562L11.3034 1.5299L6.00011 6.83323L0.696777 1.5299L1.87511 0.351562L6.00011 4.47656Z" fill="#667085" />
                        </svg>
                    </span>
                </button>

                {isDropdownOpen && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-gray-200 shadow-md bg-white">
                        {industryTree.map((category) => {
                            const categoryKey = category.name;
                            return (
                                <div key={categoryKey}>
                                    <div
                                        className="px-4 py-3 text-[16px] font-semibold text-gray-700 cursor-pointer flex justify-between items-center hover:bg-gray-50"
                                        onClick={() => toggleExpand(categoryKey)}
                                    >
                                        {category.name}
                                        <span className="text-gray-400">
                                            {expandedCategories[categoryKey] ? (
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                    <path d="M15 12.5L10 7.5L5 12.5" stroke="#2D65DD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            ) : (
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                    <path d="M5 7.5L10 12.5L15 7.5" stroke="#101828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                        </span>
                                    </div>
                                    {expandedCategories[categoryKey] && category.children && renderSubIndustries(category.children, categoryKey)}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default IndustrySelector;

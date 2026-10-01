import { useEffect, useState } from "react";
import Editor from './Editor';
import { CalendarPlus, DollarSign } from 'lucide-react';
import clsx from "clsx";
import { useFormContext } from "react-hook-form";

const visibilityTabs = [
    { id: 1, label: "Everyone" },
    { id: 7, label: "Investors" },
    { id: 8, label: "Mentors" },
    { id: 2, label: "Strategy Consultants" },
    { id: 3, label: "Experts" },
    { id: 4, label: "Advocate" },
    { id: 5, label: "Partners" },
];

const formatAMPM = (timeStr: string) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hr12 = hours % 12 || 12;
    return `${hr12}:${minutes?.toString().padStart(2, '0')} ${ampm}`;
};

const AboutBusiness = () => {
    const { setValue, watch, register, formState: { errors } } = useFormContext();
    const languages = (watch('Languages')?.split(',') || []).map(lang => lang.trim()).filter(Boolean);
    const prevVisibility = watch('RevenueVisibility');
    const fromTime = watch('BusinessHours.from');
    const toTime = watch('BusinessHours.to');
    const [isOpen, setIsOpen] = useState(false);
    const annualRevenue = watch('AnnualRevenueRange');
    const [openRevenueDropdown, setOpenRevenueDropdown] = useState(false);

    const annualRevenueOptions = [
        { value: "", label: "Select range", disabled: true },
        { value: "0", label: "0" },
        { value: "$1 - $29,999", label: "$1 - $29,999" },
        { value: "$30,000 - $74,999", label: "$30,000 - $74,999" },
        { value: "$75,000 - $149,999", label: "$75,000 - $149,999" },
        { value: "$150,000 - $399,999", label: "$150,000 - $399,999" },
        { value: "$400,000 - $749,999", label: "$400,000 - $749,999" },
        { value: "$750,000 - $999,999", label: "$750,000 - $999,999" },
        { value: "$1M – $3M", label: "$1M – $3M" },
        { value: "$3M - $10M", label: "$3M - $10M" },
        { value: "Over $10M", label: "Over $10M" },
        { value: "Over $100M", label: "Over $100M" },
        { value: "Over $1B", label: "Over $1B" },
    ];


    const handleSetHours = () => {
        if (fromTime && toTime) {
            const formatted = `${fromTime}-${toTime}`;
            setValue('BusinessHoursString', formatted);
        }
        setIsOpen(false);
    };

    const [revenueVisible, setRevenueVisible] = useState(false);
    const [selectedTabs, setSelectedTabs] = useState<number[]>([]);

    useEffect(() => {
        if (prevVisibility) {
            const visibilityArray = JSON.parse(prevVisibility)
            if (visibilityArray && visibilityArray?.length > 0) {
                setRevenueVisible(visibilityArray)
                setSelectedTabs(visibilityArray)
            }
        }
    }, [prevVisibility])

    const toggleRevenueVisibility = () => {
        const newState = !revenueVisible;
        setRevenueVisible(newState);
        setValue('IsRevenueVisible', newState);

        if (!newState) {
            setSelectedTabs([]);
            setValue('RevenueVisibility', JSON.stringify([]));
        }
    };


    const handleTabClick = (label: string) => {
        if (!revenueVisible) return;

        const clickedTab = visibilityTabs.find(tab => tab.label === label);
        if (!clickedTab) return;

        let updatedTabs: number[];

        if (label === "Everyone") {
            const allIdsExceptEveryone = visibilityTabs
                .filter(t => t.label !== "Everyone")
                .map(t => t.id);

            if (selectedTabs.length === allIdsExceptEveryone.length) {
                // All were selected, now unselect all
                updatedTabs = [];
            } else {
                // Select all except 'Everyone'
                updatedTabs = [...allIdsExceptEveryone];
            }
        } else {
            const alreadySelected = selectedTabs.includes(clickedTab.id);
            updatedTabs = alreadySelected
                ? selectedTabs.filter(id => id !== clickedTab.id)
                : [...selectedTabs, clickedTab.id];

            // Check if all tabs (except "Everyone") are selected
            const allExceptEveryoneIds = visibilityTabs
                .filter(t => t.label !== "Everyone")
                .map(t => t.id);

            const manuallySelectedAll = allExceptEveryoneIds.every(id => updatedTabs.includes(id));

            if (manuallySelectedAll) {
                updatedTabs = [...allExceptEveryoneIds];
            }
        }

        setSelectedTabs(updatedTabs);
        setValue('RevenueVisibility', JSON.stringify(updatedTabs)); // Save as string '[7,8,2,3,4,5]'
    };

    return (
        <div className='w-[95%] mx-auto min-h-[64rem] 3xl:min-h-[52rem] bg-white border border-gray-300 rounded-2xl shadow-[#1018280F] shadow-md mt-5'>
            <div className="max-w-full mx-auto">
                <div className="md:w-[95%] mx-auto bg-white rounded-t-2xl  h-auto relative p-2 md:px-6 py-4">
                    <div className='pb-4'>
                        <h2 className='text-[16px] font-semibold'>About Your Business</h2>
                    </div>

                    <Editor
                        label={<>
                            <span className="text-red-500">*</span> Tell us about your business
                        </>}
                        placeholder="Describe your business and what makes you unique..."
                        name="About"
                    />
                    {typeof errors.About?.message === 'string' && (
                        <p className="mb-5 text-[16px] text-red-600">{errors.About.message}</p>
                    )}

                    <Editor
                        label="Tell us about your business mission"
                        placeholder="Describe your business mission"
                        name="Mission"
                    />
                    {typeof errors.Mission?.message === 'string' && (
                        <p className="mb-5 text-[16px] text-red-600">{errors.Mission.message}</p>
                    )}

                    <Editor
                        label="Tell us about your business vision"
                        placeholder="Describe your business vision"
                        name="Vision"
                    />
                    {typeof errors.Vision?.message === 'string' && (
                        <p className="mb-5 text-[16px] text-red-600">{errors.Vision.message}</p>
                    )}

                    {/* Language Selector */}
                    <div className="mt-4">
                        <h2 className='text-[16px] text-gray-700 font-semibold'>Languages</h2>
                        <h2 className='text-[14px] text-gray-700 font-semibold mb-2'>Select as many language as apply </h2>

                        <div className="w-full border border-gray-300 rounded-md p-2 min-h-[48px] flex flex-wrap gap-2 items-center">
                            {languages.map((lang, idx) => (
                                <div
                                    key={idx}
                                    className="bg-[#EFF8FF] text-[#194185] border border-[#B2DDFF] px-3 py-1 rounded-md flex items-center text-[14px] font-medium"
                                >
                                    {lang}
                                    <button
                                        type="button"
                                        className="ml-2 text-[#2357C6] hover:text-gray-200"
                                        onClick={() => {
                                            const updated = languages.filter((_, i) => i !== idx);
                                            setValue('Languages', updated.join(','));
                                        }}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                            <input
                                type="text"
                                placeholder="Select all language that applies"
                                className="flex-grow outline-none text-[16px] px-2 py-1"
                                onKeyDown={(e) => {
                                    if ((e.key === 'Enter' || e.key === ',') && e.currentTarget.value.trim()) {
                                        e.preventDefault();
                                        const newLang = e.currentTarget.value.trim();
                                        if (!languages.includes(newLang)) {
                                            const updated = [...languages, newLang];
                                            setValue('Languages', updated.join(','));
                                        }
                                        e.currentTarget.value = '';
                                    }
                                }}
                            />
                            {typeof errors.Languages?.message === 'string' && (
                                <p className="mt-1 text-[16px] text-red-600">{errors.Languages.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="w-full mt-6 flex flex-col md:flex-row gap-6">
                        {/* Business Hours */}
                        <div className="relative w-full md:w-1/2">
                            <label className="block text-[16px] font-semibold text-gray-700 mb-2">Business Hours <span className="text-red-500">*</span></label>
                            <div className="flex items-center px-4 py-2 rounded-lg border border-gray-300 shadow-sm bg-white focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                                <input
                                    type="text"
                                    value={
                                        fromTime && toTime
                                            ? `${formatAMPM(fromTime)} to ${formatAMPM(toTime)}`
                                            : ''
                                    }
                                    placeholder="Select business hours"
                                    readOnly
                                    className="flex-1 text-[16px] text-gray-800 placeholder:text-gray-400 outline-none bg-transparent"
                                />
                                <CalendarPlus
                                    className="w-5 h-5 text-gray-500 ml-2 cursor-pointer"
                                    onClick={() => setIsOpen(!isOpen)}
                                />
                            </div>

                            {/* Time Picker Dropdown */}
                            {isOpen && (
                                <div className="absolute z-10 mt-2 w-full p-4 bg-white border border-gray-200 rounded-xl shadow-lg">
                                    <div className="flex gap-4 items-center w-full">
                                        <div className="flex flex-col w-[50%]">
                                            <label className="text-[14px] text-gray-600">From</label>
                                            <input
                                                type="time"
                                                className="border border-gray-300 rounded-md p-1 text-[16px]"
                                                {...register('BusinessHours.from')}
                                                onChange={(e) => setValue('BusinessHours.from', e.target.value)}
                                                value={fromTime || ''}
                                            />
                                        </div>
                                        <div className="flex flex-col w-[50%]">
                                            <label className="text-[14px] text-gray-600">To</label>
                                            <input
                                                type="time"
                                                className="border border-gray-300 rounded-md p-1 text-[16px]"
                                                {...register('BusinessHours.to')}
                                                onChange={(e) => setValue('BusinessHours.to', e.target.value)}
                                                value={toTime || ''}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        className="mt-4 px-4 py-2 bg-[#2357C6] text-white rounded-md text-[14px] hover:bg-[#2357C6]"
                                        onClick={handleSetHours}
                                    >
                                        Set Hours
                                    </button>
                                </div>
                            )}
                            {typeof errors.BusinessHours?.message === 'string' && (
                                <p className="mt-1 text-[16px] text-red-600">{errors.BusinessHours.message}</p>
                            )}
                        </div>

                        {/* Annual Revenue */}
                        <div className="space-y-2 w-full md:w-1/2">
                            <label className="block text-[16px] font-semibold text-gray-700">Annual Revenue
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div
                                    onClick={() => setOpenRevenueDropdown(!openRevenueDropdown)}
                                    className={`w-full flex justify-between items-center text-[16px] font-normal ${!annualRevenue ? "text-gray-500" : "text-black-500"
                                        } px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none cursor-pointer`}
                                >
                                    <p>{annualRevenue || "Select range"}</p>
                                    <svg
                                        width="12"
                                        height="8"
                                        viewBox="0 0 12 8"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`transform transition-transform duration-200 ${openRevenueDropdown ? "rotate-180" : ""
                                            }`}
                                    >
                                        <path
                                            d="M5.99865 4.97656L10.1236 0.851562L11.302 2.0299L5.99865 7.33323L0.695312 2.0299L1.87365 0.851562L5.99865 4.97656Z"
                                            fill="#667085"
                                        />
                                    </svg>
                                </div>

                                {openRevenueDropdown && (
                                    <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white shadow-md">
                                        {annualRevenueOptions
                                            .filter(option => !option.disabled)
                                            .map(option => (
                                                <div
                                                    key={option.value}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[16px] text-black-500"
                                                    onClick={() => {
                                                        setValue('AnnualRevenueRange', option.value);
                                                        setOpenRevenueDropdown(false);
                                                    }}
                                                >
                                                    {option.label}
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                            {typeof errors.AnnualRevenueRange?.message === 'string' && (
                                <p className="mt-1 text-[16px] text-red-600">
                                    {errors.AnnualRevenueRange.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Revenue Visibility */}
                    <div className="mt-4 md:w-[55%] mb-5">
                        <div className="flex justify-between w-[95%]">
                            <h2 className='text-[16px] text-gray-700 font-semibold'>Enable annual revenue visibility</h2>

                            {/* Toggle */}
                            <label className="relative inline-block w-[36px] h-[20px] cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={revenueVisible}
                                    onChange={toggleRevenueVisibility}
                                />
                                {/* Background */}
                                <div className="w-full h-full bg-[#EAECF0] rounded-full peer-checked:bg-[#2357C6] transition-colors duration-300"></div>

                                {/* Knob */}
                                <div
                                    className={`absolute top-0.5 left-0.5 w-[16px] h-[16px] bg-white rounded-full shadow-[0_1px_2px_rgba(16,24,40,0.06),0_1px_3px_rgba(16,24,40,0.1)] transition-transform duration-300 ${revenueVisible ? "translate-x-[17px]" : ""
                                        }`}
                                ></div>
                            </label>
                        </div>

                        {/* Visibility Tabs */}
                        <div className="flex flex-wrap gap-4 mt-4">
                            {visibilityTabs.map(tab => {
                                const isSelected = selectedTabs.includes(tab.id);

                                return (
                                    <button
                                        key={tab.id}
                                        disabled={!revenueVisible}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleTabClick(tab.label);
                                        }}
                                        className={clsx(
                                            "px-4 py-2 rounded-md border transition-all",
                                            {
                                                "bg-[#2357C6] text-white text-[14px] font-semibold border-[#2357C6] shadow": isSelected,
                                                "bg-white text-gray-700 text-[14px] font-semibold border-gray-300 shadow-sm hover:bg-gray-100": revenueVisible && !isSelected,
                                                "opacity-50 text-gray-700 text-[14px] font-semibold cursor-not-allowed": !revenueVisible,
                                            }
                                        )}
                                    >
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutBusiness;

'use client';

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

const ServiceArea = () => {
    const {
        formState: { errors },
        setValue,
        watch
    } = useFormContext();

    const prevAreaOfExpertise = watch('AreaOfExpertise');
    const [inputValue, setInputValue] = useState('');
    const [selectedAreaOfExpertise, setSelectedAreaOfExpertise] = useState<string[]>([]);
    const [openExpertiseAreaDropdown, setOpenExpertiseAreaDropdown] = useState(false)

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddAreaOfExpertise(inputValue);
            setInputValue('');
        }
    };
    useEffect(() => {
        if (!selectedAreaOfExpertise.length && prevAreaOfExpertise) {
            setSelectedAreaOfExpertise(prevAreaOfExpertise.split('|'));
        }
    }, [prevAreaOfExpertise]);

    function handleAddAreaOfExpertise(value: string) {
        if (!selectedAreaOfExpertise.includes(value)) {
            setSelectedAreaOfExpertise((prev) => [...prev, value]);
        }
    }

    function handleRemoveAreaOfExpertise(value: string) {
        setSelectedAreaOfExpertise((prev) => prev.filter((style) => style !== value));
    }

    useEffect(() => {
        const formattedStyles = selectedAreaOfExpertise.join('|');
        setValue('AreaOfExpertise', formattedStyles);
    }, [selectedAreaOfExpertise, setValue]);

    return (
        <div className="max-w-[97%] mx-auto">
            <div className="pt-5">

                <h2 className="text-[16px] font-semibold text-gray-900 mb-2">Area of Expertise*</h2>
                <h2 className="font-semibold text-gray-700 mb-1">Enter area of expertise</h2>

                <div className={`w-full flex gap-2 md:gap-4 justify-between items-center text-[16px] font-normal text-gray-500 px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none`}>
                    <div className="flex gap-1">
                        {selectedAreaOfExpertise.map((val, index) => (
                            <span
                                key={index}
                                className="flex items-center gap-x-1 bg-[#EFF8FF] text-[#194185] px-2 rounded-md text-md border border-[#B2DDFF]"
                            >
                                {val}
                                <button
                                    type="button"
                                    className="text-blue-500 hover:text-blue-700"
                                    onClick={() => handleRemoveAreaOfExpertise(val)}
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                    <div onClick={() => { setOpenExpertiseAreaDropdown(!openExpertiseAreaDropdown) }} className='flex-grow'>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full flex-1 outline-none text-black placeholder-gray-400"
                            placeholder="Enter area of expertise (press Enter/Return after each area entered)"
                        />
                    </div>
                </div>
                {typeof errors.AreaOfExpertise?.message === 'string' && (
                    <span className="text-red-500">
                        {errors.AreaOfExpertise.message}
                    </span>
                )}
            </div>
        </div >
    );
};

export default ServiceArea;

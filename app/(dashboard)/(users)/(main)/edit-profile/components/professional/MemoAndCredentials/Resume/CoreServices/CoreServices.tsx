'use client';

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

const CoreServices = () => {
    const {
        formState: { errors },
        setValue,
        watch
    } = useFormContext();

    const prevCoreServices = watch('CoreServices');
    const [selectedCoreServices, setSelectedCoreServices] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    
    useEffect(() => {
        if (!selectedCoreServices.length && prevCoreServices) {
            setSelectedCoreServices(prevCoreServices.split('|'));
        }
    }, [prevCoreServices]);

    function handleAddCoreServices(value: string) {
        if (!selectedCoreServices.includes(value)) {
            setSelectedCoreServices((prev) => [...prev, value]);
        }
    }

    function handleRemoveCoreServices(value: string) {
        setSelectedCoreServices((prev) => prev.filter((style) => style !== value));
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddCoreServices(inputValue);
            setInputValue('');
        }
    };

    useEffect(() => {
        const formattedStyles = selectedCoreServices.join('|');
        setValue('CoreServices', formattedStyles);
    }, [selectedCoreServices, setValue]);

    return (
        <div className="max-w-[97%] mx-auto">
            <div className="pt-5">
                <h2 className="text-[16px] font-semibold text-gray-900 mb-4">Professional Snapshot*</h2>
                <h2 className="text-[16px] font-semibold text-gray-900 mb-4">Core Services</h2>
                <h2 className="font-semibold text-gray-700 mb-1">What are your core services?</h2>

                <div className={`w-full flex gap-2 md:gap-4 justify-between items-center text-[16px] font-normal text-gray-500 px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none`}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 outline-none text-black placeholder-gray-400"
                        placeholder="Enter core services (press Enter/Return after each service entered)"
                    />
                </div>

                <div className="flex gap-2 mt-2">
                    {selectedCoreServices.map((val, index) => (
                        <span
                            key={index}
                            className="flex items-center gap-x-1 bg-[#EFF8FF] text-[#194185] px-3 py-2 rounded-md text-md border border-[#B2DDFF]"
                        > {val}
                            <button
                                type="button"
                                className="text-blue-500 hover:text-blue-700"
                                onClick={() => handleRemoveCoreServices(val)}
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
                {typeof errors.CoreServices?.message === 'string' && (
                    <span className="text-red-500">
                        {errors.CoreServices.message}
                    </span>
                )}
            </div>
        </div >
    );
};

export default CoreServices;

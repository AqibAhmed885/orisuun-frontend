import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

const SupportFocus = () => {
    const { setValue, watch, formState: { errors } } = useFormContext();
    const [selectedSupportFocus, setSelectedSupportFocus] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const supportFocus = watch('SupportFocus') || '';

    useEffect(() => {
        if (!selectedSupportFocus.length && supportFocus) {
            setSelectedSupportFocus(supportFocus.split('|'));
        }
    }, [supportFocus]);

    function handleAddSupportFocus(value: string) {
        if (!value.trim()) return;

        const trimmedValue = value.trim();

        if (!selectedSupportFocus.includes(trimmedValue)) {
            setSelectedSupportFocus((prev) => [...prev, trimmedValue]);
        }

        setInputValue('');
    }

    function handleRemoveSupportFocus(value: string) {
        setSelectedSupportFocus((prev) => prev.filter((item) => item !== value));
    }

    useEffect(() => {
        const formattedSupportFocus = selectedSupportFocus.join('|');
        setValue('SupportFocus', formattedSupportFocus);
    }, [selectedSupportFocus, setValue]);

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSupportFocus(inputValue);
        }
    }

    return (
        <div className="max-w-[97%] mx-auto">
            <div className="pt-5">
                <h2 className="text-[16px] font-semibold text-gray-900 mb-4">Support Focus*</h2>

                <div className="text-[14px] font-semibold text-gray-700 mb-2">
                    <div>Select all that applies</div>
                </div>

                <div className="mb-3">
                    <div className="w-full flex flex-wrap items-center border border-gray-200 rounded-lg p-3 text-[16px] text-gray-700 placeholder-gray-400 shadow-md">
                        <div className="flex gap-1 items-center flex-wrap">
                            {selectedSupportFocus.map((val, index) => (
                                <span
                                    key={index}
                                    className="flex items-center gap-1 bg-[#EFF8FF] text-[#194185] px-3 rounded-md text-md border border-[#B2DDFF]"
                                >
                                    {val}
                                    <button
                                        type="button"
                                        className="text-blue-500 hover:text-blue-700"
                                        onClick={() => handleRemoveSupportFocus(val)}
                                    >
                                        &times;
                                    </button>
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 flex-grow ml-2">
                            <input
                                type='text'
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className='w-full focus:outline-none'
                                placeholder='Enter all that applies'
                            />
                        </div>
                    </div>

                    <div className="max-h-[7.5rem] overflow-y-auto pr-1 mt-1">
                        {typeof errors.SupportFocus?.message === 'string' && (
                            <span className="text-red-500">
                                {errors.SupportFocus.message}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportFocus;


import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

const OPTIONS = [
    'Fundraising Matching',
    'Mentorship',
    'Investments',
    'Professional Support',
    'Pro Bono Work',
    'Vendor Search',
    'Amplify Voices',
    'Promote And Advocate',
    'Resource Sharing',
    'Technology Sharing',
    'Discounts',
    'Training'
];

const PartnershipFocus = () => {
    const { setValue, watch, control, formState: { errors } } = useFormContext();
    const [selectedPartnershipFocus, setSelectedPartnershipFocus] = useState([])
    const [showOptions, setShowOptions] = useState(false)
    const partnershipFocus = watch('PartnershipFocus') || '';

    useEffect(() => {
        if (!selectedPartnershipFocus.length && partnershipFocus) {
            setSelectedPartnershipFocus(partnershipFocus.split('|'));
        }
    }, [partnershipFocus]);

    function handleAddPartnershipFocus(value: string) {
        if (!selectedPartnershipFocus.includes(value)) {
            setSelectedPartnershipFocus((prev) => [...prev, value]);
        }
    }

    function handleRemovePartnershipFocus(value: string) {
        setSelectedPartnershipFocus((prev) => prev.filter((style) => style !== value));
    }

    useEffect(() => {
        const formattedPartnershipFocus = selectedPartnershipFocus.join('|');
        setValue('PartnershipFocus', formattedPartnershipFocus);
    }, [selectedPartnershipFocus, setValue]);

    return (
        <>
            <div className="max-w-[97%] mx-auto">
                <div className="pt-5">
                    <h2 className="text-[16px] font-semibold text-gray-900 mb-4">Partnership Focus*</h2>

                    <div className="text-[14px] font-semibold text-gray-700 mb-2">
                        <div>Select all that applies</div>
                    </div>

                    <div className="mb-3">
                        <div className="w-full flex flex-wrap items-center border border-gray-200 rounded-lg p-3 text-[16px] text-gray-700 placeholder-gray-400 shadow-md">
                            <div className="flex gap-1 items-center">
                                {selectedPartnershipFocus.map((val, index) => (
                                    <span
                                        key={index}
                                        className="flex items-center gap-1 bg-[#EFF8FF] text-[#194185] px-3 rounded-md text-md border border-[#B2DDFF]"
                                    >
                                        {val}
                                        <button
                                            type="button"
                                            className="text-blue-500 hover:text-blue-700"
                                            onClick={() => handleRemovePartnershipFocus(val)}
                                        >
                                            &times;
                                        </button>
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 flex-grow justify-between ml-2 cursor-pointer" onClick={() => { setShowOptions(!showOptions) }}>
                                <p className="text-gray-500">Select focus that applies</p>
                                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.99865 11.4766L14.1236 7.35156L15.302 8.5299L9.99865 13.8332L4.69531 8.5299L5.87365 7.35156L9.99865 11.4766Z" fill="#667085" />
                                </svg>
                            </div>
                        </div>

                        <div className='flex w-full justify-end'>
                            {showOptions && (
                                <div className="relative mt-2 w-full md:w-1/4 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                                    {OPTIONS.map((option, idx) => (
                                        <div
                                            key={idx}
                                            className={`p-2 px-4 text-lg cursor-pointer hover:bg-gray-100 flex items-center justify-between ${selectedPartnershipFocus.includes(option) ? 'bg-[#EFF8FF]' : ''
                                                }`}
                                            onClick={() =>
                                                selectedPartnershipFocus.includes(option)
                                                    ? handleRemovePartnershipFocus(option)
                                                    : handleAddPartnershipFocus(option)
                                            }
                                        >
                                            {selectedPartnershipFocus.includes(option) ? (
                                                <span className="text-blue-500 text-xs"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="0.5" y="0.5" width="19" height="19" rx="5.5" fill="#2357C6" />
                                                    <rect x="0.5" y="0.5" width="19" height="19" rx="5.5" stroke="#2357C6" />
                                                    <path d="M14.6654 6.5L8.2487 12.9167L5.33203 10" stroke="#F5F8FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                                </span>
                                            ) : (
                                                <span className="text-blue-500 text-xs"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="0.5" y="0.5" width="19" height="19" rx="5.5" fill="white" />
                                                    <rect x="0.5" y="0.5" width="19" height="19" rx="5.5" stroke="#D0D5DD" />
                                                </svg>
                                                </span>
                                            )}
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="max-h-[7.5rem] overflow-y-auto pr-1">
                            {typeof errors.PartnershipFocus?.message === 'string' && (
                                <span className="text-red-500">
                                    {errors.PartnershipFocus.message}
                                </span>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default PartnershipFocus;
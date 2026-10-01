import { useFormContext } from 'react-hook-form';
import AvailabilityTimePicker from './AvailabilityTimePicker';
import { useEffect, useState } from 'react';

const SessionInformation = () => {
    const { register, watch, setValue, control, formState: { errors } } = useFormContext();
    const prevStyles = watch('SessionStyle');
    const responseTime = watch('ResponseTime') || '';
    const availableToMentor = watch('AvailableToMentor');
    const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

    const handleSelect = (value: boolean) => {
        setValue('AvailableToMentor', value);
    };

    useEffect(() => {
        if (!selectedStyles.length && prevStyles) {
            setSelectedStyles(prevStyles.split('|'));
        }
    }, [prevStyles]);

    function handleAddStyles(value: string) {
        if (!selectedStyles.includes(value)) {
            setSelectedStyles((prev) => [...prev, value]);
        }
    }

    function handleRemoveStyles(value: string) {
        setSelectedStyles((prev) => prev.filter((style) => style !== value));
    }

    useEffect(() => {
        const formattedStyles = selectedStyles.join('|');
        setValue('SessionStyle', formattedStyles);
    }, [selectedStyles, setValue]);

    return (
        <>
            <div className="max-w-[97%] mx-auto">
                <div className="pt-5">
                    <h2 className="text-[16px] font-semibold text-gray-900 mb-4">Session Information</h2>

                    <div className="grid grid-cols-2 gap-4 text-[14px] font-semibold text-gray-700 mb-2">
                        <div>Select session style*</div>
                        <div>Response Time*</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                            <div className="relative">
                                <select
                                    onChange={(e) => handleAddStyles(e.target.value)}
                                    className="w-full px-4 py-3 text-[16px] border border-gray-300 text-gray-500 rounded-lg shadow-md focus:outline-none"
                                    defaultValue=""
                                >
                                    <option disabled value="">Select Session Styles</option>
                                    <option value={"One-on-One"}>One-on-One</option>
                                    <option value={"Group Sessions"}>Group Sessions</option>
                                    <option value={"In-Person"}>In-Person</option>
                                    <option value={"Online Session"}>Online Session</option>
                                </select>
                            </div>

                            {/* Styles display */}
                            <div className="max-h-[7.5rem] overflow-y-auto pr-1">
                                <div className="flex flex-wrap gap-1">
                                    {selectedStyles.map((val, index) => (
                                        <span
                                            key={index}
                                            className="flex items-center gap-1 bg-[#EFF8FF] text-[#194185] px-3 rounded-md text-md border border-[#B2DDFF] mt-2"
                                        >
                                            {val}
                                            <button
                                                type="button"
                                                className="text-blue-500 hover:text-blue-700"
                                                onClick={() => handleRemoveStyles(val)}
                                            >
                                                &times;
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                {typeof errors.SessionStyle?.message === 'string' && (
                                    <span className="text-red-500">
                                        {errors.SessionStyle.message}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div>
                            <select
                                className={`w-full px-4 py-3 text-[16px] border border-gray-300 ${responseTime === '' ? 'text-gray-500' : 'text-black-500'} rounded-lg shadow-md focus:outline-none`}
                                defaultValue=""
                                {...register('ResponseTime')}
                            >
                                <option disabled value="">Select Response Time</option>
                                <option value="less than one hour">less than one hour</option>
                                <option value="less than three hours">less than three hours</option>
                                <option value="less than 12 hours">less than 12 hours</option>
                                <option value="less than 24 hours">less than 24 hours</option>
                                <option value="less than three days">less than three days</option>
                                <option value="less than a week">less than a week</option>
                                <option value="more than a week">more than a week</option>
                            </select>

                            {typeof errors.ResponseTime?.message === 'string' && (
                                <span className="text-red-500">
                                    {errors.ResponseTime.message}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-[14px] font-semibold text-gray-700 mt-5 mb-2">
                        <div>Availability Time*</div>
                        <div>Available to mentor?*</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                            <AvailabilityTimePicker />
                            {typeof errors.AvailabilityTime?.message === 'string' && (
                                <span className="text-red-500">
                                    {errors.AvailabilityTime.message}
                                </span>
                            )}
                        </div>

                        <div>
                            <div className="flex gap-4 font-semibold">
                                <button
                                    type="button"
                                    onClick={() => handleSelect(true)}
                                    className={`px-5 py-2 rounded-lg shadow-md border 
                        ${availableToMentor === true ? 'bg-[#EFF8FF] text-[#194185] border-[#B2DDFF]' : 'bg-white text-gray-900 border-gray-400'}`}
                                >
                                    Yes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSelect(false)}
                                    className={`px-5 py-3 rounded-lg shadow-md border 
                        ${availableToMentor === false ? 'bg-[#EFF8FF] text-[#194185] border-[#B2DDFF]' : 'bg-white text-gray-900 border-gray-400'}`}
                                >
                                    No
                                </button>
                            </div>

                            <input type="hidden" {...register('AvailableToMentor')} />

                            {typeof errors.AvailableToMentor?.message === 'string' && (
                                <span className="text-red-500">
                                    {errors.AvailableToMentor.message}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SessionInformation;

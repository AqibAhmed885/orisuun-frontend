import React, { useEffect } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import InvestmentStageNotable from './InvestmentStageNotable';

interface NotableInvestment {
    Id: number;
    CompanyName: string;
    InvestmentAmt: string | number;
    InvestmentStage: string[];
    InvestmentStageFormatted?: string;
    InvestmentStatus: 'Active' | 'Exited';
}

const NotableInvestmentSection = ({ setDeleteNotableInvestmentIds }) => {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<{ NotableInvestments: NotableInvestment[] }>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'NotableInvestments',
    });

    // 👇 Add default row on mount if empty
    useEffect(() => {
        if (fields.length === 0) {
            append({
                Id: 0,
                CompanyName: '',
                InvestmentAmt: '',
                InvestmentStage: [],
                InvestmentStageFormatted: '',
                InvestmentStatus: "Active",
            });
        }
    }, [append, fields.length]);

    function handleRemove(index: number) {
        const field = fields[index];
        if (field.Id !== 0) {
            setDeleteNotableInvestmentIds(prev => ([...prev, field.Id]));
        }
        remove(index);
    }

    return (
        <div className='w-[95%] mx-auto bg-white border-1 border-black-900 rounded-2xl shadow-[#1018280F] shadow-md mt-5'>
            <div className="max-w-full mx-auto">
                <div className="w-[95%] mx-auto bg-white relative pt-5 pb-2">
                    <h2 className='text-[16px] font-semibold mb-4'>Notable Investment</h2>

                    {fields.map((item, index) => (
                        <div
                            key={item.id}
                            className={`grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 md:p-2 pb-4 relative ${index % 2 == 1 ? "bg-gray-100" : ""}`}
                        >
                            {/* Hidden Field for Id */}
                            <input
                                type="hidden"
                                {...register(`NotableInvestments.${index}.Id`)}
                            />
                            {/* Company Name */}
                            <div>
                                <label className="block text-[14px] font-semibold mb-1">Company’s Name</label>
                                <input
                                    type="text"
                                    {...register(`NotableInvestments.${index}.CompanyName`, {
                                        required: 'Company name is required',
                                    })}
                                    placeholder="Enter company’s name"
                                    className="w-full border border-gray-200 rounded-lg p-3 text-[16px] text-gray-500 placeholder-gray-400 shadow-md"
                                />
                                {errors.NotableInvestments?.[index]?.CompanyName?.message && (
                                    <p className="text-red-600 text-[14px]">
                                        {errors.NotableInvestments[index].CompanyName.message}
                                    </p>
                                )}
                            </div>

                            {/* Investment Amount */}
                            <div>
                                <label className="block text-[14px] font-semibold mb-1">Investment</label>
                                <input
                                    type="number"
                                    {...register(`NotableInvestments.${index}.InvestmentAmt`, {
                                        required: 'Investment amount is required',
                                    })}
                                    placeholder="Enter amount invested"
                                    className="w-full border border-gray-200 rounded-lg p-3 text-[16px] text-gray-500 placeholder-gray-400 shadow-md"
                                />
                                {errors.NotableInvestments?.[index]?.InvestmentAmt?.message && (
                                    <p className="text-red-600 text-[14px]">
                                        {errors.NotableInvestments[index].InvestmentAmt.message}
                                    </p>
                                )}
                            </div>

                            {/* Investment Stage */}
                            <InvestmentStageNotable index={index} />

                            {/* Investment Status */}
                            <div className="space-y-2 col-span-1">
                                <label className="block text-[16px] font-semibold text-black-500">Investment Status</label>
                                <select
                                    {...register(`NotableInvestments.${index}.InvestmentStatus`, {
                                        required: 'Investment status is required',
                                    })}
                                    className="w-full px-4 py-3 text-[16px] border border-gray-300 text-gray-500 rounded-lg shadow-sm focus:outline-none"
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select option</option>
                                    <option value="Active">Active</option>
                                    <option value="Exited">Exited</option>
                                </select>
                                {errors.NotableInvestments?.[index]?.InvestmentStatus?.message && (
                                    <p className="text-[14px] text-red-600">
                                        {errors.NotableInvestments[index].InvestmentStatus.message}
                                    </p>
                                )}
                            </div>

                            {/* Remove Button */}
                            {fields.length > 1 && (
                                <button
                                    type="button"
                                    className="absolute top-2 right-2 bg-gray-400 text-white font-semibold rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-600"
                                    onClick={() => handleRemove(index)}
                                    title='Remove'
                                >
                                    <svg width="10" height="10" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13 1L1 13M1 1L13 13" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    ))}

                    {/* Add More Button */}
                    <button
                        type="button"
                        onClick={() =>
                            append({
                                Id: 0,
                                CompanyName: '',
                                InvestmentAmt: '',
                                InvestmentStage: [],
                                InvestmentStageFormatted: '',
                                InvestmentStatus: "Active",
                            })
                        }
                        className="shadow-md text-sm text-[#1A4EFF] font-semibold mt-2 flex items-center gap-1 p-2 border rounded-md border-[#A0BCF9] bg-[#EAF0FE]"
                    >
                        <span className="text-[16px] font-semibold text-[#2D65DD]">＋</span> Add More
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotableInvestmentSection;

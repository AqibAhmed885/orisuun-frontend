import React from 'react';
import { useFormContext } from 'react-hook-form';

const InvestmentStatsSection = () => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <div className='w-[95%] mx-auto min-h-[20rem] md:min-h-[18rem] bg-white border-1 border-black-900 rounded-2xl shadow-[#1018280F] shadow-md mt-5'>
            <div className="max-full mx-auto">
                <div className="w-[95%] mx-auto bg-white h-48 relative">
                    <div className='pb-5 pt-5'>
                        <h2 className='text-[16px] font-semibold'>Investment Stats</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[14px] font-semibold mb-1">Investments</label>
                            <input
                                type="number"
                                {...register("InvestmentsNumber", { required: true })}
                                placeholder="Enter number of investments your organization has partook in"
                                className="w-full border border-gray-200 rounded-lg p-3 text-[16px] text-gray-500 placeholder-gray-400 shadow-md"
                            />
                            {typeof errors.InvestmentsNumber?.message === 'string' && <p className="text-red-600 text-[14px]">{errors.InvestmentsNumber.message}</p>}
                        </div>

                        <div>
                            <label className="block text-[14px] font-semibold mb-1">Exits</label>
                            <input
                                type="number"
                                {...register("Exits", { required: true })}
                                placeholder="Enter number of investment exits that applies to your organization"
                                className="w-full border border-gray-200 rounded-lg p-3 text-[16px] text-gray-500 placeholder-gray-400 shadow-md"
                            />
                            {typeof errors.Exits?.message === 'string' && <p className="text-red-600 text-[14px]">{errors.Exits.message}</p>}
                        </div>

                        <div>
                            <label className="block text-[14px] font-semibold mb-1">Active Portfolio</label>
                            <input
                                type="number"
                                {...register("ActivePortfolio", { required: true })}
                                placeholder="Enter number of active portfolio"
                                className="w-full border border-gray-200 rounded-lg p-3 text-[16px] text-gray-500 placeholder-gray-400 shadow-md"
                            />
                            {typeof errors.ActivePortfolio?.message === 'string' && <p className="text-red-600 text-[14px]">{errors.ActivePortfolio.message}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvestmentStatsSection;

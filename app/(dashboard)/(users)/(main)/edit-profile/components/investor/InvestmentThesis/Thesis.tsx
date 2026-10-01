import React from 'react';
import { useFormContext } from 'react-hook-form';

const InvestmentThesisInput: React.FC = () => {
    const { register, formState: { errors } } = useFormContext();
    return (
        <div className='w-[95%] mx-auto min-h-[20rem] md:min-h-[18rem] bg-white border-1 border-black-900 rounded-2xl shadow-[#1018280F] shadow-md mt-5'>
            <div className="max-full mx-auto">
                <div className="w-[95%] mx-auto bg-white h-48 relative">
                    <div className='pb-5 pt-5'>
                        <h2 className='text-[16px] font-semibold'>Investment Thesis*</h2>
                    </div>
                    <textarea
                        {...register('InvestmentThesis')}
                        placeholder="Enter investment thesis"
                        className="w-full h-48 p-4 text-[16px] text-gray-600 placeholder-gray-400 border border-gray-200 rounded-lg shadow-inner resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {typeof errors.InvestmentThesis?.message === 'string' && <p className="text-red-600 text-[14px]">{errors.InvestmentThesis.message}</p>}
                </div>
            </div>
        </div>
    );
};

export default InvestmentThesisInput;

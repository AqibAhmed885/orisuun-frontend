'use client';
import React from 'react';

interface PercentInputProps {
    value: number;
    onChange: (val: number) => void;
}

const PercentInput = ({ value, onChange }: PercentInputProps) => {
    return (
        <div className="grid grid-cols-2 w-[80px] m-2 shadow-md border border-gray-300 rounded-lg" >
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="appearance-none text-center font-semibold text-[15px] text-gray-800 bg-transparent py-2 focus:outline-none"
            />
            <div className='flex justify-between px-1 items-center'>
                <p className=" font-semibold text-gray-800 text-[15px]" > % </p>
                < div className="flex flex-col justify-center" >
                    <button type="button" onClick={() => onChange(value + 1)}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" >
                            <path d="M7.5 6.25L5 3.75L2.5 6.25" stroke="#101828" strokeWidth="0.95" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    < button type="button" onClick={() => onChange(value - 1)}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" >
                            <path d="M2.5 3.75L5 6.25L7.5 3.75" stroke="#101828" strokeWidth="0.95" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PercentInput;

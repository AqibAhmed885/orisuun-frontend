'use client';

import React, { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import PercentInput from './PercentInput';

interface Props {
    name: string;
    title: string;
}

interface DynamicItem {
    name: string;
    percent: number;
}

const DynamicInputSection = ({ name, title }: Props) => {
    const { control, register, getValues, trigger, formState: { errors } } = useFormContext();

    const { fields, append, update } = useFieldArray<{ [key: string]: DynamicItem[] }, string, string>({
        control,
        name,
    });

    const totalError = (errors as any)?.[name]?.message;

    useEffect(() => {
        const existingFields = getValues(name);
        if (!existingFields || existingFields.length === 0) {
            append({ name: '', percent: 50 });
            append({ name: '', percent: 30 });
            append({ name: '', percent: 20 });
        }
    }, [append, getValues, name]);

    return (
        <div className="mb-6">
            <h3 className="text-[14px] font-semibold text-gray-800 mb-2">{title}</h3>
            {fields.map((field, idx) => (
                <div key={idx} className="flex flex-col gap-1 mb-2">
                    <div className="flex items-center gap-2">
                        <input
                            {...register(`${name}.${idx}.name`)}
                            placeholder={`Enter ${title.toLowerCase()} ${idx + 1}`}
                            className="shadow-md flex-1 border border-gray-300 rounded-lg px-3 py-2 text-[16px]"
                        />
                        <PercentInput
                            value={field.percent}
                            onChange={async (val) => {
                                update(idx, {
                                    name: getValues(`${name}.${idx}.name`) ?? '',
                                    percent: val,
                                });
                                await trigger(name);
                            }}
                        />
                    </div>
                    {/* Field-level errors */}
                    <p className="text-red-600 text-sm">
                        {(errors as any)?.[name]?.[idx]?.name?.message}
                    </p>
                </div>
            ))}
            {/* Section-level error (e.g. total percentage error) */}
            {totalError && (
                <p className="text-red-600 text-sm mt-1">{totalError}</p>
            )}
            <button
                type="button"
                onClick={async () => {
                    append({ name: '', percent: 70 });
                    await trigger(name);
                }}
                className="shadow-md text-sm text-[#1A4EFF] font-semibold mt-2 flex items-center gap-1 p-2 border rounded-md border-[#A0BCF9] bg-[#EAF0FE]"
            >
                <span className="text-[16px] font-semibold text-[#2D65DD]">＋</span> Add More
            </button>
        </div>
    );
};

export default DynamicInputSection;

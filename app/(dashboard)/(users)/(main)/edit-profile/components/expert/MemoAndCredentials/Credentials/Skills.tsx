import { useFieldArray, useFormContext } from 'react-hook-form';
import { useState, KeyboardEvent, useRef } from 'react';

export interface SkillItem {
    Id: number;
    Skill: string;
}

const Skills = ({ setDeleteIdsData }) => {
    const { control, watch, register, formState: { errors } } = useFormContext<{ skills: SkillItem[] }>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'skills'
    });

    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const skillValues = watch('skills') || [];

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const trimmed = inputValue.trim();
            if (trimmed) {
                append({ Id: 0, Skill: trimmed });
                setInputValue('');
            }
        }
    };

    const handleRemove = (index: number) => {
        const field = fields[index];
        if (field.Id !== 0) {
            setDeleteIdsData((prev) => ({
                ...prev,
                skills: [...prev.skills, field.Id],
            }));
        }
        remove(index);
    };


    return (
        <div className="max-w-[97%] mx-auto p-1 md:p-2 rounded">
            <h2 className="text-[16px] font-semibold text-gray-900 mb-4">Skills*</h2>
            <p className="text-[14px] font-semibold text-gray-700 mb-2">Select as many skills as possible</p>

            <div
                className="flex flex-wrap items-center min-h-[50px] w-full border border-gray-200 rounded-lg p-2 text-[16px] text-gray-700 shadow-md"
                onClick={() => inputRef.current?.focus()}
            >
                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="flex items-center text-sm bg-[#EFF8FF] border border-[#B2DDFF] text-[#194185] rounded px-2 py-1 mr-2 mb-2"
                    >
                        {skillValues[index]?.Skill}
                        <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="ml-2 text-xs font-bold"
                        >
                            ✕
                        </button>
                        <input
                            type="hidden"
                            {...register(`skills.${index}.Id`)}
                        />
                    </div>
                ))}

                <input
                    type="text"
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 min-w-[150px] border-none outline-none bg-transparent p-1"
                    placeholder="Select skills that fits your career"
                />
            </div>

            {typeof errors.skills?.message === 'string' && (
                <span className="text-red-500">{errors.skills.message}</span>
            )}
        </div>
    );
};

export default Skills;

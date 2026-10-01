
import { useEffect } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';

export interface MentorIndustryExperienceItem {
    Id: number;
    Industry: string;
    YearsOfExperience: number;
}


const IndustryExperience = ({ setDeleteIdsData }) => {
    const { register, control, formState: { errors } } = useFormContext<{ mentorIndustryExperience: MentorIndustryExperienceItem[] }>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'mentorIndustryExperience',
    });

    useEffect(() => {
        if (fields.length === 0) {
            append({
                Id: 0,
                Industry: '',
                YearsOfExperience: 0,
            });
        }
    }, [fields, append]);

    function removeData(index: number, id: number) {
        const field = fields[index];
        if (id !== 0) {
            setDeleteIdsData(prev => ({
                ...prev,
                mentorIndustryExperience: [...prev.mentorIndustryExperience, id]
            }));
        }
        remove(index);
    }

    return (
        <>
            <div className="max-w-[97%] mx-auto">
                <div className="pt-5">
                    <h2 className="text-[18px] font-semibold text-gray-900 mb-4">Professional Snapshot</h2>
                    <h2 className="text-[16px] font-semibold text-gray-900 mb-4">Industry Experience*</h2>
                    {fields.map((field, index) => (
                        <div key={index} className={`recognition-award-form p-1 md:p-2 rounded ${index % 2 == 1 ? "bg-gray-100" : ""}`}>
                            <input
                                type="hidden"
                                {...register(`mentorIndustryExperience.${index}.Id`)}
                            />
                            <div className="grid grid-cols-2 gap-4 text-[14px] font-semibold text-gray-700 mb-2">
                                <div>Industry</div>
                                <div className='flex justify-between items-center'>
                                    <p>Years of experience</p>
                                    <button
                                        type="button"
                                        onClick={() => removeData(index, field.Id)}
                                        className={`${index < 1 ? "hidden" : ""} bg-gray-500 text-white font-semibold rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-600`}
                                        title="Remove"
                                    >
                                        <svg width="10" height="10" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M13 1L1 13M1 1L13 13" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Select industry"
                                        className="w-full border border-gray-200 rounded-lg p-3 text-[16px] text-gray-700 placeholder-gray-400 shadow-md"
                                        {...register(`mentorIndustryExperience.${index}.Industry`)}
                                    />
                                    {errors.mentorIndustryExperience?.[index]?.Industry?.message && (
                                        <span className="text-red-500">
                                            {errors.mentorIndustryExperience[index].Industry.message}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        min={0}
                                        max={100}
                                        placeholder="Enter years of experience"
                                        className="w-full border border-gray-200 rounded-lg p-3 text-[16px] text-gray-700 placeholder-gray-400 shadow-md"
                                        {...register(`mentorIndustryExperience.${index}.YearsOfExperience`, { valueAsNumber: true })}
                                    />
                                    {errors.mentorIndustryExperience?.[index]?.YearsOfExperience?.message && (
                                        <span className="text-red-500">
                                            {errors.mentorIndustryExperience[index].YearsOfExperience.message}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={() =>
                        append({
                            Id: 0,
                            Industry: '',
                            YearsOfExperience: 0,
                        })
                    }
                    className="shadow-md text-[#1A4EFF] font-semibold mt-2 flex text-center gap-1 p-2 border rounded-md border-[#A0BCF9] bg-[#EAF0FE]"
                >＋ Add More
                </button>
            </div>
        </>
    )
}

export default IndustryExperience;
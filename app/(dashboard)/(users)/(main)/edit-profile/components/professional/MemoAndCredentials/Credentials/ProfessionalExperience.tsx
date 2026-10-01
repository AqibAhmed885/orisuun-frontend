import { useEffect, useRef } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';

export interface ProfessionalExperienceItem {
  Id: number;
  CompanyName: string;
  StartDate: string;
  EndDate: string;
  Responsibility: string;
}

const ProfessionalExperience = ({ setDeleteIdsData }) => {
    const initialized = useRef(false);
    const { register, control, formState: { errors } } = useFormContext<{
        professionalExperience: ProfessionalExperienceItem[];
    }>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'professionalExperience',
    });
    
    useEffect(() => {
        if (!initialized.current && fields.length === 0) {
            append({
                Id: 0,
                CompanyName: '',
                StartDate: '',
                EndDate: '',
                Responsibility: '',
            });
            initialized.current = true;
        }
    }, [fields, append]);

    function removeData(index: number, id : number) {
        const field = fields[index];
        if (id !== 0) {
            setDeleteIdsData(prev => ({
                ...prev,
                professionalExperience: [...prev.professionalExperience, id]
            }));
        }
        remove(index);
    }

    return (
        <>
            <div className="max-w-[97%] mx-auto">
                <div className="pt-5">
                    <h2 className="text-[16px] font-semibold text-gray-900 mb-4">Professional Experience</h2>
                    {fields.map((field, index) => (
                        <div key={index} className={`professional-experience-form p-1 md:p-3 rounded ${index % 2 == 1 ? "bg-gray-100" : ""}`}>
                            {/* Hidden Field for Id */}
                            <input
                                type="hidden"
                                {...register(`professionalExperience.${index}.Id`)}
                            />

                            {/*  */}
                            <div className="grid grid-cols-3 gap-4 text-[14px] font-semibold text-gray-700 mb-2">
                                <div>Company</div>
                                <div>Start Date</div>
                                <div className='flex justify-between items-center'>
                                    <p>End Date</p>
                                    <button
                                        type="button"
                                        onClick={() => removeData(index, field.Id)}
                                        className="bg-gray-500 text-white font-semibold rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-600"
                                        title="Remove"
                                    >
                                        <svg width="10" height="10" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M13 1L1 13M1 1L13 13" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mb-3">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Enter company’s name"
                                        className="w-full border border-gray-200 rounded-lg p-3 text-[16px] text-gray-700 placeholder-gray-400 shadow-md"
                                        {...register(`professionalExperience.${index}.CompanyName`)}
                                    />
                                    {errors.professionalExperience?.[index]?.CompanyName?.message && (
                                        <span className="text-red-500">
                                            {errors.professionalExperience[index].CompanyName.message}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="date"
                                        placeholder="Enter start date"
                                        className="w-full border border-gray-200 rounded-lg p-3 text-[16px] text-gray-700 placeholder-gray-400 shadow-md"
                                        {...register(`professionalExperience.${index}.StartDate`)}
                                    />
                                    {errors.professionalExperience?.[index]?.StartDate?.message && (
                                        <span className="text-red-500">
                                            {errors.professionalExperience[index].StartDate.message}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="date"
                                        placeholder="Enter end date"
                                        className="w-full border border-gray-200 rounded-lg p-3 text-[16px] text-gray-700 placeholder-gray-400 shadow-md"
                                        {...register(`professionalExperience.${index}.EndDate`)}
                                    />
                                    {errors.professionalExperience?.[index]?.EndDate?.message && (
                                        <span className="text-red-500">
                                            {errors.professionalExperience[index].EndDate.message}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 text-[14px] font-semibold text-gray-700 mt-5 mb-2">
                                <div>Responsibilities</div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 mb-3">
                                <div>
                                    <textarea
                                        placeholder="Enter work responsibilities"
                                        className="w-full border border-gray-200 rounded-lg p-3 text-[16px] text-gray-700 placeholder-gray-400 shadow-md resize-none"
                                        style={{ aspectRatio: '9.6 / 1' }}
                                        {...register(`professionalExperience.${index}.Responsibility`)}
                                    />
                                    {errors.professionalExperience?.[index]?.Responsibility?.message && (
                                        <span className="text-red-500">
                                            {errors.professionalExperience[index].Responsibility.message}
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
                            CompanyName: '',
                            StartDate: '',
                            EndDate: '',
                            Responsibility: '',
                        })
                    }
                    className="shadow-md text-[#1A4EFF] font-semibold mt-2 flex text-center gap-1 p-2 border rounded-md border-[#A0BCF9] bg-[#EAF0FE]"
                >＋ Add More
                </button>
            </div>
        </>
    )
}

export default ProfessionalExperience;
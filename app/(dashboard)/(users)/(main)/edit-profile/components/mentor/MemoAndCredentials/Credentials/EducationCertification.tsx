import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';

export interface EducationCertificationItem {
    Id: number;
    School: string;
    DegreeTypeId: number;
    StartDate: string;
    EndDate: string;
    AboutProgram: string;
}

const EducationCertification = ({ setDeleteIdsData }) => {
    const initialized = useRef(false);
    const [degreeData, setDegreeData] = useState([])
    const { register, control, formState: { errors } } = useFormContext<{ educationCertification: EducationCertificationItem[]; }>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'educationCertification',
    });

    async function GetDegreeData() {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/Profile/GetInternationalDegreeType`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        XApiKey: process.env.NEXT_PUBLIC_API_KEY,
                    },
                }
            );
            if (response.status === 200) {
                const sortedDegrees = response.data?.Result.sort((a, b) =>
                    a.Degree.localeCompare(b.Degree)
                );
                setDegreeData(sortedDegrees);
            } else {
                toast.error('Failed to Get Degree List');
            }
        } catch {
            toast.error('Failed to Get Degree List');
        }
    }

    useEffect(() => {
        GetDegreeData()
    }, [])

    useEffect(() => {
        if (!initialized.current && fields.length === 0) {
            append({ Id: 0, School: '', DegreeTypeId: 0, StartDate: '', EndDate: '', AboutProgram: '' });
            initialized.current = true;
        }
    }, [fields, append]);

    function removeData(index: number, id: number) {
        const field = fields[index];
        if (id !== 0) {
            setDeleteIdsData(prev => ({
                ...prev,
                educationCertification: [...prev.educationCertification, id]
            }));
        }
        remove(index);
    }

    return (
        <>
            <div className="max-w-[97%] mx-auto">
                <div className="pt-5">
                    <h2 className="text-[16px] font-semibold text-gray-900 mb-4">Education & Certifications</h2>
                    {fields.map((field, index) => (
                        <div key={index} className={`education-certification-form p-1 md:p-2 rounded ${index % 2 == 1 ? "bg-gray-100" : ""}`}>
                            {/* Hidden Field for Id */}
                            <input
                                type="hidden"
                                {...register(`educationCertification.${index}.Id`)}
                            />
                            <div className="grid grid-cols-4 gap-4 text-[14px] font-semibold text-gray-700 mb-2">
                                <div className='col-span-3'>School</div>
                                <div className='flex justify-between items-center'>
                                    <p>Degree Type</p>
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
                            <div className="grid grid-cols-4 gap-4 mb-3">
                                <div className='col-span-3'>
                                    <input
                                        type="text"
                                        placeholder="Enter school’s name"
                                        className="w-full border border-gray-200 rounded-lg p-3 text-[16px] text-gray-700 placeholder-gray-400 shadow-md"
                                        {...register(`educationCertification.${index}.School`)}
                                    />
                                    {errors.educationCertification?.[index]?.School?.message && (
                                        <span className="text-red-500">
                                            {errors.educationCertification[index].School.message}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <select
                                        className="w-full border border-gray-200 rounded-lg p-3 text-[16px] text-gray-700 placeholder-gray-400 shadow-md"
                                        {...register(`educationCertification.${index}.DegreeTypeId`, { valueAsNumber: true })}
                                    >
                                        <option value="" disabled>Select a degree</option>
                                        {degreeData.map((degree) => (
                                            <option key={degree.Id} value={degree.Id}>
                                                {degree.Degree}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.educationCertification?.[index]?.DegreeTypeId?.message && (
                                        <span className="text-red-500">
                                            {errors.educationCertification[index].DegreeTypeId.message}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-[14px] font-semibold text-gray-700 mb-2">
                                <div>Start Date</div>
                                <div>End Date</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                    <input
                                        type="date"
                                        placeholder="Enter start date"
                                        className="w-full border border-gray-200 rounded-lg p-3 text-[16px] text-gray-700 placeholder-gray-400 shadow-md"
                                        {...register(`educationCertification.${index}.StartDate`)}
                                    />
                                    {errors.educationCertification?.[index]?.StartDate?.message && (
                                        <span className="text-red-500">
                                            {errors.educationCertification[index].StartDate.message}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="date"
                                        placeholder="Enter end date"
                                        className="w-full border border-gray-200 rounded-lg p-3 text-[16px] text-gray-700 placeholder-gray-400 shadow-md"
                                        {...register(`educationCertification.${index}.EndDate`)}
                                    />
                                    {errors.educationCertification?.[index]?.EndDate?.message && (
                                        <span className="text-red-500">
                                            {errors.educationCertification[index].EndDate.message}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 text-[14px] font-semibold text-gray-700 mt-5 mb-2">
                                <div>What can you say about this program</div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 mb-3">
                                <div>
                                    <textarea
                                        placeholder="Give a brief description"
                                        className="w-full border border-gray-200 rounded-lg p-3 text-[16px] text-gray-700 placeholder-gray-400 shadow-md resize-none"
                                        style={{ aspectRatio: '9.6 / 1' }}
                                        {...register(`educationCertification.${index}.AboutProgram`)}
                                    />
                                    {errors.educationCertification?.[index]?.AboutProgram?.message && (
                                        <span className="text-red-500">
                                            {errors.educationCertification[index].AboutProgram.message}
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
                        // append({ schoolName: '', degreeType: '', startDate: '', endDate: '', description: '' })
                        append({ Id: 0, School: '', DegreeTypeId: 0, StartDate: '', EndDate: '', AboutProgram: '' })
                    }
                    className="shadow-md text-[#1A4EFF] font-semibold mt-2 flex text-center gap-1 p-2 border rounded-md border-[#A0BCF9] bg-[#EAF0FE]"
                >＋ Add More
                </button>
            </div>
        </>
    )
}

export default EducationCertification;
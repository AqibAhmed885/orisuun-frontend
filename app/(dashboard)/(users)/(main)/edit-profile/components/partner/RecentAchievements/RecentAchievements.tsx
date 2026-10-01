
import { useEffect } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';

export interface RecentAchievementsSchema {
    Id: number;
    Achievement: string;
}

const RecentAchievements = ({ setDeletePartnerRecentAchivementsIds }) => {
    const { register, control, formState: { errors } } = useFormContext<{ RecentAchievements: RecentAchievementsSchema[] }>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'RecentAchievements',
    });

    useEffect(() => {
        if (fields.length === 0) {
            append({
                Id: 0,
                Achievement: ''
            });
        }
    }, [fields, append]);

    function removeData(index: number, id: number) {
        if (id !== 0) {
            setDeletePartnerRecentAchivementsIds((prev) => [...prev, id]);
        }
        remove(index);
    }

    return (
        <>
            <div className="max-w-[97%] mx-auto">
                <div className="pt-5">
                    <h2 className="text-[16px] font-semibold text-gray-900 mb-4">Recent Achievement</h2>
                    {fields.map((field, index) => (
                        <div key={index} className={`recognition-award-form rounded ${index % 2 == 1 ? "bg-gray-100" : ""}`}>
                            <input
                                type="hidden"
                                {...register(`RecentAchievements.${index}.Id`)}
                            />
                            <div className="grid gap-4 text-[14px] font-semibold text-gray-700 mb-2">
                                <div className='flex justify-between items-center'>
                                    <p>Enter recent achievement</p>
                                    <button
                                        type="button"
                                        onClick={() => removeData(index, field.Id)}
                                        className={`bg-gray-500 ${index == 0 ? "hidden" : ""} text-white font-semibold rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-600`}
                                        title="Remove"
                                    >
                                        <svg width="10" height="10" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M13 1L1 13M1 1L13 13" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="grid gap-4 mb-3">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Describe achievement"
                                        className="w-full border border-gray-200 rounded-lg p-3 text-[16px] text-gray-700 placeholder-gray-400 shadow-md"
                                        {...register(`RecentAchievements.${index}.Achievement`)}
                                    />
                                    {errors.RecentAchievements?.[index]?.Achievement?.message && (
                                        <span className="text-red-500">
                                            {errors.RecentAchievements[index].Achievement.message}
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
                            Achievement: ''
                        })
                    }
                    className="shadow-md text-[#1A4EFF] font-semibold mt-2 flex text-center gap-1 p-2 border rounded-md border-[#A0BCF9] bg-[#EAF0FE]"
                >＋ Add More
                </button>
            </div>
        </>
    )
}

export default RecentAchievements;
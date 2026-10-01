
import { useEffect, useRef } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';

export interface ServicesOfferedSchema {
    Id: number;
    Title: string;
    Description: string;
}


const ServicesOffered = ({ setDeleteIdsData }) => {
    const { register, control, formState: { errors } } = useFormContext<{ ServicesOffered: ServicesOfferedSchema[] }>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'ServicesOffered',
    });

    useEffect(() => {
        if (fields.length === 0) {
            append({
                Id: 0,
                Title: '',
                Description: '',
            });
        }
    }, [fields, append]);

    function removeData(index: number, id: number) {
        if (id !== 0) {
            setDeleteIdsData((prev) => [...prev, id]);
        }
        remove(index);
    }

    return (
        <>
            <div className="max-w-[97%] mx-auto">
                <div className="pt-5">
                    <h2 className="text-[16px] font-semibold text-gray-900 mb-4">Services Offered</h2>
                    {fields.map((field, index) => (
                        <div key={index} className={`recognition-award-form rounded ${index % 2 == 1 ? "bg-gray-100" : ""}`}>
                            <input
                                type="hidden"
                                {...register(`ServicesOffered.${index}.Id`)}
                            />
                            <div className="grid gap-4 text-[14px] font-semibold text-gray-700 mb-2">
                                <div className='flex justify-between items-center'>
                                    <p>Title of focus area*</p>
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
                                        placeholder="Enter title"
                                        className="w-full border border-gray-200 rounded-lg p-3 text-[16px] text-gray-700 placeholder-gray-400 shadow-md"
                                        {...register(`ServicesOffered.${index}.Title`)}
                                    />
                                    {errors.ServicesOffered?.[index]?.Title?.message && (
                                        <span className="text-red-500">
                                            {errors.ServicesOffered[index].Title.message}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4 text-[14px] font-semibold text-gray-700 mb-2">
                                <div>Description*</div>
                            </div>
                            <div className="grid gap-4 mb-3">
                                <div>
                                    <textarea
                                        placeholder="Enter a short description"
                                        className="w-full border border-gray-200 rounded-lg p-3 text-[16px] text-gray-700 placeholder-gray-400 shadow-md resize-none"
                                        style={{ aspectRatio: '15 / 1' }}
                                        {...register(`ServicesOffered.${index}.Description`)}
                                    />
                                    {errors.ServicesOffered?.[index]?.Description?.message && (
                                        <span className="text-red-500">
                                            {errors.ServicesOffered[index].Description.message}
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
                            Title: '',
                            Description: '',
                        })
                    }
                    className="shadow-md text-[#1A4EFF] font-semibold mt-2 flex text-center gap-1 p-2 border rounded-md border-[#A0BCF9] bg-[#EAF0FE]"
                >＋ Add More
                </button>
            </div>
        </>
    )
}

export default ServicesOffered;

import { useEffect, useRef } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';

export interface RecognitionAwardItem {
    Id: number;
    AwardingBody: string;
    Name: string;
}


const RecognitionAwards = ({ setDeleteIdsData }) => {
    const initialized = useRef(false);
    const { register, control, formState: { errors } } = useFormContext<{ recognitionAward: RecognitionAwardItem[] }>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'recognitionAward',
    });

    useEffect(() => {
        if (!initialized.current && fields.length === 0) {
            append({
                Id: 0,
                AwardingBody: '',
                Name: '',
            });
            initialized.current = true;
        }
    }, [fields, append]);

    function removeData(index: number, id: number) {
        const field = fields[index];
        if (id !== 0) {
            setDeleteIdsData(prev => ({
                ...prev,
                recognitionAward: [...prev.recognitionAward, id]
            }));
        }
        remove(index);
    }

    return (
        <>
            <div className="max-w-[97%] mx-auto">
                <div className="pt-5">
                    <h2 className="text-[16px] font-semibold text-gray-900 mb-4">Recognition & Awards</h2>
                    {fields.map((field, index) => (
                        <div key={index} className={`recognition-award-form p-1 md:p-2 rounded ${index % 2 == 1 ? "bg-gray-100" : ""}`}>
                            <input
                                type="hidden"
                                {...register(`recognitionAward.${index}.Id`)}
                            />
                            <div className="grid gap-4 text-[14px] font-semibold text-gray-700 mb-2">
                                <div className='flex justify-between items-center'>
                                    <p>Awarding Body</p>
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
                            <div className="grid gap-4 mb-3">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Enter awarding body’s name"
                                        className="w-full border border-gray-200 rounded-lg p-3 text-[16px] text-gray-700 placeholder-gray-400 shadow-md"
                                        {...register(`recognitionAward.${index}.AwardingBody`)}
                                    />
                                    {errors.recognitionAward?.[index]?.AwardingBody?.message && (
                                        <span className="text-red-500">
                                            {errors.recognitionAward[index].AwardingBody.message}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4 text-[14px] font-semibold text-gray-700 mb-2">
                                <div>Name of Award</div>
                            </div>
                            <div className="grid gap-4 mb-3">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Enter award name"
                                        className="w-full border border-gray-200 rounded-lg p-3 text-[16px] text-gray-700 placeholder-gray-400 shadow-md"
                                        {...register(`recognitionAward.${index}.Name`)}
                                    />
                                    {errors.recognitionAward?.[index]?.Name?.message && (
                                        <span className="text-red-500">
                                            {errors.recognitionAward[index].Name.message}
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
                            AwardingBody: '',
                            Name: '',
                        })
                    }
                    className="shadow-md text-[#1A4EFF] font-semibold mt-2 flex text-center gap-1 p-2 border rounded-md border-[#A0BCF9] bg-[#EAF0FE]"
                >＋ Add More
                </button>
            </div>
        </>
    )
}

export default RecognitionAwards;
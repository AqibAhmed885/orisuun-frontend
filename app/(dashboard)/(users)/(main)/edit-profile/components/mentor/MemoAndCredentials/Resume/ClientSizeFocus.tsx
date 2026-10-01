import { useFormContext, useFieldArray } from 'react-hook-form';

export interface MentorClientSizeFocusItem {
    Id: number;
    ClientSize: string;
    Percentage: number;
}

const ClientSizeFocus = () => {
    const { register, control, formState: { errors } } = useFormContext<{ mentorClientSizeFocus: MentorClientSizeFocusItem[] }>();
    const { fields } = useFieldArray({
        control,
        name: 'mentorClientSizeFocus',
    });

    return (
        <div className="max-w-[97%] mx-auto">
            <div className="pt-5">
                <h2 className="text-[16px] font-semibold text-gray-900 mb-4">Client Size Focus*</h2>
                <div className="text-[14px] font-semibold text-gray-700 mb-2">
                    <p>Client Size</p>
                </div>
                {fields.map((field, index) => (
                    <div key={field.id} className="recognition-award-form p-1 md:p-2 rounded">
                        <input type="hidden" {...register(`mentorClientSizeFocus.${index}.Id`)} />
                        <input type="hidden" {...register(`mentorClientSizeFocus.${index}.ClientSize`)} />
                        <div className="grid grid-cols-4 gap-4 mb-3">
                            <div className="col-span-3">
                                <input
                                    type="text"
                                    className="w-full border border-gray-200 rounded-lg p-3 text-[16px] text-gray-700 placeholder-gray-400 shadow-md bg-gray-100 cursor-not-allowed"
                                    value={field.ClientSize}
                                    readOnly
                                />
                            </div>
                            <div className="flex items-center w-[20%] border border-gray-200 rounded-lg shadow-md">
                                <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    step={1}
                                    className="flex-1 p-3 w-full text-[16px] text-gray-700 placeholder-gray-400 outline-none"
                                    {...register(`mentorClientSizeFocus.${index}.Percentage`, {
                                        valueAsNumber: true,
                                        validate: (v) => (v >= 0 && v <= 100) || "Value must be between 0 and 100"
                                    })}
                                />
                                <span className="pr-3 text-[16px] text-gray-700">%</span>
                            </div>
                            {errors.mentorClientSizeFocus?.[index]?.Percentage?.message && (
                                <span className="text-red-500">
                                    {errors.mentorClientSizeFocus[index].Percentage.message}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClientSizeFocus;

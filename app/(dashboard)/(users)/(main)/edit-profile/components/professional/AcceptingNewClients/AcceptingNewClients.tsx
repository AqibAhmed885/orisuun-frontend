'use client';
import { useFormContext } from 'react-hook-form';

const AcceptingNewClients = () => {
    const { register,
        formState: { errors },
        setValue,
        watch
    } = useFormContext();

    const acceptingClients = watch('AcceptingClients');
    const handleSelect = (value: boolean) => {
        setValue('AcceptingClients', value);
    };

    return (
        <div className="max-w-[97%] mx-auto">
            <div className="pt-5">

                <h2 className="text-[16px] font-semibold text-gray-900 mb-2">New Clients*</h2>
                <h2 className="font-semibold text-gray-700 mb-2">Accepting new clients?</h2>

                <div>
                    <div className="flex w-full gap-4 font-semibold">
                        <button
                            type="button"
                            onClick={() => handleSelect(true)}
                            className={`px-5 w-1/12 py-2 rounded-lg shadow-md border 
                        ${acceptingClients === true ? 'bg-[#EFF8FF] text-[#194185] border-[#B2DDFF]' : 'bg-white text-gray-900 border-gray-400'}`}
                        >
                            Yes
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSelect(false)}
                            className={`px-5 w-1/12 py-3 rounded-lg shadow-md border 
                        ${acceptingClients === false ? 'bg-[#EFF8FF] text-[#194185] border-[#B2DDFF]' : 'bg-white text-gray-900 border-gray-400'}`}
                        >
                            No
                        </button>
                    </div>

                    <input type="hidden" {...register('AcceptingClients')} />

                    {typeof errors.AcceptingClients?.message === 'string' && (
                        <span className="text-red-500">
                            {errors.AcceptingClients.message}
                        </span>
                    )}
                </div>
            </div>
        </div >
    );
};

export default AcceptingNewClients;

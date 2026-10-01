'use client';

export const Radios = ({ name, value, onChange }) => {
    const labels = ['-3', '-2', '-1', '0', '1', '2', '3'];
    return (
        <>
            {labels.map((label, i) => (
                <div key={i} className="grid place-items-center">
                    <input
                        type="radio"
                        name={name}
                        id={name + label}
                        value={label}
                        checked={value === label}
                        onChange={onChange}
                        className="md:size-7 size-6"
                    />
                    <label
                        className="text-[#808181] md:text-sm text-[12px] font-medium"
                        htmlFor={name + label}
                    >
                        {label}
                    </label>
                </div>
            ))}
        </>
    );
};

export const CustomCheckbox = ({ label, checked, order, onChange }) => {
    return (
        <div className="flex items-start gap-[10px] ">
            <div className="size-[24px] border rounded">
                <div
                    className={`relative size-[24px] ${checked ? 'bg-[#2357C6] text-white' : 'border-gray-400'}`}
                    onClick={onChange}
                >
                    {checked && (
                        <span className="absolute inset-0 flex items-center justify-center font-bold p-1 text-[14px]">
                            {order}
                        </span>
                    )}
                </div>
            </div>
            <label className="text-[#6E6E6E] font-medium text-[16px] md:text-xl">
                {label}
            </label>
        </div>
    );
};

export const MightJoinCheckbox = ({ label, checked, onChange }) => {
    return (
        <label className="flex items-start gap-[10px] cursor-pointer">
            <div className="relative w-[24px] h-[24px] border rounded">
                <input
                    type="checkbox"
                    className="appearance-none w-full h-full checked:bg-[#2357C6] checked:border-transparent focus:outline-none"
                    checked={checked}
                    onChange={onChange}
                />
                {checked && (
                    <svg
                        className="absolute inset-0 w-full h-full flex items-center justify-center text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                        ></path>
                    </svg>
                )}
            </div>
            <span className="text-[#6E6E6E] font-medium text-[16px] md:text-xl">
                {label}
            </span>
        </label>
    );
};
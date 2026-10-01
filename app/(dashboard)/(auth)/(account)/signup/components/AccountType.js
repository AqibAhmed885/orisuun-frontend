import { Radio, RadioGroup } from "@headlessui/react";
import { clsx } from "clsx";

export const AccountType = ({ accountType, selected, setSelected }) => {
  return (
    <>
      <RadioGroup
        value={selected}
        onChange={setSelected}
        aria-label="Server size"
        className="grid grid-cols-2"
      >
        {accountType.map((plan, i) => (
          <Radio
            key={i}
            value={plan}
            className={clsx(
              "group relative py-2 px-3 text-[14px] font-semibold border border-[#B2B3B3] text-[#6E6E6E] data-[checked]:bg-[#F2F7FC] data-[checked]:border-nav-blue data-[checked]:text-nav-blue cursor-pointer",
              i === 0 && "rounded-l-lg",
              i === 1 && "rounded-r-lg",
            )}
          >
            {plan}
          </Radio>
        ))}
      </RadioGroup>
    </>
  );
};

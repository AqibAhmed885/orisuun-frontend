import { Radio, RadioGroup } from '@headlessui/react';

export const PlanType = ({ planType, selected, setSelected, profileType }) => {
  const plansToDisplay = profileType === 4 ? [planType[0]] : planType;

  return (
    <>
      <RadioGroup
        value={selected}
        onChange={setSelected}
        aria-label="Server size"
        className={`grid grid-cols-1 ${profileType !== 'Advocates' ? 'md:grid-cols-2' : ''
          } gap-2 md:gap-1`}
      >
        {plansToDisplay.map((plan, i) => (
          <Radio
            key={i}
            value={plan}
            className={`group relative leading-5 flex justify-between items-center text-center md:text-start p-4 ${selected === plan ? 'font-semibold' : 'font-medium'
              } text-[14px] border border-[#828282] text-[#6E6E6E] rounded data-[checked]:bg-[#F0F7FD] data-[checked]:border-nav-blue data-[checked]:text-nav-blue cursor-pointer`}
          >
            {plan}

            <div
              className={`w-5 h-5 flex items-center rounded-full justify-center ${selected === plan ? 'border-nav-blue' : 'border-grey-800'
                } border`}
            >
              <div
                className={`w-[15px] h-[15px] rounded-full ${selected === plan ? 'bg-nav-blue' : 'bg-transparent'
                  }`}
              />
            </div>
          </Radio>
        ))}
      </RadioGroup>
    </>
  );
};

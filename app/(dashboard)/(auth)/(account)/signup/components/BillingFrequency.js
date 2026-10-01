import { Radio, RadioGroup } from '@headlessui/react';
import Image from 'next/image';

export const BillingFrequency = ({ billings, selected, setSelected, noTrial = false }) => {
  return (
    <>
      <RadioGroup
        value={selected}
        onChange={setSelected}
        aria-label="Server size"
        className="grid grid-cols-2 md:grid-cols-3 gap-2 !mb-10"
      >

        {billings.map((billing, i) => {
          const freeText = noTrial
            ? ''
            : (billing?.Free || (billing?.TrialPeriodDays === 14 ? 'Two week FREE Trial' : ''));
          return (
            <Radio
              key={i}
              value={billing?.Name}
              className={`group col-span-2 md:!col-span-1 min-h-[104px] relative flex items-start justify-between py-4 px-3 ${selected === billing ? 'font-semibold' : 'font-medium'
                } text-sm border border-[#828282] text-text-gray rounded data-[checked]:bg-[#F0F7FD] data-[checked]:border-nav-blue data-[checked]:!text-nav-blue cursor-pointer`}
            >
              <div className='space-y-2 h-full'>
                <div className={`${freeText === '' ? 'space-y-2' : 'space-y-1'}`}>
                  <h6 className="font-semibold leading-5">{billing?.Name}</h6>
                  <p className={`font-medium text-sm ${selected === billing?.Name ? 'text-nav-blue' : 'text-blue-300'} leading-[130%]`}>{billing?.Price}</p>
                </div>
                {freeText && (
                  <div className="flex items-center gap-1">
                    <Image
                      src="/icons/gift.svg"
                      alt="gift"
                      width={14}
                      height={14}
                      className='h-[14px]'
                    />
                    <p className="font-medium text-nav-blue">{freeText}</p>
                  </div>
                )}
              </div>

              <div
                className={`w-5 h-5 flex items-center rounded-full justify-center ${selected === billing?.Name ? 'border-nav-blue' : 'border-grey-800'
                  } border`}
              >
                <div
                  className={`w-[15px] h-[15px] rounded-full ${selected === billing?.Name ? 'bg-nav-blue' : 'bg-transparent'
                    }`}
                />
              </div>
            </Radio>
          );
        })}
      </RadioGroup>
    </>
  );
};


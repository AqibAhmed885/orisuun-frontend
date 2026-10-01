import { Tab, TabGroup, TabList } from '@headlessui/react';
import { clsx } from 'clsx';

export const CustomTab = ({
  selectedIndex,
  setSelectedIndex,
  tabList,
  className,
}) => {
  return (
    <TabGroup
      className="p-1 rounded-[66px] bg-white shadow-price3"
      selectedIndex={selectedIndex}
      onChange={setSelectedIndex}
    >
      <TabList
        className={clsx(
          'h-[50px] md:h-[60px] small-500:w-[90vw] w-[450px] bg-white grid grid-cols-3 items-center rounded-[59px]',
          className
        )}
      >
        {tabList.map((data, i) => (
          <Tab as="div" key={i} className="focus:outline-none">
            {({ hover, selected }) => (
              <button
                className={clsx(
                  'flex flex-col w-full h-[48px] md:h-[60px] justify-center items-center focus:outline-none',
                  selected && 'bg-blue-500 rounded-[59px]'
                )}
              >
                <span
                  className={clsx(
                    'leading-6 text-base md:text-xl font-medium',
                    selected
                      ? ' text-white font-semibold'
                      : 'text-blue-500 font-medium'
                  )}
                >
                  {data?.plan}
                </span>
                <span
                  className={clsx(
                    'text-[10px] md:text-sm font-medium',
                    selected ? ' text-white ' : 'text-nav-blue '
                  )}
                >
                  {data?.free}
                </span>
              </button>
            )}
          </Tab>
        ))}
      </TabList>
    </TabGroup>
  );
};

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from '@headlessui/react';
import clsx from 'clsx';

export const DropDown = ({ whiteColor, title, isScrolled, Component }) => {
  return (
    <div className="relative">
      <Popover>
        {({ open, close }) => (
          <>
            <PopoverButton className="block text-sm/6 font-semibold text-white/50  focus:outline-none data-[active]:text-white data-[hover]:text-white data-[focus]:outline-1 data-[focus]:outline-white">
              <div
                className={clsx(
                  'flex items-end gap-1 ',
                  !isScrolled && open && 'border-b-2 border-[#000511]',
                  !whiteColor && 'hover:opacity-80'
                )}
              >
                <span
                  className={clsx(
                    'font-medium text-[#000511] text-[16px]',
                    open && '!text-[#000511]',
                    whiteColor && '!text-white'
                  )}
                >
                  {title}
                </span>
                {open ? (
                  <div className={clsx(
                    'rotate-180 p-2',
                    whiteColor && 'invert'
                  )}>
                    
                    <svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.18269 6.1487L0 0.966011L0.966011 0L5.18269 4.21664L9.39935 0L10.3653 0.966011L5.18269 6.1487Z" fill="#3D3D3D" />
                    </svg>


                  </div>
                  
                ) : (
                    <div className={clsx(
                      'p-2',
                      whiteColor && 'invert'
                    )}>
                      <svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.18269 6.1487L0 0.966011L0.966011 0L5.18269 4.21664L9.39935 0L10.3653 0.966011L5.18269 6.1487Z" fill="#3D3D3D" />
                      </svg>
                    </div>
                )}
              </div>
            </PopoverButton>
            <Transition
              enter="transition ease-out duration-75"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {/* The idea is that the popover would have no background but the width would be full but the child component would have baclground with max-width and other styling */}
              <PopoverPanel
                // anchor="bottom start"
                className={clsx(
                  'focus:outline-none z-[202] fixed left-0 right-0 !w-[1280px] !max-w-none  ',
                  // isScrolled && ' top-[40px]  ',
                  // whiteColor && !isScrolled && 'bg-white',
                  // !isScrolled && 'bg-white'
                )}
                // className={clsx(
                //   'z-[202] !w-screen !max-w-none',
                //   isScrolled && ' pb-2',
                //   whiteColor && !isScrolled && 'bg-white',
                //   !isScrolled && 'bg-white'
                // )}
                // style={{
                //   boxShadow:
                //     !isScrolled && '-10px 8px 16px 0px rgba(8, 8, 8, 0.08)',
                // }}
              >
                <div
                  className={clsx(
                    'pt-8 px-8 bg-white backdrop-blur-[28px] backdrop-saturate-150 border border-white/30 lg:overflow-y-auto xl:overflow-y-hidden rounded-[10px] hide-scrollbar !w-[1360px]  max-w-[1360px] mx-auto lg:pt-10 mt-8 ',
                    // isScrolled &&
                    // '[--anchor-gap:40px]  shadow 2xl:overflow-y-hidden hide-scrollbar bg-[#B9D9EB9E] sticky rounded-[10px] mt-10 max-w-[1440px] 3xl:max-w-[1600px] 2k:max-w-[1800px] scroll-smooth lg:pt-10  '
                  )}
                >
                  <Component closePopover={close} />
                </div>
              </PopoverPanel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};

import Image from 'next/image';
import React from 'react';

export const TaskDetails = ({ task, hideOnMobile }) => {
  return (
    <div className={'flex flex-col w-full gap-10 xl:ml-[99px] xl:mr-[197px] sm:px-4 md:px-0' + (hideOnMobile ? ' hidden md:block' : 'md:hidden block')}>
      <div className="flex items-start">
        <Image
          alt="img"
          src={task.viewImg}
          width={32}
          height={20}
          className="hidden lg:block"
        />
        <div className="flex flex-col gap-2 ml-5">
          <h2 className="text-2xl font-semibold text-[#2357C6] hidden lg:block">
            {task.title}
          </h2>
          <p className="text-[#5B657B] text-[16px] font-medium text-left hidden lg:block">
            {task.month}
          </p>
        </div>
      </div>
      <div className="w-full">
        <div className="max-h-[413px] max-w-[734px] md:mb-6 mb-10">
          {
            task.homeImg &&
            <Image
              alt="Orisuun-event"
              src={task.homeImg}
              width={734}
              height={413}
              className="w-full h-full"
            />
          }
        </div>
        <p className="text-[20px] small-500:text-[16px] text-[#5B657B] leading-150 mb-8 md:mb-0">
          {task.eventDetails}
        </p>
      </div>
    </div>
  );
};

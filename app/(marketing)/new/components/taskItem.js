// TaskItem.js
import React from 'react';
import Image from 'next/image';

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

const TaskItem = ({
  task,
  setSelectedTask,
  holder,
  holderOnFocus,
  isSelected,
}) => {
  return (
    <div
      className={`sm:relative p-4 flex flex-col small-500:gap-4 border border-[#f1f2f2] rounded-xl md:border-hidden ${
        isSelected
          ? 'w-full bg-[#F1F2F280] rounded-lg transition duration-300 ease-in-out'
          : ''
      }`}
    >
      <div
        className={`sm:absolute top-4 left-4 p-[6px] rounded-full flex justify-center items-center small-500:justify-start small-500:size-7 ${
          isSelected ? 'bg-[#2357C6]' : 'bg-white'
        }`}
      >
        <Image
          alt="img"
          src={isSelected ? holderOnFocus : holder}
          width={20}
          height={20}
        />
      </div>

      <div
        className={`sm:ml-[52px] cursor-pointer`}
        onClick={() => setSelectedTask(task)}
      >
        <div className="flex flex-col gap-3 pr-4">
          <h5
            className={`text-[18px] sm:w-[250px] w-full ${
              isSelected ? 'text-[#2357C6] font-semibold' : ''
            } `}
          >
            {task.title}
          </h5>
          {task.month ? (
            <div className="flex items-center gap-[12px] whitespace-nowrap">
              <div
                className={`flex justify-center items-center leading-110 small-500:px-[10px] small-500:py-[6px] px-[10px] py-1 h-[22px] gap-2 border rounded-xl ${
                  task.completed ? 'border-[#198754]' : 'border-[#2C57A4]'
                }`}
              >
                {task.completed && (
                  <Image
                    alt="check"
                    src={`${staticUrl}/whats-new/checkmark.svg`}
                    width={12}
                    height={12}
                  />
                )}
                <p
                  className={`text-[14px] font-medium leading-110 ${
                    task.completed ? 'text-[#198754]' : 'text-[#2C57A4]'
                  }`}
                >
                  {task.completed ? 'Completed' : 'Coming soon'}
                </p>
              </div>
              <p className="text-[#5B657B] text-[16px] font-medium w-full">
                {task.month}
              </p>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;

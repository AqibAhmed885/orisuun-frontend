'use client';
import React, { useState } from 'react';
import TaskList from './taskList';
import { TaskDetails } from './taskDetails';
import { tasks } from '../../../../data/marketing';

const WhatsNew = () => {
  const [selectedTask, setSelectedTask] = useState(tasks[0]);

  return (
    <section className="w-full">
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center justify-center small-500:px-4">
          <h1 className="mt-[60px] md:mt-[91px] m-0 text-blue-strong text-center small-500:text-left xl:text-[64px] lg:text-[50px] md:text-[30px] sm:text-[36px] w-full small-500:text-[36px] font-semibold leading-110 mb-[24px]  ">
            See what we’re planning next
          </h1>
          <p className="max-w-[500px] small-500:text-left w-full whitespace-wrap mb-[80px] text-blu-ray-300 xl:text-[20px] lg:text-[18px] text-center text-[16px] leading-150 font-medium">
            We’re constantly improving our platform to make your business
            development more and more impactful
          </p>
        </div>
        <div className="w-full mb-[120px] xl:mb-[200px] flex justify-start px-4 xl:pl-20 md:flex-row flex-col">
          <TaskList
            tasks={tasks}
            setSelectedTask={setSelectedTask}
            selectedTaskId={selectedTask.id}
          />
          <TaskDetails task={selectedTask} hideOnMobile={true} />
        </div>
      </div>
    </section>
  );
};

export default WhatsNew;

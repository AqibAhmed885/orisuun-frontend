'use client';

import Tick from '@/icons/tick';
import React, { useEffect, useState } from 'react';

interface Tab {
  id: number;
  title: string;
  steps: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: number;
  activeStep?: number;
  onTabChange: (id: number) => void;
  onStepChange?: (step: number) => void;
  children: React.ReactNode;
  contentClass?: string;
  onSubmit?: () => void | Promise<void>;
  OnNextValidation?: () => Promise<boolean>;
  IsSteps?: string;
  handleCancle?: () => void;
  isSubmitting?: boolean;
}

export function Tabs({
  tabs,
  activeTab,
  activeStep,
  onTabChange,
  onStepChange,
  children,
  contentClass,
  onSubmit,
  OnNextValidation = async () => true,
  IsSteps = 'false',
  handleCancle,
  isSubmitting = false,
}: TabsProps) {
  const [currentTab, setCurrentTabe] = useState(null);
  const [isLastTab, setIsLastTab] = useState(false);
  const [isLastStep, setIsLastStep] = useState(false);
  const [completedTabs, setCompletedTabs] = useState<number[]>([]);

  useEffect(() => {
    setCurrentTabe(tabs.find((tab) => tab.id === activeTab));
    setIsLastTab(activeTab === tabs[tabs.length - 1].id);
  }, [tabs, activeTab]);

  useEffect(() => {
    setIsLastStep(currentTab ? activeStep === currentTab.steps : false);
  }, [currentTab, activeStep]);

  const handleContinue = async () => {
    const validationResult = await OnNextValidation();
    if (IsSteps === 'false' && isLastTab && validationResult) {
      onSubmit();
    } else if (isLastTab && isLastStep) {
      if (validationResult) {
        onSubmit();
      }
    } else if (isLastStep) {
      if (!isLastTab) {
        if (validationResult) {
          onTabChange(activeTab + 1);
          {
            onStepChange && onStepChange(1);
          }
        }
      }
    } else if (onStepChange) {
      if (validationResult && onStepChange) onStepChange(activeStep + 1);
    } else if (onTabChange && validationResult) {
      onTabChange(activeTab + 1);
    }

    // handling tabs tick
    if (isLastStep && validationResult) {
      if (!completedTabs.includes(activeTab)) {
        setCompletedTabs((prev) => [...prev, activeTab]);
      }
    } else if (IsSteps === 'false' && validationResult) {
      if (!completedTabs.includes(activeTab)) {
        setCompletedTabs((prev) => [...prev, activeTab]);
      }
    }
  };

  const handleBack = () => {
    if (activeStep > 1) {
      {
        onStepChange && onStepChange(activeStep - 1);
      }
    } else if (activeTab > 1) {
      onTabChange(activeTab - 1);
      {
        onStepChange && onStepChange(tabs[activeTab - 2].steps);
      }
    }
  };

  return (
    <div className="flex flex-col relative h-full">
      {/* Tabs Navigation */}
      <div className="flex flex-col flex-1 lg:max-h-[calc(100%-60px)]  lg:overflow-auto">
        <div className="hidden lg:!flex justify-between gap-5 xs:mb-4 lg:!mb-12 overflow-x-auto hide-scrollbar w-full">
          {tabs.map((tab, index) => (
            <span key={index} className="w-full min-w-max">
              <button
                key={tab.id}
                // onClick={() => onTabChange(tab.id)}
                className={`flex items-center pt-2 pb-4 flex-1 gap-2 ${
                  activeTab === tab.id ? 'text-omblue-700' : 'text-omblue-300'
                }`}
              >
                <span
                  className={`flex items-center text-xs border justify-center w-6 h-6 rounded-full ${
                    activeTab === tab.id
                      ? 'text-omblue-600 font-semibold border-omblue-600 bg-olblue-50'
                      : 'text-omblue-300 border-omblue-100'
                  } ${
                    completedTabs.includes(tab.id) &&
                    '!bg-omblue-600 !border-omblue-600'
                  }`}
                >
                  {completedTabs.includes(tab.id) ? (
                    <Tick className="!text-white w-3 h-3" />
                  ) : (
                    tab.id
                  )}
                </span>
                <span
                  className={`${
                    activeTab === tab.id ? 'font-semibold ' : 'text-omblue-300'
                  } ${
                    completedTabs.includes(tab.id) &&
                    '!text-omblue-700 !font-semibold'
                  }`}
                >
                  {tab.title}
                </span>
              </button>
              <hr
                className={` border-t-2 rounded ${
                  activeTab === tab.id
                    ? 'border-omblue-700'
                    : 'border-omblue-100'
                } ${completedTabs.includes(tab.id) && '!border-omblue-700'}`}
              />
            </span>
          ))}
        </div>

        {/* Tab Content */}
        <div className={`flex-1  ${contentClass}`}>{children}</div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex flex-col mt-5 lg:!mt-0 mb-10  h-11 lg:!mb-0 lg:!flex-row xs:max-w-[172px] lg:!max-w-full 4xl:max-w-screen-2xl mx-auto w-full justify-between lg:absolute lg:bottom-0 lg:left-1/2 lg:-translate-x-1/2">
        <button
          type="button"
          onClick={handleBack}
          disabled={isSubmitting || (activeTab === 1 && activeStep === 1)}
          className="mt-4 lg:!mt-0 mobile:order-1 lg:!flex px-3 py-2 w-full lg:!w-[136px] h-11 border border-omblue-100 rounded text-sm text-omblue-600 hover:bg-gray-50 disabled:opacity-50 justify-center items-center disabled:cursor-not-allowed"
        >
          Back
        </button>
        <div className="lg:space-x-8 flex flex-col-reverse gap-4 lg:!gap-1 lg:!flex-row">
          <button
            type="button"
            className=" text-nav-blue font-medium w-full lg:!w-max"
            onClick={() => handleCancle()}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={isSubmitting}
            className="px-6 py-2 h-11 w-full lg:!w-44 bg-nav-blue rounded text-white hover:bg-omblue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting && (
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
              />
            )}
            {isSubmitting
              ? 'Submitting...'
              : isLastTab && isLastStep
                ? 'Submit'
                : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

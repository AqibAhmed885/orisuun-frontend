import React from 'react';
import Button from './button';
import { cn } from '@/utils/utils';

interface IProps {
  title?: string;
  subTitle?: string;
  description?: string;
  descriptionAlt?: React.ReactNode;
  handleNext?: () => void;
  handleBack?: () => void;
  children: React.ReactNode;
  position?: 'start' | 'center' | 'end';
  nextButtonType?: 'button' | 'submit';
  showBack?: boolean;
  variant?: 'normal' | 'equal' | 'larger-child';
  disableNext?: boolean;
  disableSubmit?: boolean;
  isSubmit?: boolean;
}

const FormLayout: React.FC<IProps> = ({
  handleBack,
  handleNext,
  children,
  title,
  subTitle,
  description,
  descriptionAlt,
  position = 'center',
  nextButtonType = 'button',
  showBack = true,
  variant = 'normal',
  disableNext = false,
  disableSubmit = false,
  isSubmit
}) => {
  return (
    <div className="flex flex-col p-2 md:p-6 min-h-[calc(100vh-90px)]">
      <div className={cn(
          'flex justify-between gap-3 flex-col-reverse mb-24 sm:flex-row pt-10 px-2 md:px-10',
        )}
      >
        <div className={'space-y-6 col-span-12 md:col-span-4 md:col-start-2 w-full sm:w-[40%]'}>

          {subTitle && (
            <h5 className="font-medium text-h5 2xl:font-scaled-h5 text-omblue-800">
              {subTitle}
            </h5>
          )}

          <div className="font-medium text-blue-500 text-h1 2xl:text-scaled-h11">
            {title}
          </div>

          {!descriptionAlt ? (
            <p className="text-[#58595A] text-h7 2xl:text-scaled-h7 ">
              {description}
            </p>
          ) : (
            descriptionAlt
          )}

        </div>
        
        <div
          className={
            variant === 'normal'
              ? 'space-y-4 col-span-12 md:col-span-5 md:col-start-7 w-full md:w-[35%]'
              : variant === 'equal'
                ? 'space-y-4 col-span-12 md:col-span-5 md:col-start-7'
                : 'space-y-4 col-span-12 md:col-span-6'
          }
        >
          {children}
        </div>

      </div>

      <div className="flex mt-6 flex-col fixed bottom-0 right-0 bg-[#f8fcff] items-center justify-end w-full gap-4 py-4 md:flex-row md:pe-10">
        {showBack && (
          <Button
            className="px-4 py-3 text-omblue-500 border w-[calc(100%-60px)] border-omblue-100 bg-white md:w-[170px] rounded-md"
            onClick={handleBack}
            title="Back"
            type="button"
          >
            Back
          </Button>
        )}
        {isSubmit ? (
          <Button
            className="px-4 py-3 text-white w-[calc(100%-60px)] md:w-[170px] rounded-md"
            onClick={handleNext}
            title="Submit"
            type="submit"
            disabled={disableSubmit}
          >
            Submit
          </Button>
        ) : (
          <Button
            className="px-4 py-3 bg-omblue-500 text-white w-[calc(100%-60px)]  md:w-[170px] rounded-md"
            onClick={handleNext}
            title="Next"
            type={nextButtonType}
            disabled={disableNext}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormLayout;

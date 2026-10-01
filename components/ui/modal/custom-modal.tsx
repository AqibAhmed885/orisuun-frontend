'use client';

import useOutsideClick from '@/hooks/useOutsideClick';
import Add from '@/icons/add';
import Close from '@/icons/close';
import { cn } from '@/utils/utils';
import React, { useRef } from 'react';

interface IProps extends React.AllHTMLAttributes<HTMLDivElement> {
  title?: string;
  titleAlignment?: 'left' | 'center' | 'right';
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  modalSize?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CustomModal: React.FC<IProps> = ({
  title,
  titleAlignment = 'left',
  showModal,
  setShowModal,
  children,
  modalSize = 'lg',
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick(ref, () => setShowModal(false));

  const modalDimensions = {
    sm: 'max-w-[20rem] max-h-[300px]',
    md: 'max-w-[35rem] max-h-[450px]',
    lg: 'max-w-[53rem] md:max-h-max',
  };

  return (
    <div
      className={cn(
        `fixed w-full h-screen bg-black-900 bg-opacity-40 inset-0 z-[1000] flex items-center justify-center ${className}`,
        showModal ? 'flex' : 'hidden'
      )}
    >
      <div
        ref={ref}
        className={cn(
          'relative w-[calc(100%-16px)] h-full rounded-lg bg-white mx-auto overflow-hidden flex flex-col',
          modalDimensions[modalSize]
        )}
      >
        <div className="flex-grow pt-10 pb-8 px-12 overflow-y-scroll">
          <div className="relative flex items-center mb-4">
            <h3
              className={cn(
                'font-semibold !text-blue-500 w-full',
                {
                  left: 'text-left',
                  center: 'text-center',
                  right: 'text-right',
                }[titleAlignment],
                modalSize === 'sm'
                  ? 'text-h5 2xl:text-scaled-h5'
                  : modalSize === 'md'
                  ? 'text-h4 2xl:text-scaled-h4'
                  : 'text-h3 2xl:text-scaled-h3'
              )}
            >
              {title}
            </h3>
          </div>
          <div
            className="absolute top-6 right-6 text-black-500 cursor-pointer"
            onClick={(e) => {
              setShowModal(false);
              e.stopPropagation();
            }}
          >
            <Close className="w-5 h-5 " />
          </div>

          <div className="flex-grow">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;

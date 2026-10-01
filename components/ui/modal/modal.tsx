'use client';

import useOutsideClick from '@/hooks/useOutsideClick';
import Add from '@/icons/add';
import { cn } from '@/utils/utils';
import React, { Dispatch, SetStateAction, useRef } from 'react';

interface IProps extends React.AllHTMLAttributes<HTMLDivElement> {
  title?: string;
  showModal: boolean;
  setShowModal: any;
  modalSize?: 'xs' | 'sm' | 'lg' | 'xl';
}

const Modal: React.FC<IProps> = ({
  title,
  showModal,
  setShowModal = () => { },
  children,
  modalSize = 'lg',
}) => {
  const ref = useRef(null);

  useOutsideClick(ref, () => setShowModal(false));

  return (
    <div
      className={cn(
        'fixed w-full h-screen bg-black-900 bg-opacity-40 inset-0 z-[1000] top-0 items-center justify-center',
        showModal ? 'flex' : 'hidden'
      )}
    >
      <div
        ref={ref}
        className={cn(
          'relative w-[calc(100%-16px)] min-h-[calc(100vh-100px)] rounded-lg bg-white mx-auto overflow-hidden flex flex-col',
          modalSize === 'lg'
            ? 'max-w-[50rem] 2xl:max-w-[90rem]'
            : 'max-w-[28rem] 2xl:max-w-[45rem]'
        )}
      >
        <div
          className={cn(
            'flex-grow pb-10 overflow-auto',
            modalSize === 'lg' ? 'h-[29vh]' : 'max-h-[85vh]'
          )}
        >
          <div className={cn("flex items-center justify-between gap-4 mb-4 sticky -top-4 z-50 p-6 pb-0", !title && ' absolute right-0')}>
            <h3
              className={cn(
                'font-bold text-olblue-900',
                modalSize === 'xs'
                  ? 'text-h5 2xl:text-scaled-h5'
                  : 'text-h3 2xl:text-scaled-h3'
              )}
            >
              {title}
            </h3>
            <div
              className={cn(
                'text-black-500 cursor-pointer',
                modalSize === 'xs'
                  ? ''
                  : 'p-3 border border-omblue-100 rounded-md'
                
              )}
              onClick={(e) => {
                setShowModal(false)
                e.stopPropagation()
              }}
            >
              <Add className="w-4 h-4 rotate-45" />
            </div>
          </div>

          <div className=" mobile:px-4 px-6 mb-2 flex-grow">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

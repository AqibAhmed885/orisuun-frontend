'use client';

import useOutsideClick from '@/hooks/useOutsideClick';
import Add from '@/icons/add';
import { cn } from '@/utils/utils';
import {  useRef } from 'react';


const Modal = ({
  showModal,
  setShowModal = () => { },
  children,
}) => {
  const ref = useRef(null);

  useOutsideClick(ref, () => setShowModal(false));

  return (
    <div
      className={cn(
        'fixed w-full min-h-screen bg-black-900 bg-opacity-40 inset-0 z-[1000] top-0 items-center justify-center',
        showModal ? 'flex' : 'hidden'
      )}
    >
      <div
        ref={ref}
        className={cn(
          'relative  p-4 md:p-6 rounded-lg w-[calc(100%-60px)] md:max-w-[660px] md:h-[calc(100vh-80px)] overflow-auto bg-white mx-auto flex flex-col',
        )}
      >
        <div
          className={cn(
            'flex-grow  overflow-auto',
          )}
        >
          
            <div
              className={cn(
                'text-black-200 absolute top-4 right-4  cursor-pointer',
              )}
              onClick={(e) => {
                setShowModal(false)
                e.stopPropagation()
              }}
            >
              <Add className=" w-6 h-6 rotate-45" />
            </div>
          </div>

          <div className=" mobile:px-4  flex-grow">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

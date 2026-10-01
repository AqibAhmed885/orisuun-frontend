import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import React, { Fragment } from 'react';
import Image from 'next/image';
import { XIcon } from 'lucide-react';

// Import CloseIcon as an image if it's an SVG file or use any alternative
// import CloseIcon from "@/assets/icons/close.svg";

const sizes = {
  'full-screen': {
    container: 'w-screen min-h-screen h-full',
    inner: 'w-full min-h-screen h-full rounded-none',
  },
  md: {
    container: 'p-6 max-w-max w-full mx-auto',
    inner: 'w-full max-w-md',
  },
  lg: {
    container: 'p-6 max-w-max w-full mx-auto',
    inner: 'w-full max-w-lg',
  },
  xl: {
    container: 'p-6 max-w-max w-full mx-auto',
    inner: 'w-full max-w-[747px]',
  },
};

const variants = {
  rounded: 'rounded-md',
  'rounded-md': 'rounded-lg',
  'rounded-xl': 'rounded-xl',
  squared: 'rounded-none',
};

const positions = {
  top: 'items-start',
  bottom: 'items-end',
  center: 'items-center',
};

const animations = {
  fade: {
    in: 'opacity-0',
    out: 'opacity-100',
  },
  slide: {
    in: 'opacity-0 scale-95 -translate-y-1/3',
    out: 'opacity-100 scale-100 translate-y-0',
  },
  scale: {
    in: 'opacity-0 scale-0',
    out: 'opacity-100 scale-100',
  },
};

const Modal = ({
  variant = 'rounded',
  size = 'lg',
  position = 'center',
  isOpen,
  children,
  className = '',
  animation = 'slide',
  closeModal,
  shouldCloseOnClickOutside = true,
  showCloseIcon,
  backdropClassName,
  title,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        aria-label="Modal"
        as="div"
        className="relative z-[9999]"
        onClose={shouldCloseOnClickOutside ? closeModal : () => { }}
      >
        {() => (
          <>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div
                className={clsx(
                  backdropClassName,
                  'fixed inset-0 z-0 bg-gray-800 bg-opacity-75'
                )}
              />
            </Transition.Child>

            <div className="fixed inset-0 mx-auto mt-auto overflow-y-auto">
              <div
                className={clsx(
                  'flex min-h-full justify-center',
                  sizes[size].container,
                  positions[position]
                )}
              >
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom={animations[animation].in}
                  enterTo={animations[animation].out}
                  leave="ease-in duration-200"
                  leaveFrom={animations[animation].out}
                  leaveTo={animations[animation].in}
                >
                  <Dialog.Panel
                    className={clsx(
                      'transition-all',
                      size === 'full-screen' ? 'p-0' : 'p-6',
                      className,
                      // ensure tall modals scroll vertically within the viewport
                      'max-h-[85vh] overflow-y-auto',
                      'transform',
                      'bg-white',
                      'dark:bg-dark',
                      sizes[size].inner,
                      variants[variant]
                    )}
                  >
                    <>
                      {showCloseIcon && (
                        <button
                          className="absolute right-2 top-2 z-50 rounded-full border-gray-700 p-2 text-gray-600 transition-colors hover:bg-gray-200 cursor-pointer"
                          onClick={closeModal}
                        >
                          {/* <Image src="" alt="Close" className="h-3 w-3" /> */}
                          <XIcon className="h-5 w-5" />
                        </button>
                      )}

                      {children}
                    </>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </>
        )}
      </Dialog>
    </Transition>
  );
};

export default Modal;

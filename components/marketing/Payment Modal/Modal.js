// components/Modal.js
import { useEffect } from 'react';
import X from '../../../public/icons/x.svg';
import Image from 'next/image';
import { cn } from '@/utils/utils';

const Modal = ({ isOpen, onClose, children, className }) => {
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id === 'modal-overlay') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="modal-overlay"
      className={cn(
        'fixed inset-0 z-50 flex  bg-[#111] bg-opacity-50 items-center justify-center small-1000:overflow-y-scroll hide-scrollbar',
        className
      )}
    >
      <div className="bg-white lg:rounded-[20px]  relative small-1000:w-full  small-1000:overflow-y-auto hide-scrollbar small-1000:h-full  ">
        <button
          className="absolute top-10 right-10 small-1000:right-4 small-1000:top-8 w-[20px] h-[20px] text-gray-400"
          onClick={onClose}
        >
          <Image src={X} alt="cancel" width={20} height={20} />
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;

// // components/Modal.js
// import { useEffect, cloneElement } from 'react';
// import X from '../../../public/icons/x.svg';
// import Image from 'next/image';

// const Modal = ({ isOpen, onClose, children }) => {
//   useEffect(() => {
//     const handleOutsideClick = (event) => {
//       if (event.target.id === 'modal-overlay') {
//         onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener('mousedown', handleOutsideClick);
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleOutsideClick);
//     };
//   }, [isOpen, onClose]);

//   if (!isOpen) return null;

//   // Clone each child and pass the onClose prop
//   const childrenWithProps = React.Children.map(children, (child) => {
//     if (React.isValidElement(child)) {
//       return cloneElement(child, { onClose });
//     }
//     return child;
//   });

//   return (
//     <div
//       id="modal-overlay"
//       className="fixed inset-0 z-50 flex  bg-[#111] bg-opacity-50 items-center justify-center small-1000:overflow-y-scroll hide-scrollbar"
//     >
//       <div className="bg-white lg:rounded-[20px]  relative small-1000:w-full  small-1000:overflow-y-auto hide-scrollbar small-1000:h-full  ">
//         <button
//           className="absolute top-10 right-10 small-1000:right-4 small-1000:top-8 w-[20px] h-[20px] text-gray-400"
//           onClick={onClose}
//         >
//           <Image src={X} alt="cancel" width={20} height={20} />
//         </button>
//         <div>{childrenWithProps}</div>
//       </div>
//     </div>
//   );
// };

// export default Modal;

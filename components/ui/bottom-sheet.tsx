import React from 'react';

interface IProps {
  isOpen: boolean;
  onClose: (e) => void;
  children: React.ReactNode;
}

const BottomSheet: React.FC<IProps> = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black-500 bg-opacity-30 z-40"
          onClick={onClose}
        />
      )}

      <div
        className={`
          fixed bottom-0 left-0 right-0 
          bg-white rounded-t-2xl shadow-lg
          transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        <div className="p-4">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
          {children}
        </div>
      </div>
    </>
  );
};

export default BottomSheet;

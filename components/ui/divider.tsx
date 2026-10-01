import React from 'react';

interface DividerProps {
  text?: string;
  className?: string;
}

const Divider: React.FC<DividerProps> = ({ text, className = '' }) => {
  return (
    <>
    {text ? 
      <div className={`relative flex items-center ${className}`}>
      <div className="flex-grow border-t border-[#E4E9F5]"></div>
      {text && (
        <span className="mx-3 text-blue-300 font-medium text-sm">{text}</span>
      )}
      <div className="flex-grow border-t border-[#E4E9F5]"></div>
    </div> : 
    <hr className='my-2.5 border-grey-600' />
    }
    </>
    
  );
};

export default Divider;

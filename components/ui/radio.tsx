import React, { forwardRef } from 'react';

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  value?: string;
  variant?: 'thick' | 'thin';
  outerSize?: string;
  innerSize?: string;
  labelClasses?: string;
  helperText?: string;
}

const Radio: React.ForwardRefRenderFunction<HTMLInputElement, IProps> = (
  { id, label, value, outerSize, innerSize, labelClasses, helperText, variant = 'thick', ...rest },
  ref
) => {
  return (
    <div className="flex items-center">
      <input
        ref={ref}
        type="radio"
        id={id}
        className="hidden"
        value={value}
        {...rest}
      />
      <label htmlFor={id} className={`flex items-center gap-2 cursor-pointer ${labelClasses}`}>
        <div
          className={`relative flex-shrink-0 ${
            outerSize ? outerSize : ' mobile:w-4 mobile:h-4 w-6 h-6'
          } flex items-center justify-center border 
        ${
          variant === 'thin' && rest.checked
            ? 'border-nav-blue'
            : variant === 'thin'
            ? 'border-black-100'
            : 'border-gray-300'
        } rounded-full`}
        >
          {variant === 'thick'
            ? rest.checked && (
                <div
                  className={`absolute inset-0  ${
                    innerSize ? innerSize : 'mobile:w-5 mobile:h-5 w-6 h-6'
                  }  m-auto rounded-full bg-omblue-500`}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-white"></div>
                </div>
              )
            : rest.checked && (
                <div className="w-[15px] h-[15px] rounded-full bg-omblue-500"></div>
              )}
        </div>

        {variant === 'thick' ? (
          <span className={`text-lg mobile:text-base leading-none cursor-pointer ${rest.checked ? 'font-semibold text-nav-blue' : 'font-medium text-[#6E6E6E]'} `}>
            {label}
            {helperText && <span className='text-blue-300 text-base font-medium'>{helperText}</span>}
          </span>
        ) : (
          <span className="text-black-500-custom text-sm font-medium flex gap-1 items-center">
            {label}
          {helperText && <span className='text-blue-300 text-xs font-medium'>{helperText}</span>}
          </span>
        )}
      </label>
    </div>
  );
};

export default forwardRef(Radio);

import { forwardRef } from "react";
import clsx from "clsx";
import { get } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

const sizes = {
  sm: "p-2 text-sm",
  md: "p-2.5 text-sm font-medium",
  lg: "p-4 text-base",
};
export const Input = forwardRef(
  (
    { type="text", label, errors, size = "md", name, isRequired, className, containClass, ...props },
    ref,
  ) => {
    const hasError = get(errors, name);
    return (
      <div className={clsx("relative", containClass)}>
        <input
          ref={ref}
          type={type}
          name={name}
          {...props}
          id={name}
          className={clsx(
            sizes[size],
            "border w-full rounded-[5px] outline-none placeholder:text-grey-800 box-border",
            hasError ? 'border-red-500 focus:border-red-500 bg-[#fdf2f2]' : 'border-[#B2B3B3] bg-white focus:border-[#B2B3B3]',
            className,
          )}
        />
        {hasError && (
          <ErrorMessage
          errors={errors}
          name={name}
          render={({ message }) => {
            return (
              <label className="absolute text-xs text-red-500 -bottom-4 left-0">{message}</label>
            );
          }}
        />  
        )}
        {/*  */}
      </div>
    );
  },
);

Input.displayName = "Input";

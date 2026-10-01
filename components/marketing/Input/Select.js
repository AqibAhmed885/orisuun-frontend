import { clsx } from "clsx";
import { forwardRef } from "react";

const sizes = {
  sm: "p-2 border-r-[8px] rounded-md text-sm",
  md: "p-2.5 border-r-[10px] rounded-lg text-sm font-medium",
  lg: "p-4 border-r-[16px] rounded-xl text-base",
};

const variants = {
  primary: "border-transparent",
  outlined: "select-wrapper",
};

export const Select = forwardRef(
  (
    { name, options, size = "md", variant = "primary", className, ...props },
    ref,
  ) => {
    return (
      <select
        ref={ref}
        name={name}
        id=""
        {...props}
        className={clsx(
          "outline-none",
          sizes[size],
          variants[variant],
          className,
        )}
      >
        {options?.map((value, i) => (
          <option key={i} value={value}>
            {value}
          </option>
        ))}
      </select>
    );
  },
);

Select.displayName = "Select";

import React, { forwardRef } from "react";
import { cn } from "@/utils/utils";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checkedColor?: string;
  uncheckedColor?: string;
  tickColor?: string;
  children?: React.ReactNode;
}

const Checkbox: React.ForwardRefRenderFunction<HTMLInputElement, CheckboxProps> = (
  {
    checkedColor = "nav-blue",
    uncheckedColor = "bg-white",
    tickColor = "white",
    className,
    children,
    ...props
  },
  ref
) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <div className="relative max-h-5">
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            `rounded w-[20px] h-[20px] checked:border-${checkedColor} checked:bg-${checkedColor} border border-black-100 appearance-none relative`,
            className
          )}
          {...props}
        />
        <style jsx>{`
          input[type="checkbox"]:checked::after {
            content: url('data:image/svg+xml;base64,PHN2ZwogICAgICB3aWR0aD0iMTUiCiAgICAgIGhlaWdodD0iMTUiCiAgICAgIHZpZXdCb3g9IjAgMCAyMCAyMCIKICAgICAgZmlsbD0ibm9uZSIKICAgICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICAgPgogICAgICA8cGF0aAogICAgICAgIGQ9Ik0xLjY2NDA2IDEwTDcuNDk3NCAxNS44MzMzTDE4LjMzMDcgNSIKICAgICAgICBzdHJva2U9J3doaXRlJwogICAgICAgIHN0cm9rZS13aWR0aD0iMyIKICAgICAgICBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiCiAgICAgICAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogICAgICAvPgogICAgPC9zdmc+');
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            height: 15px;
            width: 15px;
            top: -1px;
          }
        `}</style>
      </div>
      <span className="ml-2 text-blue-300 text-sm font-medium">{children}</span>
    </label>
  );
};

export default forwardRef(Checkbox);

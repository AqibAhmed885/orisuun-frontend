import { cn } from "../../../utils/marketing";

const colorScheme = {
  primary: {
    filled:
      "bg-nav-blue text-[#fff] border-nav-blue shadow-sm shadow-nav-blue/30 disabled:bg-[#C7C7C7]",
    outlined:
      "border border-[#D8D9D9] text-text-gray hover:bg-nav-blue hover:text-white disabled:bg-[#C7C7C7]",
    text: "text-nav-blue px-0 py-0",
  },

  secondary: {
    filled:
      "bg-[#162044] text-white shadow-md shadow-[#162044] disabled:bg-[#C7C7C7]",
    outlined:
      "border border-gray-700 text-gray-700 hover:bg-[#162044] disabled:bg-[#C7C7C7]",
    text: "text-[#162044] px-0 py-0",
  },

  tertiary: {
    filled: "bg-[#DEE9FF] text-nav-blue shadow-[#DEE9FF] disabled:bg-[#C7C7C7]",
    outlined:
      "border border-[#D8D9D9] text-text-gray hover:bg-[#162044] hover:text-white disabled:bg-[#C7C7C7]",
    text: "text-[#162044] px-0 py-0",
  },
};

const sizes = {
  xs: {
    text: "text-xs font-medium rounded-lg",
    filled: "py-2 px-3 text-sm font-medium rounded-lg",
    outlined: "py-2 px-3 text-sm font-medium rounded-lg",
  },
  sm: {
    text: "text-sm font-medium rounded-[56px]",
    filled: "py-2 px-3 text-sm font-medium rounded-[56px]",
    outlined: "py-2 px-3 text-sm font-medium rounded-[56px]",
  },
  md: {
    text: "text-base font-semibold rounded-[56px]",
    filled: "py-2.5 px-5 text-base font-semibold rounded-[56px]",
    outlined: "py-2.5 px-5 text-base font-semibold rounded-[56px]",
  },
  lg: {
    text: "text-lg font-semibold rounded-lg",
    filled: "py-3 px-5 text-lg font-semibold rounded-lg",
    outlined: "py-3 px-5 text-lg font-semibold rounded-lg",
  },
  xl: {
    text: "text-lg font-semibold rounded-lg",
    filled: "py-3.5 px-6 text-lg font-semibold rounded-lg",
    outlined: "py-3.5 px-6 text-lg font-semibold rounded-lg",
  },
};

export const Button = ({
  children,
  className = "",
  color = "primary",
  variant = "filled",
  size = "md",
  onClick,
  disabled = false,
  ...props
}) => {
  const classNames = cn(
    "inline-flex items-center justify-center transition-all duration-200 hover:opacity-80 focus:outline-none disabled:cursor-not-allowed  disabled:opacity-70",
    sizes[size][variant],
    colorScheme[color][variant],
    className,
  );
  return (
    <button onClick={onClick} className={classNames} {...props} disabled={disabled}>
      {children}
    </button>
  );
};

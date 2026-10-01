import { SVGProps } from 'react';

interface SvgIconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

export const GoogleIcon: React.FC<SvgIconProps> = ({ className, ...rest }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...rest}
    >
      <g clipPath="url(#clip0_4467_19782)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.6 10.2273C19.6 9.51818 19.5364 8.83637 19.4182 8.18182H10V12.05H15.3818C15.15 13.3 14.4455 14.3591 13.3864 15.0682V17.5773H16.6182C18.5091 15.8364 19.6 13.2727 19.6 10.2273Z"
          fill="#4285F4"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.99886 19.9999C12.6989 19.9999 14.9625 19.1044 16.617 17.5771L13.3852 15.068C12.4898 15.668 11.3443 16.0226 9.99886 16.0226C7.39432 16.0226 5.18977 14.2635 4.40341 11.8999H1.0625V14.4908C2.70795 17.759 6.08977 19.9999 9.99886 19.9999Z"
          fill="#34A853"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.40455 11.9001C4.20455 11.3001 4.09091 10.6591 4.09091 10.0001C4.09091 9.34096 4.20455 8.70005 4.40455 8.10005V5.50914H1.06364C0.386364 6.85914 0 8.38642 0 10.0001C0 11.6137 0.386364 13.141 1.06364 14.491L4.40455 11.9001Z"
          fill="#FBBC05"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.99886 3.97727C11.467 3.97727 12.7852 4.48182 13.8216 5.47273L16.6898 2.60455C14.958 0.990909 12.6943 0 9.99886 0C6.08977 0 2.70795 2.24091 1.0625 5.50909L4.40341 8.1C5.18977 5.73636 7.39432 3.97727 9.99886 3.97727Z"
          fill="#EA4335"
        />
      </g>
      <defs>
        <clipPath id="clip0_4467_19782">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
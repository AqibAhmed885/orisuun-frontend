import { SVGProps } from 'react';

interface SvgIconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

export const MicrosoftIcon: React.FC<SvgIconProps> = ({
  className,
  ...rest
}) => {
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
      <path d="M9.25926 0H0V9.25926H9.25926V0Z" fill="#F25325" />
      <path d="M19.9995 0H10.7402V9.25926H19.9995V0Z" fill="#80BC06" />
      <path d="M9.25926 10.7407H0V20H9.25926V10.7407Z" fill="#05A6F0" />
      <path d="M19.9995 10.7407H10.7402V20H19.9995V10.7407Z" fill="#FEBA08" />
    </svg>
  );
};
import React from 'react';

interface NoFavouritesProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const VerifyNowIcon: React.FC<NoFavouritesProps> = ({
  className,
  ...rest
}) => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...rest}
    >
      <rect width="40" height="40" rx="5" fill="#E9EEF9" />
      <mask
        id="mask0_4268_20192"
        maskUnits="userSpaceOnUse"
        x="8"
        y="8"
        width="24"
        height="24"
      >
        <rect x="8" y="8" width="24" height="24" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_4268_20192)">
        <path
          d="M16.8113 29.8655L15.0267 26.8578L11.6382 26.1155L11.969 22.627L9.67285 20.0001L11.969 17.3732L11.6382 13.8848L15.0267 13.1425L16.8113 10.1348L19.9997 11.4886L23.1882 10.1348L24.9728 13.1425L28.3612 13.8848L28.0305 17.3732L30.3266 20.0001L28.0305 22.627L28.3612 26.1155L24.9728 26.8578L23.1882 29.8654L19.9997 28.5116L16.8113 29.8655ZM17.4497 27.9501L19.9997 26.8693L22.5805 27.9501L23.9997 25.5501L26.7497 24.9193L26.4997 22.1001L28.3497 20.0001L26.4997 17.8693L26.7497 15.0501L23.9997 14.4501L22.5497 12.0501L19.9997 13.1309L17.419 12.0501L15.9997 14.4501L13.2497 15.0501L13.4997 17.8693L11.6497 20.0001L13.4997 22.1001L13.2497 24.9501L15.9997 25.5501L17.4497 27.9501ZM18.9497 23.2039L24.2536 17.9001L23.1997 16.8155L18.9497 21.0655L16.7997 18.9463L15.7459 20.0001L18.9497 23.2039Z"
          fill="#193E8D"
        />
      </g>
    </svg>
  );
};

export default VerifyNowIcon;

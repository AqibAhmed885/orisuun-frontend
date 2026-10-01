import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const UploadIcon: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="41"
      height="40"
      viewBox="0 0 41 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="0.5" width="40" height="40" rx="20" fill="#F2F6FF" />
      <g clipPath="url(#clip0_819_12916)">
        <path
          d="M23.8335 23.3313L20.5002 19.998M20.5002 19.998L17.1669 23.3313M20.5002 19.998V27.498M27.4919 25.323C28.3047 24.8798 28.9467 24.1787 29.3168 23.3301C29.6868 22.4816 29.7637 21.534 29.5354 20.6369C29.307 19.7397 28.7865 18.9442 28.0558 18.3758C27.3251 17.8074 26.4259 17.4986 25.5002 17.498H24.4502C24.198 16.5223 23.7278 15.6166 23.0752 14.8488C22.4225 14.081 21.6042 13.4712 20.682 13.0651C19.7597 12.6591 18.7573 12.4674 17.7503 12.5045C16.7433 12.5416 15.7578 12.8065 14.8679 13.2793C13.9779 13.7521 13.2068 14.4205 12.6124 15.2343C12.018 16.048 11.6158 16.9859 11.436 17.9774C11.2563 18.969 11.3036 19.9884 11.5746 20.959C11.8455 21.9296 12.3329 22.8262 13.0002 23.5813"
          stroke="#204FB4"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_819_12916">
          <rect
            width="20"
            height="20"
            fill="white"
            transform="translate(10.5 10)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default UploadIcon;

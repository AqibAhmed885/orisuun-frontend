import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> { }
const LogoSM: React.FC<LogoProps> = (props) => {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
<path d="M16.9623 1.93977L15.4776 8.87306C15.4776 8.87306 19.4849 8.26531 23.3672 9.89796C27.2495 11.5306 28.7115 14.7507 28.7115 14.7507L31.4558 11.0466L32.9706 8.82122C33.343 8.27408 32.8588 7.5521 32.2113 7.68901L28.5576 8.46148C28.1479 8.54811 27.7487 8.27521 27.6807 7.86196L26.817 2.61242C26.7316 2.09382 26.1452 1.82994 25.7005 2.11001L21.1005 5.0069C20.7483 5.22869 20.2824 5.11392 20.0735 4.75391L18.3161 1.72491C17.9789 1.1437 17.103 1.28272 16.9623 1.93977Z" fill="url(#paint0_linear_385_6920)"/>
<path d="M31.2245 24.6987C31.2245 32.5773 24.8241 38.9777 16.932 38.9777C9.0399 38.9777 2.65308 32.5773 2.65308 24.6987C2.65308 16.8202 9.05344 10.4062 16.932 10.4062C24.8106 10.4062 31.2245 16.8066 31.2245 24.6987ZM24.0297 24.6987C24.0297 20.7831 20.8476 17.6033 16.9343 17.6033C13.0209 17.6033 9.8501 20.7854 9.8501 24.6987C9.8501 28.6121 13.0187 31.7829 16.9343 31.7829C20.8499 31.7829 24.0297 28.6143 24.0297 24.6987Z" fill="url(#paint1_linear_385_6920)"/>
<defs>
<linearGradient id="paint0_linear_385_6920" x1="17.3468" y1="4.89796" x2="31.8366" y2="12.0408" gradientUnits="userSpaceOnUse">
<stop offset="0.9999" stop-color="#77C5F4"/>
<stop offset="1" stop-color="#1D4B9D"/>
</linearGradient>
<linearGradient id="paint1_linear_385_6920" x1="16.9388" y1="10.4062" x2="16.9388" y2="40.4062" gradientUnits="userSpaceOnUse">
<stop stop-color="#E1EAEE"/>
<stop offset="0.9999" stop-color="#69B3E7"/>
</linearGradient>
</defs>
</svg>
  );
};

export default LogoSM;

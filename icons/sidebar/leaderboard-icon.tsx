import React from 'react';
interface LogoProps extends React.SVGProps<SVGSVGElement> {}
const LeaderboardIcon: React.FC<LogoProps> = (props) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask id="path-1-inside-1_537_22823" fill="white">
        <path d="M3 12C3 11.4477 3.44772 11 4 11H9C9.55228 11 10 11.4477 10 12V22H4C3.44772 22 3 21.5523 3 21V12Z" />
      </mask>
      <path d="M3 12C3 11.4477 3.44772 11 4 11H9C9.55228 11 10 11.4477 10 12V22H4C3.44772 22 3 21.5523 3 21V12Z" stroke="#5B657B" stroke-width="3" mask="url(#path-1-inside-1_537_22823)" />
      <path d="M9.5 3.75H15.5C15.638 3.75005 15.75 3.86196 15.75 4V21.25H9.25V4C9.25 3.86193 9.36193 3.75 9.5 3.75Z" stroke="#5B657B" stroke-width="1.5" />
      <mask id="path-3-inside-2_537_22823" fill="white">
        <path d="M15 14C15 13.4477 15.4477 13 16 13H21C21.5523 13 22 13.4477 22 14V21C22 21.5523 21.5523 22 21 22H15V14Z" />
      </mask>
      <path d="M15 14C15 13.4477 15.4477 13 16 13H21C21.5523 13 22 13.4477 22 14V21C22 21.5523 21.5523 22 21 22H15V14Z" stroke="#5B657B" stroke-width="3" mask="url(#path-3-inside-2_537_22823)" />
    </svg>

  );
};

export default LeaderboardIcon;

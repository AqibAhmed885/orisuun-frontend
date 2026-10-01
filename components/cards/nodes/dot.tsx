import type { FC, SVGProps } from 'react';

type TProps = { path: string; isReversed?: boolean } & SVGProps<SVGElement>;
export const CardsNodesDot: FC<TProps> = ({
  path,
  isReversed = false,
  ...props
}) => {
  return (
    <circle cx="0" cy="0" r="3" fill="#0A193A">
      <animateMotion
        {...(isReversed
          ? {}
          : {
              keyPoints: '1;0',
              keyTimes: '0;1',
            })}
        path={path}
        dur="1s"
        repeatCount="indefinite"
        {...props}
      />
    </circle>
  );
};

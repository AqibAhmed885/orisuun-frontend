import {
  ANIMATION_INITIAL_DURATION,
  NODE_HEIGHT,
  NODE_WIDTH,
} from '@/components/cards/nodes/constants';
import type { FC } from 'react';

export type TCardsNodesGlowAuraProps = { id: string } & Partial<{
  width: number;
  height: number;
}>;
export const CardsNodesGlowAura: FC<TCardsNodesGlowAuraProps> = ({
  id,
  width = NODE_WIDTH,
  height = NODE_HEIGHT,
}) => {
  const OFFSET = 28;
  const W = width - OFFSET;
  const H = height - OFFSET;

  const TLX = (width + OFFSET) * 0.5;
  const TLY = (height + OFFSET) * 0.5;

  const BRX = TLX + W;
  const BRY = TLY + H;

  const NORMAL = `M${0},${0}L${0},${H} ${W},${H} ${W},${0} ${0},${0}z`;
  const ALT = `M${0},${0}L${0},${-H} ${-W},${-H} ${-W},${0} ${0},${0}z`;
  const GLOWS = [
    { start: { x: TLX, y: TLY }, path: NORMAL },
    { start: { x: BRX, y: BRY }, path: ALT },
  ] as const;
  return (
    <svg
      width={width * 2}
      height={height * 2}
      viewBox={`0 0 ${width * 2} ${height * 2}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter={`url(#${id})`}>
        {GLOWS.map(({ start, path }) => (
          <circle
            key={path}
            cx={start.x}
            cy={start.y}
            r="30"
            fill="#3284FF"
            fillOpacity="0.24"
          >
            <animateMotion
              begin={`${ANIMATION_INITIAL_DURATION}s`}
              dur="6s"
              repeatCount="indefinite"
              path={path}
            />
          </circle>
        ))}
      </g>
      <defs>
        <filter
          id={id}
          x={0}
          y={0}
          width={width * 2}
          height={height * 2}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="20"
            result="effect1_foregroundBlur_434_8908"
          />
        </filter>
      </defs>
    </svg>
  );
};

import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  anchor: HTMLElement | null;
  visible: boolean;
  text: string;
}

type TooltipPosition = {
  top: number;
  left: number;
  width: number;
  height: number;
};

function measureTooltipText(text: string) {
  if (typeof document === 'undefined') {
    return text.trim().length * 8;
  }

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    return text.trim().length * 8;
  }

  context.font = '500 13px Inter, Arial, sans-serif';
  return context.measureText(text.trim()).width;
}

function getTooltipSize(text: string) {
  const textWidth = measureTooltipText(text);
  const maxWidth = Math.min(520, Math.max(160, window.innerWidth - 24));
  const width = Math.min(maxWidth, Math.max(118, Math.ceil(textWidth) + 52));
  const availableTextWidth = Math.max(80, width - 34);
  const lineCount = Math.max(1, Math.ceil(textWidth / availableTextWidth));
  const height = Math.max(49, 30 + lineCount * 18);

  return { width, height };
}

function getBubblePath(width: number, height: number) {
  const left = 14;
  const right = width - 10;
  const top = 9;
  const bottom = height - 10;
  const mid = height / 2;
  const arrowTip = 8;
  const radius = 6;

  return [
    `M ${right - radius} ${top}`,
    `Q ${right} ${top} ${right} ${top + radius}`,
    `V ${bottom - radius}`,
    `Q ${right} ${bottom} ${right - radius} ${bottom}`,
    `H ${left + radius}`,
    `Q ${left} ${bottom} ${left} ${bottom - radius}`,
    `V ${mid + 6}`,
    `L ${arrowTip} ${mid}`,
    `L ${left} ${mid - 6}`,
    `V ${top + radius}`,
    `Q ${left} ${top} ${left + radius} ${top}`,
    'Z',
  ].join(' ');
}

const SidebarTooltip: React.FC<Props> = ({ anchor, visible, text }) => {
  const [pos, setPos] = useState<TooltipPosition>({ top: 0, left: 0, width: 180, height: 49 });
  const filterId = useMemo(() => `sidebar-tooltip-shadow-${Math.random().toString(36).slice(2)}`, []);

  useEffect(() => {
    if (!anchor || !visible) return;

    const rect = anchor.getBoundingClientRect();
    const { width, height } = getTooltipSize(text);

    let top = rect.top + rect.height / 2 - height / 2;
    let left = rect.right - 4;

    if (top + height > window.innerHeight) top = window.innerHeight - height - 8;
    if (top < 8) top = 8;

    if (left + width > window.innerWidth) {
      left = rect.left - width - 12;
    }

    setPos({ top, left, width, height });
  }, [anchor, visible, text]);

  if (!visible || !anchor) return null;

  const bubblePath = getBubblePath(pos.width, pos.height);

  return createPortal(
    <div
      role="tooltip"
      style={{
        position: 'fixed',
        top: `${pos.top}px`,
        left: `${pos.left}px`,
        width: `${pos.width}px`,
        height: `${pos.height}px`,
        zIndex: 99999,
      }}
      className="pointer-events-none"
    >
      <div className="relative h-full w-full">
        <svg
          width={pos.width}
          height={pos.height}
          viewBox={`0 0 ${pos.width} ${pos.height}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 h-full w-full"
        >
          <g filter={`url(#${filterId})`}>
            <path d={bubblePath} fill="white" stroke="#F0F3F8" strokeWidth="2" />
          </g>
          <defs>
            <filter id={filterId} x="0" y="0" width={pos.width} height={pos.height} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.666316 0 0 0 0 0.666316 0 0 0 0 0.666316 0 0 0 0.15 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
          </defs>
        </svg>

        <span className="absolute inset-y-0 left-[24px] right-[12px] flex items-center text-center text-[13px] font-medium leading-[18px] text-[#193E8D]">
          <span className="w-full break-words">{text}</span>
        </span>
      </div>
    </div>,
    document.body
  );
};

export default SidebarTooltip;

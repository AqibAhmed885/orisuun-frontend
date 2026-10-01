'use client';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { CSSProperties } from 'react';

interface LottieAnimationProps {
  src: string;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Reusable Lottie Animation Component
 * 
 * @example
 * // Basic usage
 * <LottieAnimation src="/find/lottie/pulse (1).json" />
 * 
 * @example
 * // Custom size and no loop
 * <LottieAnimation 
 *   src="/find/lottie/first bounce arrow.json" 
 *   width={200} 
 *   height={200}
 *   loop={false}
 * />
 * 
 * @example
 * // With custom styling
 * <LottieAnimation 
 *   src="/find/lottie/bottom arrow.json" 
 *   className="my-custom-class"
 *   style={{ opacity: 0.8 }}
 *   speed={1.5}
 * />
 */
export default function LottieAnimation({
  src,
  loop = true,
  autoplay = true,
  speed = 1,
  width = 150,
  height = 150,
  className = '',
  style = {},
}: LottieAnimationProps) {
  const containerStyle: CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    ...style,
  };

  return (
    <div className={className} style={containerStyle}>
      <DotLottieReact
        src={src}
        loop={loop}
        autoplay={autoplay}
        speed={speed}
      />
    </div>
  );
}

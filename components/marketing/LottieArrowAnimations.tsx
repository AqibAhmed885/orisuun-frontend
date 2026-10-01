'use client';

import LottieAnimation from '@/components/ui/LottieAnimation';

/**
 * Pre-configured Lottie arrow animations for marketing pages
 * These components use the Lottie files from /public/find/lottie/
 */

interface ArrowAnimationProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  speed?: number;
  loop?: boolean;
}

/**
 * Bottom arrow animation - pointing downward
 */
export function BottomArrow({ 
  width = 205, 
  height = 188, 
  className = '', 
  speed = 1,
  loop = true 
}: ArrowAnimationProps) {
  return (
    <LottieAnimation
      src="/find/lottie/bottom arrow.json"
      width={width}
      height={height}
      className={className}
      speed={speed}
      loop={loop}
    />
  );
}

/**
 * First bounce arrow animation
 */
export function FirstBounceArrow({ 
  width = 205, 
  height = 188, 
  className = '', 
  speed = 1,
  loop = true 
}: ArrowAnimationProps) {
  return (
    <LottieAnimation
      src="/find/lottie/first bounce arrow.json"
      width={width}
      height={height}
      className={className}
      speed={speed}
      loop={loop}
    />
  );
}

/**
 * Full bounce arrow animation
 */
export function FullBounceArrow({ 
  width = 205, 
  height = 188, 
  className = '', 
  speed = 1,
  loop = true 
}: ArrowAnimationProps) {
  return (
    <LottieAnimation
      src="/find/lottie/full bounce first arrow.json"
      width={width}
      height={height}
      className={className}
      speed={speed}
      loop={loop}
    />
  );
}

/**
 * Price arrow (first part) animation
 */
export function PriceArrow({ 
  width = 205, 
  height = 188, 
  className = '', 
  speed = 1,
  loop = true 
}: ArrowAnimationProps) {
  return (
    <LottieAnimation
      src="/find/lottie/Price arrow first part.json"
      width={width}
      height={height}
      className={className}
      speed={speed}
      loop={loop}
    />
  );
}

/**
 * Pulse animation - location pin with pulse effect
 */
export function PulseAnimation({ 
  width = 87, 
  height = 90, 
  className = '', 
  speed = 1,
  loop = true 
}: ArrowAnimationProps) {
  return (
    <LottieAnimation
      src="/find/lottie/pulse (1).json"
      width={width}
      height={height}
      className={className}
      speed={speed}
      loop={loop}
    />
  );
}

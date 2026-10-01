'use client';

import React, { useEffect, useState } from 'react';

const usdFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	maximumFractionDigits: 0,
});

interface AnimatedAmountProps {
	amount: number;
}

const AnimatedAmount: React.FC<AnimatedAmountProps> = ({ amount }) => {
	const [animatedValue, setAnimatedValue] = useState(0);

	useEffect(() => {
		let animationFrame = 0;
		const duration = 900;
		const startTime = performance.now();

		const animate = (currentTime: number) => {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const easedProgress = 1 - Math.pow(1 - progress, 3);

			setAnimatedValue(Math.round(amount * easedProgress));

			if (progress < 1) {
				animationFrame = requestAnimationFrame(animate);
			}
		};

		animationFrame = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animationFrame);
	}, [amount]);

	return <>{usdFormatter.format(animatedValue)}</>;
};

export default AnimatedAmount;

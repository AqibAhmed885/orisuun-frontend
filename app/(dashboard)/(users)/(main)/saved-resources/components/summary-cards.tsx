import React from 'react';
import AnimatedAmount from './animated-amount';

interface SummaryCard {
	label: string;
	value: number;
}

interface SummaryCardsProps {
	summaryCards: SummaryCard[];
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ summaryCards }) => {
	return (
		<div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{summaryCards.map((item) => (
				<div
					key={item.label}
					className="rounded-xl border border-[#D0D5DD] bg-white p-5 text-center"
				>
					<p className="text-h7 text-slate-700">{item.label}</p>
					<p className="mt-2 text-3xl font-semibold text-omblue-900">
						<AnimatedAmount amount={item.value} />
					</p>
				</div>
			))}
		</div>
	);
};

export default SummaryCards;

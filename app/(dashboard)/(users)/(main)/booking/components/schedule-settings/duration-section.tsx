import React from 'react';
import { FIXED_DURATIONS } from './constants';
import type { MeetingPackage } from './types';

interface DurationSectionProps {
	oneTimeId?: string;
	topicId?: string;
	packages: MeetingPackage[];
	localDurationPrices: Record<number, string>;
	onLocalDurationPricesChange: (prices: Record<number, string>) => void;
	onPackageChange: (id: string, field: keyof MeetingPackage, value: any) => void;
}

export default function DurationSection({
	oneTimeId,
	topicId,
	packages,
	localDurationPrices,
	onLocalDurationPricesChange,
	onPackageChange,
}: DurationSectionProps) {
	return (
		<div className="rounded-2xl shadow-border p-6">
			<h3 className="text-base font-semibold text-[#101828]">Duration</h3>
			<div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
				{FIXED_DURATIONS.map((duration) => {
					const pkg = packages.find(
						(item) =>
							item.durationMinutes === duration &&
							((oneTimeId && item.meetingTypeId === oneTimeId) || (topicId && item.meetingTypeId === topicId))
					);
					const displayPrice = pkg ? String(pkg.price) : localDurationPrices[duration] ?? '';

					return (
						<div key={duration}>
							<div className="mb-2 text-sm text-[#101828]">{duration} min</div>
							<div className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-white px-4 py-3">
								<div className="flex items-center gap-0.5 text-sm text-[#101828]">
									<span>$</span>
									<input
										value={displayPrice}
										placeholder="0.00"
										onChange={(event) => {
											if (pkg) {
												onPackageChange(pkg.id, 'price', Number(event.target.value));
											} else {
												onLocalDurationPricesChange({ ...localDurationPrices, [duration]: event.target.value });
											}
										}}
										className="w-16 focus:outline-none font-medium bg-transparent"
										type="number"
										min={0}
									/>
								</div>
								<span className="text-xs text-[#98A2B3] whitespace-nowrap">per {duration} minutes</span>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

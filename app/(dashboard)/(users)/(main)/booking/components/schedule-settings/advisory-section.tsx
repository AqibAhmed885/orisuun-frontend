import React from 'react';
import { FIXED_ADVISORY_PLANS } from './constants';
import type { MeetingPackage } from './types';

interface AdvisorySectionProps {
	advisoryId?: string;
	packages: MeetingPackage[];
	localAdvisoryData: Record<string, { price: string; sessions: string }>;
	whatsIncluded: string;
	maxChars: number;
	onLocalAdvisoryDataChange: (data: Record<string, { price: string; sessions: string }>) => void;
	onWhatsIncludedChange: (value: string) => void;
	onPackageChange: (id: string, field: keyof MeetingPackage, value: any) => void;
	onUpdatePackage: (pkg: MeetingPackage) => Promise<void>;
	onAddPackage: (meetingTypeId: string, packageName: string, price: number, durationMinutes: number, sessionCount?: number) => Promise<void>;
}

export default function AdvisorySection({
	advisoryId,
	packages,
	localAdvisoryData,
	whatsIncluded,
	maxChars,
	onLocalAdvisoryDataChange,
	onWhatsIncludedChange,
	onPackageChange,
	onUpdatePackage,
	onAddPackage,
}: AdvisorySectionProps) {
	return (
		<div className="rounded-2xl shadow-border p-6">
			<h3 className="text-base font-semibold text-[#101828]">Advisory Plan Setup</h3>
			<div className="mt-4 space-y-5">
				{FIXED_ADVISORY_PLANS.map((planName) => {
					const pkg = packages.find((item) => item.packageName === planName && advisoryId && item.meetingTypeId === advisoryId);
					const local = localAdvisoryData[planName] ?? { price: '', sessions: '' };
					const priceVal = pkg ? String(pkg.price) : local.price;
					const sessionsVal = pkg ? String(pkg.sessionCount ?? '') : local.sessions;

					return (
						<div key={planName}>
							<div className="grid grid-cols-2 gap-4">
								<div className="text-sm font-semibold text-[#101828]">{planName}</div>
								<div className="text-sm text-[#667085]">How many sessions would include</div>
							</div>
							<div className="mt-2 grid grid-cols-2 gap-4">
								<div className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-white px-4 py-3">
									<div className="flex items-center gap-0.5 text-sm font-semibold text-[#101828]">
										<span>$</span>
										<input
											value={priceVal}
											placeholder="0.00"
											onChange={(event) => {
												if (pkg) {
													onPackageChange(pkg.id, 'price', Number(event.target.value));
												} else {
													onLocalAdvisoryDataChange({
														...localAdvisoryData,
														[planName]: { ...local, price: event.target.value },
													});
												}
											}}
											onBlur={async () => {
												const price = pkg ? pkg.price : Number(local.price);
												if (!price) return;

												if (pkg) {
													await onUpdatePackage(pkg);
												} else if (advisoryId) {
													await onAddPackage(advisoryId, planName, price, 0, Number(local.sessions) || 1);
													const next = { ...localAdvisoryData };
													delete next[planName];
													onLocalAdvisoryDataChange(next);
												}
											}}
											className="w-full focus:outline-none font-semibold bg-transparent"
											type="number"
											min={0}
										/>
									</div>
									<span className="text-sm text-[#98A2B3]">USD</span>
								</div>
								<div className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-white px-4 py-3">
									<input
										value={sessionsVal}
										placeholder="0"
										onChange={(event) => {
											if (pkg) {
												onPackageChange(pkg.id, 'sessionCount', Number(event.target.value));
											} else {
												onLocalAdvisoryDataChange({
													...localAdvisoryData,
													[planName]: { ...local, sessions: event.target.value },
												});
											}
										}}
										onBlur={async () => {
											if (pkg) await onUpdatePackage(pkg);
										}}
										className="w-full focus:outline-none bg-transparent text-sm font-semibold text-[#101828]"
										type="number"
										min={0}
									/>
									<span className="text-sm text-[#98A2B3]">Sessions</span>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			<div className="mt-6">
				<div className="text-sm font-semibold text-[#101828]">What&apos;s included</div>
				<textarea
					value={whatsIncluded}
					onChange={(event) => onWhatsIncludedChange(event.target.value)}
					maxLength={maxChars}
					placeholder="Describe what kind of guidance you can provide and questions you can answer."
					className="mt-2 w-full rounded-lg border border-[#E5E7EB] p-4 text-sm h-40"
				/>
				<div className="text-right text-xs text-[#98A2B3] mt-1">{maxChars.toLocaleString()} characters (min. 120)</div>
			</div>
		</div>
	);
}

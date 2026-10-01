import React from 'react';
import { CANCELLATION_OPTIONS, LATE_FEE_OPTIONS } from './constants';

interface CancellationPolicySectionProps {
	cancellationWindow: string;
	lateCancellationFee: string;
	onCancellationWindowChange: (value: string) => void;
	onLateCancellationFeeChange: (value: string) => void;
}

export default function CancellationPolicySection({
	cancellationWindow,
	lateCancellationFee,
	onCancellationWindowChange,
	onLateCancellationFeeChange,
}: CancellationPolicySectionProps) {
	return (
		<div className="rounded-2xl shadow-border p-6">
			<h3 className="text-base font-semibold text-[#101828]">Cancellation Policy</h3>
			<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div>
					<label className="text-sm text-[#101828]">Cancellation window</label>
					<select
						value={cancellationWindow}
						onChange={(event) => onCancellationWindowChange(event.target.value)}
						className="mt-2 w-full rounded-md border px-4 py-2 text-sm appearance-none bg-white"
					>
						{CANCELLATION_OPTIONS.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
				</div>

				<div>
					<label className="text-sm text-[#101828]">Late cancellation fee</label>
					<select
						value={lateCancellationFee}
						onChange={(event) => onLateCancellationFeeChange(event.target.value)}
						className="mt-2 w-full rounded-md border px-4 py-2 text-sm appearance-none bg-white"
					>
						{LATE_FEE_OPTIONS.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
}

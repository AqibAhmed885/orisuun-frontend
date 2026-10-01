import React from 'react';

interface ScheduleSidebarProps {
	onConnectBankAccount: () => void;
	isConnectingBankAccount: boolean;
}

export default function ScheduleSidebar({ onConnectBankAccount, isConnectingBankAccount }: ScheduleSidebarProps) {
	return (
		<div className="space-y-4 xl:sticky xl:top-6 md:-mt-12">
			<div className="rounded-2xl shadow-border p-6">
				<h4 className="text-base font-semibold leading-tight text-[#101828]">Select offering type</h4>
				<p className="mt-2 text-sm leading-[1.35] text-[#667085]">
					A selector for professionals to categorize their service as a standard video call, a recurring advisory package, or a specific task-based consultation like a pitch deck audit.
				</p>

				<h4 className="mt-8 text-base font-semibold leading-tight text-[#101828]">Availability and Policies</h4>
				<p className="mt-4 text-sm leading-[1.35] text-[#667085]">
					This section manages when you can be booked and your rules for no-shows. It includes calendar syncing, mandatory gaps between meetings, and settings for late-cancellation fees.
				</p>

				<h4 className="mt-8 text-base font-semibold leading-tight text-[#101828]">Cancellation Policy</h4>
				<p className="mt-4 text-sm leading-[1.35] text-[#667085]">
					Sets fees and rules for late cancellations. Professionals set a rate (0%-50%, capped at $250) and a timeframe (up to 48 hours) to ensure compensation if a member cancels last minute.
				</p>
			</div>

			<div className="rounded-2xl shadow-border p-4">
				<h4 className="text-base font-semibold leading-tight text-[#101828]">Booking Rules</h4>
				<ul className="mt-4 list-disc space-y-2 pl-3 text-sm leading-[1.3] text-[#101828]">
					<li>
						Lead Time: <strong>Minimum 12 Hours</strong>
					</li>
					<li>
						Buffer Time: <strong>30 Minutes Between Meetings</strong>
					</li>
					<li>
						Meeting Capacity: <strong>Maximum 5 Meetings / Day</strong>
					</li>
					<li>
						Cancellation fees are capped at <strong>$250</strong> maximum.
					</li>
				</ul>
			</div>

			<div className="rounded-2xl shadow-border p-6">
				<h4 className="text-base font-semibold leading-tight text-[#101828]">Set up your Payouts</h4>
				<button
					type="button"
					onClick={onConnectBankAccount}
					disabled={isConnectingBankAccount}
					aria-busy={isConnectingBankAccount}
					className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg border border-[#3366D1] px-4 py-3 text-base font-semibold text-[#3366D1] disabled:cursor-not-allowed disabled:opacity-60"
				>
					{isConnectingBankAccount && (
						<span
							className="h-4 w-4 animate-spin rounded-full border-2 border-[#3366D1] border-t-transparent"
							aria-hidden="true"
						/>
					)}
					{isConnectingBankAccount ? 'Connecting...' : 'Connect Your Bank Account'}
				</button>
			</div>
		</div>
	);
}

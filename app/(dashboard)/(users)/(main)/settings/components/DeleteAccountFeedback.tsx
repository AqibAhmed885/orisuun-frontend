import React, { useState } from 'react';
import { toast } from 'react-toastify';

const reasons = [
	{ value: 'too_expensive', label: 'Too expensive' },
	{ value: 'not_enough_activity', label: 'Not enough activity' },
	{ value: 'too_few_users', label: 'Too few users' },
	{ value: 'site_did_not_function', label: 'Site did not function properly for me' },
	{ value: 'found_another', label: 'Found another platform' },
	{ value: 'other', label: 'Other (please explain)' },
];

const willReturnOptions = [
	{ value: 'yes', label: 'Yes' },
	{ value: 'no', label: 'No' },
	{ value: 'maybe', label: 'Maybe' },
];

export default function DeleteAccountFeedback({
	onSubmit,
	onCancel,
}: {
	onSubmit: (feedbackString: string) => void;
	onCancel: () => void;
}) {
	const [reason, setReason] = useState('');
	const [otherText, setOtherText] = useState('');
	const [willReturn, setWillReturn] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const reasonLabel = reasons.find((r) => r.value === reason)?.label || reason || 'No reason';
		const otherPart = reason === 'other' && otherText ? `; details: ${otherText}` : '';
		const willReturnLabel = willReturnOptions.find((w) => w.value === willReturn)?.label || willReturn || 'Unknown';

		// single string payload
		const feedbackString = `reason: ${reasonLabel}${otherPart}; willReturn: ${willReturnLabel}`;

		
		onSubmit(feedbackString);
		setReason('');
		setOtherText('');
		setWillReturn('');
		toast.success('Feedback submitted successfully.');
	};

	

	return (
		<form onSubmit={handleSubmit} className="flex flex-col p-4 tracking-wide text-gray-700 h-full">
			<h3 className="text-lg font-semibold mb-2">Why are you deleting your account?</h3>
			<div className="space-y-2 mb-4">
				{reasons.map((r) => (
					<label key={r.value} className="flex items-center gap-2">
						<input
							type="radio"
							name="reason"
							value={r.value}
							checked={reason === r.value}
							onChange={() => setReason(r.value)}
							required
							className="w-4 h-4"
						/>
						{r.label}
					</label>
				))}
				{reason === 'other' && (
					<textarea
						className="w-full border h-36 rounded p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-omblue-500"
						placeholder="Please explain"
						value={otherText}
						onChange={(e) => setOtherText(e.target.value)}
						required
					/>
				)}
			</div>

			<h3 className="text-lg font-semibold mb-2">Will you return?</h3>
			<div className="space-y-2 mb-4">
				{willReturnOptions.map((opt) => (
					<label key={opt.value} className="flex items-center gap-2">
						<input
							type="radio"
							name="willReturn"
							value={opt.value}
							checked={willReturn === opt.value}
							onChange={() => setWillReturn(opt.value)}
							required
							className="w-4 h-4"
						/>
						{opt.label}
					</label>
				))}
			</div>

			<div className="flex gap-2 justify-end ">
				<button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
					Cancel
				</button>
				<button type="submit" className="px-4 py-2 rounded bg-omblue-600 font-medium text-white">
					Submit Feedback & Delete
				</button>
			</div>
		</form>
	);
}
import React from 'react';
import { Clock3 } from 'lucide-react';

function normalizeTimeValue(value: string) {
	const trimmedValue = value.trim().toLowerCase();

	if (/^\d{2}:\d{2}$/.test(trimmedValue)) return trimmedValue;

	const match = trimmedValue.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
	if (!match) return '';

	let hour = Number(match[1]);
	const minute = match[2] ?? '00';
	const meridiem = match[3];

	if (meridiem === 'pm' && hour < 12) hour += 12;
	if (meridiem === 'am' && hour === 12) hour = 0;
	if (hour > 23 || Number(minute) > 59) return '';

	return `${String(hour).padStart(2, '0')}:${minute}`;
}

interface TimeInputProps {
	value: string;
	placeholder?: string;
	onChange: (value: string) => void;
}

export default function TimeInput({ value, placeholder, onChange }: TimeInputProps) {
	return (
		<label className="relative flex h-10 w-[150px] items-center rounded-lg border border-[#E5E7EB] bg-white px-4 text-sm text-[#101828] shadow-sm">
			<input
				type="time"
				value={normalizeTimeValue(value)}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className="min-w-0 flex-1 bg-transparent pr-8 text-sm leading-none outline-none placeholder:text-[#101828] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
			/>
			<Clock3 className="pointer-events-none absolute right-2 h-4 w-4 shrink-0 text-[#98A2B3]" strokeWidth={2.2} />
		</label>
	);
}

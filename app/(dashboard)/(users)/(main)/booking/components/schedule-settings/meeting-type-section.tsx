import React from 'react';
import { MEETING_TYPE_CATEGORIES } from './constants';

interface MeetingTypeSectionProps {
	selectedTypes: string[];
	onToggleType: (type: string) => void;
}

export default function MeetingTypeSection({ selectedTypes, onToggleType }: MeetingTypeSectionProps) {
	return (
		<div className="rounded-2xl shadow-border shadow-blur p-6">
			<h3 className="text-base font-semibold text-[#101828]">Select the Type of Meetings You Want To Offer</h3>
			<p className="mt-2 text-sm text-[#667085]">May select more than one</p>

			<div className="mt-4 flex flex-wrap gap-3">
				{MEETING_TYPE_CATEGORIES.map((type) => {
					const active = selectedTypes.includes(type);

					return (
						<button
							key={type}
							onClick={() => onToggleType(type)}
							type="button"
							className={`rounded-lg border px-4 py-2 text-sm font-medium ${
								active ? 'bg-white text-omblue-500 ring-1 ring-omblue-100' : 'bg-white text-[#334155] shadow-sm'
							}`}
						>
							{type}
						</button>
					);
				})}
			</div>
		</div>
	);
}

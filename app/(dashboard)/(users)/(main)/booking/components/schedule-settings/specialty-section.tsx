import React from 'react';
import { SPECIALTIES } from './constants';

interface SpecialtySectionProps {
	selectedSpecialties: string[];
	onToggleSpecialty: (specialty: string, description: string) => void;
}

export default function SpecialtySection({ selectedSpecialties, onToggleSpecialty }: SpecialtySectionProps) {
	return (
		<div className="rounded-2xl shadow-border p-6">
			<h3 className="text-base font-semibold text-[#101828]">Specialty setup</h3>
			<p className="mt-2 text-sm text-[#667085]">Which of these topics could be considered a speciality for you?</p>
			<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
				{SPECIALTIES.map((specialty) => {
					const active = selectedSpecialties.includes(specialty);

					return (
						<button
							key={specialty}
							onClick={() => onToggleSpecialty(specialty, 'Specialized mentorship session with structured outcomes.')}
							type="button"
							className={`relative rounded-lg border border-[#EEF2F6] bg-white p-4 text-left hover:shadow-sm min-h-[120px] ${
								active ? 'ring-1 ring-omblue-100' : ''
							}`}
						>
							<div
								className={`h-7 w-7 mb-2 flex items-center justify-center rounded-md ${
									active ? 'bg-omblue-500 text-white' : 'border border-[#E6EEF8] bg-white'
								}`}
							>
								{active ? (
									<svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								) : null}
							</div>
							<div className="text-sm font-semibold text-[#0F172A]">{specialty}</div>
							<div className="mt-3 text-sm text-[#667085]">Specialized mentorship session with structured outcomes.</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}

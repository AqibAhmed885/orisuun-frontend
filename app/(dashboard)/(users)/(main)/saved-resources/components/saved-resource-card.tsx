'use client';

import React, { useEffect, useRef, useState } from 'react';
import { EllipsisSmIcon } from '@/icons/ellipsis';
import LocationPin from '@/icons/location-pin';
import CalenderClock from '@/icons/calender-clock';
import { cn } from '@/utils/utils';

export type ResourceStatus =
	| 'Applied'
	| 'Follow Up Required'
	| 'Accepted'
	| 'Rejected'
	| 'Saved';

export type ResourceCategory =
	| 'Accelerator'
	| 'Grants'
	| 'NGO Programs'
	| 'School Programs'
	| 'Competitions'
	| 'Specialty Financing'
	| 'Government Programs';

export interface SavedResource {
	id: string;
	title: string;
	organization: string;
	location: string;
	country: string;
	deadline: string;
	amount: string;
	category: ResourceCategory;
	description: string;
	remindMe: boolean;
}

const CATEGORY_STYLES: Record<ResourceCategory, string> = {
	Accelerator: 'bg-omblue-50 text-omblue-500',
	Grants: 'bg-green-100 text-green-700',
	'NGO Programs': 'bg-pink-100 text-pink-700',
	'School Programs': 'bg-orange-100 text-orange-700',
	Competitions: 'bg-purple-100 text-purple-700',
	'Specialty Financing': 'bg-teal-100 text-teal-700',
	'Government Programs': 'bg-slate-100 text-slate-700',
};

interface SavedResourceCardProps {
	resource: SavedResource;
	currentSection: ResourceStatus;
	onToggleReminder: (resourceId: string) => void;
	onChangeStatus: (
		resourceId: string,
		currentSection: ResourceStatus,
		nextStatus: Exclude<ResourceStatus, 'Saved'>
	) => void;
}

const SavedResourceCard: React.FC<SavedResourceCardProps> = ({
	resource,
	currentSection,
	onToggleReminder,
	onChangeStatus,
}) => {
	const [showStatusMenu, setShowStatusMenu] = useState(false);
	const menuRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			if (!menuRef.current) {
				return;
			}

			if (!menuRef.current.contains(event.target as Node)) {
				setShowStatusMenu(false);
			}
		};

		document.addEventListener('mousedown', handleOutsideClick);
		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, []);

	const statusMenuOptions: Exclude<ResourceStatus, 'Saved'>[] = [
		'Applied',
		'Follow Up Required',
		'Accepted',
		'Rejected',
	];

	const normalizedCountry =
		resource.country && resource.country.trim().length > 0
			? resource.country
					.split(' ')
					.map((word) =>
						word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
					)
					.join(' ')
			: 'Country unavailable';

	return (
		<article className="md:w-[340px] w-[300px] min-w-[340px] max-h-[420px] rounded-md border border-[#EAECF0] bg-white p-4 flex flex-col">
			<div className="mb-4 flex items-start justify-between gap-3">
				<div className="relative" ref={menuRef}>
					<button
						type="button"
						className="text-gray-600 rotate-90"
						aria-label="More actions"
						onClick={() => setShowStatusMenu((previous) => !previous)}
					>
						<EllipsisSmIcon />
					</button>

					{showStatusMenu && (
						<div className="absolute left-0 top-7 z-30 w-40 rounded-md border border-[#EAECF0] bg-white p-4 shadow-lg">
							<div className="space-y-4">
								{statusMenuOptions.map((status) => (
									<button
										key={status}
										type="button"
										onClick={() => {
											onChangeStatus(resource.id, currentSection, status);
											setShowStatusMenu(false);
										}}
										className={cn(
											'w-full text-left text-xs font-medium text-slate-500',
											currentSection === status && 'text-omblue-700'
										)}
									>
										{status}
									</button>
								))}
							</div>
						</div>
					)}
				</div>
				<span
					className={cn(
						'rounded-full px-3 py-1 text-sm font-semibold',
						CATEGORY_STYLES[resource.category]
					)}
				>
					{resource.category}
				</span>
			</div>

			<div className="mb-3 flex items-start justify-between gap-3">
				<div>
					<h3 className="text-base font-semibold text-slate-800">{resource.title}</h3>
					<p className="text-xs text-slate-500">{resource.organization}</p>
				</div>
				{resource.amount && resource.amount !== '$0' && resource.amount !== '$0.00' && (
					<div className="inline-flex py-2 items-center rounded-md border border-gray-300 px-3 text-xs font-medium text-slate-700">
						<span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-omblue-500" />
						{resource.amount}
					</div>
				)}
			</div>

			<div className="mb-3 flex items-start gap-3 text-slate-600">
				<LocationPin className="h-6 w-6 text-slate-400" />
				<div className="space-y-1">
					<p className="text-xs text-slate-700">{resource.location}</p>
					<p className="text-xs text-slate-500">{normalizedCountry}</p>
				</div>
			</div>

			<div className="mb-3 flex items-center gap-2 text-slate-600">
				<CalenderClock className="h-6 w-6 text-slate-400" />
				<p className="text-xs text-slate-700">
					<span className="font-semibold">Apply by:</span> {resource.deadline}
				</p>
			</div>

			<p className="mb-4 line-clamp-3 text-xs text-slate-500">{resource.description}</p>

			<div className="mt-auto flex items-center justify-between gap-3">
				<span className="text-xs font-semibold text-slate-700">Remind me</span>
				<button
					onClick={() => onToggleReminder(resource.id)}
					className={cn(
						'relative inline-flex h-8 w-16 items-center rounded-full px-2 text-[10px] font-medium transition-colors',
						resource.remindMe
							? 'bg-[#B6C2DB33] text-omblue-700'
							: 'bg-gray-100 text-slate-500'
					)}
					aria-label={`Toggle reminder for ${resource.title}`}
				>
					<span
						className={cn(
							'absolute h-8 w-8 rounded-full transition-transform duration-200',
							resource.remindMe
								? 'translate-x-6 bg-omblue-500'
								: '-translate-x-2 bg-slate-400'
						)}
					/>
					<span className={cn('relative z-10', resource.remindMe ? 'pr-8' : 'pl-8')}>
						{resource.remindMe ? 'Yes' : 'No'}
					</span>
				</button>
			</div>
		</article>
	);
};

export default SavedResourceCard;

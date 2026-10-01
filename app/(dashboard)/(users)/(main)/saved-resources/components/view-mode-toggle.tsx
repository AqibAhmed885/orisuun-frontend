'use client';

import React from 'react';
import { cn } from '@/utils/utils';
import CardViewIcon from '@/icons/card-view';
import ListViewIcon from '@/icons/list-view';

interface ViewModeToggleProps {
	viewMode: 'card' | 'list';
	onChange: (viewMode: 'card' | 'list') => void;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ viewMode, onChange }) => {
	return (
		<div className="flex items-center gap-2 rounded-full border border-[#D0D5DD] bg-white p-1">
			<button
				type="button"
				onClick={() => onChange('card')}
				className={cn(
					'inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition-colors',
					viewMode === 'card' ? 'bg-omblue-500 text-white' : 'text-slate-600'
				)}
			>
				<CardViewIcon viewMode={viewMode} />
				Card View
			</button>
			<button
				type="button"
				onClick={() => onChange('list')}
				className={cn(
					'inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition-colors',
					viewMode === 'list' ? 'bg-omblue-500 text-white' : 'text-slate-600'
				)}
			>
				<ListViewIcon viewMode={viewMode} />
				List View
			</button>
		</div>
	);
};

export default ViewModeToggle;

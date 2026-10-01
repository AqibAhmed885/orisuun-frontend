'use client';

import React from 'react';
import ChevronDown from '@/icons/chevron-down';
import SearchIcon from '@/icons/search-icon';
import { cn } from '@/utils/utils';

export type ListColumnKey =
	| 'description'
	| 'city'
	| 'resourceType'
	| 'funding'
	| 'deadline'
	| 'status'
	| 'action';

export type SortOrder = 'none' | 'asc' | 'desc';

export interface ColumnFilterState {
	sortOrder: SortOrder;
	selectedOptions: string[];
	autoApply: boolean;
}

interface ListViewFilterHeaderProps {
	columns: ListColumnKey[];
	labels: Record<ListColumnKey, string>;
	activeFilterColumn: ListColumnKey | null;
	draftColumnFilter: ColumnFilterState | null;
	filterSearch: string;
	visibleOptions: string[];
	isAllVisibleSelected: boolean;
	filterPopoverRef: React.RefObject<HTMLDivElement | null>;
	onOpenColumnFilter: (column: ListColumnKey) => void;
	onSearchChange: (value: string) => void;
	onSortChange: (sortOrder: SortOrder) => void;
	onToggleSelectAll: () => void;
	onToggleOption: (option: string) => void;
	onToggleAutoApply: () => void;
	onApplyFilter: () => void;
	onClearFilter: () => void;
}

const ListViewFilterHeader: React.FC<ListViewFilterHeaderProps> = ({
	columns,
	labels,
	activeFilterColumn,
	draftColumnFilter,
	filterSearch,
	visibleOptions,
	isAllVisibleSelected,
	filterPopoverRef,
	onOpenColumnFilter,
	onSearchChange,
	onSortChange,
	onToggleSelectAll,
	onToggleOption,
	onToggleAutoApply,
	onApplyFilter,
	onClearFilter,
}) => {
	return (
		<div className="grid grid-cols-7 border-b border-[#EAECF0] bg-[#F9FAFB] px-4 py-3 text-sm font-semibold text-slate-600">
			{columns.map((column) => {
				const isActive = activeFilterColumn === column && !!draftColumnFilter;

				return (
					<div key={column} className="relative flex items-center gap-2">
						<span>{labels[column]}</span>
						<button
							type="button"
							onClick={() => onOpenColumnFilter(column)}
							className="inline-flex h-5 w-5 items-center justify-center rounded text-slate-700 hover:bg-slate-200"
							aria-label={`Open ${labels[column]} filter`}
						>
							<ChevronDown className="text-slate-700" />
						</button>

						{isActive && (
							<div
								ref={filterPopoverRef}
								className="absolute left-0 top-8 z-40 w-[360px] rounded-md border border-[#D0D5DD] bg-white p-5 text-slate-900 shadow-2xl"
							>
								<p className="text-lg font-semibold">Sort</p>
								<div className="mt-4 grid grid-cols-2 gap-3">
									<button
										type="button"
										onClick={() => onSortChange('asc')}
										className={cn(
											'flex items-center justify-center rounded-lg border px-2 py-1.5 text-sm',
											draftColumnFilter?.sortOrder === 'asc'
												? 'border-omblue-300 text-omblue-700'
												: 'border-[#D0D5DD] text-slate-800'
										)}
									>
										Ascending
										<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M2.5 13.3359L5.83333 16.6693M5.83333 16.6693L9.16667 13.3359M5.83333 16.6693V3.33594M16.6667 6.66927H12.5M12.5 8.33594V5.41927C12.5 4.86674 12.7195 4.33683 13.1102 3.94613C13.5009 3.55543 14.0308 3.33594 14.5833 3.33594C15.1359 3.33594 15.6658 3.55543 16.0565 3.94613C16.4472 4.33683 16.6667 4.86674 16.6667 5.41927V8.33594M12.5 11.6693H16.6667L12.5 16.6693H16.6667" stroke="#0A193A" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									</button>
									<button
										type="button"
										onClick={() => onSortChange('desc')}
										className={cn(
											'flex items-center justify-center rounded-lg border px-2 py-1.5 text-sm',
											draftColumnFilter?.sortOrder === 'desc'
												? 'border-omblue-300 text-omblue-700'
												: 'border-[#D0D5DD] text-slate-800'
										)}
									>
										Descending
										<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M2.5 6.66927L5.83333 3.33594M5.83333 3.33594L9.16667 6.66927M5.83333 3.33594V16.6693M16.6667 6.66927H12.5M12.5 8.33594V5.41927C12.5 4.86674 12.7195 4.33683 13.1102 3.94613C13.5009 3.55543 14.0308 3.33594 14.5833 3.33594C15.1359 3.33594 15.6658 3.55543 16.0565 3.94613C16.4472 4.33683 16.6667 4.86674 16.6667 5.41927V8.33594M12.5 11.6693H16.6667L12.5 16.6693H16.6667" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									</button>
								</div>

								<p className="mt-6 text-lg font-semibold">Filter</p>
								<div className="mt-4 flex items-center gap-3 rounded-md border border-[#D0D5DD] px-4 py-2">
									<SearchIcon className="h-4 w-4 text-slate-500" />
									<input
										type="text"
										value={filterSearch}
										onChange={(event) => onSearchChange(event.target.value)}
										placeholder="Search"
										className="w-full bg-transparent text-sm outline-none"
									/>
								</div>

								<div className="mt-4 max-h-44 space-y-3 overflow-y-auto pr-1 text-sm font-light text-slate-600">
									<label className="flex items-center gap-3">
										<input
											type="checkbox"
											checked={isAllVisibleSelected}
											onChange={onToggleSelectAll}
											className="h-5 w-5 rounded border-[#D0D5DD]"
										/>
										<span>Select all</span>
									</label>

									{visibleOptions.map((option) => (
										<label key={option} className="flex items-center gap-3">
											<input
												type="checkbox"
												checked={!!draftColumnFilter?.selectedOptions.includes(option)}
												onChange={() => onToggleOption(option)}
												className="h-5 w-5 rounded border-[#D0D5DD]"
											/>
											<span>{option}</span>
										</label>
									))}
								</div>

								<label className="mt-5 flex items-center gap-3 text-lg font-semibold">
									<input
										type="checkbox"
										checked={!!draftColumnFilter?.autoApply}
										onChange={onToggleAutoApply}
										className="h-6 w-6 rounded border-[#D0D5DD]"
									/>
									<span>Auto Apply</span>
								</label>

								<div className="mt-6 grid grid-cols-2 gap-4">
									<button
										type="button"
										onClick={onApplyFilter}
										className="rounded-lg bg-omblue-500 px-2 py-1.5 text-sm font-semibold text-white"
									>
										Apply Filter
									</button>
									<button
										type="button"
										onClick={onClearFilter}
										className="rounded-lg border border-omblue-300 px-2 py-1.5 text-sm font-semibold text-omblue-600"
									>
										Clear Filter
									</button>
								</div>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default ListViewFilterHeader;

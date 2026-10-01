'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import ChevronRightBlack from '@/icons/chevron-right-black';
import { cn } from '@/utils/utils';
import ListViewFilterHeader, {
	ColumnFilterState,
	ListColumnKey,
	SortOrder,
} from './components/list-view-filter-header';
import SavedResourceCard from './components/saved-resource-card';
import SummaryCards from './components/summary-cards';
import ViewModeToggle from './components/view-mode-toggle';

type ResourceStatus =
	| 'Applied'
	| 'Follow Up Required'
	| 'Accepted'
	| 'Rejected'
	| 'Saved';

type ResourceCategory =
	| 'Accelerator'
	| 'Grants'
	| 'NGO Programs'
	| 'School Programs'
	| 'Competitions'
	| 'Specialty Financing'
	| 'Government Programs';

type ViewMode = 'card' | 'list';
type GroupByMode = 'status' | 'deadline';

interface SavedResource {
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

interface ListViewRow {
	resource: SavedResource;
	status: ResourceStatus;
}

const STATUS_SECTIONS: ResourceStatus[] = [
	'Applied',
	'Follow Up Required',
	'Accepted',
	'Rejected',
	'Saved',
];

const CATEGORY_STYLES: Record<ResourceCategory, string> = {
	Accelerator: 'bg-omblue-50 text-omblue-500',
	Grants: 'bg-green-100 text-green-700',
	'NGO Programs': 'bg-pink-100 text-pink-700',
	'School Programs': 'bg-orange-100 text-orange-700',
	Competitions: 'bg-purple-100 text-purple-700',
	'Specialty Financing': 'bg-teal-100 text-teal-700',
	'Government Programs': 'bg-slate-100 text-slate-700',
};

const LIST_COLUMN_LABELS: Record<ListColumnKey, string> = {
	description: 'Description',
	city: 'City',
	resourceType: 'Resources Type',
	funding: 'Funding',
	deadline: 'Deadline',
	status: 'Status',
	action: 'Action',
};

const LIST_COLUMNS: ListColumnKey[] = [
	'description',
	'city',
	'resourceType',
	'funding',
	'deadline',
	'status',
	'action',
];

const createDefaultColumnFilters = (): Record<ListColumnKey, ColumnFilterState> => ({
	description: { sortOrder: 'none', selectedOptions: [], autoApply: false },
	city: { sortOrder: 'none', selectedOptions: [], autoApply: false },
	resourceType: { sortOrder: 'none', selectedOptions: [], autoApply: false },
	funding: { sortOrder: 'none', selectedOptions: [], autoApply: false },
	deadline: { sortOrder: 'none', selectedOptions: [], autoApply: false },
	status: { sortOrder: 'none', selectedOptions: [], autoApply: false },
	action: { sortOrder: 'none', selectedOptions: [], autoApply: false },
});

interface ApiGroupedResourceResponse {
	StatusCode: number;
	Message: string;
	Result: ApiStatusGroup[];
}

interface ApiStatusGroup {
	Status: string;
	Count: number;
	Resources: ApiSavedResource[];
}

interface ApiSavedResource {
	SavedResourceId: string;
	IsNotifyEnabled?: boolean;
	Resource: {
		Name?: string;
		Sponsor?: string;
		Description?: string;
		ApplicationDeadline?: string | null;
		ExpirationDate?: string | null;
		EventDate?: string | null;
		CurrencySymbol?: string | null;
		ResourceType?: {
			TypeName?: string;
		} | null;
		Address?: string;
		Country?: {
			CountryName?: string;
		} | null;
		State?: {
			StateName?: string;
		} | null;
		City?: {
			CityName?: string;
		} | null;
		GrantDetails?: {
			GrantAmount?: number | null;
		} | null;
		CompetitionDetails?: {
			PrizeAmount?: number | null;
		} | null;
	};
}

const API_KEY =
	process.env.NEXT_PUBLIC_API_KEY ||
	'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5';

const getApiBaseUrl = () =>
	process.env.NEXT_PUBLIC_APP_BASE_URL
		? `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`
		: 'https://api.orisuun.com/api';

const createEmptyResourcesBySection = (): Record<ResourceStatus, SavedResource[]> => ({
	Applied: [],
	'Follow Up Required': [],
	Accepted: [],
	Rejected: [],
	Saved: [],
});

const createInitialSectionOverflowState = (): Record<ResourceStatus, boolean> => ({
	Applied: false,
	'Follow Up Required': false,
	Accepted: false,
	Rejected: false,
	Saved: false,
});

const normalizeStatus = (status: string): ResourceStatus | null => {
	const normalized = status.trim().toLowerCase();

	if (normalized === 'saved') return 'Saved';
	if (normalized === 'applied') return 'Applied';
	if (normalized === 'accepted') return 'Accepted';
	if (normalized === 'rejected') return 'Rejected';
	if (normalized === 'follow up required' || normalized === 'followuprequired') {
		return 'Follow Up Required';
	}

	return null;
};

const mapResourceTypeToCategory = (typeName?: string): ResourceCategory => {
	if (!typeName) return 'Grants';

	const normalizedType = typeName.trim().toLowerCase();
	if (normalizedType.includes('accelerator')) return 'Accelerator';
	if (normalizedType.includes('competition')) return 'Competitions';
	if (normalizedType.includes('school')) return 'School Programs';
	if (normalizedType.includes('ngo')) return 'NGO Programs';
	if (normalizedType.includes('financing') || normalizedType.includes('loan')) {
		return 'Specialty Financing';
	}
	if (normalizedType.includes('government')) return 'Government Programs';

	return 'Grants';
};

const formatDateValue = (dateValue?: string | null): string => {
	if (!dateValue) return 'No deadline';

	const date = new Date(dateValue);
	if (Number.isNaN(date.getTime())) return 'No deadline';

	return date.toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	});
};

const formatAmountValue = (resource: ApiSavedResource['Resource']): string => {
	const amount =
		resource?.CompetitionDetails?.PrizeAmount ?? resource?.GrantDetails?.GrantAmount ;
	const currencySymbol = resource?.CurrencySymbol ;

	if (!amount || amount <= 0) {
		return `${currencySymbol || ''}0`;
	}

	return `${currencySymbol}${amount.toLocaleString()}`;
};

const mapApiResourceToSavedResource = (item: ApiSavedResource): SavedResource => {
	const mappedLocation =
		item.Resource?.City?.CityName || item.Resource?.Address || item.Resource?.State?.StateName ;

	return {
		id: item.SavedResourceId,
		title: item.Resource?.Name ,
		organization: item.Resource?.Sponsor ,
		location: mappedLocation,
		country: item.Resource?.Country?.CountryName ,
		deadline: formatDateValue(
			item.Resource?.ApplicationDeadline ||
				item.Resource?.ExpirationDate ||
				item.Resource?.EventDate
		),
		amount: formatAmountValue(item.Resource),
		category: mapResourceTypeToCategory(item.Resource?.ResourceType?.TypeName),
		description: item.Resource?.Description ,
		remindMe: !!item.IsNotifyEnabled,
	};
};

const mapGroupedResources = (
	groups: ApiGroupedResourceResponse['Result']
): Record<ResourceStatus, SavedResource[]> => {
	const sectionData = createEmptyResourcesBySection();

	groups.forEach((group) => {
		const mappedStatus = normalizeStatus(group.Status);
		if (!mappedStatus) {
			return;
		}

		sectionData[mappedStatus] = group.Resources.map(mapApiResourceToSavedResource);
	});

	return sectionData;
};

const mapUiStatusToApiStatus = (status: ResourceStatus): string => {
	switch (status) {
		case 'Applied':
			return 'applied';
		case 'Follow Up Required':
			return 'follow up required';
		case 'Accepted':
			return 'accepted';
		case 'Rejected':
			return 'rejected';
		case 'Saved':
			return 'saved';
		default:
			return 'saved';
	}
};

const SaveResourcesPage = () => {
	const [viewMode, setViewMode] = useState<ViewMode>('card');
	const [groupByMode, setGroupByMode] = useState<GroupByMode>('status');
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [columnFilters, setColumnFilters] = useState<
		Record<ListColumnKey, ColumnFilterState>
	>(createDefaultColumnFilters());
	const [activeFilterColumn, setActiveFilterColumn] =
		useState<ListColumnKey | null>(null);
	const [draftColumnFilter, setDraftColumnFilter] =
		useState<ColumnFilterState | null>(null);
	const [filterSearch, setFilterSearch] = useState('');
	const filterPopoverRef = useRef<HTMLDivElement | null>(null);
	const [resourcesBySection, setResourcesBySection] =
		useState<Record<ResourceStatus, SavedResource[]>>(createEmptyResourcesBySection());
	const [showScrollButtonBySection, setShowScrollButtonBySection] = useState<
		Record<ResourceStatus, boolean>
	>(createInitialSectionOverflowState());
	const [showDeadlineScrollButton, setShowDeadlineScrollButton] = useState(false);

	const sectionRefs = useRef<Record<ResourceStatus, HTMLDivElement | null>>({
		Applied: null,
		'Follow Up Required': null,
		Accepted: null,
		Rejected: null,
		Saved: null,
	});
	const deadlineSectionRef = useRef<HTMLDivElement | null>(null);

	const evaluateSectionOverflow = useCallback(() => {
		setShowScrollButtonBySection(() => {
			const nextState = createInitialSectionOverflowState();

			STATUS_SECTIONS.forEach((sectionName) => {
				const sectionElement = sectionRefs.current[sectionName];
				nextState[sectionName] =
					!!sectionElement && sectionElement.scrollWidth > sectionElement.clientWidth + 2;
			});

			return nextState;
		});

		setShowDeadlineScrollButton(() => {
			const deadlineElement = deadlineSectionRef.current;
			return (
				!!deadlineElement &&
				deadlineElement.scrollWidth > deadlineElement.clientWidth + 2
			);
		});
	}, []);

	const sectionData = useMemo(
		() =>
			STATUS_SECTIONS.map((sectionName) => ({
				name: sectionName,
				resources: resourcesBySection[sectionName],
			})),
		[resourcesBySection]
	);

	const listViewRows = useMemo(
		() =>
			STATUS_SECTIONS.flatMap((sectionName) =>
				resourcesBySection[sectionName].map((resource) => ({
					resource,
					status: sectionName,
				}))
			),
		[resourcesBySection]
	);

	const parseDeadlineTimestamp = (deadline: string) => {
		const timestamp = new Date(deadline).getTime();
		return Number.isNaN(timestamp) ? Number.POSITIVE_INFINITY : timestamp;
	};

	const deadlineSortedRows = useMemo(
		() =>
			[...listViewRows].sort(
				(a, b) =>
					parseDeadlineTimestamp(a.resource.deadline) -
					parseDeadlineTimestamp(b.resource.deadline)
			),
		[listViewRows]
	);

	const getListColumnValue = (row: ListViewRow, column: ListColumnKey): string => {
		switch (column) {
			case 'description':
				return row.resource.title;
			case 'city':
				return row.resource.location;
			case 'resourceType':
				return row.resource.category;
			case 'funding':
				return row.resource.amount;
			case 'deadline':
				return row.resource.deadline;
			case 'status':
				return row.status;
			case 'action':
				return 'Apply';
			default:
				return '';
		}
	};

	const getColumnOptions = (column: ListColumnKey) => {
		const uniqueValues = new Set(listViewRows.map((row) => getListColumnValue(row, column)));
		return Array.from(uniqueValues).filter(Boolean);
	};

	const getVisibleDraftOptions = () => {
		if (!activeFilterColumn) {
			return [];
		}

		const options = getColumnOptions(activeFilterColumn);
		const normalizedSearch = filterSearch.trim().toLowerCase();

		if (!normalizedSearch) {
			return options;
		}

		return options.filter((option) =>
			option.toLowerCase().includes(normalizedSearch)
		);
	};

	const visibleDraftOptions = getVisibleDraftOptions();
	const isAllVisibleSelected =
		visibleDraftOptions.length > 0 &&
		!!draftColumnFilter &&
		visibleDraftOptions.every((option) =>
			draftColumnFilter.selectedOptions.includes(option)
		);

	const applyDraftToColumn = (nextDraft: ColumnFilterState) => {
		if (!activeFilterColumn) {
			return;
		}

		setColumnFilters((previous) => ({
			...previous,
			[activeFilterColumn]: nextDraft,
		}));
	};

	const updateDraftFilter = (updater: (current: ColumnFilterState) => ColumnFilterState) => {
		setDraftColumnFilter((current) => {
			if (!current) {
				return current;
			}

			const nextDraft = updater(current);
			if (nextDraft.autoApply) {
				applyDraftToColumn(nextDraft);
			}

			return nextDraft;
		});
	};

	const openColumnFilter = (column: ListColumnKey) => {
		if (activeFilterColumn === column) {
			setActiveFilterColumn(null);
			setDraftColumnFilter(null);
			setFilterSearch('');
			return;
		}

		setActiveFilterColumn(column);
		setDraftColumnFilter({ ...columnFilters[column] });
		setFilterSearch('');
	};

	const applyColumnFilter = () => {
		if (!draftColumnFilter) {
			return;
		}

		applyDraftToColumn(draftColumnFilter);
		setActiveFilterColumn(null);
		setDraftColumnFilter(null);
		setFilterSearch('');
	};

	const clearColumnFilter = () => {
		if (!activeFilterColumn) {
			return;
		}

		const clearedFilter: ColumnFilterState = {
			sortOrder: 'none',
			selectedOptions: [],
			autoApply: false,
		};

		setColumnFilters((previous) => ({
			...previous,
			[activeFilterColumn]: clearedFilter,
		}));
		setDraftColumnFilter(clearedFilter);
		setFilterSearch('');
	};

	useEffect(() => {
		const onOutsideClick = (event: MouseEvent) => {
			if (!filterPopoverRef.current) {
				return;
			}

			if (!filterPopoverRef.current.contains(event.target as Node)) {
				setActiveFilterColumn(null);
				setDraftColumnFilter(null);
				setFilterSearch('');
			}
		};

		document.addEventListener('mousedown', onOutsideClick);
		return () => {
			document.removeEventListener('mousedown', onOutsideClick);
		};
	}, []);

	useEffect(() => {
		const fetchSavedResources = async () => {
			setIsLoading(true);
			setErrorMessage(null);

			try {
				const currentUser = JSON.parse(localStorage.getItem('userData') || 'null');
				const userId = currentUser?.Id;

				if (!userId) {
					setResourcesBySection(createEmptyResourcesBySection());
					setErrorMessage('User is not available. Please sign in again.');
					return;
				}

				const response = await axios.get<ApiGroupedResourceResponse>(
					`${getApiBaseUrl()}/Resources/GetSavedResourcesGroupedByStatus`,
					{
						params: { userId },
						headers: {
							accept: '*/*',
							XApiKey: API_KEY,
						},
					}
				);

				if (response.data?.StatusCode !== 200) {
					throw new Error(response.data?.Message || 'Failed to load saved resources.');
				}

				setResourcesBySection(mapGroupedResources(response.data.Result || []));
			} catch (error) {
				console.error('Error fetching saved resources:', error);
				setResourcesBySection(createEmptyResourcesBySection());
				setErrorMessage('Unable to load saved resources right now.');
			} finally {
				setIsLoading(false);
			}
		};

		fetchSavedResources();
	}, []);

	useEffect(() => {
		const animationFrame = requestAnimationFrame(() => {
			evaluateSectionOverflow();
		});

		const handleResize = () => {
			evaluateSectionOverflow();
		};

		window.addEventListener('resize', handleResize);

		return () => {
			cancelAnimationFrame(animationFrame);
			window.removeEventListener('resize', handleResize);
		};
	}, [evaluateSectionOverflow, resourcesBySection, viewMode]);

	const filteredAndSortedListRows = useMemo(() => {
		let rows = [...listViewRows];

		LIST_COLUMNS.forEach((column) => {
			const { selectedOptions } = columnFilters[column];
			if (selectedOptions.length === 0) {
				return;
			}

			rows = rows.filter((row) =>
				selectedOptions.includes(getListColumnValue(row, column))
			);
		});

		const sortColumn = LIST_COLUMNS.find(
			(column) => columnFilters[column].sortOrder !== 'none'
		);

		if (!sortColumn) {
			return rows;
		}

		const order = columnFilters[sortColumn].sortOrder;
		rows.sort((leftRow, rightRow) => {
			if (sortColumn === 'funding') {
				const leftAmount = parseAmount(leftRow.resource.amount);
				const rightAmount = parseAmount(rightRow.resource.amount);
				return order === 'asc' ? leftAmount - rightAmount : rightAmount - leftAmount;
			}

			if (sortColumn === 'deadline') {
				const leftDeadline = new Date(leftRow.resource.deadline).getTime();
				const rightDeadline = new Date(rightRow.resource.deadline).getTime();
				return order === 'asc'
					? leftDeadline - rightDeadline
					: rightDeadline - leftDeadline;
			}

			const leftValue = getListColumnValue(leftRow, sortColumn);
			const rightValue = getListColumnValue(rightRow, sortColumn);
			return order === 'asc'
				? leftValue.localeCompare(rightValue)
				: rightValue.localeCompare(leftValue);
		});

		return rows;
	}, [columnFilters, listViewRows]);

	const handleSortChange = (sortOrder: SortOrder) => {
		updateDraftFilter((current) => ({
			...current,
			sortOrder,
		}));
	};

	const handleToggleSelectAll = () => {
		updateDraftFilter((current) => {
			if (isAllVisibleSelected) {
				return {
					...current,
					selectedOptions: current.selectedOptions.filter(
						(option) => !visibleDraftOptions.includes(option)
					),
				};
			}

			const merged = Array.from(
				new Set([...current.selectedOptions, ...visibleDraftOptions])
			);
			return { ...current, selectedOptions: merged };
		});
	};

	const handleToggleOption = (option: string) => {
		updateDraftFilter((current) => {
			const isSelected = current.selectedOptions.includes(option);
			return {
				...current,
				selectedOptions: isSelected
					? current.selectedOptions.filter((value) => value !== option)
					: [...current.selectedOptions, option],
			};
		});
	};

	const handleToggleAutoApply = () => {
		updateDraftFilter((current) => {
			const nextAutoApply = !current.autoApply;
			const nextDraft = { ...current, autoApply: nextAutoApply };
			if (nextAutoApply) {
				applyDraftToColumn(nextDraft);
			}
			return nextDraft;
		});
	};

	const parseAmount = (value: string) => {
		const numericValue = Number(value.replace(/[^0-9.-]+/g, ''));
		return Number.isFinite(numericValue) ? numericValue : 0;
	};

	const summaryCards = useMemo(
		() => {
			const sumBySectionAndCategory = (
				section: ResourceStatus,
				category: ResourceCategory
			) => {
				return resourcesBySection[section].reduce((sum, resource) => {
					if (resource.category !== category) {
						return sum;
					}

					return sum + parseAmount(resource.amount);
				}, 0);
			};

			const sumByCategoryAcrossSections = (category: ResourceCategory) => {
				return STATUS_SECTIONS.reduce((sectionSum, section) => {
					const categorySum = resourcesBySection[section].reduce(
						(sum, resource) => {
							if (resource.category !== category) {
								return sum;
							}

							return sum + parseAmount(resource.amount);
						},
						0
					);

					return sectionSum + categorySum;
				}, 0);
			};

			return [
				{
					label: 'Total Grants Saved',
					value: sumBySectionAndCategory('Saved', 'Grants'),
				},
				{
					label: 'Accepted Grants Value',
					value: sumBySectionAndCategory('Accepted', 'Grants'),
				},
				{
					label: 'All Competitions Saved',
					value: sumByCategoryAcrossSections('Competitions'),
				},
				{
					label: 'Accepted Competitions Value',
					value: sumBySectionAndCategory('Accepted', 'Competitions'),
				},
			];
		},
		[resourcesBySection]
	);

	const scrollSectionRight = (sectionName: ResourceStatus) => {
		const sectionRef = sectionRefs.current[sectionName];
		if (!sectionRef) {
			return;
		}

		sectionRef.scrollBy({
			left: 320,
			behavior: 'smooth',
		});
	};

	const scrollDeadlineSectionRight = () => {
		if (!deadlineSectionRef.current) {
			return;
		}

		deadlineSectionRef.current.scrollBy({
			left: 320,
			behavior: 'smooth',
		});
	};

	const toggleReminder = async (sectionName: ResourceStatus, resourceId: string) => {
		const sectionResources = resourcesBySection[sectionName] || [];
		const resourceToUpdate = sectionResources.find(
			(resource) => resource.id === resourceId
		);

		if (!resourceToUpdate) {
			return;
		}

		const nextNotifyValue = !resourceToUpdate.remindMe;

		try {
			setErrorMessage(null);

			await axios.put(
				`${getApiBaseUrl()}/Resources/ToggleSavedResourceNotify`,
				{
					Id: resourceId,
					IsNotifyEnabled: nextNotifyValue,
				},
				{
					headers: {
						accept: '*/*',
						'Content-Type': 'application/json',
						XApiKey: API_KEY,
					},
				}
			);

			setResourcesBySection((previousData) => ({
				...previousData,
				[sectionName]: previousData[sectionName].map((resource) =>
					resource.id === resourceId
						? { ...resource, remindMe: nextNotifyValue }
						: resource
				),
			}));
		} catch (error) {
			console.error('Error toggling reminder status:', error);
			setErrorMessage('Unable to update reminder right now.');
		}
	};

	const changeResourceStatus = async (
		resourceId: string,
		currentSection: ResourceStatus,
		nextStatus: Exclude<ResourceStatus, 'Saved'>
	) => {
		if (currentSection === nextStatus) {
			return;
		}

		try {
			setErrorMessage(null);

			await axios.put(
				`${getApiBaseUrl()}/Resources/UpdateSavedResourceStatus`,
				{
					Id: resourceId,
					ResourceStatus: mapUiStatusToApiStatus(nextStatus),
				},
				{
					headers: {
						accept: '*/*',
						'Content-Type': 'application/json',
						XApiKey: API_KEY,
					},
				}
			);

			setResourcesBySection((previousData) => {
				const resourceToMove = previousData[currentSection].find(
					(resource) => resource.id === resourceId
				);

				if (!resourceToMove) {
					return previousData;
				}

				return {
					...previousData,
					[currentSection]: previousData[currentSection].filter(
						(resource) => resource.id !== resourceId
					),
					[nextStatus]: [...previousData[nextStatus], resourceToMove],
				};
			});
		} catch (error) {
			console.error('Error updating saved resource status:', error);
			setErrorMessage('Unable to update resource status right now.');
		}
	};

	return (
		<main className="w-full space-y-6 p-4 md:p-6">
			{errorMessage && (
				<div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					{errorMessage}
				</div>
			)}

			{isLoading && (
				<div className="rounded-md border border-[#EAECF0] bg-white px-4 py-10 text-center text-slate-600">
					Loading saved resources...
				</div>
			)}

			<section className=" px-4 py-8 md:px-8">
				<div className="mx-auto max-w-6xl text-center">
					<h1 className="text-4xl font-semibold text-slate-800">Your Saved Resources</h1>
					<p className="mt-3 text-h5 text-slate-700">
						Track your applications, monitor deadlines, and manage your funding
					</p>
					<SummaryCards summaryCards={summaryCards} />
				</div>
			</section>

			<div className="flex items-center justify-between gap-3">

				<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={() => setGroupByMode('status')}
					className={cn(
						'rounded-full border px-4 py-2 text-h8 font-medium',
						groupByMode === 'status'
							? 'border-omblue-300 bg-omblue-50 text-omblue-500'
							: 'border-gray-300 bg-white text-slate-600'
					)}
				>
					By Status
				</button>
				<button
					type="button"
					onClick={() => setGroupByMode('deadline')}
					className={cn(
						'rounded-full border px-4 py-2 text-h8 font-semibold',
						groupByMode === 'deadline'
							? 'border-omblue-500 bg-omblue-50 text-omblue-700'
							: 'border-gray-300 bg-white text-slate-600'
					)}
				>
					By Deadline
				</button>
                </div>
                <ViewModeToggle viewMode={viewMode} onChange={setViewMode} />
			</div>

			<div className="border border-[#EAECF0] rounded-md">
				{viewMode === 'card' && groupByMode === 'status' ? (
					<>
						{sectionData.map((section) => (
							<section key={section.name} className="">
								<h2 className="text-base font-semibold text-slate-700 border-b px-4 py-3">{section.name}</h2>

								<div className="relative p-4">
									<div
										ref={(element) => {
											sectionRefs.current[section.name] = element;
										}}
										className="hide-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-2 pr-14"
									>
										{section.resources.map((resource) => (
											<SavedResourceCard
												key={resource.id}
												resource={resource}
												currentSection={section.name}
												onToggleReminder={(resourceId) =>
													toggleReminder(section.name, resourceId)
												}
												onChangeStatus={changeResourceStatus}
											/>
										))}
									</div>

									{showScrollButtonBySection[section.name] && (
										<button
											className="absolute right-0 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-omblue-500 text-white shadow-sm"
											onClick={() => scrollSectionRight(section.name)}
											aria-label={`Scroll ${section.name} section`}
										>
											<ChevronRightBlack className="h-4 w-4 text-white" />
										</button>
									)}
								</div>
							</section>
						))}
					</>
				) : viewMode === 'card' ? (
					<section>
						<h2 className="text-base font-semibold text-slate-700 border-b px-4 py-3">By Deadline</h2>

						<div className="relative p-4">
							<div
								ref={deadlineSectionRef}
								className="hide-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-2 pr-14"
							>
								{deadlineSortedRows.map(({ resource, status }) => (
									<SavedResourceCard
										key={`${status}-${resource.id}`}
										resource={resource}
										currentSection={status}
										onToggleReminder={(resourceId) =>
											toggleReminder(status, resourceId)
										}
										onChangeStatus={changeResourceStatus}
									/>
								))}
							</div>

							{showDeadlineScrollButton && (
								<button
									className="absolute right-0 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-omblue-500 text-white shadow-sm"
									onClick={scrollDeadlineSectionRight}
									aria-label="Scroll deadline section"
								>
									<ChevronRightBlack className="h-4 w-4 text-white" />
								</button>
							)}
						</div>
					</section>
				) : (
					<div className="overflow-x-auto">
						<div className="min-w-[1100px]">
							<ListViewFilterHeader
								columns={LIST_COLUMNS}
								labels={LIST_COLUMN_LABELS}
								activeFilterColumn={activeFilterColumn}
								draftColumnFilter={draftColumnFilter}
								filterSearch={filterSearch}
								visibleOptions={visibleDraftOptions}
								isAllVisibleSelected={isAllVisibleSelected}
								filterPopoverRef={filterPopoverRef}
								onOpenColumnFilter={openColumnFilter}
								onSearchChange={setFilterSearch}
								onSortChange={handleSortChange}
								onToggleSelectAll={handleToggleSelectAll}
								onToggleOption={handleToggleOption}
								onToggleAutoApply={handleToggleAutoApply}
								onApplyFilter={applyColumnFilter}
								onClearFilter={clearColumnFilter}
							/>

							{filteredAndSortedListRows.map(({ resource, status }) => (
								<div
									key={`${status}-${resource.id}`}
									className="grid grid-cols-7 items-center border-b border-[#EAECF0] px-4 py-4 text-sm text-slate-700"
								>
									<div>
										<p className="font-semibold text-slate-900">{resource.title}</p>
										<p className="mt-1 line-clamp-1 text-slate-500">{resource.organization}</p>
									</div>
									<p>{resource.location}</p>
									<div>
										<span
											className={cn(
												'rounded-full px-3 py-1 text-sm font-semibold',
												CATEGORY_STYLES[resource.category]
											)}
										>
											{resource.category}
										</span>
									</div>
									<p>Up to {resource.amount}</p>
									<p>{resource.deadline}</p>
									<div>
										<span className="rounded-full bg-omblue-50 px-3 py-1 text-sm font-semibold text-omblue-700">
											{status}
										</span>
									</div>
									<div>
										<button className="rounded-full w-36 bg-omblue-500 px-6 py-2 text-sm font-semibold text-white">
											Apply
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
			
		</main>
	);
};

export default SaveResourcesPage;

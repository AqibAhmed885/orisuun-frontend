import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Plus } from 'lucide-react';
import type { Topic, TopicOfferingConfig, TopicOption } from './types';

interface TopicSpecificConsultationsSectionProps {
	offering: TopicOfferingConfig;
	selectedTopics: string[];
	savedTopics: Topic[];
	onToggleTopic: (topicName: string, description: string) => void;
	customTopicName?: string;
	customTopicDescription?: string;
	onCustomTopicNameChange?: (value: string) => void;
	onCustomTopicDescriptionChange?: (value: string) => void;
	onAddCustomTopic?: () => void;
	isAddingCustomTopic?: boolean;
}

function TopicCard({
	topicName,
	description,
	active,
	onClick,
}: {
	topicName: string;
	description?: string;
	active: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`flex min-h-[75px] items-center gap-4 rounded-[12px] border px-5 py-5 text-left transition hover:border-[#C7D7FE] hover:shadow-sm ${
				active ? 'border-[#2F63D9] bg-white shadow-[0_0_0_1px_rgba(47,99,217,0.12)]' : 'border-[#E5E7EB] bg-white'
			}`}
		>
			<span
				className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-sm ${
					active ? 'bg-[#2F63D9] text-white' : 'border border-[#D0D5DD] bg-white text-transparent'
				}`}
			>
				<Check className="h-4 w-4" strokeWidth={3} />
			</span>

			<span className="min-w-0">
				<span className="block text-sm font-semibold leading-tight text-[#101828]">{topicName}</span>
				{description ? <span className="mt-1 block text-sm text-[#667085]">{description}</span> : null}
			</span>
		</button>
	);
}

export default function TopicSpecificConsultationsSection({
	offering,
	selectedTopics,
	savedTopics,
	onToggleTopic,
	customTopicName = '',
	customTopicDescription = '',
	onCustomTopicNameChange,
	onCustomTopicDescriptionChange,
	onAddCustomTopic,
	isAddingCustomTopic = false,
}: TopicSpecificConsultationsSectionProps) {
	const [activeGroupLabel, setActiveGroupLabel] = useState(offering.groups?.[0]?.label ?? '');
	const [isGroupMenuOpen, setIsGroupMenuOpen] = useState(false);
	const groupMenuRef = useRef<HTMLDivElement | null>(null);
	const selectedTopicSet = useMemo(() => new Set(selectedTopics), [selectedTopics]);

	useEffect(() => {
		const handleDocumentClick = (event: MouseEvent) => {
			if (!groupMenuRef.current) return;
			if (!groupMenuRef.current.contains(event.target as Node)) {
				setIsGroupMenuOpen(false);
			}
		};

		document.addEventListener('mousedown', handleDocumentClick);
		return () => document.removeEventListener('mousedown', handleDocumentClick);
	}, []);

	const activeGroup = useMemo(
		() => offering.groups?.find((group) => group.label === activeGroupLabel) ?? offering.groups?.[0],
		[activeGroupLabel, offering.groups]
	);

	const visibleTopics: TopicOption[] = useMemo(() => {
		if (offering.type === 'grouped') {
			return activeGroup?.topics ?? [];
		}

		if (offering.type === 'custom') {
			return savedTopics
				.filter((topic) => selectedTopicSet.has(topic.topicName))
				.map((topic) => ({
					topicName: topic.topicName,
					description: topic.description?.trim() || 'Custom topic-specific consultation',
				}));
		}

		return offering.topics ?? [];
	}, [activeGroup, offering.topics, offering.type, savedTopics, selectedTopicSet]);

	return (
		<div className="rounded-2xl shadow-border p-6">
			<div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
				<div className="max-w-3xl">
					<h3 className="text-base font-semibold text-[#101828]">Select specific topics</h3>
					<p className="mt-2 text-sm text-[#667085]">{offering.description}</p>
				</div>

				{offering.type === 'grouped' && offering.groups?.length ? (
					<div className="relative w-full lg:w-[420px]" ref={groupMenuRef}>
						<button
							type="button"
							onClick={() => setIsGroupMenuOpen((open) => !open)}
							aria-expanded={isGroupMenuOpen}
							className="flex h-10 w-full items-center justify-between rounded-lg border border-[#E5E7EB] bg-white px-5 text-left text-sm font-medium text-[#101828] shadow-sm"
						>
							<span className="text-[14px] font-normal leading-none">{activeGroup?.label ?? offering.groups[0].label}</span>
							<ChevronDown className="h-6 w-6 text-[#667085]" />
						</button>

						{isGroupMenuOpen ? (
							<div className="absolute right-0 top-[calc(100%+10px)] z-20 w-full overflow-hidden rounded-lg border border-[#E5E7EB] bg-white shadow-xl">
								{offering.groups.map((group) => {
									const active = group.label === (activeGroup?.label ?? offering.groups?.[0]?.label);

									return (
										<button
											key={group.label}
											type="button"
											onClick={() => {
												setActiveGroupLabel(group.label);
												setIsGroupMenuOpen(false);
											}}
											className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium transition-colors ${
												active ? 'bg-[#EEF3FF] text-[#2F63D9]' : 'text-[#101828] hover:bg-[#F8FAFC]'
											}`}
										>
											<span
												className={`flex h-5 w-5 items-center justify-center rounded-md border ${
													active ? 'border-[#2F63D9] bg-[#2F63D9] text-white' : 'border-[#D0D5DD] bg-white text-transparent'
												}`}
											>
												<Check className="h-4 w-4" strokeWidth={3} />
											</span>
											<span>{group.label}</span>
										</button>
									);
								})}
							</div>
						) : null}
					</div>
				) : null}
			</div>

			{offering.type === 'custom' ? (
				<div className="mt-6 rounded-[22px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
					<div className="grid gap-3 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto]">
						<div className="space-y-1">
							<label className="text-xs font-medium text-[#667085]">Topic name</label>
							<input
								value={customTopicName}
								onChange={(event) => onCustomTopicNameChange?.(event.target.value)}
								placeholder="Enter a custom topic"
								className="h-12 w-full rounded-lg border border-[#D0D5DD] px-4 text-sm text-[#101828] outline-none transition focus:border-[#2F63D9]"
							/>
						</div>
						<div className="space-y-1">
							<label className="text-xs font-medium text-[#667085]">Optional description</label>
							<input
								value={customTopicDescription}
								onChange={(event) => onCustomTopicDescriptionChange?.(event.target.value)}
								placeholder="Add a short description"
								className="h-12 w-full rounded-lg border border-[#D0D5DD] px-4 text-sm text-[#101828] outline-none transition focus:border-[#2F63D9]"
							/>
						</div>
						<div className="flex items-end">
							<button
								type="button"
								onClick={onAddCustomTopic}
								disabled={isAddingCustomTopic}
								className="inline-flex h-12 items-center gap-2 rounded-lg bg-[#2F63D9] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2450b8] disabled:cursor-not-allowed disabled:bg-[#9BB3EF]"
							>
								<Plus className="h-4 w-4" />
								{isAddingCustomTopic ? 'Adding…' : 'Add topic'}
							</button>
						</div>
					</div>
				</div>
			) : null}

			<div className={`mt-5 grid grid-cols-1 gap-4 ${offering.type === 'grouped' ? 'sm:grid-cols-2 xl:grid-cols-4' : 'sm:grid-cols-2 xl:grid-cols-4'}`}>
				{visibleTopics.map((topic) => {
					const topicName = topic.topicName;
					const active = selectedTopicSet.has(topicName);
					const description = topic.description ?? (offering.type === 'grouped' ? activeGroup?.label : offering.label);

					return (
						<TopicCard
							key={topicName}
							topicName={topicName}
							description={offering.type === 'custom' ? topic.description : undefined}
							active={active}
							onClick={() => onToggleTopic(topicName, description || '')}
						/>
					);
				})}
			</div>

			{offering.type === 'custom' && visibleTopics.length === 0 ? (
				<div className="mt-5 rounded-[20px] border border-dashed border-[#D0D5DD] bg-[#FCFCFD] px-5 py-10 text-center text-sm text-[#667085]">
					No custom topics yet. Add one above to get started.
				</div>
			) : null}
		</div>
	);
}

"use client";

import React, { useEffect, useState } from 'react';
import useCurrentUser from '@/hooks/useCurrentUser';
import {
	createConnectAccount,
	createMeetingPackage,
	createMeetingType,
	createTopic,
	disconnectCalendar,
	getCalendarConnectionStatus,
	fetchMeetingPackages,
	fetchMeetingTypes,
	fetchProviderSetup,
	fetchTopics,
	getGoogleAuthUrl,
	getOutlookAuthUrl,
	removeTopic,
	saveBookingSettings,
	saveMeetingPackage,
	saveMeetingType,
	saveOfficeHours,
} from './schedule-settings/api';
import {
	CANCELLATION_OPTIONS,
	FIXED_DURATIONS,
	LATE_FEE_OPTIONS,
	getTopicOffering,
	createDefaultOfficeHours,
} from './schedule-settings/constants';
import { buildOfficeHoursPayload } from './schedule-settings/utils';
import type { CalendarConnectionStatus, CalendarProvider, DurationOption, MeetingPackage, MeetingType,  OfficeHours, ScheduleSettingsProps, Slot, Topic } from './schedule-settings/types';
import ActionsRow from './schedule-settings/actions-row';
import AdvisorySection from './schedule-settings/advisory-section';
import CalendarSection from './schedule-settings/calendar-section';
import CancellationPolicySection from './schedule-settings/cancellation-policy-section';
import DurationSection from './schedule-settings/duration-section';
import LoadingSkeleton from './schedule-settings/loading-skeleton';
import MeetingTypeSection from './schedule-settings/meeting-type-section';
import OfficeHoursSection from './schedule-settings/office-hours-section';
import ScheduleSidebar from './schedule-settings/schedule-sidebar';
import TopicSpecificConsultationsSection from './schedule-settings/topic-specific-consultations-section';
import { toast } from 'react-toastify';

export default function ScheduleSettings({ userProfileType = 'Mentor' }: ScheduleSettingsProps): JSX.Element {
	const { user } = useCurrentUser();
	const userId = user?.Id || user?.id || '';

	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [connectingBankAccount, setConnectingBankAccount] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [meetingTypesData, setMeetingTypesData] = useState<MeetingType[]>([]);
	const [packagesData, setPackagesData] = useState<MeetingPackage[]>([]);
	const [topicsData, setTopicsData] = useState<Topic[]>([]);
	const [calendarConnectionStatus, setCalendarConnectionStatus] = useState<CalendarConnectionStatus | null>(null);
	const [pendingCalendarProvider, setPendingCalendarProvider] = useState<CalendarProvider | null>(null);
	const [officeHours, setOfficeHours] = useState<OfficeHours>(() => createDefaultOfficeHours());
	const [pauseAvailability, setPauseAvailability] = useState(false);
	const [leadTime, setLeadTime] = useState('');
	const [bufferTime, setBufferTime] = useState('0');
	const [localDurationPrices, setLocalDurationPrices] = useState<Record<number, string>>({});
	const [localAdvisoryData, setLocalAdvisoryData] = useState<Record<string, { price: string; sessions: string }>>({});
	const [whatsIncluded, setWhatsIncluded] = useState('');
	const [cancellationWindow, setCancellationWindow] = useState(CANCELLATION_OPTIONS[0]);
	const [lateCancellationFee, setLateCancellationFee] = useState(LATE_FEE_OPTIONS[0]);
	const [selectedTopicNames, setSelectedTopicNames] = useState<string[]>([]);
	const [customTopicName, setCustomTopicName] = useState('');
	const [customTopicDescription, setCustomTopicDescription] = useState('');
	const [savingCustomTopic, setSavingCustomTopic] = useState(false);
	const maxChars = 1200;

	const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
	const currentUserProfileType = String(
		user?.UserProfileType ||
			user?.ProfileType ||
			user?.UserProfileName ||
			user?.profileType ||
			userProfileType ||
			''
	).toLowerCase();
	const topicOffering = getTopicOffering(currentUserProfileType);

	useEffect(() => {
		if (!userId) {
			setLoading(false);
			return;
		}

		const fetchSetup = async () => {
			setLoading(true);
			setError(null);

			try {
				const setup = await fetchProviderSetup(userId);
				const connectionStatus = await getCalendarConnectionStatus(userId);
				setPauseAvailability(setup.pauseAvailability);
				setCalendarConnectionStatus(connectionStatus);
				setLeadTime(setup.leadTime);
				setBufferTime(setup.bufferTime);
				setCancellationWindow(setup.cancellationWindow);
				setLateCancellationFee(setup.lateCancellationFee);
				setLocalDurationPrices(setup.durationPrices);
				setWhatsIncluded(setup.whatsIncluded);
				if (setup.officeHours) setOfficeHours(setup.officeHours);

				const meetingTypes = await fetchMeetingTypes(userId);

				setMeetingTypesData(meetingTypes);

				setSelectedTypes(
					meetingTypes
						.filter((meetingType) => Boolean(meetingType.isActive))
						.map((meetingType) => meetingType.meetingType)
				);

				const packageGroups = await Promise.all(meetingTypes.map((meetingType) => fetchMeetingPackages(meetingType.id)));
				const topicGroups = await Promise.all(meetingTypes.map((meetingType) => fetchTopics(meetingType.id)));
				const packages = packageGroups.flat();
				const topics = topicGroups.flat();
				const firstWhatsIncluded = packages.find((pkg) => pkg.whatsIncluded?.trim())?.whatsIncluded;
				const topicMeetingTypeId = meetingTypes.find((meetingType) =>
					meetingType.meetingType.toLowerCase().trim() === 'topic-specific consultations'
				)?.id;

				setPackagesData(packages);
				setTopicsData(topics);
				setSelectedTopicNames(
					topics
						.filter((topic) => !topicMeetingTypeId || topic.meetingTypeId === topicMeetingTypeId)
						.filter((topic) => topic.isActive)
						.map((topic) => topic.topicName)
				);
				if (firstWhatsIncluded) setWhatsIncluded(firstWhatsIncluded);
			} catch (err: any) {
				setError(err?.response?.data?.Message || 'Failed to load schedule settings');
			} finally {
				setLoading(false);
			}
		};

		fetchSetup();
	}, [userId]);

	function getMeetingTypeId(categoryName: string): string | undefined {
		return meetingTypesData.find((meetingType) => meetingType.meetingType === categoryName)?.id;
	}

	function buildDurationOptions(): DurationOption[] {
		return FIXED_DURATIONS.flatMap((duration) => {
			const packagePrice = packagesData.find((pkg) => pkg.durationMinutes === duration)?.price;
			const price = Number(packagePrice ?? localDurationPrices[duration]);

			if (!price || Number.isNaN(price)) return [];

			return [{
				DurationMinutes: duration,
				Price: price,
			}];
		});
	}

	async function toggleType(categoryName: string) {
		if (!userId) return;

		const isAlreadySelected = selectedTypes.includes(categoryName);

		setSelectedTypes((prev) =>
			isAlreadySelected
				? prev.filter((type) => type !== categoryName)
				: [...prev, categoryName]
		);

		const existing = meetingTypesData.find(
			(meetingType) =>
				meetingType.meetingType.toLowerCase().trim() === categoryName.toLowerCase().trim()
		);

		if (existing) {
			const updated = {
				...existing,
				isActive: !isAlreadySelected,
			};

			setMeetingTypesData((prev) =>
				prev.map((meetingType) =>
					meetingType.id === existing.id ? updated : meetingType
				)
			);

			saveMeetingType(updated).catch((err: any) => {
				setSelectedTypes((prev) =>
					isAlreadySelected
						? [...prev, categoryName]
						: prev.filter((type) => type !== categoryName)
				);

				setMeetingTypesData((prev) =>
					prev.map((meetingType) =>
						meetingType.id === existing.id ? existing : meetingType
					)
				);

				setError(err?.response?.data?.Message || `Failed to save ${categoryName}`);
			});
			return;
		}

		if (isAlreadySelected) return;

		try {
			const newType = await createMeetingType(userId, categoryName);

			if (newType) {
				setMeetingTypesData((prev) => [...prev, newType]);
			}
		} catch (err: any) {
			setSelectedTypes((prev) => prev.filter((type) => type !== categoryName));
			setError(err?.response?.data?.Message || `Failed to add ${categoryName}`);
		}
	}

	async function addPackage(meetingTypeId: string, packageName: string, price: number, durationMinutes: number, sessionCount?: number) {
		try {
			const newPackage = await createMeetingPackage(meetingTypeId, packageName, price, durationMinutes, sessionCount);
			if (newPackage) setPackagesData((prev) => [...prev, newPackage]);
		} catch (err: any) {
			setError(err?.response?.data?.Message || 'Failed to add package');
		}
	}

	async function updatePackage(pkg: MeetingPackage) {
		try {
			await saveMeetingPackage(pkg);
			setPackagesData((prev) => prev.map((item) => (item.id === pkg.id ? pkg : item)));
		} catch (err: any) {
			setError(err?.response?.data?.Message || 'Failed to update package');
		}
	}

	async function toggleSavedTopic(
		topicName: string,
		description: string,
	) {
		const topicMeetingTypeId = getMeetingTypeId('Topic-Specific Consultations');
		const isSelected = selectedTopicNames.includes(topicName);

		if (!topicMeetingTypeId) {
			setError('Select Topic-Specific Consultations before adding topics');
			return;
		}

		const existingTopic = topicsData.find(
			(topic) =>
				topic.meetingTypeId === topicMeetingTypeId &&
				topic.topicName.toLowerCase().trim() === topicName.toLowerCase().trim()
		);

		if (existingTopic && isSelected) {
			setSelectedTopicNames((prev) => prev.filter((topic) => topic !== topicName));

			try {
				await removeTopic(existingTopic.id);
				setTopicsData((prev) => prev.filter((topic) => topic.id !== existingTopic.id));
			} catch (err: any) {
				setSelectedTopicNames((prev) => [...prev, topicName]);
				setError(err?.response?.data?.Message || `Failed to delete ${topicName}`);
			}
			return;
		}

		if (existingTopic) {
			setSelectedTopicNames((prev) => (prev.includes(topicName) ? prev : [...prev, topicName]));

			try {
				await createTopic(topicMeetingTypeId, topicName, description);
			} catch (err: any) {
				setSelectedTopicNames((prev) => prev.filter((topic) => topic !== topicName));
				setError(err?.response?.data?.Message || `Failed to add ${topicName}`);
			}
			return;
		}

		setSelectedTopicNames((prev) => (prev.includes(topicName) ? prev : [...prev, topicName]));

		try {
			const newTopic = await createTopic(topicMeetingTypeId, topicName, description);
			if (newTopic) setTopicsData((prev) => [...prev, newTopic]);
		} catch (err: any) {
			setSelectedTopicNames((prev) => prev.filter((topic) => topic !== topicName));
			setError(err?.response?.data?.Message || `Failed to add ${topicName}`);
		}
	}

	async function handleAddCustomTopic() {
		if (!userId) return;

		const topicMeetingTypeId = getMeetingTypeId('Topic-Specific Consultations');
		const topicName = customTopicName.trim();
		const description = customTopicDescription.trim();

		if (!topicMeetingTypeId) {
			setError('Select Topic-Specific Consultations before adding topics');
			return;
		}

		if (!topicName) {
			setError('Please enter a topic name');
			return;
		}

		if (selectedTopicNames.includes(topicName)) {
			setError('That topic is already selected');
			return;
		}

		setSavingCustomTopic(true);
		setError(null);

		try {
			const newTopic = await createTopic(topicMeetingTypeId, topicName, description, 0, 0);
			if (newTopic) {
				setTopicsData((prev) => [...prev, newTopic]);
				setSelectedTopicNames((prev) => [...prev, topicName]);
				setCustomTopicName('');
				setCustomTopicDescription('');
			}
		} catch (err: any) {
			setError(err?.response?.data?.Message || `Failed to add ${topicName}`);
		} finally {
			setSavingCustomTopic(false);
		}
	}

	function toggleDayEnabled(day: string) {
		setOfficeHours((prev) => {
			const nextEnabled = !prev[day].enabled;
			const nextSlots = nextEnabled && prev[day].slots.length === 0 ? [{ start: '09:00', end: '18:30' }] : prev[day].slots;

			return { ...prev, [day]: { ...prev[day], enabled: nextEnabled, slots: nextSlots } };
		});
	}

	function addSlot(day: string) {
		setOfficeHours((prev) => ({
			...prev,
			[day]: { ...prev[day], enabled: true, slots: [...prev[day].slots, { start: '09:00', end: '18:30' }] },
		}));
	}

	function removeSlot(day: string, index: number) {
		setOfficeHours((prev) => {
			const slots = [...prev[day].slots];
			slots.splice(index, 1);

			return { ...prev, [day]: { ...prev[day], enabled: slots.length > 0, slots } };
		});
	}

	function updateSlot(day: string, index: number, field: 'start' | 'end', value: string) {
		setOfficeHours((prev) => {
			const slots = prev[day].slots.map((slot: Slot, slotIndex: number) => (slotIndex === index ? { ...slot, [field]: value } : slot));

			return { ...prev, [day]: { ...prev[day], slots } };
		});
	}

	async function handleConnect(provider: CalendarProvider) {
		if (!userId) return;

		const providerStatus = calendarConnectionStatus?.[provider];

		setPendingCalendarProvider(provider);

		try {
			if (providerStatus?.isConnected) {
				await disconnectCalendar(userId, provider);
				const updatedStatus = await getCalendarConnectionStatus(userId);
				setCalendarConnectionStatus(updatedStatus);
				toast.success(`${provider === 'outlook' ? 'Outlook' : 'Google'} calendar disconnected`);
				return;
			}

			const url = provider === 'outlook'
				? await getOutlookAuthUrl(userId)
				: await getGoogleAuthUrl(userId);

			if (url && typeof url === 'string') {
				window.location.href = url;
			} else {
				setError(`Failed to get ${provider} auth URL`);
			}
		} catch (err: any) {
			setError(
				err?.response?.data?.Message ||
				(providerStatus?.isConnected
					? `Failed to disconnect ${provider} calendar`
					: `Failed to connect ${provider} calendar`)
			);
		} finally {
			setPendingCalendarProvider(null);
		}
	}

	async function handleConnectBankAccount() {
		if (!userId || connectingBankAccount) return;

		setConnectingBankAccount(true);
		setError(null);
		try {
			const url = await createConnectAccount(userId);
			if (url && typeof url === 'string') {
				window.location.href = url;
			} else {
				setError('Failed to get payout onboarding URL');
				setConnectingBankAccount(false);
			}
		} catch (err: any) {
			setError(err?.response?.data?.Message || 'Failed to connect bank account');
			setConnectingBankAccount(false);
		}
	}

	async function handleSave() {
		if (!userId) {
			alert('User not authenticated');
			return;
		}

		setSaving(true);
		setError(null);

		try {
			await saveBookingSettings({
				userId,
				pauseAvailability,
				leadTime,
				bufferTime,
				cancellationWindow,
				lateCancellationFee,
				durationOptions: buildDurationOptions(),
			});
			await saveOfficeHours(buildOfficeHoursPayload(userId, officeHours));

			const advisoryType = meetingTypesData.find((meetingType) => meetingType.meetingType === 'Ongoing Advisory Plan');
			if (advisoryType && whatsIncluded.trim()) {
				const advisoryPackages = packagesData.filter((pkg) => pkg.meetingTypeId === advisoryType.id);
				await Promise.all(
					advisoryPackages
						.filter((pkg) => pkg.whatsIncluded !== whatsIncluded.trim())
						.map((pkg) => updatePackage({ ...pkg, whatsIncluded: whatsIncluded.trim() }))
				);
			}

			toast.success('Schedule settings saved successfully');
		} catch (err: any) {
			setError(err?.response?.data?.Message || 'Failed to save schedule settings');
		} finally {
			setSaving(false);
		}
	}

	function handlePackageChange(id: string, field: keyof MeetingPackage, value: any) {
		setPackagesData((prev) => prev.map((pkg) => (pkg.id === id ? { ...pkg, [field]: value } : pkg)));
	}

	function handleCancel() {
		setCancellationWindow(CANCELLATION_OPTIONS[0]);
		setLateCancellationFee(LATE_FEE_OPTIONS[0]);
		toast.info('Changes canceled');
	}
	
	const oneTimeId = getMeetingTypeId('One Time Video Consultation');
	const topicId = getMeetingTypeId('Topic-Specific Consultations');
	const advisoryId = getMeetingTypeId('Ongoing Advisory Plan');

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
			{
				loading ? (
					<div className=" flex ">
						<LoadingSkeleton />
					</div>
				) : (
						<div className="rounded space-y-4">
							<MeetingTypeSection
								selectedTypes={selectedTypes}
								onToggleType={toggleType}
							/>

							{/* {userProfileType === 'Mentor' && selectedTypes.includes('Topic-Specific Consultations') && !allMeetingTypesSelected && (
					<TopicsSection
						topics={topicsData}
						topicMeetingTypeId={topicId}
						newTopicForm={newTopicForm}
						onSetNewTopicForm={setNewTopicForm}
						onAddTopic={addTopic}
						onDeleteTopic={deleteTopic}
						onToggleTopic={toggleTopic}
					/>
				)} */}

							{selectedTypes.includes('Topic-Specific Consultations') && (
								<TopicSpecificConsultationsSection
									offering={topicOffering}
									selectedTopics={selectedTopicNames}
									savedTopics={topicsData.filter((topic) => !topicId || topic.meetingTypeId === topicId)}
									onToggleTopic={toggleSavedTopic}
									customTopicName={customTopicName}
									customTopicDescription={customTopicDescription}
									onCustomTopicNameChange={setCustomTopicName}
									onCustomTopicDescriptionChange={setCustomTopicDescription}
									onAddCustomTopic={topicOffering.type === 'custom' ? handleAddCustomTopic : undefined}
									isAddingCustomTopic={savingCustomTopic}
								/>
							)}

							{(selectedTypes.includes('One Time Video Consultation') || selectedTypes.includes('Topic-Specific Consultations')) && (
								<DurationSection
									oneTimeId={oneTimeId}
									topicId={topicId}
									packages={packagesData}
									localDurationPrices={localDurationPrices}
									onLocalDurationPricesChange={setLocalDurationPrices}
									onPackageChange={handlePackageChange}
								/>
							)}

							{selectedTypes.includes('Ongoing Advisory Plan') && (
								<AdvisorySection
									advisoryId={advisoryId}
									packages={packagesData}
									localAdvisoryData={localAdvisoryData}
									whatsIncluded={whatsIncluded}
									maxChars={maxChars}
									onLocalAdvisoryDataChange={setLocalAdvisoryData}
									onWhatsIncludedChange={setWhatsIncluded}
									onPackageChange={handlePackageChange}
									onUpdatePackage={updatePackage}
									onAddPackage={addPackage}
								/>
							)}

							<CalendarSection
								onConnect={handleConnect}
								connectionStatus={calendarConnectionStatus}
								pendingProvider={pendingCalendarProvider}
							/>

							<OfficeHoursSection
								officeHours={officeHours}
								pauseAvailability={pauseAvailability}
								leadTime={leadTime}
								bufferTime={bufferTime}
								onPauseAvailabilityChange={setPauseAvailability}
								onLeadTimeChange={setLeadTime}
								onBufferTimeChange={setBufferTime}
								onToggleDayEnabled={toggleDayEnabled}
								onAddSlot={addSlot}
								onRemoveSlot={removeSlot}
								onUpdateSlot={updateSlot}
							/>

							<CancellationPolicySection
								cancellationWindow={cancellationWindow}
								lateCancellationFee={lateCancellationFee}
								onCancellationWindowChange={setCancellationWindow}
								onLateCancellationFeeChange={setLateCancellationFee}
							/>

							<ActionsRow saving={saving} onCancel={handleCancel} onSave={handleSave} />
						</div>
				)
			}
			

			<ScheduleSidebar
				onConnectBankAccount={handleConnectBankAccount}
				isConnectingBankAccount={connectingBankAccount}
			/>
		</div>
	);
}

import { apiClient } from '@/utils/api-client';
import { MEETING_TYPE_CATEGORIES } from './constants';
import { mapApiOfficeHours } from './utils';
import type { CalendarConnectionStatus, CalendarProvider, DurationOption, MeetingPackage, MeetingType, OfficeHours, Topic } from './types';

export interface ProviderSetupResult {
	pauseAvailability: boolean;
	leadTime: string;
	bufferTime: string;
	cancellationWindow: string;
	lateCancellationFee: string;
	durationPrices: Record<number, string>;
	whatsIncluded: string;
	officeHours?: OfficeHours;
}

function parseDurationOptions(settings: any): DurationOption[] {
	if (Array.isArray(settings?.DurationOptions)) return settings.DurationOptions;

	if (typeof settings?.DurationOptionsJson === 'string' && settings.DurationOptionsJson.trim()) {
		try {
			const parsed = JSON.parse(settings.DurationOptionsJson);
			return Array.isArray(parsed) ? parsed : [];
		} catch {
			return [];
		}
	}

	return [];
}

function mapDurationPrices(durationOptions: DurationOption[]): Record<number, string> {
	return durationOptions.reduce<Record<number, string>>((prices, option) => {
		const duration = Number(option.DurationMinutes);
		const price = Number(option.Price);

		if (duration > 0 && !Number.isNaN(price)) {
			prices[duration] = String(price);
		}

		return prices;
	}, {});
}

function getFirstWhatsIncludedFromSetup(data: any): string {
	const meetingTypes = Array.isArray(data?.MeetingTypes) ? data.MeetingTypes : [];

	for (const meetingType of meetingTypes) {
		const packages = Array.isArray(meetingType?.Packages) ? meetingType.Packages : [];
		const packageWithContent = packages.find((pkg: any) => typeof pkg?.WhatsIncluded === 'string' && pkg.WhatsIncluded.trim());

		if (packageWithContent) {
			return packageWithContent.WhatsIncluded;
		}
	}

	return '';
}

export async function fetchProviderSetup(userId: string): Promise<ProviderSetupResult> {
	const setupRes = await apiClient.get('/ProviderBooking/GetProviderSetup', {
		params: { userId },
	});
	const data = setupRes.data?.Result;
	const settings = data?.Settings;
	const durationOptions = parseDurationOptions(settings);

	return {
		pauseAvailability: settings?.IsAvailabilityPaused ?? false,
		leadTime: String(settings?.LeadTimeHours ?? 24),
		bufferTime: String(settings?.BufferTimeMinutes ?? 0),
		cancellationWindow: `${settings?.CancellationWindowHours ?? 24} Hours Before Meeting`,
		lateCancellationFee: `${Number(settings?.CancellationFeePercentage ?? 5)}% Fee Charged`,
		durationPrices: mapDurationPrices(durationOptions),
		whatsIncluded: getFirstWhatsIncludedFromSetup(data),
		officeHours: Array.isArray(data?.OfficeHours) ? mapApiOfficeHours(data.OfficeHours) : undefined,
	};
}

export async function fetchMeetingTypes(userId: string): Promise<MeetingType[]> {
	const mtRes = await apiClient.get('/ProviderBooking/GetMeetingTypes', { params: { userId } });
	const mtResult = mtRes.data?.Result || [];

	console.log('Fetched meeting types:', mtResult);

	return mtResult.map((meetingType: any) => {
		const normalizedType =
			MEETING_TYPE_CATEGORIES.find(
				(category) => category.toLowerCase().trim() === (meetingType.MeetingType || '').toLowerCase().trim()
			) ?? meetingType.MeetingType;

		return {
			id: meetingType.Id,
			meetingType: normalizedType,
			title: meetingType.Title,
			description: meetingType.Description,
			isActive: meetingType.IsActive ?? true,
		};
	});
}

export async function fetchMeetingPackages(meetingTypeId: string): Promise<MeetingPackage[]> {
	const pkgRes = await apiClient.get('/ProviderBooking/GetMeetingPackages', { params: { meetingTypeId } });

	return (pkgRes.data?.Result || []).map((pkg: any) => ({
		id: pkg.Id,
		meetingTypeId: pkg.MeetingTypeId,
		packageName: pkg.PackageName,
		price: pkg.Price,
		sessionCount: pkg.SessionCount,
		durationMinutes: pkg.DurationMinutes,
		whatsIncluded: pkg.WhatsIncluded,
		isActive: pkg.IsActive ?? true,
	}));
}

export async function fetchTopics(meetingTypeId: string): Promise<Topic[]> {
	const topicRes = await apiClient.get('/ProviderBooking/GetTopics', { params: { meetingTypeId } });

	console.log('Fetched topics for meetingTypeId', meetingTypeId, topicRes.data?.Result);

	return (topicRes.data?.Result || []).map((topic: any) => ({
		id: topic.Id,
		meetingTypeId: topic.MeetingTypeId,
		topicName: topic.TopicName,
		description: topic.Description,
		price: topic.Price,
		durationMinutes: topic.DurationMinutes,
		isActive: topic.IsActive ?? true,
	}));
}

export async function createMeetingType(userId: string, categoryName: string): Promise<MeetingType | null> {
	const res = await apiClient.post('/ProviderBooking/AddMeetingType', {
		UserId: userId,
		MeetingType: categoryName,
		Title: categoryName,
		Description: null,
		IsActive: true,
	});
	const newType = res.data?.Result;

	if (!newType) return null;

	return {
		id: newType.Id,
		meetingType: newType.MeetingType || categoryName,
		title: newType.Title || categoryName,
		description: newType.Description ?? null,
		isActive: newType.IsActive ?? true,
	};
}

export async function saveMeetingType(meetingType: MeetingType) {
	await apiClient.post('/ProviderBooking/UpdateMeetingType', {
		Id: meetingType.id,
		MeetingType: meetingType.meetingType,
		Title: meetingType.title,
		Description: meetingType.description,
		IsActive: meetingType.isActive,
	});
}

export async function createMeetingPackage(
	meetingTypeId: string,
	packageName: string,
	price: number,
	durationMinutes: number,
	sessionCount?: number
): Promise<MeetingPackage | null> {
	const res = await apiClient.post('/ProviderBooking/AddMeetingPackage', {
		MeetingTypeId: meetingTypeId,
		PackageName: packageName,
		Price: price,
		SessionCount: sessionCount ?? null,
		DurationMinutes: durationMinutes || null,
		WhatsIncluded: '',
	});
	const newPkg = res.data?.Result;

	if (!newPkg) return null;

	return {
		id: newPkg.Id,
		meetingTypeId: newPkg.MeetingTypeId,
		packageName: newPkg.PackageName,
		price: newPkg.Price,
		sessionCount: newPkg.SessionCount,
		durationMinutes: newPkg.DurationMinutes,
		whatsIncluded: newPkg.WhatsIncluded,
		isActive: newPkg.IsActive ?? true,
	};
}

export async function saveMeetingPackage(pkg: MeetingPackage) {
	await apiClient.post('/ProviderBooking/UpdateMeetingPackage', {
		Id: pkg.id,
		PackageName: pkg.packageName,
		Price: pkg.price,
		SessionCount: pkg.sessionCount ?? null,
		DurationMinutes: pkg.durationMinutes ?? null,
		WhatsIncluded: pkg.whatsIncluded || '',
		IsActive: pkg.isActive,
	});
}

export async function createTopic(
	meetingTypeId: string,
	topicName: string,
	description: string,
	price = 0,
	durationMinutes = 0
): Promise<Topic | null> {
	const res = await apiClient.post('/ProviderBooking/AddTopic', {
		MeetingTypeId: meetingTypeId,
		TopicName: topicName,
		Description: description,
		Price: price,
		DurationMinutes: durationMinutes,
	});
	const newTopic = res.data?.Result;

	if (!newTopic) return null;

	return {
		id: newTopic.Id,
		meetingTypeId: newTopic.MeetingTypeId,
		topicName: newTopic.TopicName,
		description: newTopic.Description,
		price: newTopic.Price,
		durationMinutes: newTopic.DurationMinutes,
		isActive: newTopic.IsActive ?? true,
	};
}

export async function saveTopic(topic: Topic) {
	await apiClient.post('/ProviderBooking/UpdateTopic', {
		Id: topic.id,
		TopicName: topic.topicName,
		Description: topic.description || '',
		Price: topic.price,
		DurationMinutes: topic.durationMinutes,
		IsActive: topic.isActive,
	});
}

export async function removeTopic(id: string) {
	await apiClient.delete('/ProviderBooking/DeleteTopic', { params: { id } });
}

export async function getGoogleAuthUrl(userId: string): Promise<string | undefined> {
	const res = await apiClient.get('/Calendar/GoogleAuthUrl', { params: { userId } });
	return res.data?.Result?.authUrl;
}

export async function getOutlookAuthUrl(userId: string): Promise<string | undefined> {
	const res = await apiClient.get('/Calendar/OutlookAuthUrl', { params: { userId } });
	return res.data?.Result?.authUrl;
}

export async function getCalendarConnectionStatus(userId: string): Promise<CalendarConnectionStatus> {
	const res = await apiClient.get('/Calendar/ConnectionStatus', { params: { userId } });
	const result = res.data?.Result || {};

	return {
		google: {
			isConnected: Boolean(result.google?.isConnected),
			email: result.google?.email ?? null,
			connectedAt: result.google?.connectedAt ?? null,
		},
		outlook: {
			isConnected: Boolean(result.outlook?.isConnected),
			email: result.outlook?.email ?? null,
			connectedAt: result.outlook?.connectedAt ?? null,
		},
	};
}

export async function disconnectCalendar(userId: string, provider: CalendarProvider) {
	const providerName = provider === 'outlook' ? 'Outlook' : 'Google';

	await apiClient.post('/Calendar/Disconnect', {
		UserId: userId,
		Provider: providerName,
	});
}

export async function saveBookingSettings(payload: {
	userId: string;
	pauseAvailability: boolean;
	leadTime: string;
	bufferTime: string;
	cancellationWindow: string;
	lateCancellationFee: string;
	durationOptions?: DurationOption[];
}) {
	await apiClient.post('/ProviderBooking/CreateOrUpdateBookingSettings', {
		UserId: payload.userId,
		IsBookingEnabled: true,
		IsAvailabilityPaused: payload.pauseAvailability,
		LeadTimeHours: Number(payload.leadTime) || 24,
		BufferTimeMinutes: Number(payload.bufferTime) || 0,
		CancellationWindowHours: parseInt(payload.cancellationWindow) || 0,
		CancellationFeePercentage: parseInt(payload.lateCancellationFee) || 0,
		Currency: 'USD',
		DurationOptions: payload.durationOptions ?? [],
	});
}

export async function saveOfficeHours(officeHoursPayload: any[]) {
	if (officeHoursPayload.length > 0) {
		await apiClient.post('/ProviderBooking/SetOfficeHours', officeHoursPayload);
	}
}

export async function createConnectAccount(userId: string): Promise<string | undefined> {
	const res = await apiClient.post(`/Booking/CreateConnectAccount?userId=${userId}`);
	return res.data?.Result?.onboardingUrl;
}

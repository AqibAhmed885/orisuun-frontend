import { apiClient } from '@/utils/api-client';

export interface ProviderPackage {
  Id: string;
  MeetingTypeId: string;
  PackageName: string;
  Price: number;
  SessionCount: number | null;
  DurationMinutes: number | null;
  IsActive: boolean;
  WhatsIncluded: string;
}

export interface ProviderTopic {
  Id: string;
  MeetingTypeId: string;
  TopicName: string;
  Description: string | null;
  Price: number;
  DurationMinutes: number;
  IsActive: boolean;
}

export interface ProviderMeetingType {
  Id: string;
  MeetingType: string;
  Title: string;
  IsActive: boolean;
  Packages: ProviderPackage[];
  Topics: ProviderTopic[];
}

export interface ProviderSetupResult {
  Settings: {
    IsBookingEnabled: boolean;
    IsAvailabilityPaused: boolean;
    LeadTimeHours: number;
    BufferTimeMinutes: number;
    CancellationWindowHours: number;
    CancellationFeePercentage: number;
    Currency: string;
    DurationOptionsJson?: string | null;
    DurationOptions?: {
      DurationMinutes: number;
      Price: number;
    }[] | null;
  };
  OfficeHours: {
    Id?: string;
    DayOfWeek: number;
    StartTime: string;
    EndTime: string;
    IsActive: boolean;
  }[];
  MeetingTypes: ProviderMeetingType[];
}

function normalizeMeetingTypeName(value?: string | null) {
  return (value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function matchesProviderMeetingType(value: string | undefined, expected: string) {
  const normalizedValue = normalizeMeetingTypeName(value);
  const normalizedExpected = normalizeMeetingTypeName(expected);

  if (normalizedValue === normalizedExpected) return true;

  if (normalizedExpected.includes('advisory')) {
    return normalizedValue.includes('advisory');
  }

  if (normalizedExpected.includes('topic')) {
    return normalizedValue.includes('topic') && normalizedValue.includes('consult');
  }

  if (normalizedExpected.includes('one time')) {
    return (
      (normalizedValue.includes('one time') || normalizedValue.includes('video')) &&
      normalizedValue.includes('consult')
    );
  }

  return false;
}

function normalizeMeetingType(meetingType: any): ProviderMeetingType {
  return {
    ...meetingType,
    IsActive: meetingType?.IsActive ?? true,
    Packages: (Array.isArray(meetingType?.Packages) ? meetingType.Packages : []).map((pkg: any) => ({
      ...pkg,
      IsActive: pkg?.IsActive ?? true,
    })),
    Topics: (Array.isArray(meetingType?.Topics) ? meetingType.Topics : []).map((topic: any) => ({
      ...topic,
      IsActive: topic?.IsActive ?? true,
    })),
  };
}

async function fetchProviderSetupWithOfferings(userId: string): Promise<ProviderSetupResult | null> {
  const res = await apiClient.get('/ProviderBooking/GetProviderSetup', { params: { userId } });
  const setup = res.data?.Result;

  if (!setup) return null;

  const nestedMeetingTypes = Array.isArray(setup.MeetingTypes)
    ? setup.MeetingTypes.map(normalizeMeetingType)
    : [];

  try {
    const meetingTypesRes = await apiClient.get('/ProviderBooking/GetMeetingTypes', {
      params: { userId },
    });
    const meetingTypes = Array.isArray(meetingTypesRes.data?.Result)
      ? meetingTypesRes.data.Result
      : [];

    if (!meetingTypes.length) {
      return { ...setup, MeetingTypes: nestedMeetingTypes };
    }

    const hydratedMeetingTypes = await Promise.all(
      meetingTypes.map(async (meetingType: any) => {
        const nestedMatch = nestedMeetingTypes.find(
          (nested) => String(nested.Id) === String(meetingType.Id)
        );
        const [packagesResult, topicsResult] = await Promise.allSettled([
          apiClient.get('/ProviderBooking/GetMeetingPackages', {
            params: { meetingTypeId: meetingType.Id },
          }),
          apiClient.get('/ProviderBooking/GetTopics', {
            params: { meetingTypeId: meetingType.Id },
          }),
        ]);

        const packages = packagesResult.status === 'fulfilled' && Array.isArray(packagesResult.value.data?.Result)
          ? packagesResult.value.data.Result
          : nestedMatch?.Packages ?? [];
        const topics = topicsResult.status === 'fulfilled' && Array.isArray(topicsResult.value.data?.Result)
          ? topicsResult.value.data.Result
          : nestedMatch?.Topics ?? [];

        return normalizeMeetingType({
          ...nestedMatch,
          ...meetingType,
          Packages: packages,
          Topics: topics,
        });
      })
    );

    return { ...setup, MeetingTypes: hydratedMeetingTypes };
  } catch {
    return { ...setup, MeetingTypes: nestedMeetingTypes };
  }
}

const providerSetupRequests = new Map<string, Promise<ProviderSetupResult | null>>();

export function getProviderSetup(userId: string): Promise<ProviderSetupResult | null> {
  const existingRequest = providerSetupRequests.get(userId);
  if (existingRequest) return existingRequest;

  const request = fetchProviderSetupWithOfferings(userId).finally(() => {
    providerSetupRequests.delete(userId);
  });

  providerSetupRequests.set(userId, request);
  return request;
}

export interface CreateBookingPayload {
  BookerUserId: string;
  BookerTeamId?: string;
  ProviderUserId: string;
  ProviderTeamId?: string;
  MeetingType: string;
  MeetingTypeId: string;
  PackageId?: string;
  TopicId?: string;
  MeetingDurationMinutes: number;
  ScheduledStartTime: string;
  ScheduledEndTime: string;
  MeetingPurpose: string;
  BasePrice: number;
  TotalPrice: number;
  Currency: string;
  PaymentMethodId: string;
  ReferralDocumentUrls?: string[];
  Email?: string[];
}

export async function createBooking(payload: CreateBookingPayload) {
  const res = await apiClient.post('/Booking/CreateBooking', payload);
  return res.data;
}

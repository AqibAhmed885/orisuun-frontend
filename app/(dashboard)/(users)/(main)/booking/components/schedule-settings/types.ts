export type Slot = { start: string; end: string };

export type OfficeHours = Record<string, { enabled: boolean; slots: Slot[] }>;

export interface ScheduleSettingsProps {
	userProfileType?: string;
}

export interface MeetingType {
	id: string;
	meetingType: string;
	title: string;
	description?: string | null;
	isActive: boolean;
}

export interface MeetingPackage {
	id: string;
	meetingTypeId: string;
	packageName: string;
	price: number;
	sessionCount?: number;
	durationMinutes?: number;
	whatsIncluded?: string;
	isActive: boolean;
}

export interface DurationOption {
	DurationMinutes: number;
	Price: number;
}

export interface CalendarProviderStatus {
	isConnected: boolean;
	email: string | null;
	connectedAt: string | null;
}

export interface CalendarConnectionStatus {
	google: CalendarProviderStatus;
	outlook: CalendarProviderStatus;
}

export type CalendarProvider = 'google' | 'outlook';

export interface Topic {
	id: string;
	meetingTypeId: string;
	topicName: string;
	description?: string;
	price: number;
	durationMinutes: number;
	isActive: boolean;
}

export interface NewTopicForm {
	meetingTypeId: string;
	topicName: string;
	price: string;
	durationMinutes: string;
}

export interface ProfessionalTopicGroup {
	label: string;
	topics: Array<{
		topicName: string;
		description?: string;
	}>;
}

export interface TopicOption {
	topicName: string;
	description?: string;
}

export interface TopicOfferingConfig {
	key: string;
	label: string;
	description: string;
	type: 'flat' | 'grouped' | 'custom';
	topics?: TopicOption[];
	groups?: ProfessionalTopicGroup[];
	customOnly?: boolean;
}

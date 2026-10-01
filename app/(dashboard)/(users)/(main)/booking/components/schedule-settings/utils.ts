import { DAY_OF_WEEK_MAP, createEmptyOfficeHours } from './constants';
import type { OfficeHours, Slot } from './types';

export function toTimeSpan(value: string): string {
	if (/^\d{2}:\d{2}$/.test(value)) return `${value}:00`;
	if (/^\d{2}:\d{2}:\d{2}$/.test(value)) return value;
	return '09:00:00';
}

export function mapApiOfficeHours(apiOfficeHours: any[]): OfficeHours {
	const mapped = createEmptyOfficeHours();

	apiOfficeHours.forEach((officeHour) => {
		const dayEntry = Object.entries(DAY_OF_WEEK_MAP).find(([, value]) => value === officeHour.DayOfWeek);
		const day = dayEntry?.[0];

		if (day) {
			mapped[day].enabled = officeHour.IsActive ?? true;
			mapped[day].slots.push({
				start: officeHour.StartTime?.substring(0, 5) || '09:00',
				end: officeHour.EndTime?.substring(0, 5) || '18:30',
			});
		}
	});

	return mapped;
}

export function buildOfficeHoursPayload(userId: string, officeHours: OfficeHours) {
	return Object.entries(officeHours).flatMap(([day, config]) => {
		const dayIndex = DAY_OF_WEEK_MAP[day];

		if (dayIndex === undefined || !config.enabled || config.slots.length === 0) return [];

		return config.slots.map((slot: Slot) => ({
			UserId: userId,
			DayOfWeek: dayIndex,
			StartTime: toTimeSpan(slot.start),
			EndTime: toTimeSpan(slot.end),
			IsActive: true,
		}));
	});
}

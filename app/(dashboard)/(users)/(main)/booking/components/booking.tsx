"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BookingTable, { type BookingItem, type BookingStatus } from './booking-table';
import ScheduleSettings from './schedule-settings';
import { apiClient } from '@/utils/api-client';
import useCurrentUser from '@/hooks/useCurrentUser';
import EarningsSummary from './earnings-summary';

type ApiBooking = {
	Id: string;
	BookerUserId: string;
	BookerName: string;
	ProviderUserId: string;
	ProviderName: string;
	MeetingType: string;
	MeetingTypeName?: string;
	MeetingDurationMinutes: number;
	ScheduledStartTime: string;
	ScheduledEndTime: string;
	MeetingPurpose?: string;
	Status: string;
	TotalPrice: number;
	Currency: string;
	IsPaid: boolean;
	IsRefunded: boolean;
	StripePaymentIntentId?: string;
	DailyRoomUrl?: string;
	CreatedAt: string;
};

type BookingAnalytics = {
	ProviderUserId: string;
	GeneratedAtUtc: string;
	TotalEarnings: number;
	YearToDateEarnings: number;
	AverageMonthlyEarnings: number;
	EarningsInEscrow: number;
	TotalBookings: number;
	TotalSessions: number;
	SessionCountsByCategory: Array<{
		BookingType: string;
		BookingCount: number;
		SessionCount: number;
		Revenue: number;
	}>;
	AverageEarningByBookingType: Array<{
		BookingType: string;
		BookingCount?: number;
		AverageEarning?: number;
		Revenue?: number;
		SessionCount?: number;
	}>;
	EarningsChart?: {
		Year: number;
		Granularity: string;
		Labels: string[];
		Series: Array<{
			Name: string;
			Color: string;
			Data: number[];
		}>;
	};
};

function formatDateTime(iso: string): string {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return iso;
	const date = d.toLocaleDateString('en-US');
	const time = d.toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	});
	return `${date} ${time}`;
}

function mapStatus(status: string): BookingStatus {
	if (status === 'completed') return 'completed';
	if (status === 'cancelled') return 'cancelled';
	return 'upcoming'; // pending / confirmed
}

function mapApiToItem(api: ApiBooking, currentUserId: string): BookingItem {
	const isBooker = api.BookerUserId === currentUserId;
	const otherName = isBooker ? api.ProviderName : api.BookerName;

	let paymentStatus: BookingItem['paymentStatus'];
	if (api.IsRefunded) paymentStatus = 'escrow';
	else if (api.IsPaid) paymentStatus = 'paid';
	else paymentStatus = 'pending';

	return {
		id: api.Id,
		client: otherName || 'Unknown',
		location: '',
		type: api.MeetingTypeName || api.MeetingType || 'Consultation',
		datetime: formatDateTime(api.ScheduledStartTime),
		scheduledStartTime: api.ScheduledStartTime,
		status: mapStatus(api.Status),
		payout: api.TotalPrice > 0 ? `$${api.TotalPrice.toFixed(2)}` : undefined,
		avatar: '',
		actions: ['reschedule', 'cancel', 'view'],
		serviceTitle: api.MeetingPurpose,
		meetingType: api.MeetingTypeName || api.MeetingType,
		durationMinutes: api.MeetingDurationMinutes,
		transactionId: api.StripePaymentIntentId,
		paymentStatus,
	};
}

export default function Booking() {
	const [activeTab, setActiveTab] = useState<'bookings' | 'schedule' | 'earnings'>('bookings');
	const [bookings, setBookings] = useState<BookingItem[]>([]);
	const [analytics, setAnalytics] = useState<BookingAnalytics | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { user } = useCurrentUser();
	const userId = user?.Id || user?.id || '';

	const fetchBookings = useCallback(async () => {
		if (!userId) return;
		setLoading(true);
		setError(null);
		try {
			const [bookingsRes, analyticsRes] = await Promise.all([
				apiClient.get('/Booking/GetUserBookings', {
					params: { userId },
				}),
				apiClient.get('/Booking/GetBookingAnalytics', {
					params: { providerUserId: userId },
				}),
			]);
			const apiData: ApiBooking[] = bookingsRes.data?.Result || [];
			setBookings(apiData.map((b) => mapApiToItem(b, userId)));
			setAnalytics(analyticsRes.data?.Result || null);
		} catch (err: any) {
			setError(err?.response?.data?.Message || 'Failed to load bookings');
		} finally {
			setLoading(false);
		}
	}, [userId]);

	useEffect(() => {
		fetchBookings();
	}, [fetchBookings]);

	const metrics = useMemo(() => {
		const total = analytics?.TotalBookings ?? bookings.length;
		const upcoming = bookings.filter((b) => b.status === 'upcoming').length;
		const avgDuration =
			total > 0
				? Math.round(
						bookings.reduce((sum, b) => sum + (b.durationMinutes || 0), 0) / total
					)
				: 0;

		// most popular offering
		const typeCounts: Record<string, number> = {};
		bookings.forEach((b) => {
			const key = b.meetingType || b.type || 'Unknown';
			typeCounts[key] = (typeCounts[key] || 0) + 1;
		});
		const mostPopular =
			Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

		return [
			{ label: 'Total bookings', value: total },
			{ label: 'Upcoming Bookings', value: upcoming },
			{ label: 'Average Booking Duration', value: avgDuration > 0 ? `${avgDuration} Min` : '-' },
			{ label: 'Most Popular offering', value: mostPopular },
		];
	}, [analytics, bookings]);

	const earningsMetrics = [
		{ label: 'Total Earnings', value: '$0' },
		{ label: 'Earnings to Date', value: '$0' },
		{ label: 'Average Monthly Earnings', value: '$0' },
		{ label: 'Earnings in Escrow', value: '$0' },
	];

	return (
		<div className="px-4 py-6">
			<div className="border-b shadow-sm py-2 pl-6">
				<h1>Create a meeting</h1>
			</div>

			<div className="mx-auto max-w-[1440px] py-4">
				{/* tabs booking and Schedule */}
				<div className="mb-6 flex items-center gap-4">
					<button
						onClick={() => setActiveTab('bookings')}
						aria-pressed={activeTab === 'bookings'}
						className={
							activeTab === 'bookings'
								? 'border-b-2 border-omblue-500 py-1 text-sm font-bold text-omblue-500'
								: 'py-1 text-sm font-bold text-gray-500 hover:text-gray-700'
						}
					>
						Bookings
					</button>
					<button
						onClick={() => setActiveTab('schedule')}
						aria-pressed={activeTab === 'schedule'}
						className={
							activeTab === 'schedule'
								? 'border-b-2 border-omblue-500 py-1 text-sm font-bold text-omblue-500'
								: 'py-1 text-sm font-bold text-gray-500 hover:text-gray-700'
						}
					>
						Schedule
					</button>
					<button
						onClick={() => setActiveTab('earnings')}
						aria-pressed={activeTab === 'earnings'}
						className={
							activeTab === 'earnings'
								? 'border-b-2 border-omblue-500 py-1 text-sm font-bold text-omblue-500'
								: 'py-1 text-sm font-bold text-gray-500 hover:text-gray-700'
						}
					>
						Earnings
					</button>
				</div>

				{activeTab === 'bookings' && (
					<>
						<div className="mb-6 grid grid-cols-1 divide-x divide-[#EAECF0] gap-4 md:grid-cols-4 overflow-hidden rounded-lg shadow">
							{metrics.map((metric, index) => (
								<div key={index} className="bg-white p-5">
									<p className="text-base text-[#101828]">{metric.label}</p>
									<p className="mt-2 text-2xl font-semibold text-[#101828]">{metric.value}</p>
								</div>
							))}
						</div>

						

						<div className="flex items-center justify-between pb-2">
							<h2 className="border-b border-[#101828] py-2 text-h3 font-semibold text-[#101828]">Bookings</h2>
						</div>

						
						{error && (
							<div className="py-10 text-center text-sm text-red-500">
								{error}
								<button
									onClick={() => window.location.reload()}
									className="ml-2 underline text-omblue-500"
								>
									Retry
								</button>
							</div>
						)}

						 <BookingTable bookings={bookings} userId={userId} onRefresh={fetchBookings} loading={loading} />
					</>
				)}

				{activeTab === 'schedule' && (
					<>
						<ScheduleSettings />
					</>
				)}
				{activeTab === 'earnings' && (
					<>
						<EarningsSummary bookings={bookings} analytics={analytics} earningsMetrics={earningsMetrics} />
					</>
				)}
			</div>
		</div>
	);
}

"use client";

import React, { useMemo } from 'react';
import {
	Banknote,
	CalendarDays,
	CircleDollarSign,
	Plus,
	TrendingUp,
} from 'lucide-react';
import type { BookingItem } from './booking-table';
import EarningsChart from './chart/EarningsChart';
import { SummaryMetric } from './chart/SummaryMetric';
import AverageBookingValueCard from './chart/AverageBookingValueCard';
import AverageEarningsPerBookingCard from './chart/AverageEarningsPerBookingCard';
import TotalSessionsCard from './chart/TotalSessionsCard';

type EarningsSummaryProps = {
	bookings?: BookingItem[];
	analytics?: BookingAnalytics | null;
	earningsMetrics?: { label: string; value: string }[];
};

type ChartSeries = {
	labels: string[];
	primary: number[];
	secondary: number[];
	yAxis: string[];
};

type CategorySeries = {
	label: string;
	value: number;
	color: string;
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

const MONEY = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	maximumFractionDigits: 0,
});

const FALLBACK_SERIES: Record<'day' | 'month' | 'year' | 'date', ChartSeries> = {
	day: {
		labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		primary: [320, 510, 210, 440, 380, 620, 460],
		secondary: [180, 90, 240, 110, 220, 170, 130],
		yAxis: ['$700', '$500', '$300', '$100', '0'],
	},
	month: {
		labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
		primary: [390, 880, 60, 440, 390, 320, 140, 980, 80, 460],
		secondary: [240, 80, 250, 110, 120, 220, 420, 860, 360, 860],
		yAxis: ['$1100', '$900', '$300', '$100', '0'],
	},
	year: {
		labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		primary: [1200, 1500, 980, 1840, 2100, 1700, 1300, 2280, 1940, 2440, 1760, 1980],
		secondary: [760, 540, 860, 680, 950, 840, 720, 1080, 920, 1120, 980, 1010],
		yAxis: ['$2.5k', '$2k', '$1.5k', '$1k', '0'],
	},
	date: {
		labels: ['1', '5', '10', '15', '20', '25', '30'],
		primary: [180, 420, 260, 560, 320, 640, 460],
		secondary: [120, 180, 140, 260, 170, 280, 210],
		yAxis: ['$700', '$500', '$300', '$100', '0'],
	},
};

function parseMoney(value?: string) {
	if (!value) return 0;
	const numeric = Number.parseFloat(value.replace(/[^0-9.-]+/g, ''));
	return Number.isFinite(numeric) ? numeric : 0;
}

function formatMoney(value: number) {
	return MONEY.format(Math.round(value || 0));
}

function getPaymentStatus(booking: BookingItem) {
	return booking.paymentStatus ?? (booking.payout ? 'paid' : 'pending');
}

function scaleSeries(values: number[], scale: number) {
	return values.map((value) => Math.max(0, Math.round(value * scale)));
}

function toYAxis(maxValue: number) {
	const safeMax = Math.max(maxValue, 1);
	const top = Math.ceil(safeMax / 4) * 4;
	return [top, Math.round(top * 0.75), Math.round(top * 0.5), Math.round(top * 0.25), 0].map((value) => {
		if (value >= 1000) return `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
		return `$${value}`;
	});
}

function buildAnalyticsChart(analytics?: BookingAnalytics | null): ChartSeries {
	const chart = analytics?.EarningsChart;

	if (!chart?.Labels?.length || !chart.Series?.length) {
		return FALLBACK_SERIES.month;
	}

	const primary = chart.Series[0]?.Data ?? [];
	const secondary = chart.Series[1]?.Data ?? [];
	const max = Math.max(...primary, ...secondary, 1);

	return {
		labels: chart.Labels,
		primary,
		secondary,
		yAxis: toYAxis(max),
	};
}

export default function EarningsSummary({ bookings = [], analytics = null }: EarningsSummaryProps) {
	const summary = useMemo(() => {
		const completedBookings = bookings.filter((booking) => booking.status === 'completed');
		const escrowBookings = bookings.filter((booking) => getPaymentStatus(booking) === 'escrow');
		const completedTotal = completedBookings.reduce((sum, booking) => sum + parseMoney(booking.payout), 0);
		const escrowTotal = escrowBookings.reduce((sum, booking) => sum + parseMoney(booking.payout), 0);
		const totalBookings = analytics?.TotalBookings ?? bookings.length;
		const totalSessions = analytics?.TotalSessions ?? bookings.filter((booking) => booking.status === 'upcoming' || booking.status === 'completed').length;
		const totalEarnings = analytics?.TotalEarnings ?? completedTotal;
		const yearToDate = analytics?.YearToDateEarnings ?? completedTotal * 0.55;
		const averageMonthlyEarnings = analytics?.AverageMonthlyEarnings ?? (completedTotal / 10 || 0);
		const escrow = analytics?.EarningsInEscrow ?? escrowTotal;

		const categoryData = analytics?.SessionCountsByCategory ?? [];
		const overallAveragePerBooking = totalBookings > 0 ? totalEarnings / totalBookings : 0;

		const topItems: CategorySeries[] = categoryData.length
			? categoryData.map((item, index) => ({
					label: item.BookingType,
					value: item.Revenue || 0,
					color: ['#f6b27f', '#6cc27d', '#d6a4f7', '#6f36ff', '#7ccf8b'][index % 5],
				}))
			: [
					{ label: 'No booking categories', value: 0, color: '#f6b27f' },
				];

		const averageEarningsRows = analytics?.AverageEarningByBookingType?.length
			? analytics.AverageEarningByBookingType.map((item) => {
					const averageEarning = typeof item.AverageEarning === 'number'
						? item.AverageEarning
						: typeof item.Revenue === 'number' && typeof item.BookingCount === 'number' && item.BookingCount > 0
							? item.Revenue / item.BookingCount
							: 0;

					return {
						label: item.BookingType,
						value: averageEarning,
						total: overallAveragePerBooking || averageEarning || 1,
						progress: totalBookings > 0 ? Math.round(((item.BookingCount ?? item.SessionCount ?? 0) / totalBookings) * 100) : 0,
					};
				})
			: categoryData.map((item) => ({
					label: item.BookingType,
					value: item.BookingCount > 0 ? item.Revenue / item.BookingCount : 0,
					total: overallAveragePerBooking || 1,
					progress: totalBookings > 0 ? Math.round((item.BookingCount / totalBookings) * 100) : 0,
				}));

		const sessionRows = categoryData.length
			? categoryData.map((item) => ({
					label: item.BookingType,
					value: item.SessionCount,
					barValue: item.SessionCount,
				}))
			: bookings.slice(0, 5).map((booking) => ({
					label: booking.meetingType || booking.type || 'Booking',
					value: 0,
					barValue: 0,
				}));

		return {
			totalEarnings,
			yearToDate,
			averageMonthlyEarnings,
			escrow,
			totalSessions,
			totalBookings,
			topItems,
			averageEarningsRows,
			sessionRows,
			chart: buildAnalyticsChart(analytics),
		};
	}, [analytics, bookings]);

	const activeChart = summary.chart;

	return (
		<div className="space-y-4 lg:space-y-5">
			<div className="grid divide-x-[0.3px] divide-[#9CAAC7] overflow-hidden rounded-[12px] border-[0.3px] border-[#9CAAC7] bg-[#D8DDE8] shadow-[0_14px_34px_rgba(16,24,40,0.08)] lg:grid-cols-4">
				<SummaryMetric
					title="Total Earnings"
					value={formatMoney(summary.totalEarnings)}
					delta="+23%"
					deltaClass="text-emerald-500"
					icon={<svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M2.5 1.25C1.465 1.25 0.625 2.09 0.625 3.125V18.125C0.625 19.16 1.465 20 2.5 20H17.5C18.535 20 19.375 19.16 19.375 18.125V3.125C19.375 2.09 18.535 1.25 17.5 1.25H2.5ZM2.5 2.5H17.5C17.845 2.5 18.125 2.78 18.125 3.125V18.125C18.125 18.47 17.845 18.75 17.5 18.75H2.5C2.155 18.75 1.875 18.47 1.875 18.125V3.125C1.875 2.78 2.155 2.5 2.5 2.5ZM6.25 4.375C6.02875 4.375 5.82438 4.49125 5.71187 4.6825C5.59937 4.87313 5.59687 5.11 5.70437 5.30375L8.65937 10.625L5.70437 15.9462C5.59687 16.14 5.59937 16.3769 5.71187 16.5675C5.82438 16.7587 6.02875 16.875 6.25 16.875H13.75C14.095 16.875 14.375 16.595 14.375 16.25V15C14.375 14.655 14.095 14.375 13.75 14.375C13.405 14.375 13.125 14.655 13.125 15V15.625H7.31188L9.92062 10.9288C10.0256 10.74 10.0256 10.51 9.92062 10.3212L7.31188 5.625H13.125V6.25C13.125 6.595 13.405 6.875 13.75 6.875C14.095 6.875 14.375 6.595 14.375 6.25V5C14.375 4.655 14.095 4.375 13.75 4.375H6.25Z" fill="black" fillOpacity="0.68" /></svg>}
				/>
				<SummaryMetric
					title="Year-to-Date Earnings"
					value={formatMoney(summary.yearToDate)}
					delta="+23%"
					deltaClass="text-emerald-500"
					icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.48415 4.31489C4.55991 4.31489 3 5.8748 3 7.79904V13.4837C3 15.408 4.55991 16.9679 6.48415 16.9679H10.6101M8.95974 4.31489H9.96831H11.7104H13.4525C15.3767 4.31489 16.9366 5.8748 16.9366 7.79904V10.6414M7.21766 5.59852V3.03125M12.719 5.59852V3.03125M3.36675 9.44943H16.8449M14.3693 14.4923L15.1945 13.6671" stroke="#505052" strokeWidth="1.10026" strokeLinecap="round" /><path d="M14.4345 16.9685C15.8523 16.9685 17.0017 15.8191 17.0017 14.4013C17.0017 12.9834 15.8523 11.834 14.4345 11.834C13.0166 11.834 11.8672 12.9834 11.8672 14.4013C11.8672 15.8191 13.0166 16.9685 14.4345 16.9685Z" stroke="#505052" strokeWidth="1.10026" /></svg>}
				/>
				<SummaryMetric
					title="Average Monthly Earnings"
					value={formatMoney(summary.averageMonthlyEarnings)}
					delta="+23%"
					deltaClass="text-emerald-500"
					icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.5648 15.9371C15.868 16.6363 15.0401 17.1911 14.1285 17.5697C13.2168 17.9482 12.2394 18.1431 11.2523 18.1431C10.2652 18.1431 9.28782 17.9482 8.37618 17.5697C7.46455 17.1911 6.6366 16.6363 5.93982 15.9371C5.88175 15.8791 5.83569 15.8101 5.80427 15.7343C5.77284 15.6584 5.75666 15.5771 5.75666 15.4949C5.75666 15.4128 5.77284 15.3315 5.80427 15.2556C5.83569 15.1798 5.88175 15.1108 5.93982 15.0528C6.0571 14.9355 6.21616 14.8696 6.38201 14.8696C6.46413 14.8696 6.54545 14.8858 6.62132 14.9172C6.69719 14.9486 6.76613 14.9947 6.8242 15.0528C7.6982 15.927 8.81184 16.5225 10.0243 16.7638C11.2367 17.0051 12.4935 16.8814 13.6356 16.4084C14.7778 15.9354 15.754 15.1344 16.4408 14.1065C17.1277 13.0787 17.4943 11.8702 17.4943 10.634C17.4943 9.3978 17.1277 8.18935 16.4408 7.1615C15.754 6.13365 14.7778 5.33258 13.6356 4.85958C12.4935 4.38659 11.2367 4.26293 10.0243 4.50424C8.81184 4.74555 7.6982 5.34099 6.8242 6.21526C6.7649 6.27333 6.69474 6.31915 6.61773 6.35011C6.54073 6.38106 6.45837 6.39655 6.37538 6.39568C6.29239 6.39481 6.21038 6.3776 6.13404 6.34503C6.0577 6.31247 5.98852 6.26519 5.93045 6.20589C5.81317 6.08613 5.74828 5.92468 5.75003 5.75707C5.75091 5.67408 5.76811 5.59207 5.80068 5.51573C5.83324 5.43939 5.88052 5.37021 5.93982 5.31214C6.73277 4.51903 7.69401 3.91452 8.75232 3.54339C10.371 2.97773 12.1337 2.97773 13.7523 3.54339C14.6091 3.8458 15.4034 4.30225 16.0961 4.89026C16.2554 5.02151 16.4086 5.16526 16.5554 5.31214C16.7023 5.45901 16.8461 5.62464 16.9773 5.77151C18.1989 7.20763 18.8348 9.05114 18.7583 10.935C18.6819 12.8188 17.8987 14.6047 16.5648 15.9371Z" fill="#505052" /><path d="M17.9406 4.81562L16.975 5.78125C16.8437 5.625 16.7 5.46875 16.5625 5.3125C16.425 5.15625 16.25 5.02187 16.1031 4.89062L17.0687 3.925C17.1883 3.82261 17.3421 3.7691 17.4994 3.77518C17.6567 3.78126 17.8059 3.84646 17.9172 3.95777C18.0285 4.06908 18.0937 4.21829 18.0998 4.37559C18.1059 4.53289 18.0524 4.68669 17.95 4.80625L17.9406 4.81562ZM13.125 1.875H9.375C9.20924 1.875 9.05027 1.94085 8.93306 2.05806C8.81585 2.17527 8.75 2.33424 8.75 2.5V3.55312C10.3687 2.98746 12.1313 2.98746 13.75 3.55312V2.5C13.75 2.33424 13.6842 2.17527 13.5669 2.05806C13.4497 1.94085 13.2908 1.875 13.125 1.875ZM8.125 11.25H1.875C1.70924 11.25 1.55027 11.1842 1.43306 11.0669C1.31585 10.9497 1.25 10.7908 1.25 10.625C1.25 10.4592 1.31585 10.3003 1.43306 10.1831C1.55027 10.0658 1.70924 10 1.875 10H8.125C8.29076 10 8.44973 10.0658 8.56694 10.1831C8.68415 10.3003 8.75 10.4592 8.75 10.625C8.75 10.7908 8.68415 10.9497 8.56694 11.0669C8.44973 11.1842 8.29076 11.25 8.125 11.25ZM9.375 8.75H3.125C2.95924 8.75 2.80027 8.68415 2.68306 8.56694C2.56585 8.44973 2.5 8.29076 2.5 8.125C2.5 7.95924 2.56585 7.80027 2.68306 7.68306C2.80027 7.56585 2.95924 7.5 3.125 7.5H9.375C9.54076 7.5 9.69973 7.56585 9.81694 7.68306C9.93415 7.80027 10 7.95924 10 8.125C10 8.29076 9.93415 8.44973 9.81694 8.56694C9.69973 8.68415 9.54076 8.75 9.375 8.75ZM9.375 13.75H3.125C2.95924 13.75 2.80027 13.6842 2.68306 13.5669C2.56585 13.4497 2.5 13.2908 2.5 13.125C2.5 12.9592 2.56585 12.8003 2.68306 12.6831C2.80027 12.5658 2.95924 12.5 3.125 12.5H9.375C9.54076 12.5 9.69973 12.5658 9.81694 12.6831C9.93415 12.8003 10 12.9592 10 13.125C10 13.2908 9.93415 13.4497 9.81694 13.5669C9.69973 13.6842 9.54076 13.75 9.375 13.75ZM14.1906 8.56563L12.4562 10.3125C12.484 10.4144 12.4987 10.5194 12.5 10.625C12.5 10.8722 12.4267 11.1139 12.2893 11.3195C12.152 11.525 11.9568 11.6852 11.7284 11.7799C11.4999 11.8745 11.2486 11.8992 11.0061 11.851C10.7637 11.8028 10.5409 11.6837 10.3661 11.5089C10.1913 11.3341 10.0722 11.1113 10.024 10.8689C9.97579 10.6264 10.0005 10.3751 10.0951 10.1466C10.1898 9.91824 10.35 9.72301 10.5555 9.58566C10.7611 9.44831 11.0028 9.375 11.25 9.375C11.3556 9.37632 11.4606 9.39102 11.5625 9.41875L13.2969 7.68437C13.4164 7.58198 13.5702 7.52848 13.7275 7.53456C13.8848 7.54063 14.034 7.60584 14.1454 7.71715C14.2567 7.82846 14.3219 7.97767 14.3279 8.13497C14.334 8.29226 14.2805 8.44606 14.1781 8.56563H14.1906Z" fill="#505052" /></svg>}
				/>
				<SummaryMetric
					title="Earnings in Escrow"
					value={formatMoney(summary.escrow)}
					delta="+23%"
					deltaClass="text-rose-500"
					icon={<CircleDollarSign className="h-5 w-5" />}
				/>
			</div>

			<div className="grid gap-4 xl:grid-cols-[minmax(0,2.2fr)_minmax(330px,1fr)]">
				<EarningsChart series={activeChart} />

				<div className="rounded-[16px] border border-black p-5 text-white shadow-[0px_4px_9.6px_0px_#00000040] sm:p-6">
					<div className="mb-5 flex items-center justify-between">
						<h1 className="text-xl font-semibold leading-none text-[#262A35] sm:text-lg">
							Popular products
						</h1>
						<button
							type="button"
							className="flex h-8 w-8 items-center justify-center rounded-md bg-[#262A35] text-white"
							aria-label="Add"
						>
							<Plus className="h-6 w-6" />
						</button>
					</div>
					<div className="space-y-7">
						{summary.topItems.map((item, index) => (
							<div key={`${item.label}-${index}`} className="space-y-3">
								<p className="text-sm text-[#282C35]">{item.label}</p>
								<div className="space-y-2">
									<div
										className="h-2 rounded-full"
										style={{
											width: `${Math.min(100, Math.max(55, (item.value / Math.max(...summary.topItems.map((row) => row.value), 1)) * 100))}%`,
											background: item.color,
										}}
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="grid gap-4 xl:grid-cols-[1fr_1fr_1fr]">
				<AverageBookingValueCard totalValue={summary.totalEarnings} primaryLabel="Earnings" secondaryLabel="Spent" />

				<AverageEarningsPerBookingCard rows={summary.averageEarningsRows} />

				<TotalSessionsCard
					totalSessions={summary.totalSessions}
					rows={summary.sessionRows}
					maxValue={Math.max(...summary.sessionRows.map((row) => Number(row.barValue ?? row.value) || 0), 80)}
					axisLabels={[0, 20, 40, 60, 80]}
				/>
			</div>
		</div>
	);
}

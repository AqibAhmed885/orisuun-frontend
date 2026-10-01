"use client";

import { apiClient } from "@/utils/api-client";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type BookingItem = {
	id: string;
	title: string;
	client: string;
	date: string;
	time: string;
	price: string;
	totalPrice: number;
	currency: string;
	duration: string;
	durationMinutes: number;
	status: "upcoming" | "completed" | "cancelled";
	scheduledStartTime: string;
	scheduledEndTime: string;
	meetingType?: string;
};

type BookingCardProps = {
	loading?: boolean;
	bookings?: BookingItem[];
};

type BookingApiResponse = {
	StatusCode?: number;
	Message?: string;
	Result?: Array<{
		Id: string;
		BookerUserId: string;
		BookerName?: string;
		BookerUserModel?: {
			Id?: string;
			UserName?: string;
			FirstName?: string;
			LastName?: string;
			Email?: string;
			PhoneNumber?: string | null;
			ProfilePicture?: string | null;
		} | null;
		BookerTeamId?: string | null;
		ProviderUserId: string;
		ProviderName?: string;
		ProviderUserModel?: {
			Id?: string;
			UserName?: string;
			FirstName?: string;
			LastName?: string;
			Email?: string;
			PhoneNumber?: string | null;
			ProfilePicture?: string | null;
		} | null;
		ProviderTeamId?: string | null;
		MeetingType: string;
		MeetingTypeId?: string;
		PackageId?: string | null;
		TopicId?: string | null;
		MeetingTypeName?: string;
		MeetingDurationMinutes: number;
		ScheduledStartTime: string;
		ScheduledEndTime: string;
		MeetingPurpose?: string;
		Status: string;
		BasePrice?: number;
		TotalPrice: number;
		Currency: string;
		IsPaid: boolean;
		IsRefunded: boolean;
		RefundAmount?: number;
		DailyRoomUrl?: string;
		ReferralDocumentUrls?: string[] | null;
		Email?: string[] | null;
		CreatedAt: string;
	}>;
};

type BookingAnalytics = {
	ProviderUserId?: string;
	GeneratedAtUtc?: string;
	TotalEarnings?: number;
	YearToDateEarnings?: number;
	AverageMonthlyEarnings?: number;
	EarningsInEscrow?: number;
	TotalBookings?: number;
	TotalSessions?: number;
	SessionCountsByCategory?: Array<{
		BookingType?: string;
		BookingCount?: number;
		SessionCount?: number;
		Revenue?: number;
	}>;
	AverageEarningByBookingType?: unknown[];
	EarningsChart?: {
		Year?: number;
		Granularity?: string;
		Labels?: string[];
		Series?: Array<{
			Name?: string;
			Color?: string;
			Data?: number[];
		}>;
	};
};

const totalEarningsIcon = (
	<svg
		width="10"
		height="10"
		viewBox="0 0 10 10"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M1.19038 0.597656C0.697167 0.597656 0.296875 0.997949 0.296875 1.49117V8.63924C0.296875 9.13246 0.697167 9.53275 1.19038 9.53275H8.33846C8.83168 9.53275 9.23197 9.13246 9.23197 8.63924V1.49117C9.23197 0.997949 8.83168 0.597656 8.33846 0.597656H1.19038ZM1.19038 1.19333H8.33846C8.50287 1.19333 8.6363 1.32676 8.6363 1.49117V8.63924C8.6363 8.80365 8.50287 8.93708 8.33846 8.93708H1.19038C1.02598 8.93708 0.892548 8.80365 0.892548 8.63924V1.49117C0.892548 1.32676 1.02598 1.19333 1.19038 1.19333ZM2.9774 2.08684C2.87197 2.08684 2.77458 2.14224 2.72097 2.23337C2.66736 2.32421 2.66616 2.43709 2.71739 2.52942L4.12556 5.0652L2.71739 7.60099C2.66616 7.69331 2.66736 7.80619 2.72097 7.89703C2.77458 7.98817 2.87197 8.04357 2.9774 8.04357H6.55144C6.71585 8.04357 6.84928 7.91014 6.84928 7.74573V7.15006C6.84928 6.98565 6.71585 6.85222 6.55144 6.85222C6.38704 6.85222 6.25361 6.98565 6.25361 7.15006V7.4479H3.48343L4.7266 5.20995C4.77663 5.12001 4.77663 5.0104 4.7266 4.92046L3.48343 2.68251H6.25361V2.98035C6.25361 3.14475 6.38704 3.27819 6.55144 3.27819C6.71585 3.27819 6.84928 3.14475 6.84928 2.98035V2.38468C6.84928 2.22027 6.71585 2.08684 6.55144 2.08684H2.9774Z"
			fill="black"
			fillOpacity="0.68"
		/>
	</svg>
);

function formatMoney(value: number, currency = "USD") {
	try {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency,
			maximumFractionDigits: 0,
		}).format(Number.isFinite(value) ? value : 0);
	} catch {
		return `$${Math.round(Number.isFinite(value) ? value : 0)}`;
	}
}

function formatDateTime(iso: string) {
	const parsed = new Date(iso);

	if (Number.isNaN(parsed.getTime())) {
		return {
			date: "-",
			time: "-",
		};
	}

	return {
		date: parsed.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		}),
		time: parsed.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
		}),
	};
}

function mapStatus(status: string): BookingItem["status"] {
	const normalized = String(status || "").toLowerCase();

	if (normalized === "completed") return "completed";
	if (normalized === "cancelled" || normalized === "canceled") return "cancelled";

	return "upcoming";
}

function isUpcomingBooking(booking: BookingItem) {
	const parsed = new Date(booking.scheduledStartTime);

	if (Number.isNaN(parsed.getTime())) {
		return booking.status === "upcoming";
	}

	return booking.status === "upcoming" && parsed.getTime() >= Date.now();
}

function getAverageDurationFromAllBookings(bookings: BookingItem[]) {
	if (!bookings.length) return 0;

	return Math.round(
		bookings.reduce((sum, booking) => sum + booking.durationMinutes, 0) /
		bookings.length
	);
}

function getTopOfferingPriceFromAllBookings(bookings: BookingItem[]) {
	if (!bookings.length) return "-";

	const offerCounts = bookings.reduce<
		Record<string, { count: number; totalPrice: number; currency: string }>
	>((acc, booking) => {
		const totalPrice = Number(booking.totalPrice || 0);
		const currency = booking.currency || "USD";
		const key = `${currency}-${totalPrice}`;

		acc[key] = {
			count: (acc[key]?.count || 0) + 1,
			totalPrice,
			currency,
		};

		return acc;
	}, {});

	const topOffer = Object.values(offerCounts).sort((a, b) => {
		if (b.count !== a.count) return b.count - a.count;
		return b.totalPrice - a.totalPrice;
	})[0];

	return topOffer ? formatMoney(topOffer.totalPrice, topOffer.currency) : "-";
}

function BookingCardSkeleton() {
	return (
		<aside className="w-full rounded-[28px] bg-white p-5 shadow-blur md:p-6">
			<div className="mb-4 flex items-center justify-between">
				<div className="h-9 w-32 rounded-md bg-gray-200" />
				<div className="h-5 w-24 rounded-md bg-gray-200" />
			</div>

			<div className="mb-8 h-px w-full bg-gray-200" />

			<div className="space-y-6 animate-pulse">
				<div>
					<div className="mb-4 h-9 w-40 rounded-md bg-gray-200" />
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						{Array.from({ length: 4 }).map((_, index) => (
							<div
								key={index}
								className="rounded-[20px] border border-gray-200 bg-gray-50 p-5"
							>
								<div className="mx-auto h-5 w-24 rounded bg-gray-200" />
								<div className="mx-auto mt-4 h-12 w-16 rounded bg-gray-200" />
							</div>
						))}
					</div>
				</div>

				<div>
					<div className="mb-4 h-8 w-52 rounded-md bg-gray-200" />
					<div className="space-y-3">
						{Array.from({ length: 2 }).map((_, index) => (
							<div
								key={index}
								className="rounded-[28px] border border-gray-200 bg-gray-50 p-5"
							>
								<div className="flex items-center justify-between gap-4">
									<div className="space-y-3">
										<div className="h-6 w-44 rounded bg-gray-200" />
										<div className="h-5 w-28 rounded bg-gray-200" />
									</div>
									<div className="h-12 w-36 rounded-full bg-gray-200" />
								</div>
							</div>
						))}
					</div>
				</div>

				<div>
					<div className="mb-4 h-8 w-24 rounded-md bg-gray-200" />
					<div className="space-y-5">
						{Array.from({ length: 3 }).map((_, index) => (
							<div key={index} className="flex items-center justify-between gap-4">
								<div className="h-7 w-48 rounded bg-gray-200" />
								<div className="h-7 w-20 rounded bg-gray-200" />
							</div>
						))}
					</div>
				</div>
			</div>
		</aside>
	);
}

export default function BookingCard({
	loading: externalLoading = false,
	bookings: externalBookings,
}: BookingCardProps) {
	const router = useRouter();
	const { user } = useCurrentUser();

	const [bookings, setBookings] = useState<BookingItem[]>(externalBookings ?? []);
	const [analytics, setAnalytics] = useState<BookingAnalytics | null>(null);
	const [loading, setLoading] = useState(!externalBookings);
	const [error, setError] = useState<string | null>(null);

	const userId = user?.Id || user?.id || "";
	const canManageBookingSetup = user?.CanManageBookingSetup ?? false;

	const fetchBookings = useCallback(async () => {
		if (!userId) {
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const requests: [
				Promise<{ data?: BookingApiResponse }>,
				Promise<{ data?: { Result?: BookingAnalytics } }> | null
			] = [
					apiClient.get<BookingApiResponse>("/Booking/GetUserBookings", {
						params: { userId },
					}),
					canManageBookingSetup
						? apiClient.get<{ Result?: BookingAnalytics }>("/Booking/GetBookingAnalytics", {
							params: { providerUserId: userId },
						})
						: null,
				];

			const [bookingsRes, analyticsRes] = await Promise.all([
				requests[0],
				requests[1] ?? Promise.resolve(null),
			]);

			const apiBookings = bookingsRes.data?.Result || [];

			const mappedBookings: BookingItem[] = apiBookings.map((booking) => {
				const { date, time } = formatDateTime(booking.ScheduledStartTime);
				const isBooker = booking.BookerUserId === userId;
				const otherName = isBooker ? booking.ProviderName : booking.BookerName;

				const totalPrice = Number.isFinite(Number(booking.TotalPrice))
					? Number(booking.TotalPrice)
					: 0;

				const durationMinutes = Number.isFinite(
					Number(booking.MeetingDurationMinutes)
				)
					? Number(booking.MeetingDurationMinutes)
					: 0;

				const currency = booking.Currency || "USD";

				return {
					id: booking.Id,
					title: booking.MeetingTypeName || booking.MeetingType || "Consultation",
					client: otherName || "Unknown",
					date,
					time,
					price: formatMoney(totalPrice, currency),
					totalPrice,
					currency,
					duration: `${durationMinutes} min`,
					durationMinutes,
					status: mapStatus(booking.Status),
					scheduledStartTime: booking.ScheduledStartTime,
					scheduledEndTime: booking.ScheduledEndTime,
					meetingType: booking.MeetingTypeName || booking.MeetingType,
				};
			});

			setBookings(mappedBookings);
			setAnalytics(analyticsRes?.data?.Result ?? null);
		} catch (err: any) {
			setError(err?.response?.data?.Message || "Failed to load bookings");
			setBookings([]);
			setAnalytics(null);
		} finally {
			setLoading(false);
		}
	}, [userId]);

	useEffect(() => {
		if (externalBookings) {
			setBookings(externalBookings);
			setLoading(false);
		}
	}, [externalBookings]);

	useEffect(() => {
		if (!externalBookings) {
			fetchBookings();
		}
	}, [externalBookings, fetchBookings]);

	const upcomingBookings = useMemo(() => {
		return bookings
			.filter(isUpcomingBooking)
			.sort(
				(a, b) =>
					new Date(a.scheduledStartTime).getTime() -
					new Date(b.scheduledStartTime).getTime()
			)
			.slice(0, 2);
	}, [bookings]);

	const defaultCurrency = bookings[0]?.currency || "USD";

	const derivedStats = useMemo(() => {
		const averageDuration = getAverageDurationFromAllBookings(bookings);
		const topOffering = getTopOfferingPriceFromAllBookings(bookings);

		return [
			{
				label: "Total Earnings",
				value: formatMoney(analytics?.TotalEarnings ?? 0, defaultCurrency),
				icon: totalEarningsIcon,
			},
			{
				label: "Average Duration",
				value: `${averageDuration} Min`,
			},
			{
				label: "Top Offering",
				value: topOffering,
			},
			{
				label: "Upcoming Booking",
				value: String(upcomingBookings.length),
			},
		];
	}, [analytics?.TotalEarnings, bookings, defaultCurrency, upcomingBookings.length]);

	const earnings = useMemo(
		() => [
			{
				label: "Total Earnings",
				value: formatMoney(analytics?.TotalEarnings ?? 0, defaultCurrency),
			},
			{
				label: "Escrow Amount",
				value: formatMoney(analytics?.EarningsInEscrow ?? 0, defaultCurrency),
			},
			{
				label: "Money Paid",
				value: formatMoney(analytics?.TotalEarnings ?? 0, defaultCurrency),
			},
		],
		[analytics?.EarningsInEscrow, analytics?.TotalEarnings, defaultCurrency]
	);

	const hasBookings = bookings.length > 0;

	if (externalLoading || loading) {
		return <BookingCardSkeleton />;
	}

	return (
		<aside className="w-full min-w-[210px] rounded-[12px] bg-white p-3 shadow-blur">
			<div className="mb-2 flex items-center justify-between gap-4">
				<h3 className="text-lg font-semibold tracking-tight text-[#0A193A]">
					Bookings
				</h3>

				{hasBookings && (
					<button
						type="button"
						className="text-sm font-semibold text-[#2B5CD4] transition-colors hover:text-[#2148a8]"
						onClick={() => router.push("/booking")}
					>
						Edit setup
					</button>
				)}
			</div>

			<div className="mb-2 h-px w-full bg-gray-200" />

			{hasBookings ? (
				<div className="mt-6 space-y-3">
					<section>
						<h4 className="mb-5 text-lg font-semibold tracking-tight text-[#0F2147]">
							Booking Stats
						</h4>

						<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
							{derivedStats.map((stat) => (
								<div
									key={stat.label}
									className="rounded-[10px] border-[0.3px] border-[#9CAAC7] bg-[#F9FBFF] px-3 py-3"
								>
									<p className="flex items-center justify-start text-nowrap text-xs font-semibold leading-tight text-[#2A2E35]">
										{stat.icon && (
											<span className="mr-1 inline-block align-middle">
												{stat.icon}
											</span>
										)}
										{stat.label}
									</p>

									<p className="mt-4 text-[22px] font-medium leading-none tracking-tight text-[#0F2147]">
										{stat.value}
									</p>
								</div>
							))}
						</div>
					</section>

					<section>
						<h4 className="my-5 text-lg font-semibold tracking-tight text-[#0F2147]">
							Upcoming Meetings
						</h4>

						<div className="space-y-2">
							{upcomingBookings.length > 0 ? (
								upcomingBookings.map((booking) => (
									<div
										key={booking.id}
										className="flex items-center justify-between gap-4 rounded-[18px] border border-[#E1E9F4] bg-white p-3"
									>
										<div className="min-w-0">
											<p className="text-[15px] font-semibold leading-tight tracking-tight text-[#1F2937]">
												{booking.date} - {booking.time}
											</p>

											<p className="mt-1 text-[12px] font-semibold text-[#111827]">
												{booking.price}
												<span className="font-normal text-[#58657B]">
													{" "}
													/ {booking.duration}
												</span>
											</p>
										</div>

										<button
											type="button"
											className="shrink-0 rounded-full bg-[#2B5CD4] px-5 py-2 text-[12px] font-semibold leading-none text-white transition-colors hover:bg-[#2148a8]"
											onClick={() => router.push(`/live/${booking.id}`)}
										>
											View
										</button>
									</div>
								))
							) : (
								<p className="rounded-[18px] border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-4 text-center text-sm text-[#64748B]">
									No bookings to show right now
								</p>
							)}
						</div>
					</section>

					<section>
						<h4 className="mb-6 text-lg font-semibold tracking-tight text-[#0F2147]">
							Earnings
						</h4>

						<div className="space-y-6">
							{earnings.map((item) => (
								<div
									key={item.label}
									className="flex items-center justify-between gap-2"
								>
									<p className="text-lg font-semibold leading-tight text-[#2A2E35]">
										{item.label}
									</p>

									<p className="text-lg font-semibold leading-tight text-[#77CE55]">
										{item.value}
									</p>
								</div>
							))}
						</div>
					</section>
				</div>
			) : (
				<div className="flex flex-col items-center pb-6 text-center">
						<svg width="137" height="120" viewBox="0 0 137 120" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M18.4414 88.0234C19.0691 88.0234 19.578 87.5145 19.578 86.8867C19.578 86.2589 19.0691 85.75 18.4414 85.75C17.8136 85.75 17.3047 86.2589 17.3047 86.8867C17.3047 87.5145 17.8136 88.0234 18.4414 88.0234Z" fill="#CFCFCF" />
							<path d="M92.1537 40.5137C82.4456 40.5137 72.5634 40.1193 63.3192 37.5444C54.2489 35.0274 45.921 30.1443 38.4978 24.4957C33.6379 20.8189 29.2187 17.8844 22.909 18.3252C16.7362 18.6592 10.8333 20.9643 6.06757 24.9017C-1.95879 31.9306 -0.752521 44.956 2.46034 54.0726C7.28544 67.8404 21.9695 77.4326 34.4498 83.6379C48.8671 90.8408 64.711 95.0279 80.5898 97.4289C94.5083 99.5515 112.394 101.083 124.456 92.0007C135.533 83.6379 138.572 64.5695 135.858 51.6949C135.199 47.8915 133.174 44.4596 130.163 42.0447C122.38 36.3497 110.77 40.1541 102.024 40.3397C98.7766 40.4093 95.471 40.4905 92.1537 40.5137Z" fill="#EEF2F6" />
							<path d="M86.2539 2.27336C86.8816 2.27336 87.3906 1.76445 87.3906 1.13668C87.3906 0.508909 86.8816 0 86.2539 0C85.6261 0 85.1172 0.508909 85.1172 1.13668C85.1172 1.76445 85.6261 2.27336 86.2539 2.27336Z" fill="#D1D3D6" />
							<path d="M18.4414 88.0234C19.0691 88.0234 19.578 87.5145 19.578 86.8867C19.578 86.2589 19.0691 85.75 18.4414 85.75C17.8136 85.75 17.3047 86.2589 17.3047 86.8867C17.3047 87.5145 17.8136 88.0234 18.4414 88.0234Z" fill="#D1D3D6" />
							<path d="M117.656 28.5898V33.5773" stroke="#BABABA" stroke-width="1.7398" stroke-linecap="round" stroke-linejoin="round" />
							<path d="M115.164 31.0859H120.152" stroke="#BABABA" stroke-width="1.7398" stroke-linecap="round" stroke-linejoin="round" />
							<path d="M119.938 103.684V108.671" stroke="#BABABA" stroke-width="1.7398" stroke-linecap="round" stroke-linejoin="round" />
							<path d="M117.438 106.176H122.425" stroke="#BABABA" stroke-width="1.7398" stroke-linecap="round" stroke-linejoin="round" />
							<path d="M32.7344 9.68555V14.673" stroke="#BABABA" stroke-width="1.7398" stroke-linecap="round" stroke-linejoin="round" />
							<path d="M30.2422 12.1797H35.2297" stroke="#BABABA" stroke-width="1.7398" stroke-linecap="round" stroke-linejoin="round" />
							<path d="M68.8682 120C92.384 120 111.447 118.811 111.447 117.344C111.447 115.877 92.384 114.688 68.8682 114.688C45.3524 114.688 26.2891 115.877 26.2891 117.344C26.2891 118.811 45.3524 120 68.8682 120Z" fill="#F9F9F9" />
							<path d="M102.339 59V83.5833C102.339 92.8562 102.339 97.4877 99.4574 100.369C96.5762 103.25 91.9447 103.25 82.6719 103.25H35.9635C32.7036 103.25 29.5772 101.955 27.272 99.6498C24.9669 97.3447 23.6719 94.2183 23.6719 90.9583M102.339 59V34.4167C102.339 25.1438 102.339 20.5123 99.4574 17.6312C96.5762 14.75 91.9447 14.75 82.6719 14.75H43.3385C34.0657 14.75 29.4342 14.75 26.553 17.6312C23.6719 20.5123 23.6719 25.1438 23.6719 34.4167V90.9583M102.339 59C102.339 68.2728 102.339 72.9043 99.4574 75.7855C96.5762 78.6667 91.9447 78.6667 82.6719 78.6667H35.9635C32.7036 78.6667 29.5772 79.9617 27.272 82.2668C24.9669 84.5719 23.6719 87.6984 23.6719 90.9583" fill="white" />
							<path d="M23.6719 90.9583V34.4167C23.6719 25.1438 23.6719 20.5123 26.553 17.6312C29.4342 14.75 34.0657 14.75 43.3385 14.75H82.6719C91.9447 14.75 96.5762 14.75 99.4574 17.6312C102.339 20.5123 102.339 25.1438 102.339 34.4167V59V83.5833C102.339 92.8562 102.339 97.4877 99.4574 100.369C96.5762 103.25 91.9447 103.25 82.6719 103.25H35.9635C32.7036 103.25 29.5772 101.955 27.272 99.6499C24.9669 97.3447 23.6719 94.2183 23.6719 90.9583ZM102.339 59C102.339 68.2728 102.339 72.9043 99.4574 75.7855C96.5762 78.6667 91.9447 78.6667 82.6719 78.6667H35.9635C32.7036 78.6667 29.5772 79.9617 27.272 82.2668C24.9669 84.5719 23.6719 87.6984 23.6719 90.9583" stroke="#D1D2D4" stroke-width="1.6" />
							<path d="M48.25 39.332H77.75" stroke="#D1D2D4" stroke-width="4.91667" stroke-linecap="round" />
						</svg>


					<p className="mb-8 text-sm leading-tight text-gray-500">
						No bookings to show
						<br />
						right now
					</p>

						{error && (
							<p className="mb-4 max-w-[220px] text-xs leading-tight text-red-500">
								{error}
							</p>
						)}

						{/* {canManageBookingSetup ? ( */}
							<button
								type="button"
								className="rounded-[5px] bg-omblue-600 px-8 py-2 text-sm font-semibold text-white hover:bg-omblue-500"
								onClick={() => router.push("/booking")}
							>
								Start setup
							</button>
						{/* ) : null} */}
				</div>
			)}
		</aside>
	);
}

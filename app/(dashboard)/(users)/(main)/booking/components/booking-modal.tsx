"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Clock, X } from 'lucide-react';
import { apiClient } from '@/utils/api-client';
import type { BookingItem } from './booking-table';

type BookingDetail = {
	Id: string;
	BookerName: string;
	ProviderName: string;
	MeetingType: string;
	MeetingTypeName: string;
	MeetingDurationMinutes: number;
	ScheduledStartTime: string;
	ScheduledEndTime: string;
	MeetingPurpose: string;
	Status: string;
	TotalPrice: number;
	Currency: string;
	IsPaid: boolean;
	IsRefunded: boolean;
	StripePaymentIntentId: string | null;
	Email: string | null;
	CreatedAt: string;
	UpdatedAt: string;
};

type BookingApiResponse = {
	StatusCode?: number;
	Message?: string;
	Result?: BookingDetail;
};

function formatBookingDate(datetime: string) {
	const parsedDate = new Date(datetime);

	if (Number.isNaN(parsedDate.getTime())) {
		return datetime.split(' ')[0] || 'Sunday, May 17, 2026';
	}

	return parsedDate.toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	});
}

function formatBookingTime(datetime: string, durationMinutes = 60) {
	const parsedDate = new Date(datetime);

	if (Number.isNaN(parsedDate.getTime())) {
		return datetime.split(' ').slice(1).join(' ') || '11:00 AM - 12:00 PM';
	}

	const endDate = new Date(parsedDate.getTime() + durationMinutes * 60 * 1000);
	const timeFormat = new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	});

	return `${timeFormat.format(parsedDate)} - ${timeFormat.format(endDate)}`;
}

function getPaymentStatus(booking: BookingItem, detail?: BookingDetail | null) {
	if (detail) {
		if (detail.IsRefunded) return 'escrow';
		if (detail.IsPaid) return 'paid';
	}

	return booking.paymentStatus ?? (booking.payout ? 'paid' : 'pending');
}

const paymentStatusStyles: Record<string, string> = {
	paid: 'border-[#08C61A] bg-[#DCFFD8] text-[#098B17]',
	escrow: 'border-amber-300 bg-amber-50 text-amber-700',
	dispute: 'border-rose-200 bg-rose-50 text-rose-600',
	pending: 'border-slate-200 bg-slate-50 text-slate-600',
};

function formatAmount(amount?: number, currency?: string) {
	if (typeof amount !== 'number') return '$0.00';

	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: currency || 'USD',
		maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
	}).format(amount);
}

export default function BookingModal({
	booking,
	onClose,
}: {
	booking: BookingItem;
	onClose: () => void;
}) {
	const [detail, setDetail] = useState<BookingDetail | null>(null);
	const [loadingDetail, setLoadingDetail] = useState(false);

	useEffect(() => {
		let cancelled = false;

		const loadBooking = async () => {
			setLoadingDetail(true);

			try {
				const response = await apiClient.get<BookingApiResponse>('/Booking/GetBooking', {
					params: { bookingId: booking.id },
				});

				if (!cancelled) {
					setDetail(response.data?.Result ?? null);
				}
			} catch {
				if (!cancelled) {
					setDetail(null);
				}
			} finally {
				if (!cancelled) {
					setLoadingDetail(false);
				}
			}
		};

		loadBooking();

		return () => {
			cancelled = true;
		};
	}, [booking.id]);

	const activeBooking = useMemo(
		() => ({
			client: detail?.BookerName || booking.client,
			provider: detail?.ProviderName || booking.meetingType || booking.type,
			meetingType: detail?.MeetingTypeName || detail?.MeetingType || booking.meetingType || booking.type,
			durationMinutes: detail?.MeetingDurationMinutes || booking.durationMinutes || 60,
			startTime: detail?.ScheduledStartTime || booking.scheduledStartTime || booking.datetime,
			endTime: detail?.ScheduledEndTime,
			totalPrice: detail?.TotalPrice ?? null,
			currency: detail?.Currency || 'USD',
			paymentIntentId: detail?.StripePaymentIntentId || booking.transactionId || null,
			status: detail?.Status || booking.status,
			email: booking.email || detail?.Email ,
		}),
		[booking, detail]
	);

	const durationMinutes = activeBooking.durationMinutes ?? 60;
	const paymentStatus = getPaymentStatus(booking, detail);
	const paymentStatusLabel = paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1);
	const isActionDisabled = booking.status === 'completed' || booking.status === 'cancelled';
	const bookingIdValue = detail?.Id || booking.id;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-6">
			<div className="absolute inset-0 bg-slate-950/35 backdrop-blur-[2px]" onClick={onClose} />

			<div className="relative z-10 w-full max-w-[640px] rounded-[28px] bg-white px-6 py-4 shadow-2xl ring-1 ring-slate-200 sm:px-12 sm:py-12">
				<button
					onClick={onClose}
					aria-label="Close"
					className="absolute right-8 top-6 rounded-full p-2 text-slate-950 transition hover:bg-slate-100"
				>
					<X className="h-6 w-6" strokeWidth={2.4} />
				</button>

				<div className="flex flex-col gap-5 pr-10 lg:flex-row lg:items-start lg:justify-between">
					<div className="min-w-0">
						<h3 className="text-2xl font-semibold leading-tight tracking-tight text-slate-950">
							{activeBooking.client}
						</h3>
						<div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-lg text-slate-600">
							{booking.phone && (
								<div className="flex items-center gap-3">
									<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M8 3C8.5 3 10.5 7.5 10.5 8C10.5 9 9 10 8.5 11C8 12 9 13 10 14C10.39 14.39 12 16 13 15.5C14 15 15 13.5 16 13.5C16.5 13.5 21 15.5 21 16C21 18 19.5 19.5 18 20C16.5 20.5 15.5 20.5 13.5 20C11.5 19.5 10 19 7.5 16.5C5 14 4.5 12.5 4 10.5C3.5 8.5 3.5 7.5 4 6C4.5 4.5 6 3 8 3Z" stroke="#475467" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
									</svg>

									<span>{booking.phone ?? '+1 (000) 000-0000'}</span>
								</div>
							)}
							{activeBooking.email && (
								<>
									<span className="hidden text-slate-600 sm:inline">•</span>
									<div className="flex min-w-0 items-center gap-3">
										<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
											<g clipPath="url(#clip0_148_28455)">
												<path d="M18.7474 3.75L9.58073 13.125L0.414062 3.75" stroke="#475467" strokeWidth="1.3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
												<path d="M18.7474 3.75H0.414062V17.0833H18.7474V3.75Z" stroke="#475467" strokeWidth="1.3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
											</g>
											<defs>
												<clipPath id="clip0_148_28455">
													<rect width="20" height="20" fill="white" />
												</clipPath>
											</defs>
										</svg>

										<span className="break-all">{activeBooking.email}</span>
									</div>
								</>
							)}
							
						</div>
					</div>

					<div className="pt-1 text-sm text-slate-950 lg:pt-1.5">
						Booking ID: <span className="font-medium">{bookingIdValue}</span>
					</div>
				</div>

				<section className="mt-6">
					<h4 className="text-sm font-bold text-slate-950">
						Schedule Details
					</h4>

					{loadingDetail ? (
						<div className="mt-3 flex flex-col gap-2">
							<div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
							<div className="h-4 w-1/4 animate-pulse rounded bg-slate-200" />
						</div>
					) : (
							<>
								<div className="mt-3 flex justify-between gap-y-7 text-sm text-slate-950 lg:grid-cols-2">
									<div className="w-full">
										<div className="font-medium">Service Booked</div>
										<div className="mt-1 leading-snug">{booking.serviceTitle ?? activeBooking.meetingType ?? 'Building a Successful Digital Agency in 2026'}</div>
									</div>
									<div className="w-full">
										<div className="font-medium">Meeting Type</div>
										<div className="mt-1 leading-snug">{activeBooking.meetingType ?? '1:1 Video Consultation'}</div>
									</div>
								</div>

								<div className="mt-5 grid gap-7 text-slate-950 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_110px] lg:items-center">
									<div className="flex items-center gap-5">
										<CalendarDays className="h-7 w-7 shrink-0 text-slate-600" strokeWidth={1.8} />
										<div>
											<div className="text-sm font-medium">
												Meeting Date
											</div>
											<div className="mt-1 text-sm">
												{formatBookingDate(activeBooking.startTime)}
											</div>
										</div>
									</div>

									<div className="flex items-center gap-2">
										<Clock className="h-7 w-7 shrink-0 text-slate-600" strokeWidth={1.8} />
										<div>
											<div className="text-sm font-medium">Meeting Time</div>
											<div className="mt-1 text-sm">{formatBookingTime(activeBooking.startTime, durationMinutes)}</div>
										</div>
									</div>

									<div>
										<div className="text-sm font-medium">Duration</div>
										<div className="mt-1 inline-flex h-7 min-w-[100px] items-center justify-center rounded-md border border-[#A8D6FF] bg-[#D2EBFF] px-4 text-xs text-slate-600">
											({durationMinutes} min)
										</div>
									</div>
								</div>
							</>
					)}
					
				</section>

				<section className="mt-7">
					<h4 className="text-lg font-bold text-slate-950">Payment Details</h4>

					{loadingDetail ? (
						// shimmer effect for loading state
						<div className="mt-3 flex flex-col gap-2">
							<div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
							<div className="h-4 w-1/4 animate-pulse rounded bg-slate-200" />
						</div>
					) : (
						<>
								<div className="mt-5 grid gap-6 text-sm text-slate-950 md:grid-cols-2">
									<div>
										<div className="font-medium">Total Paid</div>
										<div className="mt-1">{formatAmount(activeBooking.totalPrice ?? undefined, activeBooking.currency)}</div>
									</div>

									<div>
										<div className="font-medium">Payment Status</div>
										<div className="mt-3">
											<span className={`inline-flex rounded-lg border px-3 py-1 text-xs font-medium ${paymentStatusStyles[paymentStatus] ?? paymentStatusStyles.pending}`}>
												{paymentStatusLabel}
											</span>
										</div>
									</div>
								</div>
						</>
					)}
					

					<div className="mt-4 text-sm text-slate-950">
						Transaction ID: {activeBooking.paymentIntentId }
					</div>

					{/* {loadingDetail ? (
						<p className="mt-3 text-xs text-slate-500">Loading booking details...</p>
					) : null} */}
				</section>

				<div className="mt-7 flex flex-col gap-4 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
					<button
						onClick={onClose}
						className="h-8 rounded-lg border border-slate-200 bg-white px-5 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-slate-50"
					>
						Cancel
					</button>
					<button
						className={`h-8 rounded-lg px-6 text-sm font-bold text-white shadow-sm transition hover:opacity-90 sm:min-w-[120px] ${isActionDisabled ? 'cursor-not-allowed bg-omblue-200' : 'bg-[#2D5BC8]'}`}
						disabled={isActionDisabled}
					>
						Reschedule
					</button>
				</div>
			</div>
		</div>
	);
}

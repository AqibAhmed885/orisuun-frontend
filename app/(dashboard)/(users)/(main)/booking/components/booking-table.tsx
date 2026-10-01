"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import BookingModal from './booking-modal';
import { apiClient } from '@/utils/api-client';
import { CalendarDays, ChevronDown, X } from 'lucide-react';

export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

export type BookingItem = {
	id: string;
	client: string;
	location: string;
	type: string;
	datetime: string;
	scheduledStartTime?: string;
	status: BookingStatus;
	payout?: string;
	avatar?: string;
	actions: Array<'reschedule' | 'cancel' | 'view'>;
	phone?: string;
	email?: string;
	serviceTitle?: string;
	meetingType?: string;
	durationMinutes?: number;
	transactionId?: string;
	paymentStatus?: 'paid' | 'escrow' | 'dispute' | 'pending';
};

type BookingDetail = {
	Id: string;
	BookerName: string;
	Email: string | null;
	MeetingType: string;
	MeetingTypeName: string;
	MeetingDurationMinutes: number;
	ScheduledStartTime: string;
	ScheduledEndTime: string;
	TotalPrice: number;
	Currency: string;
	IsPaid: boolean;
	IsRefunded: boolean;
	StripePaymentIntentId: string | null;
	CreatedAt: string;
	UpdatedAt: string;
};

type BookingApiResponse = {
	StatusCode?: number;
	Message?: string;
	Result?: BookingDetail;
};

type BookingTableProps = {
	bookings: BookingItem[];
	userId?: string;
	onRefresh?: () => void;
	loading?: boolean;
};

const actionLabel: Record<BookingItem['actions'][number], string> = {
	reschedule: 'Reschedule',
	cancel: 'Cancel',
	view: 'View',
};

const BookingTable = ({ bookings, userId, onRefresh, loading }: BookingTableProps) => {
	const [activeTab, setActiveTab] = useState<BookingStatus>('upcoming');
	const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
	const [cancellingId, setCancellingId] = useState<string | null>(null);
	const [rescheduleBooking, setRescheduleBooking] = useState<BookingItem | null>(null);
	const [proposedDate, setProposedDate] = useState('');
	const [proposedTime, setProposedTime] = useState('');
	const [selectedSlotKey, setSelectedSlotKey] = useState<string>('');
	const [actionError, setActionError] = useState<string | null>(null);
	const [rescheduleDetail, setRescheduleDetail] = useState<BookingDetail | null>(null);
	const [loadingRescheduleDetail, setLoadingRescheduleDetail] = useState(false);
	const showPayout = activeTab === 'completed' || activeTab === 'cancelled';

	const openRescheduleModal = (booking: BookingItem) => {
		setRescheduleBooking(booking);
		setSelectedSlotKey('Today-11:30');
		setProposedDate(new Date().toISOString().split('T')[0]);
		setProposedTime('11:30');
	};

	useEffect(() => {
		if (!rescheduleBooking) {
			setRescheduleDetail(null);
			setLoadingRescheduleDetail(false);
			return;
		}

		let cancelled = false;

		const loadBookingDetail = async () => {
			setLoadingRescheduleDetail(true);

			try {
				const response = await apiClient.get<BookingApiResponse>('/Booking/GetBooking', {
					params: { bookingId: rescheduleBooking.id },
				});

				if (!cancelled) {
					setRescheduleDetail(response.data?.Result ?? null);
				}
			} catch {
				if (!cancelled) {
					setRescheduleDetail(null);
				}
			} finally {
				if (!cancelled) {
					setLoadingRescheduleDetail(false);
				}
			}
		};

		loadBookingDetail();

		return () => {
			cancelled = true;
		};
	}, [rescheduleBooking]);

	const rescheduleGroups = useMemo(() => {
		if (!rescheduleBooking) return [];

		const baseDate = rescheduleBooking.scheduledStartTime || rescheduleBooking.datetime;
		const parsedBaseDate = new Date(baseDate);
		const referenceDate = Number.isNaN(parsedBaseDate.getTime()) ? new Date() : parsedBaseDate;

		const buildSlot = (date: Date, time: string, label: string) => {
			const [hours, minutes] = time.split(':').map(Number);
			const slotDate = new Date(date);
			slotDate.setHours(hours, minutes, 0, 0);
			const displayTime = slotDate.toLocaleTimeString('en-US', {
				hour: 'numeric',
				minute: '2-digit',
			});

			return {
				key: `${label}-${time}`,
				label,
				time,
				displayTime,
				price: rescheduleBooking.payout || '$80',
				duration: `${rescheduleBooking.durationMinutes || 60} min`,
				date: slotDate,
			};
		};

		const today = new Date(referenceDate);
		today.setHours(0, 0, 0, 0);
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		return [
			{
				label: 'Today',
				slots: ['9:30', '10:30', '11:30'].map((time) => buildSlot(today, time, 'Today')),
			},
			{
				label: 'Tomorrow',
				slots: ['9:30', '10:30', '11:30'].map((time) => buildSlot(tomorrow, time, 'Tomorrow')),
			},
		];
	}, [rescheduleBooking]);

	const tabList: Array<{ label: string; value: BookingStatus; count: number }> = useMemo(
		() => [
			{
				label: 'Upcoming',
				value: 'upcoming',
				count: bookings.filter((booking) => booking.status === 'upcoming').length
			},
			{
				label: 'Completed', value: 'completed', count: bookings.filter((booking) => booking.status === 'completed').length
			},
			{
				label: 'Cancelled', value: 'cancelled', count: bookings.filter((booking) => booking.status === 'cancelled').length
			},
		],
		[bookings]
	);

	const visibleBookings = useMemo(
		() =>
			bookings.filter((booking) => {
				if (booking.status !== activeTab) return false;

				if (!startDate && !endDate) return true;

				const sourceDate = booking.scheduledStartTime || booking.datetime;
				const bookingTime = new Date(sourceDate).getTime();
				if (Number.isNaN(bookingTime)) return false;

				if (startDate) {
					const startTime = new Date(`${startDate}T00:00:00`).getTime();
					if (bookingTime < startTime) return false;
				}

				if (endDate) {
					const endTime = new Date(`${endDate}T23:59:59.999`).getTime();
					if (bookingTime > endTime) return false;
				}

				return true;
			}),
		[activeTab, bookings, startDate, endDate]
	);

	const rangeLabel = useMemo(() => {
		if (startDate && endDate) {
			return `${startDate} – ${endDate}`;
		}
		if (startDate) return `${startDate} – ...`;
		if (endDate) return `... – ${endDate}`;
		return 'May 6, 2026 – Jun 13, 2026';
	}, [startDate, endDate]);

	const handleCancel = async (booking: BookingItem) => {
		if (!userId) return;
		setCancellingId(booking.id);
		setActionError(null);
		try {
			await apiClient.post('/Booking/CancelBooking', {
				BookingId: booking.id,
				CancelledBy: userId,
				CancellationReason: 'Cancelled by user',
			});
			onRefresh?.();
		} catch (err: any) {
			setActionError(err?.response?.data?.Message || 'Cancel failed');
		} finally {
			setCancellingId(null);
		}
	};

	const handleReschedule = async () => {
		if (!userId || !rescheduleBooking || !proposedDate || !proposedTime) return;
		setActionError(null);
		try {
			const start = new Date(`${proposedDate}T${proposedTime}`);
			const end = new Date(start.getTime() + (rescheduleBooking.durationMinutes || 60) * 60000);
			await apiClient.post('/Booking/RequestReschedule', {
				BookingId: rescheduleBooking.id,
				RequestedBy: userId,
				ProposedStartTime: start.toISOString(),
				ProposedEndTime: end.toISOString(),
				Reason: `Reschedule requested by user${selectedSlotKey ? ` - ${selectedSlotKey}` : ''}`,
			});
			setRescheduleBooking(null);
			setProposedDate('');
			setProposedTime('');
			setSelectedSlotKey('');
			onRefresh?.();
		} catch (err: any) {
			setActionError(err?.response?.data?.Message || 'Reschedule failed');
		}
	};

	return (
		<div className="py-2">

			<div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
				<nav className="inline-flex flex-wrap gap-1 rounded-xl bg-gray-100 p-1 shadow-[0_0_0_1px_rgba(16,24,40,0.04)]">
					{tabList.map((tab) => {
						const isActive = activeTab === tab.value;

						return (
							<button
								key={tab.value}
								type="button"
								onClick={() => setActiveTab(tab.value)}
								className={`rounded-lg px-9 py-2 text-sm font-semibold transition-colors ${
									isActive ? 'bg-white text-[#101828] shadow-sm' : 'text-[#667085] hover:text-[#101828]'
								}`}
							>
								{tab.label}
							</button>
						);
					})}
				</nav>

				<div className="relative self-start lg:self-auto">
					<button
						type="button"
						onClick={() => setIsDateFilterOpen((open) => !open)}
						className="inline-flex items-center gap-3 rounded-lg border border-[#D0D5DD] bg-[#F2F4F7] px-4 py-3 text-sm text-[#475467] shadow-sm transition hover:bg-[#EAECF0]"
					>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
							<path d="M7.673 2C7.85865 2 8.0367 2.07375 8.16797 2.20503C8.29925 2.3363 8.373 2.51435 8.373 2.7V4.009H15.89V2.709C15.89 2.52335 15.9637 2.3453 16.095 2.21403C16.2263 2.08275 16.4043 2.009 16.59 2.009C16.7757 2.009 16.9537 2.08275 17.085 2.21403C17.2162 2.3453 17.29 2.52335 17.29 2.709V4.009H20C20.5303 4.009 21.0388 4.21958 21.4139 4.59443C21.7889 4.96929 21.9997 5.47774 22 6.008V20.001C21.9997 20.5313 21.7889 21.0397 21.4139 21.4146C21.0388 21.7894 20.5303 22 20 22H4C3.46974 22 2.96118 21.7894 2.58614 21.4146C2.2111 21.0397 2.00027 20.5313 2 20.001V6.008C2.00027 5.47774 2.2111 4.96929 2.58614 4.59443C2.96118 4.21958 3.46974 4.009 4 4.009H6.973V2.699C6.97327 2.51352 7.04713 2.33573 7.17838 2.20467C7.30963 2.07361 7.48752 2 7.673 2ZM3.4 9.742V20.001C3.4 20.0798 3.41552 20.1578 3.44567 20.2306C3.47583 20.3034 3.52002 20.3695 3.57574 20.4253C3.63145 20.481 3.69759 20.5252 3.77039 20.5553C3.84319 20.5855 3.92121 20.601 4 20.601H20C20.0788 20.601 20.1568 20.5855 20.2296 20.5553C20.3024 20.5252 20.3685 20.481 20.4243 20.4253C20.48 20.3695 20.5242 20.3034 20.5543 20.2306C20.5845 20.1578 20.6 20.0798 20.6 20.001V9.756L3.4 9.742ZM8.667 16.619V18.285H7V16.619H8.667ZM12.833 16.619V18.285H11.167V16.619H12.833ZM17 16.619V18.285H15.333V16.619H17ZM8.667 12.642V14.308H7V12.642H8.667ZM12.833 12.642V14.308H11.167V12.642H12.833ZM17 12.642V14.308H15.333V12.642H17ZM6.973 5.408H4C3.92121 5.408 3.84319 5.42352 3.77039 5.45367C3.69759 5.48382 3.63145 5.52802 3.57574 5.58374C3.52002 5.63945 3.47583 5.70559 3.44567 5.77839C3.41552 5.85119 3.4 5.92921 3.4 6.008V8.343L20.6 8.357V6.008C20.6 5.92921 20.5845 5.85119 20.5543 5.77839C20.5242 5.70559 20.48 5.63945 20.4243 5.58374C20.3685 5.52802 20.3024 5.48382 20.2296 5.45367C20.1568 5.42352 20.0788 5.408 20 5.408H17.29V6.337C17.29 6.52265 17.2162 6.7007 17.085 6.83197C16.9537 6.96325 16.7757 7.037 16.59 7.037C16.4043 7.037 16.2263 6.96325 16.095 6.83197C15.9637 6.7007 15.89 6.52265 15.89 6.337V5.408H8.373V6.328C8.373 6.51365 8.29925 6.6917 8.16797 6.82297C8.0367 6.95425 7.85865 7.028 7.673 7.028C7.48735 7.028 7.3093 6.95425 7.17803 6.82297C7.04675 6.6917 6.973 6.51365 6.973 6.328V5.408Z" fill="#475467" />
						</svg>
						<span>{rangeLabel}</span>
						{/* <ChevronDown className="h-4 w-4 text-[#98A2B3]" /> */}
					</button>

					{isDateFilterOpen ? (
						<div className="absolute right-0 top-[calc(100%+10px)] z-20 w-[320px] rounded-2xl border border-[#D0D5DD] bg-white p-4 shadow-lg">
							<div className="mb-3 flex items-center justify-between">
								<p className="text-sm font-semibold text-[#101828]">Filter by date</p>
								<button
									type="button"
									onClick={() => {
										setStartDate('');
										setEndDate('');
										setIsDateFilterOpen(false);
									}}
									className="inline-flex items-center gap-1 text-xs font-medium text-[#667085] hover:text-[#101828]"
								>
									<X className="h-4 w-4" />
									Clear
								</button>
							</div>

							<div className="space-y-3">
								<label className="block">
									<span className="mb-1 block text-xs font-medium text-[#667085]">Start date</span>
									<input
										type="date"
										value={startDate}
										onChange={(e) => setStartDate(e.target.value)}
										className="w-full rounded-lg border border-[#D0D5DD] px-3 py-2 text-sm text-[#101828] outline-none focus:border-[#2F63D9]"
									/>
								</label>
								<label className="block">
									<span className="mb-1 block text-xs font-medium text-[#667085]">End date</span>
									<input
										type="date"
										value={endDate}
										onChange={(e) => setEndDate(e.target.value)}
										className="w-full rounded-lg border border-[#D0D5DD] px-3 py-2 text-sm text-[#101828] outline-none focus:border-[#2F63D9]"
									/>
								</label>
								<button
									type="button"
									onClick={() => setIsDateFilterOpen(false)}
									className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#2F63D9] px-4 py-2 text-sm font-semibold text-white"
								>
									<CalendarDays className="h-4 w-4" />
									Apply filter
								</button>
							</div>
						</div>
					) : null}
				</div>
			</div>

			<div className="bg-white rounded-lg border border-[#EAECF0] overflow-hidden table-reset">
				<div className="overflow-x-auto">
					<div role="table" className="w-full min-w-[900px]" aria-label="Bookings table">
						{/* Header */}
						<div role="rowgroup" className="border-b border-[#EAECF0] bg-[#FAFBFC]">
							<div role="row" className={`grid gap-4 px-5 py-5 text-left text-sm font-semibold text-[#475467] ${showPayout ? 'grid-cols-7' : 'grid-cols-4'}`}>
								<div role="columnheader" className="">Client</div>
								<div role="columnheader" className="">Meeting Type</div>
								<div role="columnheader" className="">Time and Date</div>
								{showPayout ? <div role="columnheader" className="">Payout</div> : null}
								{showPayout ? <div role="columnheader" className="">Status</div> : null}
								<div role="columnheader" className={`${showPayout ? 'col-span-2' : ''}`}>Action</div>
							</div>
						</div>

						{/* Rows */}
						<div role="rowgroup" className="bg-white divide-y divide-[#EAECF0]">
							{loading ? ( 
								<>
									{/* skeleton */}
									<div>
										{Array.from({ length: 5 }).map((_, index) => (
											<div key={index} role="row" className={`grid gap-4 px-5 py-5 items-center hover:bg-[#FAFBFC] transition ${showPayout ? 'grid-cols-7' : 'grid-cols-4'}`}>
												<div role="cell" className="">
													<div className="h-4 w-32 rounded bg-gray-200" />
												</div>
												<div role="cell" className="">
													<div className="h-4 w-24 rounded bg-gray-200" />
												</div>
												<div role="cell" className="">
													<div className="h-4 w-20 rounded bg-gray-200" />
												</div>
												{showPayout ? (
													<>
														<div role="cell" className="">
															<div className="h-4 w-16 rounded bg-gray-200" />
														</div>
														<div role="cell" className="">
															<div className="h-4 w-20 rounded bg-gray-200" />
														</div>
													</>
												) : null}
												<div role="cell" className={`${showPayout ? 'col-span-2' : ''}`}>
													<div className="h-4 w-24 rounded bg-gray-200" />
												</div>
											</div>
										))}
									</div>
								</>
							) : visibleBookings.length > 0 ? (
								visibleBookings.map((booking) => (
									<div role="row" key={booking.id} className={`grid gap-4 px-4 py-4 items-center hover:bg-[#FAFBFC] transition ${showPayout ? 'grid-cols-7' : 'grid-cols-4'}`}>
										{/* Client */}
										<div role="cell" className="">
											<div className="flex items-center gap-3">
												<div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-100 ring-1 ring-gray-200">
													{booking.avatar ? (
														<Image src={booking.avatar} alt="avatar" fill className="object-cover" />
													) : (
														<div className="flex h-full w-full items-center justify-center text-gray-500">
															{booking.client.charAt(0)}
														</div>
													)}
												</div>
												<div>
													<div className="text-sm font-semibold text-[#101828]">{booking.client}</div>
													{booking.location && (
														<div className="mt-1 flex items-center gap-2 text-sm text-[#667085]">
															<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path d="M20 10C20 16.5 12 22 12 22C12 22 4 16.5 4 10C4 7.87827 4.84285 5.84344 6.34315 4.34315C7.84344 2.84285 9.87827 2 12 2C14.1217 2 16.1566 2.84285 17.6569 4.34315C19.1571 5.84344 20 7.87827 20 10Z" stroke="#101828" stroke-width="2" />
																<path d="M15 10C15 10.7956 14.6839 11.5587 14.1213 12.1213C13.5587 12.6839 12.7956 13 12 13C11.2044 13 10.4413 12.6839 9.87868 12.1213C9.31607 11.5587 9 10.7956 9 10C9 9.20435 9.31607 8.44129 9.87868 7.87868C10.4413 7.31607 11.2044 7 12 7C12.7956 7 13.5587 7.31607 14.1213 7.87868C14.6839 8.44129 15 9.20435 15 10Z" stroke="#101828" stroke-width="2" />
															</svg>
															<span>{booking.location}</span>
														</div>
													)}
													
												</div>
											</div>
										</div>

										{/* Meeting Type */}
										<div role="cell" className="text-[15px] text-[#101828]">
											{booking.type}
										</div>

										{/* Time and Date */}
										<div role="cell" className="flex flex-col text-sm text-[#101828]">
											<span>
												{booking.datetime.split(' ')[0]}
											</span>
											
											<span className='text-[#6C7880]'>
												{booking.datetime.split(' ').slice(1).join(' ')}
											</span>
											
										</div>

										{showPayout ? (
											<>
												<div role="cell" className="text-sm font-semibold text-[#101828]">
													{booking.payout ?? '$0'}
												</div>

												<div role="cell" className="text-sm">
													{(() => {
														const status = booking.paymentStatus ?? (booking.payout ? 'paid' : 'pending');
														if (status === 'paid') {
															return (
																<span className="inline-block rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm text-emerald-600">
																	Paid
																</span>
															);
														}
														if (status === 'escrow') {
															return (
																<span className="inline-block rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-sm text-amber-700">
																	Escrow
																</span>
															);
														}
														if (status === 'dispute') {
															return (
																<span className="inline-block rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-sm text-rose-600">
																	Dispute
																</span>
															);
														}
														return (
																<span className="inline-block rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600">
																	Pending
																 </span>
														);
													})()}
												</div>
											</>
										) : null}

										{/* Actions */}
										<div role="cell" className={`${showPayout ? 'col-span-2' : ''}`}>
											<div className="flex items-center gap-3">
												{booking.actions.map((action) => {
													if (action === 'reschedule') {
														return (
															<button
																key={`${booking.id}-reschedule`}
																type="button"
																disabled={showPayout}
																onClick={() => openRescheduleModal(booking)}
																className={`rounded-md px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 ${showPayout ? 'bg-omblue-200 cursor-not-allowed' : 'bg-omblue-500'}`}
															>
																{actionLabel[action]}
															</button>
														);
													}
													if (action === 'view') {
														return (
															<button
																key={`${booking.id}-view`}
																type="button"
																onClick={() => setSelectedBooking(booking)}
																className="rounded-lg border border-[#F2F4F7] bg-white px-3 py-2 text-sm font-semibold text-[#101828] shadow-sm transition-colors hover:bg-[#F9FAFB]"
															>
																{actionLabel[action]}
															</button>
														);
													}
													return (
														<button
																key={`${booking.id}-${action}`}
																type="button"
																disabled={action === 'cancel' && showPayout || cancellingId === booking.id}
																onClick={() => handleCancel(booking)}
																className={`rounded-lg border border-[#F2F4F7] bg-white px-3 py-2 text-sm font-semibold text-[#101828] shadow-sm transition-colors hover:bg-[#F9FAFB] ${action === 'cancel' && showPayout ? 'cursor-not-allowed opacity-50 hover:bg-white' : ''}`}
															>
																{cancellingId === booking.id ? 'Cancelling…' : actionLabel[action]}
															</button>
													);
												})}
											</div>
										</div>
									</div>
								))
							) : (
								<div role="row" className={`grid px-5 py-10 ${showPayout ? 'grid-cols-6' : 'grid-cols-4'}`}>
									<div role="cell" className="text-center text-sm text-gray-500">
										No {tabList.find((tab) => tab.value === activeTab)?.label.toLowerCase()} bookings found.
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* View Modal */}
			{selectedBooking && <BookingModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}

			{/* Reschedule Modal */}
			{rescheduleBooking && (
				<div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
					<div
						className="absolute inset-0 bg-slate-950/35 backdrop-blur-[2px]"
						onClick={() => {
							setRescheduleBooking(null);
							setSelectedSlotKey('');
							setProposedDate('');
							setProposedTime('');
						}}
					/>

					<div className="relative z-10 w-full max-w-[620px] rounded-[28px] bg-white px-5 py-5 shadow-2xl sm:px-8 sm:py-8">
						<button
							type="button"
							onClick={() => {
								setRescheduleBooking(null);
								setSelectedSlotKey('');
								setProposedDate('');
								setProposedTime('');
							}}
							aria-label="Close"
							className="absolute right-5 top-5 rounded-full p-2 text-slate-800 transition hover:bg-slate-100 sm:right-6 sm:top-6"
						>
							<X className="h-6 w-6" />
						</button>

						<div className="flex items-start justify-between gap-4 pr-10">
							<h3 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-[26px]">
								Reschedule Booking
							</h3>
							<div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF4FF] text-[#2D5BC8]">
								<CalendarDays className="h-5 w-5" />
							</div>
						</div>

						<div className="mt-8 max-h-[calc(100%-120px)] overflow-y-auto pr-1">
							<div className="space-y-7">
								{rescheduleGroups.map((group, groupIndex) => (
									<section key={group.label}>
										<h4 className="text-lg font-semibold text-slate-700">
											{group.label}
										</h4>

										<div className="mt-4 space-y-3">
											{group.slots.map((slot) => {
												const isSelected = selectedSlotKey === slot.key;
												return (
													<button
														key={slot.key}
														type="button"
														onClick={() => {
															setSelectedSlotKey(slot.key);
															setProposedDate(slot.date.toISOString().split('T')[0]);
															setProposedTime(slot.time);
														}}
														className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left transition ${
															isSelected
																? 'border-[#5B84E8] bg-[#EAF3FF] shadow-[0_0_0_1px_rgba(91,132,232,0.14)]'
																: 'border-[#DDE5F3] bg-white hover:bg-[#F8FAFF]'
														}`}
													>
														<span className={`text-base font-medium ${isSelected ? 'text-[#2D5BC8]' : 'text-[#4A5568]'}`}>
															{slot.displayTime}
														</span>
														<span className={`text-base font-semibold ${isSelected ? 'text-[#2D5BC8]' : 'text-[#525252]'}`}>
															{slot.price} <span className="font-medium text-[#6B7280]">/ {slot.duration}</span>
														</span>
													</button>
												);
											})}
										</div>

										{groupIndex < rescheduleGroups.length - 1 ? <div className="mt-7" /> : null}
									</section>
								))}
							</div>

							<div className="mt-8 border-t border-slate-100 pt-6">
								<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
									<div>
										<div className="text-2xl font-semibold tracking-tight text-slate-950">
											{rescheduleDetail?.BookerName || rescheduleBooking.client}
										</div>
										<div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-600">
											{rescheduleBooking.phone ? (
												<span className="inline-flex items-center gap-2">
													<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
														<path d="M8 3C8.5 3 10.5 7.5 10.5 8C10.5 9 9 10 8.5 11C8 12 9 13 10 14C10.39 14.39 12 16 13 15.5C14 15 15 13.5 16 13.5C16.5 13.5 21 15.5 21 16C21 18 19.5 19.5 18 20C16.5 20.5 15.5 20.5 13.5 20C11.5 19.5 10 19 7.5 16.5C5 14 4.5 12.5 4 10.5C3.5 8.5 3.5 7.5 4 6C4.5 4.5 6 3 8 3Z" stroke="#667085" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
													</svg>
													{rescheduleBooking.phone}
												</span>
											) : null}
											{rescheduleBooking.phone && rescheduleDetail?.Email ? <span className="hidden sm:inline">•</span> : null}
											{rescheduleDetail?.Email ? (
												<span className="inline-flex items-center gap-2">
													<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
														<path d="M18.75 3.75L9.58 13.13L0.41 3.75" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
														<path d="M18.75 3.75H0.41V17.08H18.75V3.75Z" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													</svg>
													{rescheduleDetail.Email}
												</span>
											) : null}
										</div>
									</div>

									<div className="text-sm text-slate-700 sm:text-right">
										Booking ID: <span className="font-medium">{rescheduleDetail?.Id || rescheduleBooking.id}</span>
									</div>
								</div>

								<div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
									<button
										type="button"
										onClick={() => {
											setRescheduleBooking(null);
											setSelectedSlotKey('');
											setProposedDate('');
											setProposedTime('');
										}}
										className="h-12 rounded-lg border border-slate-200 bg-white px-6 text-base font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:w-[110px]"
									>
										Cancel
									</button>
										<button
											type="button"
											onClick={handleReschedule}
											disabled={!proposedDate || !proposedTime}
											className="h-12 rounded-lg bg-[#2D5BC8] px-6 text-base font-semibold text-white shadow-sm transition hover:bg-[#244DAE] disabled:cursor-not-allowed disabled:bg-[#A9BEEB] sm:w-[177px]"
										>
											{loadingRescheduleDetail ? 'Loading…' : 'Save reschedule'}
										</button>
									</div>
								</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default BookingTable;

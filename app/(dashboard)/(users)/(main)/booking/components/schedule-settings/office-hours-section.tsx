import React from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import { WEEKDAYS } from './constants';
import InfoTooltip from './info-tooltip';
import TimeInput from './time-input';
import type { OfficeHours, Slot } from './types';

interface OfficeHoursSectionProps {
	officeHours: OfficeHours;
	pauseAvailability: boolean;
	leadTime: string;
	bufferTime: string;
	onPauseAvailabilityChange: (value: boolean) => void;
	onLeadTimeChange: (value: string) => void;
	onBufferTimeChange: (value: string) => void;
	onToggleDayEnabled: (day: string) => void;
	onAddSlot: (day: string) => void;
	onRemoveSlot: (day: string, index: number) => void;
	onUpdateSlot: (day: string, index: number, field: 'start' | 'end', value: string) => void;
}

export default function OfficeHoursSection({
	officeHours,
	pauseAvailability,
	leadTime,
	bufferTime,
	onPauseAvailabilityChange,
	onLeadTimeChange,
	onBufferTimeChange,
	onToggleDayEnabled,
	onAddSlot,
	onRemoveSlot,
	onUpdateSlot,
}: OfficeHoursSectionProps) {
	return (
		<div className="rounded-2xl shadow-border p-6">
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<h3 className="text-base font-semibold text-[#101828]">Set Your Office Hours</h3>
				<div className="flex items-center gap-3 text-sm text-[#667085]">
					<span>Pause availability</span>
					<button
						onClick={() => onPauseAvailabilityChange(!pauseAvailability)}
						aria-pressed={pauseAvailability}
						className={`h-6 w-10 rounded-full p-0.5 transition-colors ${pauseAvailability ? 'bg-omblue-500' : 'bg-[#686B8E]'}`}
						type="button"
					>
						<span className={`block h-5 w-5 rounded-full bg-white transition-transform ${pauseAvailability ? 'translate-x-4' : 'translate-x-0'}`} />
					</button>
				</div>
			</div>

			<div className="mt-6 space-y-5">
				{WEEKDAYS.map((day) => {
					const dayState = officeHours[day];

					return (
						<div key={day} className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)] xl:items-start">
							<div className="text-base text-[#344054]">
								<label className="inline-flex items-center gap-3">
									<button
										type="button"
										onClick={() => onToggleDayEnabled(day)}
										aria-pressed={dayState.enabled}
										className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors ${
											dayState.enabled ? 'border-[#2D5BC8] bg-[#2D5BC8] text-white' : 'border-[#D0D5DD] bg-white text-transparent'
										}`}
									>
										<Check className="h-5 w-5" strokeWidth={3} />
									</button>
									<span>{day}</span>
								</label>
							</div>

							<div className="flex flex-1 flex-col gap-3">
								{dayState.enabled ? (
									dayState.slots.map((slot: Slot, index: number) => (
										<div key={index} className="grid gap-3 lg:grid-cols-[150px_18px_150px_36px_36px] lg:items-center">
											<TimeInput value={slot.start} onChange={(value) => onUpdateSlot(day, index, 'start', value)} />
											<span className="hidden text-center text-sm leading-none text-[#667085] lg:block">-</span>
											<TimeInput value={slot.end} placeholder="To" onChange={(value) => onUpdateSlot(day, index, 'end', value)} />
											<button
												type="button"
												onClick={() => onRemoveSlot(day, index)}
												aria-label={`Remove ${day} office hours`}
												className="flex h-6 w-6 items-center justify-center rounded-lg text-[#101828] transition hover:bg-slate-100"
											>
												<Trash2 className="h-5 w-5" strokeWidth={2.2} />
											</button>
											{index === 0 ? (
												<button
													type="button"
													onClick={() => onAddSlot(day)}
													aria-label={`Add ${day} office hours`}
													className="flex h-5 w-5 items-center justify-center rounded-full border border-[#101828] text-[#101828] transition hover:bg-slate-100"
												>
													<Plus className="h-5 w-5" strokeWidth={2} />
												</button>
											) : (
												<span className="hidden h-9 w-9 lg:block" />
											)}
										</div>
									))
								) : (
									<div className="flex items-center gap-4 text-base text-[#101828]">
										<span>Unavailable</span>
										<button
											type="button"
											onClick={() => onAddSlot(day)}
											aria-label={`Add ${day} office hours`}
											className="flex h-5 w-5 items-center justify-center rounded-full border border-[#101828] text-[#101828] transition hover:bg-slate-100"
										>
											<Plus className="h-5 w-5" strokeWidth={2} />
										</button>
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>

			<div className="grid grid-cols-2 gap-6 items-center mt-4">
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<div className="text-sm font-semibold">Lead time</div>
						<InfoTooltip
							text="The minimum notice required before someone can book a meeting with you."
							example="If your lead time is set to 24 hours, users cannot book a meeting starting within the next 24 hours."
						/>
					</div>
					<div className="flex items-center gap-3">
						<input placeholder="-" value={leadTime} onChange={(event) => onLeadTimeChange(event.target.value)} className="rounded-md border px-3 py-2 text-sm w-40" />
					</div>
				</div>

				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<div className="text-sm font-semibold">Buffer time</div>
						<InfoTooltip
							text="Extra time automatically blocked before or after meetings to avoid back-to-back bookings."
							example="If your buffer time is 30 minutes, a 1:00 PM meeting will block nearby slots so you have preparation or break time before the next booking."
						/>
					</div>
					<div className="flex items-center rounded-md border px-3 py-2 text-sm w-60">
						<input type="number" value={bufferTime} onChange={(event) => onBufferTimeChange(event.target.value)} className="focus:outline-none" />
						<div className="text-sm text-[#667085]">minutes</div>
					</div>
				</div>
				<div />
			</div>
		</div>
	);
}

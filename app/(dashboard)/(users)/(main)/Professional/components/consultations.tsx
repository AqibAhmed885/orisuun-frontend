"use client"
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Calendar from './calendar'
import InviteSection from './InviteSection'
import ConsultationDiscussion from './ConsultationDiscussion'
import { matchesProviderMeetingType } from '@/utils/providerBookingApi'
import { setBookingDraft } from '@/data/slices/booking-slice'
import { resolveBookingProvider } from '@/utils/booking-provider'
import type { AppDispatch } from '@/data/store'
import {
    selectSelectedConsultationType,
    setSelectedConsultationType,
    type ConsultationType,
} from '@/data/slices/profile-view-slice'
import { useProfileProviderSetup } from '@/hooks/useProfileViewState'

type PlanTab = ConsultationType

function parseDurationOptions(settings: any) {
    if (Array.isArray(settings?.DurationOptions)) return settings.DurationOptions
    if (typeof settings?.DurationOptionsJson === 'string' && settings.DurationOptionsJson.trim()) {
        try {
            const parsed = JSON.parse(settings.DurationOptionsJson)
            return Array.isArray(parsed) ? parsed : []
        } catch {
            return []
        }
    }
    return []
}

function splitIncluded(value?: string | null) {
    if (!value?.trim()) return []
    return value
        .split(/\r?\n|•|;/)
        .map(item => item.trim())
        .filter(Boolean)
}

function pad2(value: number) {
    return String(value).padStart(2, '0')
}

function formatApiDateTime(date: Date) {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(date.getHours())}:${pad2(date.getMinutes())}:00.000Z`
}

function parseLocalDate(value: string) {
    if (!value) return null

    // Calendar normally sends YYYY-MM-DD. Adding T00:00 keeps it in local time
    // instead of letting the browser interpret the value as UTC.
    const parsed = /^\d{4}-\d{2}-\d{2}$/.test(value)
        ? new Date(`${value}T00:00:00`)
        : new Date(value)

    return Number.isNaN(parsed.getTime()) ? null : parsed
}

function formatDateKey(date: Date) {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

function timeToMinutes(value?: string | null) {
    const [hours = 0, minutes = 0] = (value ?? '00:00').substring(0, 5).split(':').map(Number)
    return (hours * 60) + minutes
}

function minutesToTime(totalMinutes: number) {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${pad2(hours)}:${pad2(minutes)}`
}

function formatTime12Hour(value: string) {
    const [hours, minutes] = value.split(':').map(Number)
    const suffix = hours >= 12 ? 'PM' : 'AM'
    const hour12 = hours % 12 || 12
    return `${hour12}:${pad2(minutes)} ${suffix}`
}

function dateWithTime(dateValue: string, time: string) {
    const date = parseLocalDate(dateValue) ?? new Date()
    const [hours, minutes] = time.split(':').map(Number)
    date.setHours(hours, minutes, 0, 0)
    return date
}

const Consultations = ({ profileData }: any) => {
    const [advisoryPlan, setAdvisoryPlan] = useState('')
    const [duration, setDuration] = useState<number | null>(null)
    const [selectedDates, setSelectedDates] = useState<string[]>([])
    const [selectedSlot, setSelectedSlot] = useState<any>(null)
    const [selectedAdvisorySlots, setSelectedAdvisorySlots] = useState<any[]>([])
    const [inviteEmails, setInviteEmails] = useState<string[]>([])
    const [notes, setNotes] = useState('')
    const [referralDocumentUrls, setReferralDocumentUrls] = useState<string[]>([])
    const [selectedTopic, setSelectedTopic] = useState('')
    const dispatch = useDispatch<AppDispatch>()
    const selectedConsultationType = useSelector(selectSelectedConsultationType)
    const planTab: PlanTab = selectedConsultationType ?? 'one-time'
    const providerUserId = profileData?.UserId || profileData?.userId
    const { providerSetup, isLoadingProviderSetup: isLoadingAvailability } =
        useProfileProviderSetup(providerUserId)
    const router = useRouter()

    useEffect(() => {
        if (!providerSetup) return

        const firstDuration = parseDurationOptions(providerSetup.Settings)?.[0]?.DurationMinutes
        const firstPkgDuration = providerSetup.MeetingTypes
            ?.find(mt => mt.IsActive !== false && matchesProviderMeetingType(mt.MeetingType, 'One Time Video Consultation'))
            ?.Packages?.find(p => p.IsActive !== false && p.DurationMinutes)?.DurationMinutes
        setDuration(firstDuration || firstPkgDuration || null)

        const firstAdvisoryPackage = providerSetup.MeetingTypes
            ?.find(mt => mt.IsActive !== false && matchesProviderMeetingType(mt.MeetingType, 'Ongoing Advisory Plan'))
            ?.Packages?.find(p => p.IsActive !== false)
        setAdvisoryPlan(firstAdvisoryPackage?.Id ?? '')
    }, [providerSetup])

    const oneTimeMeetingType = useMemo(
        () => providerSetup?.MeetingTypes?.find(
            mt => mt.IsActive !== false && matchesProviderMeetingType(mt.MeetingType, 'One Time Video Consultation')
        ),
        [providerSetup]
    )

    const advisoryMeetingType = useMemo(
        () => providerSetup?.MeetingTypes?.find(
            mt => mt.IsActive !== false && matchesProviderMeetingType(mt.MeetingType, 'Ongoing Advisory Plan')
        ),
        [providerSetup]
    )

    const taskMeetingType = useMemo(
        () => providerSetup?.MeetingTypes?.find(
            mt => mt.IsActive !== false && matchesProviderMeetingType(mt.MeetingType, 'Topic-Specific Consultations')
        ),
        [providerSetup]
    )

    const availablePlanTabs = useMemo(() => {
        const tabs: PlanTab[] = []
        if (oneTimeMeetingType) tabs.push('one-time')
        if (advisoryMeetingType) tabs.push('advisory')
        if (taskMeetingType) tabs.push('task')
        return tabs
    }, [advisoryMeetingType, oneTimeMeetingType, taskMeetingType])

    useEffect(() => {
        if (!availablePlanTabs.length) return
        if (selectedConsultationType && availablePlanTabs.includes(selectedConsultationType)) return

        dispatch(setSelectedConsultationType(availablePlanTabs[0]))
    }, [availablePlanTabs, dispatch, selectedConsultationType])

    const setPlanTab = (tab: PlanTab) => {
        dispatch(setSelectedConsultationType(tab))
    }

    const topicGroups = useMemo(
        () => taskMeetingType?.Topics?.filter(topic => topic.IsActive !== false).map(topic => topic.TopicName) ?? [],
        [taskMeetingType]
    )

    const durations = useMemo(() => {
        const durationOptions = parseDurationOptions(providerSetup?.Settings)
        if (durationOptions.length) {
            return durationOptions
                .filter((option: any) => option.DurationMinutes && option.Price !== undefined)
                .map((option: any) => ({ mins: Number(option.DurationMinutes), price: Number(option.Price) }))
                .sort((a, b) => a.mins - b.mins)
        }

        const oneTimePkgs = oneTimeMeetingType?.Packages?.filter(p => p.IsActive !== false && p.DurationMinutes) ?? []
        return oneTimePkgs
            .map(p => ({ mins: p.DurationMinutes as number, price: Number(p.Price) }))
            .sort((a, b) => a.mins - b.mins)
    }, [oneTimeMeetingType, providerSetup])

    const advisoryPlans = useMemo(() => {
        const apiPkgs = advisoryMeetingType?.Packages?.filter(p => p.IsActive !== false) ?? []
        return apiPkgs.map(pkg => ({
            key: pkg.Id,
            title: pkg.PackageName,
            price: `$${Number(pkg.Price).toFixed(2)}`,
            rawPrice: Number(pkg.Price),
            subtitle: pkg.SessionCount ? `${pkg.SessionCount} Sessions` : 'Advisory plan',
            included: splitIncluded(pkg.WhatsIncluded),
            durationLabel: pkg.DurationMinutes ? `${pkg.DurationMinutes} min` : 'Advisory plan',
            durationMinutes: Number(pkg.DurationMinutes ?? 60),
            packageId: pkg.Id,
            sessionCount: pkg.SessionCount,
        }))
    }, [advisoryMeetingType])

    const selectedAdvisory = advisoryPlans.find(plan => plan.key === advisoryPlan) ?? advisoryPlans[0]

    const advisorySessionLimit = Math.max(1, Number(selectedAdvisory?.sessionCount ?? 1))

    const toggleAdvisorySlot = (slot: any) => {
        setSelectedAdvisorySlots(prev => {
            const alreadySelected = prev.some(item => item.id === slot.id)

            // Allow a selected session to be deselected at any time.
            if (alreadySelected) {
                return prev.filter(item => item.id !== slot.id)
            }

            // Do not allow more sessions than the selected advisory package includes.
            if (prev.length >= advisorySessionLimit) {
                return prev
            }

            return [...prev, slot]
        })
    }

    const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    const activeOfficeHours = useMemo(
        () => providerSetup?.OfficeHours?.filter(oh => oh.IsActive) ?? [],
        [providerSetup]
    )

    const availableSlots = useMemo(() => {
        if (!activeOfficeHours.length || !selectedDates.length) return []

        const slotDuration = planTab === 'advisory'
            ? Number(selectedAdvisory?.durationMinutes ?? 60)
            : Number(duration ?? 30)

        if (!slotDuration || slotDuration <= 0) return []

        const currentPrice = planTab === 'advisory'
            ? selectedAdvisory?.rawPrice ?? 0
            : durations.find(d => d.mins === duration)?.price ?? 0

        return selectedDates.flatMap((selectedDate) => {
            const date = parseLocalDate(selectedDate)
            if (!date) return []

            const dayOfWeek = date.getDay()
            const dayName = DAY_NAMES[dayOfWeek] ?? `Day ${dayOfWeek}`
            const dateKey = formatDateKey(date)

            return activeOfficeHours
                .filter(oh => oh.DayOfWeek === dayOfWeek)
                .flatMap(oh => {
                    const officeStart = timeToMinutes(oh.StartTime)
                    const officeEnd = timeToMinutes(oh.EndTime)
                    const slots = []

                    // Contiguous slots:
                    // 09:00-09:15, 09:15-09:30, 09:30-09:45, ...
                    for (
                        let start = officeStart;
                        start + slotDuration <= officeEnd;
                        start += slotDuration
                    ) {
                        const end = start + slotDuration
                        const timeFrom = minutesToTime(start)
                        const timeTo = minutesToTime(end)

                        slots.push({
                            id: `${dateKey}-${oh.Id ?? dayOfWeek}-${timeFrom}-${timeTo}`,
                            date: dateKey,
                            day: dayName,
                            timeFrom,
                            timeTo,
                            timeFromLabel: formatTime12Hour(timeFrom),
                            timeToLabel: formatTime12Hour(timeTo),
                            price: currentPrice,
                        })
                    }

                    return slots
                })
        })
    }, [
        activeOfficeHours,
        selectedDates,
        duration,
        durations,
        planTab,
        selectedAdvisory?.durationMinutes,
        selectedAdvisory?.rawPrice,
    ])

    const availableDayNumbers = useMemo(() => [], []);
    const availableDaysOfWeek = useMemo(() =>
        [...new Set((providerSetup?.OfficeHours ?? []).filter(oh => oh.IsActive).map(oh => oh.DayOfWeek))]
        , [providerSetup]);
    const handleBook = () => {
        const providerUserId = profileData?.UserId || profileData?.userId || ''
        const providerTeamId = profileData?.TeamId || profileData?.teamId || undefined

        let meetingTypeId = ''
        let packageId = ''
        let topicId = ''
        let price = 0
        let durationMins = duration ?? 30
        let planLabel = ''

        if (planTab === 'advisory') {
            const mt = advisoryMeetingType
            meetingTypeId = mt?.Id ?? ''
            packageId = selectedAdvisory?.packageId ?? ''
            price = selectedAdvisory?.rawPrice ?? 0
            durationMins = Number(selectedAdvisory?.durationMinutes ?? 60)
            planLabel = `Advisory Plan - ${selectedAdvisory?.title ?? ''}`
        } else if (planTab === 'task') {
            const mt = taskMeetingType
            meetingTypeId = mt?.Id ?? ''
            const topic = mt?.Topics?.find(item => item.TopicName === selectedTopic)
            topicId = topic?.Id ?? ''
            price = durations.find(d => d.mins === durationMins)?.price ?? Number(topic?.Price ?? 0)
            planLabel = `Task-specific${topic ? ` - ${topic.TopicName}` : ''}`
        } else {
            const mt = oneTimeMeetingType
            meetingTypeId = mt?.Id ?? ''
            const pkg = mt?.Packages?.find(p => p.DurationMinutes === durationMins)
            packageId = pkg?.Id ?? ''
            price = pkg?.Price ?? durations.find(d => d.mins === durationMins)?.price ?? 0
            planLabel = `One-time · ${durationMins} min`
        }

        const slot = planTab === 'advisory'
            ? selectedAdvisorySlots[0] ?? null
            : selectedSlot

        const startDate = slot?.date
            ? dateWithTime(slot.date, slot.timeFrom)
            : new Date()
        const startISO = formatApiDateTime(startDate)
        const endDate = new Date(startDate)
        endDate.setMinutes(endDate.getMinutes() + durationMins)
        const endISO = formatApiDateTime(endDate)

        const advisoryScheduledSessions = planTab === 'advisory'
            ? selectedAdvisorySlots.map(sessionSlot => {
                const sessionStart = dateWithTime(sessionSlot.date, sessionSlot.timeFrom)
                const sessionEnd = new Date(sessionStart)
                sessionEnd.setMinutes(sessionEnd.getMinutes() + durationMins)

                return {
                    id: sessionSlot.id,
                    date: sessionSlot.date,
                    day: sessionSlot.day,
                    timeFrom: sessionSlot.timeFrom,
                    timeTo: sessionSlot.timeTo,
                    scheduledStartTime: formatApiDateTime(sessionStart),
                    scheduledEndTime: formatApiDateTime(sessionEnd),
                }
            })
            : []

        // Keep the existing first scheduledStartTime/scheduledEndTime fields for
        // backwards compatibility, and also carry all advisory sessions.
        const bookingDraft: any = {
            providerUserId,
            providerTeamId,
            ...resolveBookingProvider(profileData),
            meetingType: planTab === 'advisory'
                ? 'Ongoing Advisory Plan'
                : planTab === 'task'
                    ? 'Topic-Specific Consultations'
                    : 'One Time Video Consultation',
            meetingTypeId,
            packageId,
            topicId,
            durationMinutes: durationMins,
            scheduledDay: slot?.day ?? '',
            scheduledStartTime: startISO,
            scheduledEndTime: endISO,
            basePrice: Number(price),
            totalPrice: Number(price),
            currency: providerSetup?.Settings?.Currency || 'USD',
            cancellationWindowHours: Number(providerSetup?.Settings?.CancellationWindowHours ?? 24),
            cancellationFeePercentage: Number(providerSetup?.Settings?.CancellationFeePercentage ?? 0),
            meetingPurpose: notes,
            planLabel,
            inviteEmails,
            referralDocumentUrls,
            advisoryScheduledSessions,
            selectedSessionCount: advisoryScheduledSessions.length,
            includedSessionCount: planTab === 'advisory' ? advisorySessionLimit : 1,
        }

        dispatch(setBookingDraft(bookingDraft))

        router.push('/booking/checkout')
    }

    const toggleTopic = (topic: string) => {
        setSelectedTopic(prev => prev === topic ? '' : topic)
    }

    const toggleDate = (dateString: string) => {
        setSelectedDates(prev => (
            prev.includes(dateString) ? prev.filter(date => date !== dateString) : [...prev, dateString]
        ))
    }

    useEffect(() => {
        setSelectedSlot(null)
    }, [duration, planTab, selectedDates])

    // Reset advisory selections whenever the package, tab, or selected dates change.
    useEffect(() => {
        setSelectedAdvisorySlots([])
    }, [advisoryPlan, planTab, selectedDates])

    // Advisory plans start with one slot selected by default.
    // This only runs when availability itself changes, so the member can still
    // manually deselect the default slot and leave zero selected.
    useEffect(() => {
        if (
            planTab === 'advisory' &&
            availableSlots.length > 0 &&
            selectedAdvisorySlots.length === 0
        ) {
            setSelectedAdvisorySlots([availableSlots[0]])
        }
        // Intentionally do not depend on selectedAdvisorySlots: after the user
        // deselects the default slot, we must not immediately select it again.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [availableSlots, advisoryPlan, planTab])


    const handleAttachmentsChange = useCallback((attachments: { url?: string }[]) => {
        setReferralDocumentUrls(attachments.map((attachment) => attachment.url).filter((url): url is string => Boolean(url)))
    }, [])

    if (isLoadingAvailability) {
        return (
            <div
                className="w-full rounded-[18px] border border-gray-200 bg-white p-4"
                role="status"
                aria-label="Loading booking availability"
            >
                <div className="animate-pulse">
                    <div className="h-7 w-44 rounded-md bg-gray-200" />

                    <div className="mt-5 flex gap-3 border-b border-gray-100 pb-6">
                        {[0, 1, 2].map(item => (
                            <div key={item} className="h-12 flex-1 rounded-2xl bg-gray-200" />
                        ))}
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="h-64 rounded-2xl bg-gray-100" />
                        <div className="space-y-3">
                            <div className="mb-4 h-6 w-32 rounded-md bg-gray-200" />
                            {[0, 1, 2].map(item => (
                                <div key={item} className="h-16 rounded-[18px] bg-gray-100" />
                            ))}
                        </div>
                    </div>
                </div>
                <span className="sr-only">Loading booking availability...</span>
            </div>
        )
    }

    if (!activeOfficeHours.length) {
        return (
            <div className="w-full rounded-[18px] border border-gray-200 bg-white flex items-center justify-center p-4 min-h-[240px]">
                <div className="text-lg text-center  text-slate-600">
                    Booking is not available at this time. <br /> Please check back later or contact the provider for assistance.
                </div>
            </div>
        )
    }

    if (!availablePlanTabs.length) {
        return (
            <div className="w-full bg-white p-3.5 h-[240px] rounded-[18px] border border-gray-200">
                <div className="text-sm text-slate-600">
                    This provider has not configured booking options yet.
                </div>
            </div>
        )
    }

    return (
        <div className=" w-full">
            <div className="bg-white p-3.5 rounded-[18px] border border-gray-200">
                <h2 className="text-2xl font-semibold mb-4">Book a meeting</h2>

                {/* Top tabs */}
                <div className="flex gap-3 mb-4 text-base font-semibold">
                    {availablePlanTabs.includes('one-time') && (
                        <button onClick={() => setPlanTab('one-time')} className={`px-4 py-3 rounded-[18px] w-48 border ${planTab === 'one-time' ? 'bg-[#D2EBFF] border-olblue-200' : 'bg-white border-gray-200'}`}>One-time</button>
                    )}
                    {availablePlanTabs.includes('advisory') && (
                        <button onClick={() => setPlanTab('advisory')} className={`px-4 py-3 rounded-[18px] w-48 border ${planTab === 'advisory' ? 'bg-[#D2EBFF] border-olblue-200' : 'bg-white border-gray-200'}`}>Advisory plan</button>
                    )}
                    {availablePlanTabs.includes('task') && (
                        <button onClick={() => setPlanTab('task')} className={`px-4 py-3 rounded-[18px] w-48 border ${planTab === 'task' ? 'bg-[#D2EBFF] border-olblue-200' : 'bg-white border-gray-200'}`}>Task-specific</button>
                    )}
                </div>

                {!availablePlanTabs.length && (
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-slate-600">
                        This provider has not configured booking options yet.
                    </div>
                )}

                {planTab === 'task' && (
                    <div className="mb-6 border-b pb-6">
                        <div className="text-base font-semibold mb-3">
                            Select specific topics
                        </div>
                        {/* {topicGroups.length > 0 ? <div className="relative max-w-md mb-4">
                            <select
                                value={selectedTopic}
                                onChange={(e) => {
                                    const value = e.currentTarget.value
                                    setSelectedTopic(value)
                                }}
                                className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900"
                            >
                                <option value="" disabled>Select specific topics</option>
                                {topicGroups.map((topic) => (
                                    <option key={topic} value={topic}>{topic}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">⌄</div>
                        </div> : (
                            <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-slate-600">
                                No task-specific topics are currently available.
                            </div>
                        )} */}

                        <div className="flex flex-wrap gap-3">
                            {topicGroups.map((topic) => (
                                <button
                                    key={topic}
                                    onClick={() => toggleTopic(topic)}
                                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${selectedTopic === topic ? 'bg-[#D2EBFF] border-olblue-200' : 'bg-white border-gray-200 text-slate-700'}`}
                                >
                                    {topic}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {planTab === 'advisory' ? (
                    <>
                        {advisoryPlans.length > 0 ? <div className="flex gap-3 mb-6 border-b pb-6">
                            {advisoryPlans.map(plan => (
                                <button
                                    key={plan.key}
                                    onClick={() => setAdvisoryPlan(plan.key)}
                                    className={`flex-1 rounded-2xl border px-6 py-3 text-center transition ${advisoryPlan === plan.key ? 'bg-[#D2EBFF] border-olblue-200' : 'bg-white border-gray-200'}`}
                                >
                                    <div className="text-[18px] font-semibold leading-tight">{plan.title}</div>
                                    <div className="mt-1 flex items-center justify-center gap-3 text-sm">
                                        <span className="font-semibold text-slate-900">{plan.price}</span>
                                        <span className="text-slate-500">{plan.subtitle}</span>
                                    </div>
                                </button>
                            ))}
                        </div> : (
                            <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-slate-600">
                                No advisory packages are currently available.
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.7fr_0.7fr] gap-6 items-start">
                            <div>
                                <Calendar availableDayNumbers={availableDayNumbers} availableDaysOfWeek={availableDaysOfWeek} selectedDates={selectedDates} onToggleDate={toggleDate} />
                            </div>

                            <div className="pt-4">
                                <div className="text-base font-medium text-slate-900 mb-2">Ongoing Advisory Plan</div>
                                <div className="rounded-[18px] border border-[#D3E7FB] bg-gradient-to-t from-[#0094F0]/20 to-[#6CE0FF]/20 px-3 py-2 shadow-[0_1px_0_rgba(16,24,40,0.02)]">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D2EBFF] border border-[#B2DDFF]">
                                            <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.43612 0H3.74863C3.60946 4.67001e-06 3.47304 0.0387306 3.35462 0.111845C3.23621 0.18496 3.14047 0.28958 3.07812 0.414L0.078125 6.414H6.83263L8.43612 0Z" fill="url(#paint0_linear_356_26881)" />
                                                <path d="M14.166 6.414L12.5625 0H17.25C17.3892 4.67001e-06 17.5256 0.0387306 17.644 0.111845C17.7624 0.18496 17.8582 0.28958 17.9205 0.414L20.9205 6.414H14.166Z" fill="url(#paint1_linear_356_26881)" />
                                                <path d="M7.5225 0.5685C7.56299 0.406176 7.65658 0.262048 7.7884 0.159037C7.92022 0.056026 8.0827 4.62172e-05 8.25 0H12.75C12.9173 4.62172e-05 13.0798 0.056026 13.2116 0.159037C13.3434 0.262048 13.437 0.406176 13.4775 0.5685L14.9775 6.5685C14.9925 6.6285 15 6.689 15 6.75H6C6.00007 6.68881 6.00762 6.62786 6.0225 6.5685L7.5225 0.5685Z" fill="url(#paint2_linear_356_26881)" />
                                                <path d="M6.85228 6H0.28678L0.0797797 6.414C0.0149001 6.54318 -0.0112636 6.68836 0.00443739 6.83207C0.0201384 6.97577 0.0770351 7.11188 0.16828 7.224L9.91828 19.224C9.98736 19.3087 10.0741 19.3774 10.1725 19.425C10.2709 19.4727 10.3785 19.4983 10.4878 19.5C10.5972 19.5017 10.7055 19.4795 10.8054 19.435C10.9052 19.3904 10.9941 19.3245 11.0658 19.242L6.85228 6Z" fill="url(#paint3_linear_356_26881)" />
                                                <path d="M9.9375 19.242L14.151 6H20.7165L20.9235 6.414C20.9884 6.54318 21.0145 6.68836 20.9988 6.83207C20.9831 6.97577 20.9262 7.11188 20.835 7.224L11.085 19.224C11.0159 19.3087 10.9291 19.3774 10.8308 19.425C10.7324 19.4727 10.6248 19.4983 10.5154 19.5C10.4061 19.5017 10.2978 19.4795 10.1979 19.435C10.0981 19.3904 10.0092 19.3245 9.9375 19.242Z" fill="url(#paint4_linear_356_26881)" />
                                                <path d="M6.1647 6L6.0222 6.5685C5.98896 6.70204 5.99312 6.84216 6.0342 6.9735L9.7842 18.9735C9.83205 19.1258 9.92725 19.2588 10.0559 19.3533C10.1846 19.4477 10.3401 19.4986 10.4997 19.4986C10.6593 19.4986 10.8148 19.4477 10.9435 19.3533C11.0721 19.2588 11.1673 19.1258 11.2152 18.9735L14.9652 6.9735C15.0063 6.84216 15.0104 6.70204 14.9772 6.5685L14.8347 6H6.1647Z" fill="url(#paint5_linear_356_26881)" />
                                                <path d="M3.75028 1.44917e-06C3.61111 6.11918e-06 3.47469 0.038732 3.35628 0.111847C3.23786 0.184961 3.14213 0.289581 3.07978 0.414001L0.0797797 6.414C0.0149001 6.54318 -0.0112636 6.68836 0.00443739 6.83207C0.0201384 6.97577 0.0770351 7.11188 0.16828 7.224L9.91828 19.224C9.9886 19.3105 10.0773 19.3803 10.178 19.4282C10.2787 19.4761 10.3888 19.501 10.5003 19.501C10.6118 19.501 10.7219 19.4761 10.8225 19.4282C10.9232 19.3803 11.012 19.3105 11.0823 19.224L20.8323 7.224C20.9238 7.11203 20.9809 6.976 20.9969 6.83229C21.0129 6.68858 20.987 6.54332 20.9223 6.414L17.9223 0.414001C17.8598 0.289353 17.7638 0.184582 17.6451 0.111452C17.5264 0.0383221 17.3897 -0.000272583 17.2503 1.44917e-06H3.75028Z" fill="url(#paint6_linear_356_26881)" fill-opacity="0.7" />
                                                <defs>
                                                    <linearGradient id="paint0_linear_356_26881" x1="7.24212" y1="-2.673" x2="3.76812" y2="5.64" gradientUnits="userSpaceOnUse">
                                                        <stop stop-color="#9FF0F9" />
                                                        <stop offset="1" stop-color="#29C3FF" />
                                                    </linearGradient>
                                                    <linearGradient id="paint1_linear_356_26881" x1="15.5475" y1="-2.31181e-08" x2="19.506" y2="9.948" gradientUnits="userSpaceOnUse">
                                                        <stop stop-color="#0FAFFF" />
                                                        <stop offset="1" stop-color="#102784" />
                                                    </linearGradient>
                                                    <linearGradient id="paint2_linear_356_26881" x1="10.5" y1="0" x2="10.5" y2="8.4375" gradientUnits="userSpaceOnUse">
                                                        <stop stop-color="#3BD5FF" />
                                                        <stop offset="1" stop-color="#367AF2" />
                                                    </linearGradient>
                                                    <linearGradient id="paint3_linear_356_26881" x1="1.95328" y1="3.3" x2="10.2273" y2="19.26" gradientUnits="userSpaceOnUse">
                                                        <stop stop-color="#0094F0" />
                                                        <stop offset="1" stop-color="#6CE0FF" />
                                                    </linearGradient>
                                                    <linearGradient id="paint4_linear_356_26881" x1="23.607" y1="-0.75" x2="11.2785" y2="17.742" gradientUnits="userSpaceOnUse">
                                                        <stop stop-color="#1B44B1" />
                                                        <stop offset="1" stop-color="#2052CB" />
                                                    </linearGradient>
                                                    <linearGradient id="paint5_linear_356_26881" x1="10.4937" y1="1.275" x2="10.4937" y2="19.5" gradientUnits="userSpaceOnUse">
                                                        <stop stop-color="#2052CB" />
                                                        <stop offset="1" stop-color="#0FAFFF" />
                                                    </linearGradient>
                                                    <linearGradient id="paint6_linear_356_26881" x1="-2.13272" y1="-18.363" x2="14.6463" y2="21.0795" gradientUnits="userSpaceOnUse">
                                                        <stop offset="0.533" stop-color="#FF6CE8" stop-opacity="0" />
                                                        <stop offset="1" stop-color="#FF6CE8" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>


                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-lg font-medium leading-tight text-slate-700">
                                                Advisory plan
                                            </div>
                                            <div className="mt-1 text-xs leading-tight text-slate-700">
                                                <span className="font-semibold text-slate-900">
                                                    {selectedAdvisory?.price ?? '$0.00'}</span>
                                                <span className="ml-2 text-slate-600">/ {selectedAdvisory?.title ?? 'Advisory plan'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 text-sm font-semibold text-slate-900">What&apos;s included:</div>
                                <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
                                    {(selectedAdvisory?.included ?? []).length > 0 ? selectedAdvisory?.included.map((item) => (
                                        <li key={item} className="flex gap-2 ">
                                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-2">
                                                <path d="M5.56651 0.209136C5.70046 0.0752264 5.88212 0 6.07152 0C6.26093 0 6.44258 0.0752264 6.57653 0.209136L9.79086 3.42347C9.92477 3.55742 10 3.73907 10 3.92848C10 4.11788 9.92477 4.29954 9.79086 4.43349L6.57653 7.64782C6.44181 7.77794 6.26138 7.84993 6.07409 7.84831C5.88681 7.84668 5.70765 7.77156 5.57521 7.63912C5.44278 7.50668 5.36766 7.32753 5.36603 7.14024C5.3644 6.95296 5.4364 6.77252 5.56651 6.63781L7.50011 4.64278H0.714297C0.524853 4.64278 0.343169 4.56752 0.209213 4.43356C0.075256 4.29961 0 4.11792 0 3.92848C0 3.73904 0.075256 3.55735 0.209213 3.4234C0.343169 3.28944 0.524853 3.21418 0.714297 3.21418H7.50011L5.56651 1.21915C5.4326 1.0852 5.35738 0.90355 5.35738 0.714144C5.35738 0.524738 5.4326 0.343087 5.56651 0.209136Z" fill="#3C413F" />
                                            </svg>
                                            <span>{item}</span>
                                        </li>
                                    )) : (
                                        <li className="text-slate-500">No included details provided.</li>
                                    )}
                                </ul>
                            </div>

                            <div className="pt-4 ">
                                <div className="mb-2 flex items-center justify-between gap-2">
                                    <div className="text-base font-medium text-slate-900">Available slots</div>
                                    <div className="text-base font-medium text-slate-900">
                                        {selectedAdvisorySlots.length}/{advisorySessionLimit} selected
                                    </div>
                                </div>
                                {/* <div className="mb-3 text-xs text-slate-500">
                                    Select up to {advisorySessionLimit} session{advisorySessionLimit === 1 ? '' : 's'} included in this plan.
                                </div> */}
                                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                    {!selectedDates.length && (
                                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-slate-600">
                                            Select one or more dates to see available time slots.
                                        </div>
                                    )}
                                    {!!selectedDates.length && !availableSlots.length && (
                                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-slate-600">
                                            No slots are available for the selected date(s).
                                        </div>
                                    )}
                                    {availableSlots.map((s: any) => {
                                        const isSelected = selectedAdvisorySlots.some(slot => slot.id === s.id)
                                        const selectionLimitReached =
                                            !isSelected && selectedAdvisorySlots.length >= advisorySessionLimit

                                        return (
                                            <button
                                                key={s.id}
                                                onClick={() => toggleAdvisorySlot(s)}
                                                aria-pressed={isSelected}
                                                title={selectionLimitReached
                                                    ? `This plan includes ${advisorySessionLimit} sessions`
                                                    : undefined}
                                                className={`w-full rounded-[18px] border px-4 py-2 text-left transition ${isSelected
                                                        ? 'bg-[#D8ECFF] border-[#B6D8FA]'
                                                        : selectionLimitReached
                                                            ? 'bg-gray-50 border-[#D7E1EB] opacity-60 cursor-not-allowed'
                                                            : 'bg-white border-[#D7E1EB] hover:border-[#B6D8FA]'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <div>
                                                        <div className="text-sm text-nowrap font-medium text-slate-700">
                                                            {s.day} - {s.timeFromLabel} - {s.timeToLabel}
                                                        </div>
                                                        <div className="mt-1 text-[11px] text-slate-700">
                                                            <span className="font-semibold text-slate-900">${s.price}.00</span>
                                                            <span className="ml-2 text-slate-600">/ {selectedAdvisory?.durationLabel ?? 'Advisory plan'}</span>
                                                        </div>
                                                    </div>
                                                    {isSelected && (
                                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-omblue-500 text-white text-lg font-semibold">
                                                            <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M10.3333 1L3.91667 7.41667L1 4.5" stroke="#F5F8FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                            </svg>

                                                        </div>
                                                    )}
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Durations row */}
                        {durations.length > 0 ? <div className="flex gap-3 mb-6 border-b pb-6">
                            {durations.map(d => (
                                <button key={d.mins} onClick={() => setDuration(d.mins)} className={`flex-1 text-center p-3 rounded-2xl border ${duration === d.mins ? 'bg-[#D2EBFF] border-olblue-200' : 'bg-white border-gray-200'}`}>
                                    <div className="text-[15px] font-semibold">
                                        {d.mins} min
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        ${d.price}.00
                                        <span className="text-sm ml-3 text-gray-400">
                                            per {d.mins} minutes
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div> : (
                            <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-slate-600">
                                No duration options are currently available.
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 divide-x-[1px] divide-[#E1E9F4]">
                            {/* Calendar column (separate component) */}
                            <div>
                                <Calendar availableDayNumbers={availableDayNumbers} availableDaysOfWeek={availableDaysOfWeek} selectedDates={selectedDates} onToggleDate={toggleDate} />
                            </div>

                            {/* Slots column */}
                            <div className="px-8">
                                <div className="text-lg font-semibold mb-3">Available slots</div>
                                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                    {!selectedDates.length && (
                                        <div className="text-center h-64  flex items-center    justify-center ">
                                            No slots are available for the selected date(s).
                                        </div>
                                    )}
                                    {!!selectedDates.length && !availableSlots.length && (
                                        <div className="text-center h-64  flex items-center    justify-center ">
                                            No slots are available for the selected date(s).
                                        </div>
                                    )}
                                    {availableSlots.map((s: any) => {
                                        const isSelected = selectedSlot?.id === s.id
                                        return (
                                            <button
                                                key={s.id}
                                                onClick={() => setSelectedSlot(isSelected ? null : s)}
                                                className={`w-full rounded-[18px] border p-3 text-left transition ${isSelected ? 'bg-[#D8ECFF] border-[#B6D8FA]' : 'bg-white border-gray-200 hover:border-[#B6D8FA]'}`}
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <div>
                                                        <div className="font-semibold">
                                                            {s.day} - {s.timeFromLabel} - {s.timeToLabel}
                                                        </div>
                                                        <div className="text-xs text-gray-500">({duration} minutes)</div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="font-semibold">${s.price}.00</div>
                                                        {isSelected && (
                                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-omblue-500 text-white">
                                                                <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M10.3333 1L3.91667 7.41667L1 4.5" stroke="#F5F8FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>


            {/* Invite section */}
            <InviteSection inviteEmails={inviteEmails} setInviteEmails={setInviteEmails} />

            {/* Discussion + attachments */}
            <ConsultationDiscussion
                notes={notes}
                setNotes={setNotes}
                onAttachmentsChange={handleAttachmentsChange}
            />

            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleBook}
                    disabled={planTab === 'advisory' && selectedAdvisorySlots.length === 0}
                    className={`px-6 py-3 text-white rounded-full ${planTab === 'advisory' && selectedAdvisorySlots.length === 0
                            ? 'bg-slate-300 cursor-not-allowed'
                            : 'bg-[#1E4ED8]'
                        }`}
                >
                    Book now
                </button>
            </div>
        </div>
    )
}

export default Consultations

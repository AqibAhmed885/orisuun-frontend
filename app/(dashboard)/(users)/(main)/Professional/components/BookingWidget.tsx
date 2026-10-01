'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  matchesProviderMeetingType,
  type ProviderMeetingType,
  type ProviderPackage,
  type ProviderSetupResult,
  type ProviderTopic,
} from '@/utils/providerBookingApi'
import type { AppDispatch } from '@/data/store'
import {
  setActiveProfileTab,
  setSelectedConsultationType,
  type ConsultationType,
} from '@/data/slices/profile-view-slice'
import { useProfileProviderSetup } from '@/hooks/useProfileViewState'

type BookingWidgetProps = {
  profileData: any
}

type BookingOption =
  | {
      key: string
      type: 'one-time'
      label: string
      sublabel: string
      durationMinutes: number
      price: number
      packageId?: string
      meetingTypeId: string
      meetingTypeName: string
    }
  | {
      key: string
      type: 'advisory'
      label: string
      sublabel: string
      durationMinutes: number
      price: number
      packageId: string
      meetingTypeId: string
      meetingTypeName: string
    }
  | {
      key: string
      type: 'task'
      label: string
      sublabel: string
      durationMinutes: number
      price: number
      topicId: string
      meetingTypeId: string
      meetingTypeName: string
    }

type AvailabilitySlot = {
  id: string
  day: string
  timeFrom: string
  timeTo: string
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function parseDurationOptions(settings: ProviderSetupResult['Settings'] | undefined) {
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

function formatToAMPM(time: string) {
  const [hourStr, minuteStr] = time.split(':')
  let hour = parseInt(hourStr, 10)
  const minute = minuteStr
  const ampm = hour >= 12 ? 'PM' : 'AM'
  hour = hour % 12 || 12
  return `${hour}:${minute} ${ampm}`
}

function buildOneTimeOptions(
  settings: ProviderSetupResult['Settings'] | undefined,
  meetingType: ProviderMeetingType | undefined
): BookingOption[] {
  const durationOptions = parseDurationOptions(settings)

  if (durationOptions.length) {
    return durationOptions
      .filter((option) => option.DurationMinutes && option.Price !== undefined)
      .sort((left, right) => left.DurationMinutes - right.DurationMinutes)
      .map((option) => {
        const packageMatch = meetingType?.Packages?.find(
          (pkg) => pkg.IsActive !== false && pkg.DurationMinutes === option.DurationMinutes
        )

        return {
          key: `one-time-${option.DurationMinutes}`,
          type: 'one-time' as const,
          label: option.DurationMinutes <= 30 ? 'Quick' : option.DurationMinutes <= 60 ? 'Full' : `${option.DurationMinutes} min`,
          sublabel: `${option.DurationMinutes} min`,
          durationMinutes: Number(option.DurationMinutes),
          price: Number(option.Price),
          packageId: packageMatch?.Id,
          meetingTypeId: meetingType?.Id ?? '',
          meetingTypeName: meetingType?.MeetingType ?? 'One Time Video Consultation',
        }
      })
  }

  const packages = meetingType?.Packages?.filter(
    (pkg) => pkg.IsActive !== false && pkg.DurationMinutes && pkg.Price !== undefined
  ) ?? []

  return packages
    .sort((left, right) => (left.DurationMinutes ?? 0) - (right.DurationMinutes ?? 0))
    .map((pkg) => ({
      key: `one-time-${pkg.Id}`,
      type: 'one-time' as const,
      label: pkg.DurationMinutes && pkg.DurationMinutes <= 30 ? 'Quick' : pkg.DurationMinutes && pkg.DurationMinutes <= 60 ? 'Full' : pkg.PackageName || `${pkg.DurationMinutes} min`,
      sublabel: `${pkg.DurationMinutes ?? 30} min`,
      durationMinutes: pkg.DurationMinutes ?? 30,
      price: Number(pkg.Price),
      packageId: pkg.Id,
      meetingTypeId: meetingType?.Id ?? '',
      meetingTypeName: meetingType?.MeetingType ?? 'One Time Video Consultation',
    }))
}

function buildAdvisoryOptions(meetingType: ProviderMeetingType | undefined): BookingOption[] {
  const packages = meetingType?.Packages?.filter((pkg) => pkg.IsActive !== false) ?? []

  return packages.map((pkg: ProviderPackage) => ({
    key: `advisory-${pkg.Id}`,
    type: 'advisory' as const,
    label: pkg.PackageName,
    sublabel: pkg.SessionCount ? `${pkg.SessionCount} sessions` : `${pkg.DurationMinutes ?? 60} min`,
    durationMinutes: pkg.DurationMinutes ?? 60,
    price: Number(pkg.Price),
    packageId: pkg.Id,
    meetingTypeId: meetingType?.Id ?? '',
    meetingTypeName: meetingType?.MeetingType ?? 'Ongoing Advisory Plan',
  }))
}

function buildTaskOptions(meetingType: ProviderMeetingType | undefined): BookingOption[] {
  const topics = meetingType?.Topics?.filter((topic) => topic.IsActive !== false) ?? []

  return topics.map((topic: ProviderTopic) => ({
    key: `task-${topic.Id}`,
    type: 'task' as const,
    label: topic.TopicName,
    sublabel: `${topic.DurationMinutes} min`,
    durationMinutes: topic.DurationMinutes,
    price: Number(topic.Price),
    topicId: topic.Id,
    meetingTypeId: meetingType?.Id ?? '',
    meetingTypeName: meetingType?.MeetingType ?? 'Topic-Specific Consultations',
  }))
}

const BookingWidget: React.FC<BookingWidgetProps> = ({ profileData }) => {
  const [selectedOptionKey, setSelectedOptionKey] = useState('')
  const [selectedAvailabilityIndex, setSelectedAvailabilityIndex] = useState(0)
  const dispatch = useDispatch<AppDispatch>()
  const providerUserId = profileData?.UserId || profileData?.userId
  const { providerSetup, isLoadingProviderSetup: isLoading } = useProfileProviderSetup(providerUserId)

  const currentUser = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('userData') || 'null')
    : null
  const isCurrentUserOwner = String(currentUser?.Id) === String(profileData?.UserId)

  const oneTimeMeetingType = useMemo(
    () => providerSetup?.MeetingTypes?.find(
      (mt) => mt.IsActive !== false && matchesProviderMeetingType(mt.MeetingType, 'One Time Video Consultation')
    ),
    [providerSetup]
  )

  const advisoryMeetingType = useMemo(
    () => providerSetup?.MeetingTypes?.find(
      (mt) => mt.IsActive !== false && matchesProviderMeetingType(mt.MeetingType, 'Ongoing Advisory Plan')
    ),
    [providerSetup]
  )

  const taskMeetingType = useMemo(
    () => providerSetup?.MeetingTypes?.find(
      (mt) => mt.IsActive !== false && matchesProviderMeetingType(mt.MeetingType, 'Topic-Specific Consultations')
    ),
    [providerSetup]
  )

  const allBookingOptions = useMemo(() => {
    return [
      ...buildOneTimeOptions(providerSetup?.Settings, oneTimeMeetingType),
      ...buildAdvisoryOptions(advisoryMeetingType),
      ...buildTaskOptions(taskMeetingType),
    ]
  }, [advisoryMeetingType, oneTimeMeetingType, providerSetup?.Settings, taskMeetingType])

  const bookingOptions = useMemo(() => {
    const primaryOptions = allBookingOptions.filter((option) => option.type !== 'advisory')
    return (primaryOptions.length ? primaryOptions : allBookingOptions).slice(0, 3)
  }, [allBookingOptions])

  useEffect(() => {
    if (bookingOptions.length && !bookingOptions.some((option) => option.key === selectedOptionKey)) {
      setSelectedOptionKey(bookingOptions[0].key)
      dispatch(setSelectedConsultationType(bookingOptions[0].type))
    }
  }, [bookingOptions, dispatch, selectedOptionKey])

  const selectedOption = bookingOptions.find((option) => option.key === selectedOptionKey) ?? bookingOptions[0]

  const featuredBottomOption = useMemo<Extract<BookingOption, { type: 'advisory' }> | null>(
    () => allBookingOptions.find((option): option is Extract<BookingOption, { type: 'advisory' }> => option.type === 'advisory') ?? null,
    [allBookingOptions]
  )

  const availabilitySlots = useMemo<AvailabilitySlot[]>(() => {
    const officeHours = providerSetup?.OfficeHours?.filter((slot) => slot.IsActive) ?? []
    return officeHours.map((slot) => ({
      id: slot.Id ?? `${slot.DayOfWeek}-${slot.StartTime}`,
      day: DAY_NAMES[slot.DayOfWeek] ?? `Day ${slot.DayOfWeek}`,
      timeFrom: slot.StartTime?.substring(0, 5) ?? '',
      timeTo: slot.EndTime?.substring(0, 5) ?? '',
    }))
  }, [providerSetup])

  const selectedAvailability =
    availabilitySlots[selectedAvailabilityIndex] ??
    availabilitySlots[0] ??
    null

  useEffect(() => {
    if (selectedAvailabilityIndex > availabilitySlots.length - 1) {
      setSelectedAvailabilityIndex(0)
    }
  }, [availabilitySlots.length, selectedAvailabilityIndex])

  const bookingDisabled =
    isLoading ||
    isCurrentUserOwner ||
    !providerSetup?.Settings?.IsBookingEnabled ||
    providerSetup?.Settings?.IsAvailabilityPaused ||
    !selectedOption ||
    !selectedAvailability

  const openConsultations = (consultationType?: ConsultationType) => {
    if (consultationType) dispatch(setSelectedConsultationType(consultationType))
    dispatch(setActiveProfileTab('Consultations'))
  }

  const handleBookNow = () => {
    openConsultations(selectedOption?.type)
  }

  const handleBookFeaturedOption = () => {
    openConsultations('advisory')
  }

  const handleViewAllOptions = () => {
    openConsultations(selectedOption?.type)
  }

  if (isCurrentUserOwner) {
    return null
  }

  return (
    <div className="mb-6 w-full rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="text-sm font-semibold text-gray-900">
          Quick Meeting
        </div>
        <button
          type="button"
          onClick={handleViewAllOptions}
          className="shrink-0 whitespace-nowrap text-[13px] text-gray-700 underline"
        >
          View all options
        </button>
      </div>

      {isLoading ? (
        <div
          className="animate-pulse space-y-4"
          role="status"
          aria-label="Loading booking options"
        >
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-14 rounded-2xl bg-gray-200" />
            ))}
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="h-4 w-28 rounded bg-gray-200" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[0, 1].map((item) => (
              <div key={item} className="h-14 rounded-[18px] bg-gray-100" />
            ))}
          </div>
          <div className="h-20 rounded-2xl bg-gray-100" />
          <span className="sr-only">Loading booking options...</span>
        </div>
      ) : !providerSetup?.Settings?.IsBookingEnabled ? (
        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-6 text-sm text-gray-500">
          Booking is currently disabled for this provider.
        </div>
      ) : providerSetup?.Settings?.IsAvailabilityPaused ? (
        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-6 text-sm text-gray-500">
          This provider has paused availability for now.
        </div>
      ) : !bookingOptions.length ? (
        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-6 text-sm text-gray-500">
          No active consultation options are available yet.
        </div>
      ) : !availabilitySlots.length ? (
        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-6 text-sm text-gray-500">
          This provider is not available for bookings right now.
        </div>
      ) : (
        <>
          <div className="mb-4 grid grid-cols-3 gap-3">
            {bookingOptions.map((option) => {
              const active = selectedOption?.key === option.key
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => {
                    setSelectedOptionKey(option.key)
                    dispatch(setSelectedConsultationType(option.type))
                  }}
                  className={`min-w-0 rounded-2xl border px-1 py-2 text-center ${
                    active ? 'border-[#B2DDFF] bg-[#DFF4FF]' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className={`text-xs font-semibold ${active ? 'text-[#0F172A]' : 'text-gray-900'}`}>
                    {option.label}
                  </div>
                  <div className="text-xs text-gray-500">({option.sublabel})</div>
                </button>
              )
            })}
          </div>

          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="text-sm font-semibold text-gray-900">Availability</div>
            <button
              type="button"
              onClick={handleViewAllOptions}
              className="shrink-0 whitespace-nowrap text-[13px] text-gray-700 underline"
            >
              View other availability
            </button>
          </div>

          {availabilitySlots.length ? (
            <div className="mb-4 flex w-full gap-3 overflow-x-auto pb-2">
              {availabilitySlots.map((slot, index) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSelectedAvailabilityIndex(index)}
                  className={`min-w-[140px] shrink-0 rounded-[18px] border px-2 py-2 text-center ${
                    selectedAvailabilityIndex === index ? 'border-[#B2DDFF] bg-[#DFF4FF]' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="text-xs font-semibold">{slot.day}</div>
                  <div className="mt-1 whitespace-nowrap text-xs text-gray-500">
                    {formatToAMPM(slot.timeFrom)} - {formatToAMPM(slot.timeTo)}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="mb-4 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-6 text-sm text-gray-500">
              No availability slots are currently configured.
            </div>
          )}

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 p-4">
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-semibold">
                {selectedAvailability
                  ? `${selectedAvailability.day} · ${formatToAMPM(selectedAvailability.timeFrom)} - ${formatToAMPM(selectedAvailability.timeTo)}`
                  : 'Availability not selected'}
              </div>
              <div className="text-xs text-gray-500">
                <span className="font-semibold">${Number(selectedOption?.price || 0).toFixed(2)}</span>
                {' / '}
                {selectedOption?.sublabel || 'Session'}
              </div>
            </div>
            <button
              type="button"
              onClick={handleBookNow}
              disabled={bookingDisabled}
              className="ml-auto shrink-0 rounded-full bg-[#1E4ED8] px-4 py-3 text-xs text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Book now
            </button>
          </div>

          {featuredBottomOption?.type === 'advisory' ? (
            <div className="space-y-4">
              {/* <h3 className="text-[15px] font-semibold text-[#101828]">Ongoing Advisory Plan</h3> */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#D8F0FF] bg-gradient-to-l from-[#0094F0]/20 to-[#6CE0FF]/20 p-4">
                <div className="flex min-w-[150px] flex-1 items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[14px] border border-[#B2DDFF] bg-[#D2EBFF] shadow-sm">
                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.43612 0H3.74863C3.60946 4.67001e-06 3.47304 0.0387306 3.35462 0.111845C3.23621 0.18496 3.14047 0.28958 3.07812 0.414L0.078125 6.414H6.83263L8.43612 0Z" fill="url(#paint0_linear_booking_widget)" />
                  <path d="M14.166 6.414L12.5625 0H17.25C17.3892 4.67001e-06 17.5256 0.0387306 17.644 0.111845C17.7624 0.18496 17.8582 0.28958 17.9205 0.414L20.9205 6.414H14.166Z" fill="url(#paint1_linear_booking_widget)" />
                  <path d="M7.5225 0.5685C7.56299 0.406176 7.65658 0.262048 7.7884 0.159037C7.92022 0.056026 8.0827 4.62172e-05 8.25 0H12.75C12.9173 4.62172e-05 13.0798 0.056026 13.2116 0.159037C13.3434 0.262048 13.437 0.406176 13.4775 0.5685L14.9775 6.5685C14.9925 6.6285 15 6.689 15 6.75H6C6.00007 6.68881 6.00762 6.62786 6.0225 6.5685L7.5225 0.5685Z" fill="url(#paint2_linear_booking_widget)" />
                  <path d="M6.85228 6H0.28678L0.0797797 6.414C0.0149001 6.54318 -0.0112636 6.68836 0.00443739 6.83207C0.0201384 6.97577 0.0770351 7.11188 0.16828 7.224L9.91828 19.224C9.98736 19.3087 10.0741 19.3774 10.1725 19.425C10.2709 19.4727 10.3785 19.4983 10.4878 19.5C10.5972 19.5017 10.7055 19.4795 10.8054 19.435C10.9052 19.3904 10.9941 19.3245 11.0658 19.242L6.85228 6Z" fill="url(#paint3_linear_booking_widget)" />
                  <path d="M9.9375 19.242L14.151 6H20.7165L20.9235 6.414C20.9884 6.54318 21.0145 6.68836 20.9988 6.83207C20.9831 6.97577 20.9262 7.11188 20.835 7.224L11.085 19.224C11.0159 19.3087 10.9291 19.3774 10.8308 19.425C10.7324 19.4727 10.6248 19.4983 10.5154 19.5C10.4061 19.5017 10.2978 19.4795 10.1979 19.435C10.0981 19.3904 10.0092 19.3245 9.9375 19.242Z" fill="url(#paint4_linear_booking_widget)" />
                  <path d="M6.1647 6L6.0222 6.5685C5.98896 6.70204 5.99312 6.84216 6.0342 6.9735L9.7842 18.9735C9.83205 19.1258 9.92725 19.2588 10.0559 19.3533C10.1846 19.4477 10.3401 19.4986 10.4997 19.4986C10.6593 19.4986 10.8148 19.4477 10.9435 19.3533C11.0721 19.2588 11.1673 19.1258 11.2152 18.9735L14.9652 6.9735C15.0063 6.84216 15.0104 6.70204 14.9772 6.5685L14.8347 6H6.1647Z" fill="url(#paint5_linear_booking_widget)" />
                  <path d="M3.75028 1.44917e-06C3.61111 6.11918e-06 3.47469 0.038732 3.35628 0.111847C3.23786 0.184961 3.14213 0.289581 3.07978 0.414001L0.0797797 6.414C0.0149001 6.54318 -0.0112636 6.68836 0.00443739 6.83207C0.0201384 6.97577 0.0770351 7.11188 0.16828 7.224L9.91828 19.224C9.9886 19.3105 10.0773 19.3803 10.178 19.4282C10.2787 19.4761 10.3888 19.501 10.5003 19.501C10.6118 19.501 10.7219 19.4761 10.8225 19.4282C10.9232 19.3803 11.012 19.3105 11.0823 19.224L20.8323 7.224C20.9238 7.11203 20.9809 6.976 20.9969 6.83229C21.0129 6.68858 20.987 6.54332 20.9223 6.414L17.9223 0.414001C17.8598 0.289353 17.7638 0.184582 17.6451 0.111452C17.5264 0.0383221 17.3897 -0.000272583 17.2503 1.44917e-06H3.75028Z" fill="url(#paint6_linear_booking_widget)" fillOpacity="0.7" />
                  <defs>
                    <linearGradient id="paint0_linear_booking_widget" x1="7.24212" y1="-2.673" x2="3.76812" y2="5.64" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#9FF0F9" />
                      <stop offset="1" stopColor="#29C3FF" />
                    </linearGradient>
                    <linearGradient id="paint1_linear_booking_widget" x1="15.5475" y1="-2.31181e-08" x2="19.506" y2="9.948" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#0FAFFF" />
                      <stop offset="1" stopColor="#102784" />
                    </linearGradient>
                    <linearGradient id="paint2_linear_booking_widget" x1="10.5" y1="0" x2="10.5" y2="8.4375" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#3BD5FF" />
                      <stop offset="1" stopColor="#367AF2" />
                    </linearGradient>
                    <linearGradient id="paint3_linear_booking_widget" x1="1.95328" y1="3.3" x2="10.2273" y2="19.26" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#0094F0" />
                      <stop offset="1" stopColor="#6CE0FF" />
                    </linearGradient>
                    <linearGradient id="paint4_linear_booking_widget" x1="23.607" y1="-0.75" x2="11.2785" y2="17.742" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#1B44B1" />
                      <stop offset="1" stopColor="#2052CB" />
                    </linearGradient>
                    <linearGradient id="paint5_linear_booking_widget" x1="10.4937" y1="1.275" x2="10.4937" y2="19.5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#2052CB" />
                      <stop offset="1" stopColor="#0FAFFF" />
                    </linearGradient>
                    <linearGradient id="paint6_linear_booking_widget" x1="-2.13272" y1="-18.363" x2="14.6463" y2="21.0795" gradientUnits="userSpaceOnUse">
                      <stop offset="0.533" stopColor="#FF6CE8" stopOpacity="0" />
                      <stop offset="1" stopColor="#FF6CE8" />
                    </linearGradient>
                  </defs>
                </svg>
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold text-[#344054]">
                      Advisory plan
                    </div>
                    <div className="text-[12px] text-gray-600">
                      <span className="font-semibold text-[#101828]">${Number(featuredBottomOption?.price || 0).toFixed(2)}</span>
                      {' / '}
                      {featuredBottomOption?.sublabel}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleBookFeaturedOption}
                  disabled={bookingDisabled}
                  className="ml-auto shrink-0 rounded-full bg-[#1E4ED8] px-4 py-3 text-xs text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Book now
                </button>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}

export default BookingWidget

# Formal Booking System

## Overview

We’re creating a formal booking system for BOB members to setup meetings with Investors, Mentors, Professionals, Strategy Consultants, and Experts. The system will connect with the users’ personal/work calendars to show availability and facilitate booking. The availability and booking mechanisms will be displayed prominently on the profile pages of the members who want to be booked.

---

# Core Mechanics of the System

To ensure that members offering meetings always show accurate availability on their pages, the availability shown will go through these three filters:

- Member must set general “office hours”
- Member must connect a calendar, and the calendar must not be marked “busy” for that time
- The shown availability must meet the minimum notice or “lead” time before the meeting can happen

---

# General Office Hours

Members offering meetings will set their standard weekly recurring availability on a 7-day week (each day showing 24 hours potential availability).

## Features

### Master Availability Toggle

Members can turn off all future incoming booking requests.

- Does NOT affect already booked meetings

### Meeting Length Options

Supported durations:

- 15 minutes
- 30 minutes
- 45 minutes
- 60 minutes

Users can enable one or multiple durations.

---

# Calendar Integration

To prevent double booking and minimize cancellations, members offering meetings must sync their calendar.

## Supported Calendars

- Google Calendar
- Outlook Calendar

## Features

### OAuth Integration

Uses appropriately scoped OAuth APIs for:

- Reading availability (`calendar.freebusy`)
- Creating calendar events (`calendar.events.owned`)

### Bi-Directional Synchronization

The system constantly checks for:

- Cancellations
- Reschedules
- Meeting updates

Both participants are updated automatically.

### Important Requirement

Calendar synchronization must be highly accurate with extensive edge-case testing.

---

# Lead Time & Buffer Settings

## Lead Time

Members can define the minimum notice required before a meeting can be booked.

Examples:

- 10 hours
- 24 hours
- 48 hours

## Buffer Time

Minimum gap between meetings.

Examples:

- 5 minutes
- 10 minutes
- 15 minutes

---

# Offerings & Setup Page

A dedicated setup page allows members to configure their booking offerings and availability.

---

# Setup Page Features

Members can configure:

- Price per offering
- Cancellation rate
- Cancellation timeframe
- Lead time
- Buffer time
- Availability
- Offerings
- Stripe payout setup

---

# Cancellation Settings

## Cancellation Rate

Percentage charged if cancellation occurs too close to the meeting.

- Maximum: 50%

## Cancellation Timeframe

Minimum required notice for cancellation.

- Maximum: 48 hours

## Cancellation Fee Cap

- Maximum charge: $250

---

# Offering Types

The platform supports 3 offering types.

---

## 1. Regular Consultation / Meeting

Video-based meetings with configurable durations and pricing.

---

## 2. Advisory Plans

Packaged ongoing meetings.

### Features

- Two advisory plan packages supported
- Custom pricing

---

## 3. Topic / Task-Specific Offerings

Different member types can configure specialized services.

---

# Stripe Connect Integration

Users are prompted to:

- Connect bank account
- Setup payouts

Stripe Connect handles:

- Verification
- Payout onboarding
- Earnings management

---

# In-Platform Video Call System

Meetings occur directly on the platform.

## Supported Providers

- Daily.co
- Dyte

## Features

- Screen sharing
- Video recording
- Meeting transcripts

---

# Notifications

Notifications are sent when:

- Booking is made
- Cancellation occurs
- Reschedule is requested

---

# Premium Access

The booking feature is available only to Premium Members.

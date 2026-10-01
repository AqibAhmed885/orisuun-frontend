import React from 'react';
import type { CalendarConnectionStatus, CalendarProvider } from './types';
import Image from 'next/image';

interface CalendarSectionProps {
	onConnect: (provider: CalendarProvider) => void;
	connectionStatus: CalendarConnectionStatus | null;
	pendingProvider?: CalendarProvider | null;
}

function CalendarCard({
	title,
	description,
	provider,
	status,
	onConnect,
	pendingProvider,
}: {
	title: string;
	description: React.ReactNode;
	provider: CalendarProvider;
	status?: CalendarConnectionStatus['google'];
	onConnect: (provider: CalendarProvider) => void;
	pendingProvider?: CalendarProvider | null;
}) {
	const connected = Boolean(status?.isConnected);
	const isPending = pendingProvider === provider;

	return (
		<div className="rounded-lg border border-[#EAECF0] bg-white p-4 w-[280px]">
			<div className="flex items-start justify-between gap-3">
				<div className="flex gap-4 text-[15px] items-center font-semibold">
					<Image src={`/icons/${provider}.svg`} alt={title} width={30} height={30} />
					{title}
				</div>
				{connected && (
					<span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
						Connected
					</span>
				)}
			</div>
			<div className="mt-2 text-[15px] text-[#667085]">{connected && status?.email ? status.email : description}</div>
			<div className="mt-4">
				<button
					onClick={() => onConnect(provider)}
					className="rounded-md border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-60"
					type="button"
					disabled={isPending}
				>
					{isPending ? (connected ? 'Disconnecting...' : 'Connecting...') : connected ? 'Disconnect' : 'Connect'}
				</button>
			</div>
		</div>
	);
}

export default function CalendarSection({ onConnect, connectionStatus, pendingProvider }: CalendarSectionProps) {
	return (
		<div className="rounded-2xl shadow-border p-6">
			<h3 className="text-base font-semibold text-[#101828]">Connect Your Calendar</h3>
			<p className="mt-2 text-sm text-[#667085]">Sync availability and prevent overlapping meetings</p>
			<div className="mt-4 flex space-x-6">
				<CalendarCard
					title="Google Calendar"
					description={<>Connect your Google <br /> calendar account</>}
					provider="google"
					status={connectionStatus?.google}
					onConnect={onConnect}
					pendingProvider={pendingProvider}
				/>
				<CalendarCard
					title="Outlook Calendar"
					description={<>Connect your Microsoft <br /> calendar account</>}
					provider="outlook"
					status={connectionStatus?.outlook}
					onConnect={onConnect}
					pendingProvider={pendingProvider}
				/>
			</div>
		</div>
	);
}

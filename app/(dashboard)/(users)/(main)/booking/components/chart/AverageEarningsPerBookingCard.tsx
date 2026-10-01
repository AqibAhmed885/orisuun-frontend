'use client';

import type { ReactNode } from 'react';

type AverageEarningsRow = {
    label: string;
    value: number;
    total: number;
    icon?: ReactNode;
    progress?: number;
};

type AverageEarningsPerBookingCardProps = {
    title?: string;
    rows: AverageEarningsRow[];
    className?: string;
};

function formatMoney(value: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(value);
}

function ChartIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-10 w-10 text-black"
            aria-hidden="true"
        >
            <path
                d="M22 21C22 21.55 21.55 22 21 22H3C2.45 22 2 21.55 2 21C2 20.45 2.45 20 3 20H21C21.55 20 22 20.45 22 21ZM6 18C6.55 18 7 17.55 7 17V3C7 2.45 6.55 2 6 2C5.45 2 5 2.45 5 3V17C5 17.55 5.45 18 6 18ZM14 18C14.55 18 15 17.55 15 17V13C15 12.45 14.55 12 14 12C13.45 12 13 12.45 13 13V17C13 17.55 13.45 18 14 18ZM10 18C10.55 18 11 17.55 11 17V9C11 8.45 10.55 8 10 8C9.45 8 9 8.45 9 9V17C9 17.55 9.45 18 10 18ZM18 18C18.55 18 19 17.55 19 17V5C19 4.45 18.55 4 18 4C17.45 4 17 4.45 17 5V17C17 17.55 17.45 18 18 18Z"
                fill="currentColor"
            />
        </svg>
    );
}

function DefaultUserIcon() {
    return (
        <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.6402 2.4043L7.22179 2.4043C5.22724 2.4043 3.61719 4.00234 3.61719 5.97286L3.61719 19.0816C3.61719 21.0521 5.22724 22.6502 7.22179 22.6502H8.13496C9.09619 22.6502 10.0094 23.0226 10.6822 23.6955L12.7368 25.7261C13.674 26.6513 15.2 26.6513 16.1372 25.7261L18.1918 23.6955C18.8647 23.0226 19.7899 22.6502 20.7391 22.6502H21.6402C23.6348 22.6502 25.2448 21.0521 25.2448 19.0816V5.97286C25.2448 4.00234 23.6348 2.4043 21.6402 2.4043ZM14.431 6.91005C15.981 6.91005 17.2306 8.15965 17.2306 9.70963C17.2306 11.2596 15.981 12.5092 14.431 12.5092C12.881 12.5092 11.6314 11.2476 11.6314 9.70963C11.6314 8.15965 12.881 6.91005 14.431 6.91005ZM17.6511 18.0963H11.2109C10.2376 18.0963 9.67292 17.015 10.2136 16.2099C11.0307 14.9964 12.6167 14.1793 14.431 14.1793C16.2453 14.1793 17.8313 14.9964 18.6484 16.2099C19.1891 17.015 18.6123 18.0963 17.6511 18.0963Z" fill="#000E2C" />
        </svg>

    );
}

function DefaultStackIcon() {
    return (
        <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.2199 15.2485V21.7247C19.2199 24.5363 17.3455 26.3987 14.546 26.3987H7.07241C4.27283 26.3987 2.39844 24.5363 2.39844 21.7247L2.39844 12.3888C2.39844 9.57722 4.27283 7.71484 7.07241 7.71484H11.6743C12.9119 7.71484 14.1014 8.20747 14.9785 9.08459L17.8502 11.9442C18.7273 12.8214 19.2199 14.0109 19.2199 15.2485Z" fill="#000E2C" />
            <path d="M26.4303 9.91283V16.3891C26.4303 19.1887 24.5559 21.0631 21.7563 21.0631H20.4226V15.2476C20.4226 13.6977 19.7978 12.1837 18.7044 11.0903L15.8327 8.23068C14.7393 7.13728 13.2254 6.51248 11.6754 6.51248H9.63281C9.84909 4.01329 11.6634 2.36719 14.2828 2.36719L18.8846 2.36719C20.1222 2.36719 21.3117 2.85982 22.1889 3.73694L25.0605 6.60861C25.9376 7.48573 26.4303 8.67525 26.4303 9.91283Z" fill="#000E2C" />
        </svg>

    );
}

function DefaultBuildingIcon() {
    return (
        <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.6094 3.60352L6.12384 3.60352C3.73279 3.60352 2.53125 4.81707 2.53125 7.23215L2.53125 26.4327H9.01954V21.9269C9.01954 21.4343 9.42806 21.0258 9.92069 21.0258C10.4133 21.0258 10.8218 21.4223 10.8218 21.9269V26.4327H17.19V7.23215C17.19 4.81707 16.0005 3.60352 13.6094 3.60352ZM12.9245 15.3185H6.97693C6.4843 15.3185 6.07578 14.91 6.07578 14.4173C6.07578 13.9247 6.4843 13.5162 6.97693 13.5162H12.9245C13.4172 13.5162 13.8257 13.9247 13.8257 14.4173C13.8257 14.91 13.4172 15.3185 12.9245 15.3185ZM12.9245 10.8127H6.97693C6.4843 10.8127 6.07578 10.4042 6.07578 9.91157C6.07578 9.41894 6.4843 9.01042 6.97693 9.01042H12.9245C13.4172 9.01042 13.8257 9.41894 13.8257 9.91157C13.8257 10.4042 13.4172 10.8127 12.9245 10.8127Z" fill="#000E2C" />
            <path d="M27.6396 25.5337H24.9121V21.9291C26.0536 21.5566 26.8826 20.4872 26.8826 19.2256V16.8225C26.8826 15.2485 25.597 13.9629 24.023 13.9629C22.449 13.9629 21.1633 15.2485 21.1633 16.8225V19.2256C21.1633 20.4752 21.9804 21.5326 23.0978 21.9171V25.5337H1.20584C0.713209 25.5337 0.304688 25.9422 0.304688 26.4348C0.304688 26.9275 0.713209 27.336 1.20584 27.336H23.9509C23.9749 27.336 23.9869 27.348 24.011 27.348C24.035 27.348 24.047 27.336 24.0711 27.336H27.6396C28.1322 27.336 28.5408 26.9275 28.5408 26.4348C28.5408 25.9422 28.1322 25.5337 27.6396 25.5337Z" fill="#000E2C" />
        </svg>
    );
}

function DefaultCoffeeIcon() {
    return (
        <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.20584 6.15304C6.71321 6.15304 6.30469 5.74451 6.30469 5.25188V3.1492C6.30469 2.65657 6.71321 2.24805 7.20584 2.24805C7.69847 2.24805 8.10699 2.65657 8.10699 3.1492V5.25188C8.10699 5.75653 7.69847 6.15304 7.20584 6.15304Z" fill="#000E2C" />
            <path d="M12.0105 6.15304C11.5179 6.15304 11.1094 5.74451 11.1094 5.25188V3.1492C11.1094 2.65657 11.5179 2.24805 12.0105 2.24805C12.5032 2.24805 12.9117 2.65657 12.9117 3.1492V5.25188C12.9117 5.75653 12.5032 6.15304 12.0105 6.15304Z" fill="#000E2C" />
            <path d="M16.8152 6.15304C16.3226 6.15304 15.9141 5.74451 15.9141 5.25188V3.1492C15.9141 2.65657 16.3226 2.24805 16.8152 2.24805C17.3078 2.24805 17.7164 2.65657 17.7164 3.1492V5.25188C17.7164 5.75653 17.3078 6.15304 16.8152 6.15304Z" fill="#000E2C" />
            <path d="M26.7225 15.9222C26.7225 12.7741 24.2834 10.2269 21.2075 9.96255C20.3183 8.5087 18.7323 7.52344 16.906 7.52344H8.05065C5.26309 7.52344 2.99219 9.79434 2.99219 12.5819V13.2187H21.9644V12.5819C21.9644 12.3536 21.9284 12.1253 21.8923 11.909C23.6346 12.4257 24.9202 14.0117 24.9202 15.9222C24.9202 17.8086 23.6706 19.3826 21.9644 19.9113V14.4202H2.99219L2.99219 21.3771C2.99219 24.1647 5.26309 26.4356 8.05065 26.4356H16.906C19.5493 26.4356 21.7001 24.393 21.9164 21.7977C24.6559 21.245 26.7225 18.8179 26.7225 15.9222Z" fill="#000E2C" />
        </svg>
    );
}

const FALLBACK_ICONS = [
    <DefaultUserIcon key="user" />,
    <DefaultStackIcon key="stack" />,
    <DefaultBuildingIcon key="building" />,
    <DefaultCoffeeIcon key="coffee" />,
];

export default function AverageEarningsPerBookingCard({
    title = 'Average earnings per booking',
    rows,
    className = '',
}: AverageEarningsPerBookingCardProps) {
    return (
        <div
            className={[
                'w-full rounded-[16px] border-[0.5px] border-[#9CAAC7] bg-white p-5 shadow-[0_14px_34px_rgba(16,24,40,0.06)] sm:p-5',
                className,
            ].join(' ')}
        >
            <div className="mb-12 flex items-center gap-5">
                <ChartIcon />

                <h3 className="text-lg font-medium leading-tight tracking-[-0.04em] text-black sm:text-xl">
                    {title}
                </h3>
            </div>

            <div className="space-y-10">
                {rows.map((row, index) => {
                    const progress =
                        typeof row.progress === 'number'
                            ? row.progress
                            : row.total > 0
                                ? Math.round((row.value / row.total) * 100)
                                : 0;

                    const safeProgress = Math.min(Math.max(progress, 0), 100);

                    return (
                        <div
                            key={`${row.label}-${index}`}
                            className="grid grid-cols-[24px_minmax(0,1fr)] items-center gap-10"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#EEF2FF] text-[#071738]">
                                {row.icon ?? FALLBACK_ICONS[index % FALLBACK_ICONS.length]}
                            </div>

                            <div className="min-w-0">
                                <div className="mb-4 flex items-center justify-between gap-6">
                                    <span className="text-sm font-medium leading-none tracking-[-0.03em] text-black sm:text-base">
                                        {row.label}
                                    </span>

                                    <span className="shrink-0 text-xs leading-none tracking-[-0.03em] text-black sm:text-base">
                                        <span className="font-bold">{formatMoney(row.value)}</span>
                                        <span className="font-normal">/{formatMoney(row.total)}</span>
                                    </span>
                                </div>

                                <div className="h-[8px] overflow-hidden rounded-[3px] bg-[#282C35]">
                                    <div
                                        className="h-full rounded-[3px] bg-[#3368D8]"
                                        style={{ width: `${safeProgress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
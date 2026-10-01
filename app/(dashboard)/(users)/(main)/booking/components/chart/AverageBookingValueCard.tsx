'use client';

type WeeklyBarData = {
    label: string;
    primary: number;
    secondary: number;
};

type AverageBookingValueCardProps = {
    title?: string;
    totalValue: number;
    changePercent?: number;
    changeText?: string;
    primaryLabel?: string;
    secondaryLabel?: string;
    data?: WeeklyBarData[];
    maxValue?: number;
    className?: string;
};

const DEFAULT_WEEKLY_DATA: WeeklyBarData[] = [
    { label: 'Mo', primary: 1150, secondary: 420 },
    { label: 'Tu', primary: 1500, secondary: 550 },
    { label: 'We', primary: 1750, secondary: 620 },
    { label: 'Th', primary: 2200, secondary: 900 },
    { label: 'Fr', primary: 2200, secondary: 780 },
    { label: 'Sa', primary: 1850, secondary: 650 },
    { label: 'Su', primary: 1200, secondary: 430 },
];

function formatMoney(value: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(value);
}

function AverageBookingIcon() {
    return (
        <svg
            width="42"
            height="42"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-9 w-9 sm:h-11 sm:w-11"
            aria-hidden="true"
        >
            <path
                d="M22 21C22 21.55 21.55 22 21 22H3C2.45 22 2 21.55 2 21C2 20.45 2.45 20 3 20H21C21.55 20 22 20.45 22 21ZM6 18C6.55 18 7 17.55 7 17V3C7 2.45 6.55 2 6 2C5.45 2 5 2.45 5 3V17C5 17.55 5.45 18 6 18ZM14 18C14.55 18 15 17.55 15 17V13C15 12.45 14.55 12 14 12C13.45 12 13 12.45 13 13V17C13 17.55 13.45 18 14 18ZM10 18C10.55 18 11 17.55 11 17V9C11 8.45 10.55 8 10 8C9.45 8 9 8.45 9 9V17C9 17.55 9.45 18 10 18ZM18 18C18.55 18 19 17.55 19 17V5C19 4.45 18.55 4 18 4C17.45 4 17 4.45 17 5V17C17 17.55 17.45 18 18 18Z"
                fill="black"
            />
        </svg>
    );
}

export default function AverageBookingValueCard({
    title = 'Average booking value',
    totalValue,
    changePercent = 23,
    changeText = 'since last month',
    primaryLabel = 'Earnings',
    secondaryLabel = 'Spent',
    data = DEFAULT_WEEKLY_DATA,
    maxValue = 3000,
    className = '',
}: AverageBookingValueCardProps) {
    const yAxis = [
        { label: '$3K', value: 3000 },
        { label: '$2K', value: 2000 },
        { label: '$1K', value: 1000 },
        { label: '0', value: 0 },
    ];

    return (
        <div
            className={[
                'w-full rounded-[16px] border-[0.5px] border-[#9CAAC7] bg-white p-5 shadow-[0_14px_34px_rgba(16,24,40,0.06)] sm:p-7',
                className,
            ].join(' ')}
        >
            <div className="mb-6 flex items-center gap-5">
                <AverageBookingIcon />

                <h3 className="text-[28px] font-medium  text-black sm:text-xl">
                    {title}
                </h3>
            </div>

            <div className="mb-4 flex flex-col gap-6">
                <div className="flex flex-wrap items-end gap-x-2 gap-y-2">
                    <div className="text-xl font-normal leading-none tracking-[-0.04em] text-[#071046] sm:text-2xl">
                        {formatMoney(totalValue)}
                    </div>

                    <div className="pb-1 text-[18px] leading-none sm:text-xs">
                        <span className="font-semibold text-[#05C89B]">
                            +{changePercent}%
                        </span>
                        <span className="ml-2 text-[#AEB7D4]">{changeText}</span>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-20 pr-10 text-sm text-[#9CA3AF]">
                    <div className="flex items-center gap-3">
                        <span className="h-4 w-4 rounded-full bg-[#3D6DDB]" />
                        <span className="">{primaryLabel}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="h-4 w-4 rounded-full bg-[#8DBFE8]" />
                        <span className="">{secondaryLabel}</span>
                    </div>
                </div>
            </div>

            <div className="relative">
                <div className="grid grid-cols-[64px_1fr] gap-3">
                    <div className="relative h-[180px]">
                        {yAxis.map((item) => (
                            <span
                                key={item.label}
                                className="absolute right-3 -translate-y-1/2 text-[24px] leading-none text-black sm:text-sm"
                                style={{
                                    top: `${100 - (item.value / maxValue) * 100}%`,
                                }}
                            >
                                {item.label}
                            </span>
                        ))}
                    </div>

                    <div>
                        <div className="relative h-[180px]">
                            {yAxis.map((item) => (
                                <div
                                    key={item.label}
                                    className={[
                                        'absolute left-0 right-0 h-px',
                                        item.value === 0
                                            ? 'border-t border-[#858585]'
                                            : 'border-t border-dashed border-[#6D6D6D]',
                                    ].join(' ')}
                                    style={{
                                        top: `${100 - (item.value / maxValue) * 100}%`,
                                    }}
                                />
                            ))}

                            <div className="relative z-10 grid h-full grid-cols-7 items-end gap-7 px-1 sm:gap-10 sm:px-3">
                                {data.map((item) => {
                                    const primaryHeight = Math.max(
                                        (item.primary / maxValue) * 100,
                                        item.primary > 0 ? 10 : 0,
                                    );

                                    const secondaryHeight = Math.max(
                                        (item.secondary / maxValue) * 100,
                                        item.secondary > 0 ? 7 : 0,
                                    );

                                    return (
                                        <div
                                            key={item.label}
                                            className="relative flex h-full items-end justify-center"
                                        >
                                            <div
                                                className="absolute bottom-0 w-[12px] rounded-lg bg-[#3D6DDB] shadow-[0_8px_20px_rgba(61,109,219,0.18)] sm:w-[12px]"
                                                style={{
                                                    height: `${primaryHeight}%`,
                                                }}
                                            />

                                            <div
                                                className="absolute bottom-0 w-[12px] rounded-lg bg-[#8DBFE8] sm:w-[12px]"
                                                style={{
                                                    height: `${secondaryHeight}%`,
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-7 px-1 pt-9 sm:gap-10 sm:px-3">
                            {data.map((item) => (
                                <span
                                    key={item.label}
                                    className="text-center text-xs font-medium leading-none text-black sm:text-sm"
                                >
                                    {item.label}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
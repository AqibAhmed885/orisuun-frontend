'use client';

type SessionRow = {
    label: string;
    value: number | string;
    barValue?: number;
};

type TotalSessionsCardProps = {
    title?: string;
    totalSessions: number | string;
    rows: SessionRow[];
    maxValue?: number;
    axisLabels?: number[];
    className?: string;
};

const DEFAULT_AXIS_LABELS = [0, 20, 40, 60, 80];

function formatNumber(value: number | string) {
    if (typeof value === 'string') return value;

    return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 0,
    }).format(value);
}

function toNumber(value: number | string) {
    if (typeof value === 'number') return value;

    const parsed = Number(value.replace(/,/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
}

function SigmaIcon() {
    return (
        <svg
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3 1.5C1.758 1.5 0.75 2.508 0.75 3.75V21.75C0.75 22.992 1.758 24 3 24H21C22.242 24 23.25 22.992 23.25 21.75V3.75C23.25 2.508 22.242 1.5 21 1.5H3ZM3 3H21C21.414 3 21.75 3.336 21.75 3.75V21.75C21.75 22.164 21.414 22.5 21 22.5H3C2.586 22.5 2.25 22.164 2.25 21.75V3.75C2.25 3.336 2.586 3 3 3ZM7.5 5.25C7.2345 5.25 6.98925 5.3895 6.85425 5.619C6.71925 5.84775 6.71625 6.132 6.84525 6.3645L10.3912 12.75L6.84525 19.1355C6.71625 19.368 6.71925 19.6523 6.85425 19.881C6.98925 20.1105 7.2345 20.25 7.5 20.25H16.5C16.914 20.25 17.25 19.914 17.25 19.5V18C17.25 17.586 16.914 17.25 16.5 17.25C16.086 17.25 15.75 17.586 15.75 18V18.75H8.77425L11.9047 13.1145C12.0308 12.888 12.0308 12.612 11.9047 12.3855L8.77425 6.75H15.75V7.5C15.75 7.914 16.086 8.25 16.5 8.25C16.914 8.25 17.25 7.914 17.25 7.5V6C17.25 5.586 16.914 5.25 16.5 5.25H7.5Z"
                fill="black"
            />
        </svg>
    );
}

export default function TotalSessionsCard({
    title = 'Total Sessions',
    totalSessions,
    rows,
    maxValue = 80,
    axisLabels = DEFAULT_AXIS_LABELS,
    className = '',
}: TotalSessionsCardProps) {
    return (
        <div
            className={[
                'w-full rounded-[16px] border-[0.5px] border-[#9CAAC7] bg-white p-6  sm:p-5',
                className,
            ].join(' ')}
        >
            <div className="mb-4 flex items-center gap-5">
                <SigmaIcon />

                <h3 className="text-sm text-black sm:text-xl">
                    {title}
                </h3>
            </div>

            <div className="mb-5 text-xl font-normal leading-none tracking-[-0.04em] text-[#2D344B] sm:text-2xl">
                {formatNumber(totalSessions)}
            </div>

            <div className="grid grid-cols-[48px_minmax(0,1fr)] gap-x-5">
                <div className="relative h-[250px]">
                    <div className="absolute inset-0 flex flex-col justify-between py-3">
                        {rows.map((row, index) => (
                            <div
                                key={`${row.label}-${index}`}
                                className="text-right text-xs font-normal leading-none text-[#252B41A3]"
                            >
                                {row.label}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative h-[250px]">
                    {axisLabels.map((axis) => (
                        <div
                            key={axis}
                            className="absolute bottom-0 top-0 w-px bg-[#E2E7F0]"
                            style={{
                                left: `${(axis / maxValue) * 100}%`,
                            }}
                        />
                    ))}

                    <div className="relative z-10 flex h-full flex-col justify-between py-3">
                        {rows.map((row, index) => {
                            const barValue = row.barValue ?? toNumber(row.value);
                            const width = Math.min(Math.max((barValue / maxValue) * 100, 0), 100);

                            return (
                                <div
                                    key={`${row.label}-${index}`}
                                    className="relative h-[24px]"
                                >
                                    <div
                                        className="h-full rounded-[7px] bg-[#3D6DDB]"
                                        style={{
                                            width: `${width}%`,
                                        }}
                                    />

                                    <span
                                        className="absolute top-1/2 -translate-y-1/2 text-xs font-normal leading-none text-[#747B8E]"
                                        style={{
                                            left: `calc(${width}% + 10px)`,
                                        }}
                                    >
                                        {formatNumber(row.value)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div />

                <div className="relative h-10">
                    {axisLabels.map((axis) => (
                        <span
                            key={axis}
                            className="absolute top-0 -translate-x-1/2 text-xs font-normal leading-none text-[#A4AAB7]"
                            style={{
                                left: `${(axis / maxValue) * 100}%`,
                            }}
                        >
                            {axis}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
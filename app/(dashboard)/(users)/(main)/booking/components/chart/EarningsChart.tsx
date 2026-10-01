'use client';

import { useMemo } from 'react';

type ChartPoint = {
    x: number;
    y: number;
};

type ChartSeries = {
    primary: number[];
    secondary: number[];
    labels: string[];
    yAxis: string[];
    max?: number;
};

const SERIES: Record<string, ChartSeries> = {
    month: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        yAxis: ['$1100', '$900', '$300', '$100', '0'],
        primary: [620, 760, 80, 610, 620, 360, 210, 980, 120, 620],
        secondary: [520, 170, 500, 250, 360, 610, 890, 610, 590, 860],
        max: 1100,
    },
};

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

function parseAxisValue(label: string) {
    const number = Number(label.replace(/[^0-9.-]/g, ''));
    return Number.isFinite(number) ? number : 0;
}

function getSmoothPath(points: ChartPoint[], tension = 0.18) {
    if (!points.length) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i += 1) {
        const p0 = points[i - 1] ?? points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] ?? p2;

        const cp1 = {
            x: p1.x + (p2.x - p0.x) * tension,
            y: clamp(p1.y + (p2.y - p0.y) * tension, 0, 100),
        };

        const cp2 = {
            x: p2.x - (p3.x - p1.x) * tension,
            y: clamp(p2.y - (p3.y - p1.y) * tension, 0, 100),
        };

        path += ` C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${p2.x} ${p2.y}`;
    }

    return path;
}

export function ChartShell({ series = SERIES.month }: { series?: ChartSeries }) {
    const safeSeries = series ?? SERIES.month;

    const chartData = useMemo(() => {
        const axisMax = Math.max(...safeSeries.yAxis.map(parseAxisValue), 1);
        const dataMax = Math.max(...safeSeries.primary, ...safeSeries.secondary, 1);
        const max = safeSeries.max ?? Math.max(axisMax, dataMax);

        const topPadding = 8;
        const bottomPadding = 10;
        const chartHeight = 100 - topPadding - bottomPadding;

        const makePoints = (values: number[]) =>
            values.map((value, index) => ({
                x: (index / Math.max(values.length - 1, 1)) * 100,
                y: clamp(topPadding + chartHeight - (value / max) * chartHeight, 0, 100),
            }));

        return {
            primary: makePoints(safeSeries.primary),
            secondary: makePoints(safeSeries.secondary),
        };
    }, [safeSeries]);

    const gridLines = safeSeries.yAxis.map((label, index) => ({
        label,
        top: `${(index / Math.max(safeSeries.yAxis.length - 1, 1)) * 100}%`,
        isBottom: index === safeSeries.yAxis.length - 1,
    }));

    return (
        <div className="relative h-[360px] w-full sm:h-[420px]">
            <div className="absolute inset-x-0 top-4 bottom-14 flex">
                <div className="relative w-[50px] shrink-0 sm:w-[60px]">
                    {gridLines.map((item) => (
                        <span
                            key={item.label}
                            style={{ top: item.top }}
                            className="absolute right-4 -translate-y-1/2 text-sm leading-none text-[#282C35] sm:text-base"
                        >
                            {item.label}
                        </span>
                    ))}
                </div>

                <div className="relative min-w-0 flex-1">
                    {gridLines.map((item) => (
                        <div
                            key={item.label}
                            style={{ top: item.top }}
                            className={[
                                'absolute left-0 right-0 h-px',
                                item.isBottom
                                    ? 'border-t border-[#CFCFCF]'
                                    : 'border-t border-dashed border-[#D4D4D4]',
                            ].join(' ')}
                        />
                    ))}

                    <svg
                        viewBox="0 0 100 100"
                        className="absolute inset-0 h-full w-full overflow-visible"
                        preserveAspectRatio="none"
                    >
                        <path
                            d={getSmoothPath(chartData.secondary)}
                            fill="none"
                            stroke="#7EB3DD"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            vectorEffect="non-scaling-stroke"
                        />

                        <path
                            d={getSmoothPath(chartData.primary)}
                            fill="none"
                            stroke="#2F63D9"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 flex">
                <div className="w-[58px] shrink-0 sm:w-[76px]" />

                <div className="flex min-w-0 flex-1 justify-between">
                    {safeSeries.labels.map((label) => (
                        <span
                            key={label}
                            className="w-9 text-center text-sm leading-none text-[#282C35] sm:w-12 sm:text-base"
                        >
                            {label}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function EarningsChart({ series = SERIES.month }: { series?: ChartSeries }) {
    return (
        <section className="w-full rounded-[16px] border-[0.3px] shadow-[0px_4px_4px_0px_#00000040] border-[#D8DDE8] bg-[#FFFFFF] p-5 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-semibold leading-none text-black sm:text-2xl">
                    Earnings
                </h2>

                <div className="flex flex-wrap items-center gap-5 sm:gap-10">
                    <div className="flex items-center gap-3 text-sm text-[#9E9E9E] sm:text-base">
                        <span className="h-4 w-4 rounded-full bg-[#2357C6] sm:h-4 sm:w-4" />
                        <span>Lorem</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-[#9E9E9E] sm:text-base">
                        <span className="h-4 w-4 rounded-full bg-[#D2EBFF] sm:h-4 sm:w-4" />
                        <span>Lorem</span>
                    </div>

                    <button
                        type="button"
                        className="flex items-center gap-3 rounded-[12px] bg-[#000612] px-5 py-2 text-sm  text-white sm:px-4 sm:py-1 sm:text-base"
                    >
                        <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.59639 5.27344H20.5286C21.0568 5.27344 21.4831 5.27344 21.8303 5.29717C22.1867 5.32134 22.5022 5.37275 22.801 5.49668C23.5188 5.7939 24.0892 6.36407 24.3866 7.08179C24.5101 7.38062 24.5615 7.69614 24.5856 8.05298C24.6094 8.39971 24.6094 8.82598 24.6094 9.3542V20.5286C24.6094 21.0568 24.6094 21.4831 24.5856 21.8303C24.5615 22.1867 24.5101 22.5022 24.3866 22.801C24.2394 23.1565 24.0236 23.4795 23.7515 23.7515C23.4795 24.0236 23.1565 24.2394 22.801 24.3866C22.5022 24.5101 22.1867 24.5615 21.8298 24.5856C21.4831 24.6094 21.0568 24.6094 20.5286 24.6094H7.59639C7.06816 24.6094 6.64189 24.6094 6.29473 24.5856C5.93833 24.5615 5.6228 24.5101 5.32397 24.3866C4.60612 24.0892 4.03579 23.5189 3.73843 22.801C3.61494 22.5022 3.56353 22.1867 3.53936 21.8298C3.51562 21.4835 3.51562 21.0573 3.51562 20.5291V9.3542C3.51562 8.82598 3.51562 8.39971 3.53936 8.05254C3.56353 7.69614 3.61494 7.38062 3.73843 7.08179C4.03588 6.3641 4.6062 5.79394 5.32397 5.49668C5.6228 5.37275 5.93833 5.32134 6.29517 5.29717C6.64145 5.27344 7.06816 5.27344 7.59639 5.27344ZM6.37471 6.46611C6.07764 6.48633 5.90449 6.52456 5.77266 6.57905C5.55936 6.66739 5.36556 6.79688 5.20231 6.96013C5.03907 7.12337 4.90958 7.31717 4.82124 7.53047C4.76675 7.6623 4.72895 7.83545 4.7083 8.13252C4.68765 8.43486 4.68765 8.82114 4.68765 9.37485V20.508C4.68765 21.0617 4.68765 21.4484 4.7083 21.7503C4.72852 22.0474 4.76675 22.2205 4.82124 22.3523C4.90958 22.5656 5.03907 22.7594 5.20231 22.9227C5.36556 23.0859 5.55936 23.2154 5.77266 23.3038C5.90449 23.3583 6.07764 23.396 6.37471 23.4167C6.67705 23.4374 7.06333 23.4374 7.61704 23.4374H20.508C21.0617 23.4374 21.4484 23.4374 21.7503 23.4167C22.0474 23.3965 22.2205 23.3583 22.3523 23.3038C22.5656 23.2154 22.7594 23.0859 22.9227 22.9227C23.0859 22.7594 23.2154 22.5656 23.3038 22.3523C23.3583 22.2205 23.396 22.0474 23.4167 21.7503C23.4374 21.4479 23.4374 21.0617 23.4374 20.508V9.37485C23.4374 8.82114 23.4374 8.43442 23.4167 8.13252C23.3965 7.83545 23.3583 7.6623 23.3038 7.53047C23.2154 7.31717 23.0859 7.12337 22.9227 6.96013C22.7594 6.79688 22.5656 6.66739 22.3523 6.57905C22.2205 6.52456 22.0474 6.48677 21.7503 6.46611C21.4479 6.44546 21.0617 6.44546 20.508 6.44546H7.61704C7.06333 6.44546 6.67661 6.44546 6.37471 6.46611Z" fill="#F9FBFF" />
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.10156 11.1327C4.10156 10.8092 4.36392 10.5469 4.68779 10.5469H24.0237C24.1791 10.5469 24.3282 10.6086 24.4381 10.7185C24.548 10.8284 24.6097 10.9775 24.6097 11.1329C24.6097 11.2883 24.548 11.4374 24.4381 11.5473C24.3282 11.6572 24.1791 11.7189 24.0237 11.7189H4.68779C4.61079 11.719 4.53453 11.7038 4.46338 11.6744C4.39223 11.6449 4.32758 11.6018 4.27314 11.5473C4.21869 11.4929 4.17551 11.4282 4.14607 11.3571C4.11663 11.2859 4.1015 11.2097 4.10156 11.1327ZM9.375 3.51562C9.69888 3.51562 9.96123 3.77798 9.96123 4.10142V6.44546C9.96123 6.60088 9.89949 6.74993 9.78959 6.85983C9.67969 6.96973 9.53064 7.03147 9.37522 7.03147C9.2198 7.03147 9.07075 6.96973 8.96085 6.85983C8.85095 6.74993 8.78921 6.60088 8.78921 6.44546V4.10142C8.78921 3.77798 9.05156 3.51562 9.375 3.51562ZM18.7503 3.51562C19.0737 3.51562 19.3361 3.77798 19.3361 4.10142V6.44546C19.3361 6.60088 19.2743 6.74993 19.1644 6.85983C19.0545 6.96973 18.9055 7.03147 18.7501 7.03147C18.5947 7.03147 18.4456 6.96973 18.3357 6.85983C18.2258 6.74993 18.1641 6.60088 18.1641 6.44546V4.10142C18.1641 3.77798 18.4264 3.51562 18.7503 3.51562Z" fill="#F9FBFF" />
                            <path d="M9.37515 16.4065C10.0224 16.4065 10.5472 15.8818 10.5472 15.2345C10.5472 14.5872 10.0224 14.0625 9.37515 14.0625C8.72786 14.0625 8.20312 14.5872 8.20312 15.2345C8.20312 15.8818 8.72786 16.4065 9.37515 16.4065Z" fill="#F9FBFF" />
                            <path d="M14.0626 16.4065C14.7099 16.4065 15.2347 15.8818 15.2347 15.2345C15.2347 14.5872 14.7099 14.0625 14.0626 14.0625C13.4154 14.0625 12.8906 14.5872 12.8906 15.2345C12.8906 15.8818 13.4154 16.4065 14.0626 16.4065Z" fill="#F9FBFF" />
                            <path d="M18.7501 16.4065C19.3974 16.4065 19.9222 15.8818 19.9222 15.2345C19.9222 14.5872 19.3974 14.0625 18.7501 14.0625C18.1029 14.0625 17.5781 14.5872 17.5781 15.2345C17.5781 15.8818 18.1029 16.4065 18.7501 16.4065Z" fill="#F9FBFF" />
                            <path d="M9.37515 21.094C10.0224 21.094 10.5472 20.5693 10.5472 19.922C10.5472 19.2747 10.0224 18.75 9.37515 18.75C8.72786 18.75 8.20312 19.2747 8.20312 19.922C8.20312 20.5693 8.72786 21.094 9.37515 21.094Z" fill="#F9FBFF" />
                            <path d="M14.0626 21.094C14.7099 21.094 15.2347 20.5693 15.2347 19.922C15.2347 19.2747 14.7099 18.75 14.0626 18.75C13.4154 18.75 12.8906 19.2747 12.8906 19.922C12.8906 20.5693 13.4154 21.094 14.0626 21.094Z" fill="#F9FBFF" />
                            <path d="M18.7501 21.094C19.3974 21.094 19.9222 20.5693 19.9222 19.922C19.9222 19.2747 19.3974 18.75 18.7501 18.75C18.1029 18.75 17.5781 19.2747 17.5781 19.922C17.5781 20.5693 18.1029 21.094 18.7501 21.094Z" fill="#F9FBFF" />
                        </svg>
                        Monthly 
                    </button>
                </div>
            </div>

            <div className="mt-6 sm:mt-8">
                <ChartShell series={series} />
            </div>
        </section>
    );
}
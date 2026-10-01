export function SummaryMetric({
    title,
    value,
    delta,
    deltaClass,
    icon,
}: {
    title: string;
    value: string;
    delta: string;
    deltaClass: string;
    icon?: React.ReactNode;
}) {
    return (
        <div className="flex min-h-[170px] flex-col justify-between bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2 text-[#505052]">
                    {icon}
                <h3 className="text-base  text-[#575B66]">{title}</h3>
            </div>
            <div className="flex items-end gap-3">
                <div className="text-3xl font-semibold tracking-[-0.04em] text-[#0B1242]">
                    {value}
                </div>
                <div className="pb-2 text-xs mb-6">
                    <span className={`font-semibold ${deltaClass}`}>{delta}</span>
                    <span className="ml-1 text-[#A3AED0]">since last month</span>
                </div>
            </div>
        </div>
    );
}
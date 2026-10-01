import React from "react";

const investments = [
    {
        name: "CloudSecure",
        amount: "$50M",
        stage: "Series B",
        status: "Active",
    },
    {
        name: "FinanceFlow",
        amount: "Acquired",
        stage: "Seed",
        status: "Exited",
    },
    {
        name: "HealthTech Pro",
        amount: "$150M",
        stage: "Series B",
        status: "Active",
    },
    {
        name: "Tugur",
        amount: "Acquired",
        stage: "Seed",
        status: "Exited",
    },
    {
        name: "DataLink",
        amount: "$50M",
        stage: "Series B",
        status: "Active",
    },
    {
        name: "DataMine AI",
        amount: "$150M",
        stage: "Series B",
        status: "Active",
    },
];

const statusClasses = {
    Active: "bg-green-100 text-green-700",
    Exited: "bg-orange-100 text-orange-700",
};

export default function NotableInvestments({ NotableInvestment }) {
    const formatToK = (value) => {
        if (value == null || value === '') return '—';

        const num = parseFloat(value);
        if (isNaN(num)) return value;

        const absNum = Math.abs(num); // Support negative numbers
        const sign = num < 0 ? '-' : '';

        if (absNum >= 1_000_000_000_000) return sign + (absNum / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '') + 'T';
        if (absNum >= 1_000_000_000) return sign + (absNum / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
        if (absNum >= 1_000_000) return sign + (absNum / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
        if (absNum >= 1_000) return sign + (absNum / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';

        return sign + absNum.toString();
    };

    return (

        <div className="w-full mx-auto  bg-white p-4 mt-6 rounded-xl border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Notable Investments</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {NotableInvestment?.map((inv, idx) => (
                    <div
                        key={idx}
                        className="border rounded-xl p-5 bg-white shadow-sm "
                    >
                        <h3 className="text-lg font-semibold text-gray-900">{inv?.CompanyName}</h3>
                        <p className="text-gray-500">${formatToK(inv?.Investment)}</p>

                        <div className="flex items-center gap-2 justify-between mt-3">
                            <span className="text-sm px-3 py-1 border border-gray-300 rounded-full text-gray-700">
                                {inv?.InvestmentStage}
                            </span>
                            <span
                                className={`text-sm px-3 py-1 rounded-full font-semibold ${statusClasses[inv.InvestmentStatus]}`}
                            >
                                {inv?.InvestmentStatus}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

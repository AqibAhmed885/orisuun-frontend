'use client';

export default function InvestorHighlights({ AssetsUnderManagement, AvgTimeToClose, NumberOfFunds, AverageReturn }) {
    const highlights = [
        {
            icon: (
                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.9596 7.08203H2.29297M2.29297 10.4154H5.24853C5.69869 10.4154 5.92377 10.4154 6.14141 10.4542C6.3346 10.4886 6.52305 10.5457 6.70289 10.6242C6.9055 10.7126 7.09278 10.8375 7.46733 11.0872L7.95194 11.4102C8.32649 11.6599 8.51377 11.7848 8.71638 11.8732C8.89622 11.9517 9.08467 12.0088 9.27786 12.0432C9.4955 12.082 9.72058 12.082 10.1707 12.082H11.0819C11.532 12.082 11.7571 12.082 11.9747 12.0432C12.1679 12.0088 12.3564 11.9517 12.5362 11.8732C12.7388 11.7848 12.9261 11.6599 13.3007 11.4102L13.7853 11.0872C14.1598 10.8375 14.3471 10.7126 14.5497 10.6242C14.7296 10.5457 14.918 10.4886 15.1112 10.4542C15.3288 10.4154 15.5539 10.4154 16.0041 10.4154H18.9596M2.29297 5.9987L2.29297 13.9987C2.29297 14.9321 2.29297 15.3988 2.47462 15.7553C2.63441 16.0689 2.88938 16.3239 3.20298 16.4837C3.5595 16.6654 4.02621 16.6654 4.95964 16.6654L16.293 16.6654C17.2264 16.6654 17.6931 16.6654 18.0496 16.4837C18.3632 16.3239 18.6182 16.069 18.778 15.7553C18.9596 15.3988 18.9596 14.9321 18.9596 13.9987V5.9987C18.9596 5.06528 18.9596 4.59857 18.778 4.24205C18.6182 3.92844 18.3632 3.67348 18.0496 3.51369C17.6931 3.33203 17.2264 3.33203 16.293 3.33203L4.95964 3.33203C4.02622 3.33203 3.5595 3.33203 3.20298 3.51369C2.88938 3.67348 2.63441 3.92844 2.47462 4.24205C2.29297 4.59857 2.29297 5.06528 2.29297 5.9987Z" stroke="#152F66" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

            ),
            value: `$${AssetsUnderManagement}`,
            label: 'Assets under Management',
        },
        {
            icon: (
                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_1141_228550)">
                        <path d="M19.7916 9.58333L18.1255 11.25L16.4583 9.58333M18.3292 10.8333C18.3595 10.5597 18.375 10.2817 18.375 10C18.375 5.85786 15.0171 2.5 10.875 2.5C6.73286 2.5 3.375 5.85786 3.375 10C3.375 14.1421 6.73286 17.5 10.875 17.5C13.2311 17.5 15.3334 16.4136 16.7083 14.7144M10.875 5.83333V10L13.375 11.6667" stroke="#152F66" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                    <defs>
                        <clipPath id="clip0_1141_228550">
                            <rect width="20" height="20" fill="white" transform="translate(0.875)" />
                        </clipPath>
                    </defs>
                </svg>

            ),
            value: AvgTimeToClose,
            label: 'Average Time to Close',
        },
        {
            icon: (
                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_1141_228550)">
                        <path d="M19.7916 9.58333L18.1255 11.25L16.4583 9.58333M18.3292 10.8333C18.3595 10.5597 18.375 10.2817 18.375 10C18.375 5.85786 15.0171 2.5 10.875 2.5C6.73286 2.5 3.375 5.85786 3.375 10C3.375 14.1421 6.73286 17.5 10.875 17.5C13.2311 17.5 15.3334 16.4136 16.7083 14.7144M10.875 5.83333V10L13.375 11.6667" stroke="#152F66" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                    <defs>
                        <clipPath id="clip0_1141_228550">
                            <rect width="20" height="20" fill="white" transform="translate(0.875)" />
                        </clipPath>
                    </defs>
                </svg>

            ),
            value: NumberOfFunds,
            label: 'Number of Funds',
        },
        {
            icon: (
                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.125 13.3346C5.125 15.1756 6.61738 16.668 8.45833 16.668H11.7917C13.6326 16.668 15.125 15.1756 15.125 13.3346C15.125 11.4937 13.6326 10.0013 11.7917 10.0013H8.45833C6.61738 10.0013 5.125 8.50892 5.125 6.66797C5.125 4.82702 6.61738 3.33464 8.45833 3.33464H11.7917C13.6326 3.33464 15.125 4.82702 15.125 6.66797M10.125 1.66797V18.3346" stroke="#152F66" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

            ),
            value: `${AverageReturn}%`,
            label: 'Average Return',
        },
    ];


    return (
        <div className="rounded-xl border border-gray-200 p-6 bg-white shadow-sm mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Investors Highlights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {highlights.map((item, index) => (
                    <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-5 flex flex-col items-center justify-center text-center"
                    >
                        <div className="mb-3">{item.icon}</div>
                        <div className="text-2xl font-bold text-[#2D65DD]">{item.value}</div>
                        <div className="text-[#475467] mt-1 text-sm">{item.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

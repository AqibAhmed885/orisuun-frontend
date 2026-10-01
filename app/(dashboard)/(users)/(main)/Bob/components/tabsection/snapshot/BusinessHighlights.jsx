const BusinessHighlights = ({ profileData }) => {
    const formatToK = (value) => {
        if (!value) return '—';
        const num = parseInt(value);
        if (isNaN(num)) return value;
        if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        return num;
    };

    const {
        BusinessGrowth,
        RegularCustomers,
        AmountOfInvestment
    } = profileData || {};

    const hasData =
        BusinessGrowth != null ||
        RegularCustomers != null ||
        AmountOfInvestment != null;

    if (!hasData) return null;

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mt-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Business Highlights</h2>

            <div className="flex flex-wrap sm:grid sm:grid-cols-2 md:grid-cols-5 gap-4">

                {/* Growth This Year */}
                {BusinessGrowth != null && (
                    <div className="bg-[#F9FAFB] rounded-xl p-4 flex flex-col items-center justify-center text-center">
                        <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 9.16536L9.33333 0.832031M9.33333 0.832031H1M9.33333 0.832031V9.16536" stroke="#152F66" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="text-2xl font-bold text-[#2D65DD] pt-4">{BusinessGrowth}%</p>
                        <p className="text-sm text-gray-600">Growth This Year</p>
                    </div>
                )}

                {/* Regular Customers */}
                {RegularCustomers != null && (
                    <div className="bg-[#F9FAFB] rounded-xl p-4 flex flex-col items-center justify-center text-center">

                        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.5 13.1974C16.7133 13.8069 17.7534 14.785 18.5127 16.008C18.6631 16.2502 18.7382 16.3713 18.7642 16.539C18.8171 16.8798 18.584 17.2988 18.2666 17.4336C18.1104 17.5 17.9347 17.5 17.5833 17.5M13.8333 9.6102C15.0681 8.99657 15.9167 7.72238 15.9167 6.25C15.9167 4.77762 15.0681 3.50343 13.8333 2.8898M12.1667 6.25C12.1667 8.32107 10.4877 10 8.41667 10C6.3456 10 4.66667 8.32107 4.66667 6.25C4.66667 4.17893 6.3456 2.5 8.41667 2.5C10.4877 2.5 12.1667 4.17893 12.1667 6.25ZM2.63269 15.782C3.96128 13.7871 6.05781 12.5 8.41667 12.5C10.7755 12.5 12.8721 13.7871 14.2006 15.782C14.4917 16.219 14.6372 16.4375 14.6205 16.7166C14.6074 16.9339 14.465 17.2 14.2913 17.3313C14.0683 17.5 13.7615 17.5 13.148 17.5H3.6853C3.07181 17.5 2.76507 17.5 2.54203 17.3313C2.36837 17.2 2.22591 16.9339 2.21286 16.7166C2.19611 16.4375 2.34164 16.219 2.63269 15.782Z" stroke="#152F66" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <p className="text-2xl font-bold text-[#2D65DD] pt-4">{RegularCustomers}</p>
                        <p className="text-sm text-gray-600">Regular Customers</p>
                    </div>
                )}

                {/* Seeking Investment */}
                {AmountOfInvestment != null && (
                    <div className="bg-[#F9FAFB] rounded-xl p-4 flex flex-col items-center justify-center text-center">
                        <svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.833374 13.3346C0.833374 15.1756 2.32576 16.668 4.16671 16.668H7.50004C9.34099 16.668 10.8334 15.1756 10.8334 13.3346C10.8334 11.4937 9.34099 10.0013 7.50004 10.0013H4.16671C2.32576 10.0013 0.833374 8.50892 0.833374 6.66797C0.833374 4.82702 2.32576 3.33464 4.16671 3.33464H7.50004C9.34099 3.33464 10.8334 4.82702 10.8334 6.66797M5.83337 1.66797V18.3346" stroke="#152F66" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <p className="text-2xl font-bold text-[#2D65DD] pt-4">{profileData?.CurrencySymbol}{formatToK(AmountOfInvestment)}</p>
                        <p className="text-sm text-gray-600">Seeking Investment</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BusinessHighlights;

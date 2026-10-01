'use client';
import ProfileImage from './ProfileImage';

const BasicInformation = ({ currentUserData, investorType }) => {

    const formatPipedString = (input: string): string => {
        return input?.split('|').join(', ');
    };

    const formatLargeNumber = (value: string | number): string => {
        const numeric =
            typeof value === 'string'
                ? parseFloat(value.replace(/[^0-9.-]/g, ''))
                : value;

        if (isNaN(numeric)) return '0';

        if (numeric >= 1_000_000_000_000) {
            return (numeric / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '') + 'T';
        } else if (numeric >= 1_000_000_000) {
            return (numeric / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
        } else if (numeric >= 1_000_000) {
            return (numeric / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
        } else if (numeric >= 1_000) {
            return (numeric / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
        } else {
            return numeric.toString();
        }
    };

    return (
        <div className="flex flex-col md:flex-row w-[95%] mx-auto justify-between gap-6 mt-16">
            {/* Left - Profile Image */}
            <div className="w-full md:w-[20%] flex justify-center">
                <ProfileImage imageUrl={currentUserData?.ProfilePicture}
                />
            </div>

            {/* Right - Info */}
            <div className="w-full md:w-[80%] grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label={investorType === "firm" ? "Organization name" : "Name"} value={currentUserData?.CompanyName || '—'} />
                <Field label="Website" value={currentUserData?.WebsiteUrl || '—'} />
                <Field label={investorType === "firm" ? "Tagline/Slogan" : "Title/Position"} value={currentUserData?.Tagline || '—'} />
                {investorType == "firm" && (
                    <Field label="Street Address" value={currentUserData?.AddressLine1 || '—'} />
                )}

                {/* Row 1: State, City, Country */}
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:col-span-2">
                    <Field label="State/Province" value={currentUserData?.StateName || '—'} />
                    <Field label="City" value={currentUserData?.CityName || '—'} />
                    <Field label="Country" value={currentUserData?.CountryName || '—'} />
                </div>

                {/* Row 2: Business Type, Ownership %, Ethnicity */}
                <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6 md:col-span-2">
                    <Field label="Check Size" value={"$" + formatLargeNumber(currentUserData?.MinCheckSize) + " - $" + formatLargeNumber(currentUserData?.MaxCheckSize) || '—'} />
                    <Field
                        label="Investment Stage"
                        value={formatPipedString(currentUserData?.InvestmentStage)}
                    />
                    <Field
                        label="Investment Type"
                        value={formatPipedString(currentUserData?.InvestorType) || '—'}
                    />
                    <Field
                        label="Geography of Service"
                        value={formatPipedString(currentUserData?.GeographyOfService) || '—'}
                    />
                </div>
            </div>
        </div>
    );
};

export default BasicInformation;

// Reusable Field component
const Field = ({
    label,
    value,
    iconLeft,
}: {
    label: string;
    value: string;
    iconLeft?: string;
}) => (
    <div className="space-y-2">
        <label className="block text-[16px] font-semibold text-black-500">{label}</label>
        <div className="relative">
            {iconLeft && (
                <img
                    src={iconLeft}
                    alt="icon"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
                />
            )}
            <p
                className={`w-full px-4 py-3 text-[16px] font-normal text-black-500 border border-gray-300 rounded-lg shadow-md bg-gray-100 ${iconLeft ? 'pl-10' : ''
                    }`}
            >
                {value}
            </p>
        </div>
    </div>
);

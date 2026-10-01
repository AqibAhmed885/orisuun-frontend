'use client';
import UserIcon from '../../../../../../../../icons/profile-creation/Icon.png';
import ProfileImage from './ProfileImage';

const ownershipPercentageOptions = [
    { value: '', label: 'Select option' },
    { value: '0%', label: '0%' },
    { value: '1-10%', label: '1-10%' },
    { value: '11-30%', label: '11-30%' },
    { value: '31-50%', label: '31-50%' },
    { value: '51-70%', label: '51-70%' },
    { value: '91-99%', label: '91-99%' },
    { value: '100%', label: '100%' },
];

const BasicInformation = ({ currentUserData }) => {
    const getOwnershipLabel = (value: string) =>
        ownershipPercentageOptions.find((item) => item.value === value)?.label || '—';

    return (
        <div className="flex flex-col md:flex-row w-[95%] mx-auto justify-between gap-6 mt-16">
            {/* Left - Profile Image */}
            <div className="w-full md:w-[20%] flex justify-center">
                <ProfileImage imageUrl={currentUserData?.ProfilePicture} isVerified={currentUserData?.ProfileVerified}
                />
            </div>

            {/* Right - Info */}
            <div className="w-full md:w-[80%] grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Business Name*" value={currentUserData?.CompanyName || '—'} />
                <Field label="Website" value={currentUserData?.WebsiteUrl || '—'} />
                <Field label="Company Tagline/Bio*" value={currentUserData?.Tagline || '—'} />
                <Field label="Street Address" value={currentUserData?.AddressLine1 || '—'} />

                {/* Row 1: State, City, Country */}
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:col-span-2">
                    <Field label="State/Province" value={currentUserData?.StateName || '—'} />
                    <Field label="City" value={currentUserData?.CityName || '—'} />
                    <Field label="Country" value={currentUserData?.CountryName || '—'} />
                </div>

                {/* Row 2: Business Type, Ownership %, Ethnicity */}
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:col-span-2">
                    <Field label="Business Type" value={currentUserData?.BussinessType || '—'} />
                    <Field
                        label="Black Ownership %"
                        value={getOwnershipLabel(currentUserData?.BlackOwnershipPercentage)}
                        iconLeft={UserIcon.src}
                    />
                    <Field
                        label="Ethnicity of Black Ownership"
                        value={currentUserData?.EthinicityBlackOwnershipName || '—'}
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

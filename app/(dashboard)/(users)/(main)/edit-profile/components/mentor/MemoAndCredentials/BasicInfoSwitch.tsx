'use client';
import { toast } from 'react-toastify';
import ProfileImage from './ProfileImage';
import Image from 'next/image';
import DefaultBanner from './image.png'
const BasicInformation = ({ currentUserData }) => {

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
        <div className="">
            <div className="relative  bg-gray-100 border-2 border-[#F9FAFB] rounded-t-2xl h-64 z-0">
                {/* Banner Image */}
                <Image
                    src={currentUserData?.BannerPicture ? currentUserData?.BannerPicture : DefaultBanner}
                    alt="Banner"
                    className="w-full h-full object-cover rounded-t-2xl"
                    width={1000}
                    height={1000}
                />

                {/* Share Button */}
                <button
                    className="absolute flex bg-white py-[7px] px-[10px] rounded right-4 top-4 text-blue-600 hover:text-blue-700"
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href)
                            .then(() => {
                                toast.success('Link copied to clipboard!');
                            })
                            .catch((err) => {
                                console.error('Failed to copy URL: ', err);
                                toast.error('Failed to copy link');
                            });
                    }}
                >
                    <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.15833 11.2587L11.85 14.5753M11.8417 5.42533L6.15833 8.74199M16.5 4.16699C16.5 5.5477 15.3807 6.66699 14 6.66699C12.6193 6.66699 11.5 5.5477 11.5 4.16699C11.5 2.78628 12.6193 1.66699 14 1.66699C15.3807 1.66699 16.5 2.78628 16.5 4.16699ZM6.5 10.0003C6.5 11.381 5.38071 12.5003 4 12.5003C2.61929 12.5003 1.5 11.381 1.5 10.0003C1.5 8.61961 2.61929 7.50033 4 7.50033C5.38071 7.50033 6.5 8.61961 6.5 10.0003ZM16.5 15.8337C16.5 17.2144 15.3807 18.3337 14 18.3337C12.6193 18.3337 11.5 17.2144 11.5 15.8337C11.5 14.4529 12.6193 13.3337 14 13.3337C15.3807 13.3337 16.5 14.4529 16.5 15.8337Z" stroke="#344054" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="ml-2 text-sm font-semibold">Share</span>
                </button>
            </div>

            {/* Profile Image (Overlapping) */}
            <div className="relative z-10 -mt-[51px] w-full md:w-[20%] mx-auto">
                <ProfileImage
                    imageUrl={currentUserData?.ProfilePicture}
                    verified={false}
                />
            </div>

            {/* Right - Info */}
            <div className="w-full px-10 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <Field label="Name*" value={currentUserData?.CompanyName || '—'} />
                <Field label="Website" value={currentUserData?.WebsiteUrl || '—'} />
                <div className='col-span-2'>
                    <Field label="Title" value={currentUserData?.Tagline || '—'} />
                </div>


                {/* Row 1: State, City, Country */}
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:col-span-2">
                    <Field label="State/Province" value={currentUserData?.StateName || '—'} />
                    <Field label="City*" value={currentUserData?.CityName || '—'} />
                    <Field label="Country*" value={currentUserData?.CountryName || '—'} />
                </div>

                {/* Row 2: Business Type, Ownership %, Ethnicity */}
                <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6 md:col-span-2">
                    <Field label="Years of Experience*" value={currentUserData?.YearsOfExp || '0'} />
                    <Field
                        label="Mentees*"
                        value={currentUserData?.Mentees || '0'}
                    />
                    <Field
                        label="Funding Raised*"
                        value={"$" + currentUserData?.FundingRaised || '0'}
                    />
                    <Field
                        label="Status*"
                        value={currentUserData?.Status || '—'}
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

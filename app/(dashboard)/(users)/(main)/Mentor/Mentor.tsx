'use client';
import { getOriginalPrivateId } from "@/utils/profile.helpers";
import { useEffect, useState } from "react";
import { fetchProfileDetails } from "@/app/api/profile-details";
import InvestorProfile from "./MentorProfile";
// import TabSection from "./TabSection";
// import ProfileSidebar from "./Sidebar/ProfileSidebar";
import Loader from "@/components/ui/loader";
import ProfileSidebar from "./ProfileSidebar";
import TabSection from "./TabSection";
import MentorProfile from "./MentorProfile";
import ProfileShimmer from "../profile/components/ProfileShimmer";
import TabSectionShimmer from "../profile/components/TabSectionShimmer";
import ProfileSidebarShimmer from "../profile/components/ProfileSidebar";
const Mentor = ({ params, searchParams }) => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchProfileData = async () => {
        try {
            const currentUser = JSON.parse(localStorage.getItem('userData'));
            const profile = await fetchProfileDetails({ username: params.username, profileId: params.id, viewer: currentUser });
            setProfileData(profile);
        } catch (error) {
            console.error('Error fetching profile data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, [params.id, params.username]);
    


    if (loading) {
        return (
            <div className="max-w-[100rem] mx-auto px-4 py-6">
                <div className="mb-6">
                    <ProfileShimmer />
                </div>
                <div className="flex min-h-screen flex-col-reverse pt-6 lg:flex-row lg:gap-2 2xl:gap-4 3xl:gap-6">
                    <div className="w-full p-4 lg:w-[400px] lg:shrink-0 xl:w-[430px] 2xl:w-[460px] 3xl:w-[500px]">
                        <ProfileSidebarShimmer />
                    </div>
                    <div className="w-full min-w-0 p-4 lg:flex-1">
                        <TabSectionShimmer />
                    </div>
                </div>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-red-600 text-lg">Failed to load profile data.</div>
            </div>
        );
    }
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
        <div>
            {/* <div className="text-lg font-semibold px-8 py-2 bg-white">
                Mentor Profile
            </div> */}
            <div className="max-w-[100rem] mx-auto px-4 py-6" style={{fontSize: '1rem'}}>
                <div className='mb-6'>
                    <MentorProfile profileData={profileData} />
                </div>
                <div className="w-[98%] mx-auto mt-6 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">

                        <div>
                            <div className="flex justify-center mb-2">
                                <svg className='h-5 w-5' viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.3346 9.16667H15.3346C16.2681 9.16667 16.7348 9.16667 17.0913 9.34832C17.4049 9.50811 17.6599 9.76308 17.8196 10.0767C18.0013 10.4332 18.0013 10.8999 18.0013 11.8333V17.5M11.3346 17.5V5.16667C11.3346 4.23325 11.3346 3.76654 11.153 3.41002C10.9932 3.09641 10.7382 2.84144 10.4246 2.68166C10.0681 2.5 9.60139 2.5 8.66797 2.5H5.66797C4.73455 2.5 4.26784 2.5 3.91132 2.68166C3.59771 2.84144 3.34275 3.09641 3.18296 3.41002C3.0013 3.76654 3.0013 4.23325 3.0013 5.16667V17.5M18.8346 17.5H2.16797M5.91797 5.83333H8.41797M5.91797 9.16667H8.41797M5.91797 12.5H8.41797" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                            </div>
                            <p className="text-sm text-[#080808]">Years of Experience</p>
                            <p className="text-[30px] font-semibold text-gray-900 mt-1">{profileData?.YearsOfExp || '-'}</p>
                        </div>

                        <div>
                            <div className="flex justify-center mb-2">
                                <svg className='h-5 w-5' viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.6693 18.3346C6.06677 18.3346 2.33594 14.6038 2.33594 10.0013C2.33594 5.3988 6.06677 1.66797 10.6693 1.66797C15.2718 1.66797 19.0026 5.3988 19.0026 10.0013C19.0026 14.6038 15.2718 18.3346 10.6693 18.3346ZM6.51344 15.2146C7.69306 16.1577 9.159 16.6704 10.6693 16.668C12.3109 16.668 13.8134 16.0746 14.9751 15.0913C14.4324 14.5344 13.7835 14.092 13.0668 13.7903C12.3501 13.4886 11.5802 13.3336 10.8026 13.3346C9.99643 13.3337 9.19886 13.5003 8.46049 13.824C7.72213 14.1476 7.05909 14.6212 6.51344 15.2146ZM5.34927 14.018C6.04965 13.2747 6.89483 12.6827 7.83272 12.2786C8.77061 11.8744 9.78134 11.6666 10.8026 11.668C11.7873 11.6667 12.7626 11.8599 13.6724 12.2366C14.5822 12.6133 15.4087 13.166 16.1043 13.863C16.8177 12.8589 17.239 11.6768 17.3214 10.4479C17.4039 9.21896 17.1442 7.99121 16.5713 6.90085C15.9985 5.81049 15.1347 4.90015 14.0759 4.27084C13.0171 3.64152 11.8047 3.31783 10.5731 3.33568C9.34154 3.35352 8.13899 3.71221 7.09887 4.37193C6.05875 5.03166 5.22174 5.96664 4.68068 7.07314C4.13962 8.17964 3.91568 9.4144 4.0337 10.6404C4.15172 11.8665 4.60708 13.0358 5.34927 14.0188V14.018ZM10.6693 10.8346C9.78522 10.8346 8.93737 10.4834 8.31225 9.85833C7.68713 9.2332 7.33594 8.38536 7.33594 7.5013C7.33594 6.61725 7.68713 5.7694 8.31225 5.14428C8.93737 4.51916 9.78522 4.16797 10.6693 4.16797C11.5533 4.16797 12.4012 4.51916 13.0263 5.14428C13.6514 5.7694 14.0026 6.61725 14.0026 7.5013C14.0026 8.38536 13.6514 9.2332 13.0263 9.85833C12.4012 10.4834 11.5533 10.8346 10.6693 10.8346ZM10.6693 9.16797C11.1113 9.16797 11.5352 8.99237 11.8478 8.67981C12.1603 8.36725 12.3359 7.94333 12.3359 7.5013C12.3359 7.05927 12.1603 6.63535 11.8478 6.32279C11.5352 6.01023 11.1113 5.83464 10.6693 5.83464C10.2272 5.83464 9.80332 6.01023 9.49076 6.32279C9.1782 6.63535 9.0026 7.05927 9.0026 7.5013C9.0026 7.94333 9.1782 8.36725 9.49076 8.67981C9.80332 8.99237 10.2272 9.16797 10.6693 9.16797Z" fill="#344054" />
                                </svg>

                            </div>
                            <p className="text-sm text-[#080808]">Mentees</p>
                            <p className="text-[30px] font-semibold text-gray-900 mt-1">{profileData?.Mentees || '-'}</p>
                        </div>

                        <div>
                            <div className="flex justify-center mb-2">
                                <svg className='h-5 w-5' viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.668 7.91536V5.9987C16.668 5.06528 16.668 4.59857 16.4863 4.24205C16.3265 3.92845 16.0716 3.67348 15.758 3.51369C15.4014 3.33203 14.9347 3.33203 14.0013 3.33203H4.33464C3.40122 3.33203 2.9345 3.33203 2.57798 3.51369C2.26438 3.67348 2.00941 3.92844 1.84962 4.24205C1.66797 4.59857 1.66797 5.06528 1.66797 5.9987V13.9987C1.66797 14.9321 1.66797 15.3988 1.84962 15.7553C2.00941 16.069 2.26438 16.3239 2.57798 16.4837C2.9345 16.6654 3.40121 16.6654 4.33464 16.6654L14.0013 16.6654C14.9347 16.6654 15.4014 16.6654 15.758 16.4837C16.0716 16.3239 16.3265 16.069 16.4863 15.7553C16.668 15.3988 16.668 14.9321 16.668 13.9987V12.082M12.5013 9.9987C12.5013 9.61149 12.5013 9.41788 12.5333 9.25688C12.6648 8.59573 13.1817 8.0789 13.8428 7.94739C14.0038 7.91536 14.1974 7.91536 14.5846 7.91536H16.2513C16.6385 7.91536 16.8321 7.91536 16.9931 7.94739C17.6543 8.0789 18.1711 8.59573 18.3026 9.25688C18.3346 9.41788 18.3346 9.61149 18.3346 9.9987C18.3346 10.3859 18.3346 10.5795 18.3026 10.7405C18.1711 11.4017 17.6543 11.9185 16.9931 12.05C16.8321 12.082 16.6385 12.082 16.2513 12.082H14.5846C14.1974 12.082 14.0038 12.082 13.8428 12.05C13.1817 11.9185 12.6648 11.4017 12.5333 10.7405C12.5013 10.5795 12.5013 10.3859 12.5013 9.9987Z" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                            </div>
                            <p className="text-sm text-[#080808]">Mentee Funding Raised</p>
                            <p className="text-[30px] font-semibold text-gray-900 mt-1">${formatToK(profileData?.FundingRaised)}</p>
                        </div>

                        <div>
                            <div className="flex justify-center mb-2">
                                <svg className='h-5 w-5' viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.3372 18.3346C5.73474 18.3346 2.00391 14.6038 2.00391 10.0013C2.00391 5.3988 5.73474 1.66797 10.3372 1.66797C14.9397 1.66797 18.6706 5.3988 18.6706 10.0013C18.6706 14.6038 14.9397 18.3346 10.3372 18.3346ZM6.18141 15.2146C7.36103 16.1577 8.82697 16.6704 10.3372 16.668C11.9789 16.668 13.4814 16.0746 14.6431 15.0913C14.1003 14.5344 13.4514 14.092 12.7348 13.7903C12.0181 13.4886 11.2482 13.3336 10.4706 13.3346C9.6644 13.3337 8.86683 13.5003 8.12846 13.824C7.3901 14.1476 6.72706 14.6212 6.18141 15.2146ZM5.01724 14.018C5.71762 13.2747 6.5628 12.6827 7.50069 12.2786C8.43858 11.8744 9.44931 11.6666 10.4706 11.668C11.4553 11.6667 12.4305 11.8599 13.3404 12.2366C14.2502 12.6133 15.0766 13.166 15.7722 13.863C16.4856 12.8589 16.9069 11.6768 16.9894 10.4479C17.0718 9.21896 16.8122 7.99121 16.2393 6.90085C15.6664 5.81049 14.8027 4.90015 13.7439 4.27084C12.6851 3.64152 11.4726 3.31783 10.2411 3.33568C9.00951 3.35352 7.80696 3.71221 6.76684 4.37193C5.72672 5.03166 4.88971 5.96664 4.34865 7.07314C3.80759 8.17964 3.58365 9.4144 3.70167 10.6404C3.81969 11.8665 4.27505 13.0358 5.01724 14.0188V14.018ZM10.3372 10.8346C9.45319 10.8346 8.60534 10.4834 7.98022 9.85833C7.3551 9.2332 7.00391 8.38536 7.00391 7.5013C7.00391 6.61725 7.3551 5.7694 7.98022 5.14428C8.60534 4.51916 9.45319 4.16797 10.3372 4.16797C11.2213 4.16797 12.0691 4.51916 12.6943 5.14428C13.3194 5.7694 13.6706 6.61725 13.6706 7.5013C13.6706 8.38536 13.3194 9.2332 12.6943 9.85833C12.0691 10.4834 11.2213 10.8346 10.3372 10.8346ZM10.3372 9.16797C10.7793 9.16797 11.2032 8.99237 11.5158 8.67981C11.8283 8.36725 12.0039 7.94333 12.0039 7.5013C12.0039 7.05927 11.8283 6.63535 11.5158 6.32279C11.2032 6.01023 10.7793 5.83464 10.3372 5.83464C9.89521 5.83464 9.47129 6.01023 9.15873 6.32279C8.84617 6.63535 8.67057 7.05927 8.67057 7.5013C8.67057 7.94333 8.84617 8.36725 9.15873 8.67981C9.47129 8.99237 9.89521 9.16797 10.3372 9.16797Z" fill="#667085" />
                                </svg>

                            </div>
                            <p className="text-sm text-[#080808]">Status</p>
                            <p className="text-[30px] font-semibold text-gray-900 mt-1">{profileData?.Status || '-'}</p>
                        </div>

                    </div>
                </div>

                <div className="flex min-h-screen flex-col-reverse pt-6 lg:flex-row lg:gap-2 2xl:gap-4 3xl:gap-6">
                    <div className="w-full p-4 lg:w-[400px] lg:shrink-0 xl:w-[430px] 2xl:w-[460px] 3xl:w-[500px]">
                        <ProfileSidebar profileData={profileData} />
                    </div>
                    <div className="w-full min-w-0 p-4 lg:flex-1">

                        <TabSection profileData={profileData} UserProfileDetailId={getOriginalPrivateId(params.id)} />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Mentor;

import ChevronRight from '@/icons/chevron-right';
import Eye from '@/icons/eye';
import Feather from '@/icons/feather';
import Globe from '@/icons/globe';
import Users from '@/icons/users';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import { renderProfileShape } from '@/utils/profile-shapes';
import { apiEndpoint } from '@/utils/utils';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import StarRatings from 'react-star-ratings';

const SearchResultCard = ({
  index,
  data,
  setResults,
  results,
  isPostProfile,
}: {
  index: number;
  data: any;
  setResults?: any;
  results?: any;
  isPostProfile?: boolean;
}) => {
  const router = useRouter();
  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));

  const teamData = JSON.parse(localStorage.getItem('teamData'));

  const setFavourite = async (profile, isFavourite) => {
    const payloadProfile = {
      [!isFavourite ? 'UserProfileDetailId' : 'Id']: isFavourite
        ? profile?.FavouriteProfilePostId
        : profile.ProfileDetailId,
      UserId: (teamData && teamData?.isActive) ? teamData?.teamId : currentUser?.Id,
    };
    const payloadPost = {
      BDOpportunityId: isFavourite
        ? profile?.FavouriteProfilePostId
        : profile.BDOpportunityId,
      UserId: (teamData && teamData?.isActive) ? teamData?.teamId : currentUser?.Id,
    };

    try {
      const response = await axios.post(
        !isFavourite
          ? `${apiEndpoint}/Profile/${isPostProfile ? 'SetFavouritePost' : 'SetFavouriteProfile'
          }`
          : isPostProfile
            ? `${apiEndpoint}/Profile/UnFavouritePost`
            : `${apiEndpoint}/Favourite/UnFavouriteProfile`,
        isPostProfile ? { ...payloadPost } : { ...payloadProfile },
        {
          headers: {
            XApiKey:
              'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        const filterData = results.map((detail) =>
          detail.BDOpportunityId === profile.BDOpportunityId
            ? {
              ...detail,
              IsFavouriteProfile: !detail.IsFavouriteProfile,
              FavouriteProfilePostId: response.data.Result,
            }
            : detail
        );

        setResults(filterData);
      }
    } catch (error) {
      console.error('Error updating favourite status:', error);
    }
  };

  const handleClick = (id) => () => {
    router.push(`/profile/${add2040ToProfileDetailsId(id)}#profile_reviews`);
  };

  const [isExpanded, setIsExpanded] = useState(false);
  

  return (
    <div className="p-4 md:border border-grey-600 min-h-72 rounded-md shadow-md bg-white">
      <div className="space-y-4">
        <div className="w-full flex items-start md:items-center justify-between gap-4">
          <div className="w-full flex items-start flex-1 gap-3">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden">
              {renderProfileShape(
                data?.MatchType || '1',
                data?.ProfilePicture || '',
                '',
                64
              )}
            </div>
            <div className="space-y-2">
              <p
                className="flex gap-2 text-h8 md:text-h8 2xl:text-scaled-h8 font-bold text-black-500 text-wrap cursor-pointer"
                onClick={() => router.push(`/profile/${add2040ToProfileDetailsId(data?.ProfileDetailId)}`)}
              >
                {data.CompanyName || ''}
                {data.IsVerified ? (
                  <div className="text-[#1A9E78]">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0_2465_264295)">
                        <path d="M15.4442 3.54062C15.6342 4.00002 15.9988 4.36517 16.4579 4.55581L18.0678 5.22264C18.5272 5.41294 18.8922 5.77796 19.0825 6.23738C19.2728 6.69681 19.2728 7.21302 19.0825 7.67245L18.4162 9.28115C18.2258 9.74078 18.2255 10.2575 18.4168 10.7169L19.082 12.3251C19.1763 12.5527 19.2249 12.7966 19.2249 13.0429C19.225 13.2893 19.1765 13.5332 19.0822 13.7608C18.9879 13.9883 18.8497 14.1951 18.6755 14.3693C18.5013 14.5434 18.2945 14.6815 18.0669 14.7757L16.4582 15.4421C15.9988 15.632 15.6336 15.9966 15.443 16.4558L14.7762 18.0656C14.5859 18.525 14.2209 18.8901 13.7614 19.0804C13.302 19.2707 12.7858 19.2707 12.3264 19.0804L10.7177 18.414C10.2582 18.2242 9.7422 18.2246 9.28304 18.4151L7.67318 19.081C7.21401 19.2708 6.69825 19.2707 6.2392 19.0805C5.78014 18.8904 5.41533 18.5258 5.2249 18.0668L4.55788 16.4565C4.36793 15.9971 4.00332 15.632 3.54421 15.4413L1.93435 14.7745C1.47513 14.5843 1.11022 14.2195 0.919849 13.7603C0.729477 13.3012 0.729219 12.7852 0.919131 12.3258L1.58548 10.7171C1.77531 10.2577 1.77492 9.74167 1.5844 9.28252L0.91901 7.6715C0.824671 7.44395 0.776094 7.20005 0.776054 6.95372C0.776015 6.70739 0.824513 6.46346 0.91878 6.23588C1.01305 6.00831 1.15123 5.80153 1.32544 5.62738C1.49965 5.45322 1.70647 5.3151 1.93408 5.22091L3.54278 4.55456C4.00178 4.36478 4.36671 4.00063 4.55749 3.54205L5.22432 1.93219C5.41462 1.47277 5.77964 1.10775 6.23906 0.917451C6.69849 0.72715 7.2147 0.72715 7.67413 0.917451L9.28283 1.5838C9.74227 1.77363 10.2583 1.77324 10.7174 1.58272L12.328 0.918485C12.7874 0.72829 13.3034 0.728329 13.7628 0.918593C14.2221 1.10886 14.5871 1.47377 14.7774 1.93307L15.4444 3.54341L15.4442 3.54062Z" fill="url(#paint0_linear_2465_264295)" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.9166 7.37925C14.0502 7.1694 14.0949 6.91507 14.041 6.67221C13.9871 6.42935 13.8389 6.21785 13.6291 6.08425C13.4192 5.95065 13.1649 5.90588 12.922 5.9598C12.6792 6.01372 12.4677 6.1619 12.3341 6.37175L8.66283 12.1405L6.98283 10.0405C6.82751 9.84623 6.60138 9.72162 6.35418 9.69407C6.10699 9.66653 5.85897 9.73831 5.6647 9.89363C5.47043 10.0489 5.34582 10.2751 5.31827 10.5223C5.29073 10.7695 5.36251 11.0175 5.51783 11.2118L8.01783 14.3368C8.111 14.4534 8.23066 14.546 8.36687 14.6071C8.50308 14.6681 8.65189 14.6957 8.80094 14.6877C8.94998 14.6796 9.09494 14.6361 9.22376 14.5607C9.35258 14.4853 9.46154 14.3802 9.54158 14.2543L13.9166 7.37925Z" fill="white" />
                      </g>
                      <defs>
                        <linearGradient id="paint0_linear_2465_264295" x1="13.7616" y1="0.918114" x2="6.23862" y2="19.0803" gradientUnits="userSpaceOnUse">
                          <stop stop-color="#1594FF" />
                          <stop offset="1" stop-color="#0BC1A5" />
                        </linearGradient>
                        <clipPath id="clip0_2465_264295">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                ) : ('')}
              </p>
              {data.tagline && (
                <div className="flex items-center gap-2">
                  <Users className="text-omblue-500 w-4 h-4 2xl:w-scaled-4 2xl:h-scaled-4" />
                  <p className="text-h10 2xl:text-scaled-h10 font-medium text-blue-500">
                    {data.tagline}
                  </p>
                </div>
              )}
              <div className="hidden md:flex items-center gap-4">
                <div className="text-omblue-500 flex items-center gap-2">
                  <h6 className="text-h6 2xl:text-scaled-h6">{data.Rating}</h6>
                  <div className="flex items-center flex-row">
                    <StarRatings
                      starDimension="25px"
                      rating={data.Rating}
                      starRatedColor="rgba(35, 87, 198, 1)"
                      numberOfStars={5}
                      name="rating"
                      starSpacing="0px"
                      starHoverColor="#01AFD7"
                      svgIconViewBox="0 0 25 25"
                      svgIconPath="M21.9668 8.16346L21.9672 8.16461C22.0078 8.28943 22.0108 8.42343 21.9759 8.54996C21.941 8.67649 21.8697 8.78998 21.7708 8.87632L21.7701 8.87696L16.9704 13.0854L16.7465 13.2817L16.8124 13.5721L18.2277 19.8066L18.2278 19.8068C18.2569 19.9349 18.2478 20.0687 18.2015 20.1916C18.1552 20.3145 18.0738 20.421 17.9675 20.498L17.9672 20.4982C17.7495 20.656 17.4614 20.668 17.2332 20.5307L17.232 20.53L11.7567 17.2564L11.5001 17.103L11.2436 17.2563L5.7663 20.53L5.76615 20.53C5.65828 20.5946 5.54069 20.626 5.42339 20.626C5.28679 20.626 5.15017 20.5836 5.03147 20.4978C4.81444 20.341 4.71199 20.0706 4.77149 19.8064C4.77152 19.8063 4.77155 19.8062 4.77158 19.806L6.1868 13.5721L6.25271 13.2818L6.02889 13.0855L1.22916 8.87613L1.22821 8.87531C1.02694 8.69969 0.949845 8.42048 1.03307 8.16452L1.03324 8.164C1.0736 8.0394 1.14965 7.92937 1.25195 7.84758C1.35426 7.76579 1.47832 7.71582 1.60876 7.70387L7.95917 7.12734L8.25645 7.10035L8.37374 6.82586L10.8844 0.950474C10.991 0.70175 11.2325 0.542969 11.5001 0.542969C11.7676 0.542969 12.009 0.701641 12.1158 0.949201C12.1158 0.949426 12.1159 0.949651 12.116 0.949876L14.6264 6.82578L14.7437 7.1003L15.041 7.12729L21.3908 7.70391L21.3915 7.70397C21.5219 7.71564 21.646 7.76543 21.7483 7.84714C21.8506 7.92885 21.9266 8.03886 21.9668 8.16346Z"
                      style={{ margin: 'auto' }}
                    />
                  </div>
                  <div className="text-omblue-900 flex items-center cursor-pointer" onClick={handleClick(data?.ProfileDetailId)} >
                    <p className="text-h9 2xl:text-scaled-h9">
                      {data.Review} Reviews
                    </p>
                    <ChevronRight />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href={data.CompanyWebsite} target="_blank" rel="noopener noreferrer">
              <div
                className="p-2 w-8 h-8 border border-[#7FAAE3] flex items-center justify-center rounded-full cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_2739_51757)">
                    <path d="M11.5208 3.32748C11.7021 3.35682 11.8888 3.30793 12.0337 3.19504L12.1697 3.08926C11.0461 2.13548 9.59369 1.55859 8.00524 1.55859C5.19458 1.55771 2.81058 3.36037 1.92969 5.86971C2.53591 7.23326 3.31813 8.29815 4.28435 9.00393L4.49591 9.15415C4.57502 9.20926 4.65235 9.26348 4.72702 9.31859C4.73413 9.32393 4.74124 9.32926 4.74747 9.33459C5.0088 9.53015 5.23547 9.74437 5.35013 10.0626C5.43369 10.2955 5.42391 10.4804 5.41058 10.7141C5.39191 11.0635 5.36702 11.4973 5.67013 12.0004C5.94835 12.4626 6.30835 12.6519 6.57147 12.7906C6.77235 12.8964 6.8648 12.9488 6.95013 13.0777C7.19813 13.4493 7.07369 14.0199 7.0088 14.2475C6.99813 14.2857 6.98747 14.3204 6.97591 14.3586C7.31191 14.4128 7.65324 14.4484 8.00435 14.4484C10.7421 14.4484 13.0755 12.7381 14.0097 10.3293C13.5804 9.35771 13.0364 8.81193 12.3519 8.68215C11.6284 8.54526 11.0852 8.92571 10.647 9.23148C10.2772 9.48837 10.0372 9.64748 9.79458 9.59859C9.65502 9.57282 9.58924 9.50793 9.36791 9.24215C9.16169 8.99504 8.87902 8.65548 8.39724 8.37282C7.61413 7.91415 6.64169 7.79682 5.50035 8.02171C5.38747 7.70259 5.30302 7.23859 5.51991 6.79859C5.56702 6.70348 5.8248 6.22082 6.29413 6.09104C6.66569 5.98793 7.02569 6.16393 7.40436 6.34971C7.82835 6.55771 8.40791 6.84215 8.96791 6.48659C9.59547 6.08659 9.52702 5.33637 9.47191 4.73282C9.43191 4.29726 9.38658 3.80304 9.58213 3.55948C9.82302 3.25815 10.5306 3.17371 11.5208 3.32926V3.32748Z" fill="#204FB4" />
                    <path d="M8.00174 15.1128C4.08085 15.1128 0.890625 11.9226 0.890625 8.00174C0.890625 4.08085 4.08085 0.890625 8.00174 0.890625C11.9226 0.890625 15.1128 4.08085 15.1128 8.00174C15.1128 11.9226 11.9226 15.1128 8.00174 15.1128ZM8.00174 2.22396C4.81596 2.22396 2.22396 4.81596 2.22396 8.00174C2.22396 11.1875 4.81596 13.7795 8.00174 13.7795C11.1875 13.7795 13.7795 11.1875 13.7795 8.00174C13.7795 4.81596 11.1875 2.22396 8.00174 2.22396Z" fill="#204FB4" />
                  </g>
                  <defs>
                    <clipPath id="clip0_2739_51757">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </a>
            <div
              className="p-2 w-8 h-8 border border-[#7FAAE3] flex items-center justify-center rounded-full cursor-pointer"
              onClick={() => setFavourite(data, data.IsFavouriteProfile)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill={data.IsFavouriteProfile ? '#2357C6' : 'white'} xmlns="http://www.w3.org/2000/svg">
                <path d="M7.99913 1.55859L9.99024 5.59326L14.4436 6.24037L11.2214 9.3817L11.9822 13.8164L7.99913 11.723L4.01602 13.8164L4.77691 9.3817L1.55469 6.24037L6.00802 5.59326L7.99913 1.55859Z" stroke='#2357C6' stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              {/* <Favourite
                className="w-5 h-5 text-green-400"
                fill={data.IsFavouriteProfile ? 'currentColor' : 'white'}
              /> */}
            </div>
            {/* <button
              className="hidden flex-1 px-5 py-3.5 md:flex items-center gap-2 text-white bg-omblue-500 rounded-md"
              onClick={() =>
                router.push(
                  `/profile/${add2040ToProfileDetailsId(data?.ProfileDetailId)}`
                )
              }
            >
              <Eye className="w-4 h-4" />
              <p className="text-h9 2xl:text-scaled-h9 font-semibold">
                View Profile
              </p>
            </button> */}
          </div>
        </div>
        <div
          className="text-omblue-500 md:hidden flex items-center gap-2 ml-[54px] mobile:flex-wrap"
          style={{ marginTop: 0 }}
        >
          <h6 className="text-h6 2xl:text-scaled-h6">{data.Rating}</h6>
          <div className="flex items-center">
            {/* {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} />
            ))} */}
            <StarRatings
              starDimension="25px"
              rating={data.Rating}
              starRatedColor="rgba(35, 87, 198, 1)"
              numberOfStars={5}
              name="rating"
              starSpacing="0px"
              starHoverColor="#01AFD7"
              svgIconViewBox="0 0 25 25"
              svgIconPath="M21.9668 8.16346L21.9672 8.16461C22.0078 8.28943 22.0108 8.42343 21.9759 8.54996C21.941 8.67649 21.8697 8.78998 21.7708 8.87632L21.7701 8.87696L16.9704 13.0854L16.7465 13.2817L16.8124 13.5721L18.2277 19.8066L18.2278 19.8068C18.2569 19.9349 18.2478 20.0687 18.2015 20.1916C18.1552 20.3145 18.0738 20.421 17.9675 20.498L17.9672 20.4982C17.7495 20.656 17.4614 20.668 17.2332 20.5307L17.232 20.53L11.7567 17.2564L11.5001 17.103L11.2436 17.2563L5.7663 20.53L5.76615 20.53C5.65828 20.5946 5.54069 20.626 5.42339 20.626C5.28679 20.626 5.15017 20.5836 5.03147 20.4978C4.81444 20.341 4.71199 20.0706 4.77149 19.8064C4.77152 19.8063 4.77155 19.8062 4.77158 19.806L6.1868 13.5721L6.25271 13.2818L6.02889 13.0855L1.22916 8.87613L1.22821 8.87531C1.02694 8.69969 0.949845 8.42048 1.03307 8.16452L1.03324 8.164C1.0736 8.0394 1.14965 7.92937 1.25195 7.84758C1.35426 7.76579 1.47832 7.71582 1.60876 7.70387L7.95917 7.12734L8.25645 7.10035L8.37374 6.82586L10.8844 0.950474C10.991 0.70175 11.2325 0.542969 11.5001 0.542969C11.7676 0.542969 12.009 0.701641 12.1158 0.949201C12.1158 0.949426 12.1159 0.949651 12.116 0.949876L14.6264 6.82578L14.7437 7.1003L15.041 7.12729L21.3908 7.70391L21.3915 7.70397C21.5219 7.71564 21.646 7.76543 21.7483 7.84714C21.8506 7.92885 21.9266 8.03886 21.9668 8.16346Z"
              style={{ margin: 'auto' }}
            />
          </div>
          <div className="text-omblue-900 flex items-center mobile:w-full">
            <p className="text-h9 2xl:text-scaled-h9">{data.Review} Reviews</p>
            <ChevronRight />
          </div>
        </div>
        <hr className="border-b border-[#D2D4DA]" />
        <div className="grid grid-cols-12 gap-4">
          <div className="border-b md:border-0 border-[#D2D4DA] py-4 col-span-12 md:col-span-3 space-y-1">
            <p className="text-black-500 text-h9 2xl:text-scaled-h9 font-semibold">
              Business Information
            </p>
            <div className="grid grid-cols-2 md:grid-cols-1">
              {/* {data.IsVerified ? (
                <div className="text-[#1A9E78] flex items-center gap-2 py-1">
                  <StyledTick className="w-6 h-6" />
                  <p className="text-h9 2xl:text-scaled-h9 font-medium">
                    Verified
                  </p>
                </div>
              ) : (
                <div className="text-[#E88206] flex items-center gap-2 py-1">
                  <div className="p-0.5 flex items-center justify-center rounded-full bg-[#E88206] text-white">
                    <Add className="rotate-45 w-5 h-5" />
                  </div>
                  <p className="text-h9 2xl:text-scaled-h9 font-medium">
                    Not Verified
                  </p>
                </div>
              )} */}
              <div className="relative group flex items-center gap-2 py-1">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.9994 13.1974C16.2126 13.8069 17.2528 14.785 18.0121 16.008C18.1624 16.2502 18.2376 16.3713 18.2636 16.539C18.3164 16.8798 18.0834 17.2988 17.766 17.4336C17.6098 17.5 17.4341 17.5 17.0827 17.5M13.3327 9.6102C14.5675 8.99657 15.416 7.72238 15.416 6.25C15.416 4.77762 14.5675 3.50343 13.3327 2.8898M11.666 6.25C11.666 8.32107 9.98711 10 7.91604 10C5.84497 10 4.16604 8.32107 4.16604 6.25C4.16604 4.17893 5.84497 2.5 7.91604 2.5C9.98711 2.5 11.666 4.17893 11.666 6.25ZM2.13207 15.782C3.46066 13.7871 5.55719 12.5 7.91604 12.5C10.2749 12.5 12.3714 13.7871 13.7 15.782C13.9911 16.219 14.1366 16.4375 14.1198 16.7166C14.1068 16.9339 13.9643 17.2 13.7907 17.3313C13.5676 17.5 13.2609 17.5 12.6474 17.5H3.18467C2.57118 17.5 2.26444 17.5 2.04141 17.3313C1.86775 17.2 1.72528 16.9339 1.71224 16.7166C1.69548 16.4375 1.84101 16.219 2.13207 15.782Z" stroke="#2357C6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <p className="text-[#0A193A] text-[14px] 2xl:text-scaled-h9 font-[500]">
                  {data?.Size}
                  {/* {data.Timeline || 0} */}
                </p>
                <span className="pointer-events-none z-50 absolute left-0  bottom-full mt-2 hidden rounded-sm border border-slate-200 bg-white p-1 px-2 text-xs text-omblue-700 shadow-lg group-hover:block">
                  {"Number of employees"}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-1">
              <div className="relative group flex items-center gap-2 py-1">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.16927 14.9496C7.4882 14.7357 5.95165 13.8897 4.87193 12.5836C3.79221 11.2775 3.25034 9.60925 3.35645 7.91795C3.46257 6.22665 4.20871 4.63921 5.44322 3.47829C6.67774 2.31736 8.30798 1.67007 10.0026 1.66797C11.6993 1.66671 13.3326 2.31242 14.5698 3.47354C15.807 4.63465 16.5549 6.2238 16.6612 7.91717C16.7674 9.61054 16.224 11.2807 15.1417 12.5874C14.0593 13.894 12.5195 14.7388 10.8359 14.9496V16.678C14.1243 16.7546 16.6693 17.2805 16.6693 17.918C16.6693 18.608 13.6843 19.168 10.0026 19.168C6.32094 19.168 3.33594 18.608 3.33594 17.918C3.33594 17.2805 5.88094 16.7546 9.16927 16.678V14.9496ZM10.0026 13.3346C11.3287 13.3346 12.6005 12.8079 13.5381 11.8702C14.4758 10.9325 15.0026 9.66072 15.0026 8.33464C15.0026 7.00855 14.4758 5.73679 13.5381 4.7991C12.6005 3.86142 11.3287 3.33464 10.0026 3.33464C8.67652 3.33464 7.40475 3.86142 6.46707 4.7991C5.52939 5.73679 5.0026 7.00855 5.0026 8.33464C5.0026 9.66072 5.52939 10.9325 6.46707 11.8702C7.40475 12.8079 8.67652 13.3346 10.0026 13.3346ZM10.0026 10.0013C9.56058 10.0013 9.13665 9.82571 8.82409 9.51315C8.51153 9.20059 8.33594 8.77666 8.33594 8.33464C8.33594 7.89261 8.51153 7.46869 8.82409 7.15613C9.13665 6.84357 9.56058 6.66797 10.0026 6.66797C10.4446 6.66797 10.8686 6.84357 11.1811 7.15613C11.4937 7.46869 11.6693 7.89261 11.6693 8.33464C11.6693 8.77666 11.4937 9.20059 11.1811 9.51315C10.8686 9.82571 10.4446 10.0013 10.0026 10.0013Z" fill="#2357C6" />
                </svg>
                <p className="text-[#0A193A] text-[14px] 2xl:text-scaled-h9 font-[500]">
                  {data?.Country + ' , ' + data.City}
                </p>
                <span className="pointer-events-none z-50 absolute left-0 bottom-full mt-2 hidden rounded-sm border border-slate-200 bg-white p-1 px-2 text-xs text-omblue-700 shadow-lg group-hover:block">
                  {'Location'}
                </span>
              </div>
              <div className="relative group flex items-center gap-2 py-1">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_2465_264312)">
                    <path d="M13.3359 11.6654H14.5859V14.0154L16.6193 15.1904L15.9943 16.2737L13.3359 14.7404V11.6654ZM14.1693 9.9987C13.0642 9.9987 12.0044 10.4377 11.223 11.2191C10.4416 12.0005 10.0026 13.0603 10.0026 14.1654C10.0026 15.2704 10.4416 16.3302 11.223 17.1116C12.0044 17.893 13.0642 18.332 14.1693 18.332C15.2743 18.332 16.3341 17.893 17.1155 17.1116C17.8969 16.3302 18.3359 15.2704 18.3359 14.1654C18.3359 13.0603 17.8969 12.0005 17.1155 11.2191C16.3341 10.4377 15.2743 9.9987 14.1693 9.9987ZM14.1693 8.33203C15.7164 8.33203 17.2001 8.94661 18.2941 10.0406C19.388 11.1345 20.0026 12.6183 20.0026 14.1654C20.0026 15.7125 19.388 17.1962 18.2941 18.2902C17.2001 19.3841 15.7164 19.9987 14.1693 19.9987C11.8443 19.9987 9.83594 18.632 8.89427 16.6654H0.835938V14.1654C0.835938 11.9487 5.2776 10.832 7.5026 10.832C8.0026 10.832 8.61927 10.8904 9.26927 10.9987C9.79772 10.1798 10.5232 9.50652 11.3793 9.04063C12.2353 8.57474 13.1946 8.3311 14.1693 8.33203ZM8.33594 14.1654C8.33594 13.582 8.41927 13.0154 8.5776 12.4987C8.2276 12.4404 7.86094 12.4154 7.5026 12.4154C5.0276 12.4154 2.41927 13.632 2.41927 14.1654V15.082H8.41094C8.36185 14.7789 8.33677 14.4724 8.33594 14.1654ZM7.5026 3.33203C8.38666 3.33203 9.23451 3.68322 9.85963 4.30834C10.4847 4.93346 10.8359 5.78131 10.8359 6.66536C10.8359 7.54942 10.4847 8.39727 9.85963 9.02239C9.23451 9.64751 8.38666 9.9987 7.5026 9.9987C6.61855 9.9987 5.7707 9.64751 5.14558 9.02239C4.52046 8.39727 4.16927 7.54942 4.16927 6.66536C4.16927 5.78131 4.52046 4.93346 5.14558 4.30834C5.7707 3.68322 6.61855 3.33203 7.5026 3.33203ZM7.5026 4.91536C7.03848 4.91536 6.59336 5.09974 6.26517 5.42793C5.93698 5.75612 5.7526 6.20124 5.7526 6.66536C5.7526 7.12949 5.93698 7.57461 6.26517 7.9028C6.59336 8.23099 7.03848 8.41536 7.5026 8.41536C7.96673 8.41536 8.41185 8.23099 8.74004 7.9028C9.06823 7.57461 9.2526 7.12949 9.2526 6.66536C9.2526 6.20124 9.06823 5.75612 8.74004 5.42793C8.41185 5.09974 7.96673 4.91536 7.5026 4.91536Z" fill="#2357C6" />
                  </g>
                  <defs>
                    <clipPath id="clip0_2465_264312">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <p className="text-[#0A193A] text-[14px] 2xl:text-scaled-h9 font-[500]">
                  {data.BlackOwnedPercent}
                </p>
                <span className="pointer-events-none z-50 absolute left-0 bottom-full mt-2 hidden rounded-sm border border-slate-200 bg-white px-2 py-1 text-xs text-omblue-700 shadow-lg group-hover:block">
                  {'Percent Black ownership'}
                </span>
              </div>
            </div>
          </div>

          <div className="border-b md:border-0 border-[#D2D4DA] py-4 col-span-12 md:col-span-3 space-y-3">
            <p className="text-black-500 text-h9 2xl:text-scaled-h9 font-semibold">
              Services or Product
            </p>

            {!!data?.ServiceModels?.length ? (
              <>
                {isExpanded
                  ? data.ServiceModels.map((service, index) => (
                    <div className="flex items-center gap-2" key={index}>
                      <p className="px-2 py-1 bg-[#E9EEF9] text-[#2357C6] font-[600] text-[14px] border rounded-[30px]">
                        {service.ServicePercentage}%
                      </p>
                      <p className="text-[14px] 2xl:text-scaled-h9 font-[500] text-[#0A193A]">
                        {service.ServiceName}
                      </p>
                    </div>
                  ))
                  : data.ServiceModels.slice(0, 2).map((service, index) => (
                    <div className="flex items-center gap-2" key={index}>
                      <p className="px-2 py-1 bg-[#E9EEF9] text-[#2357C6] font-[600] text-[14px] rounded-[30px]">
                        {service.ServicePercentage}%
                      </p>
                      <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-500">
                        {typeof service === 'string' ? service : service.ServiceName}
                      </p>
                    </div>
                  ))}

                {/* Show More / Show Less Button */}
                {data.ServiceModels.length > 4 && (
                  <button
                    className="text-omblue-600 text-h9 2xl:text-scaled-h9 font-medium"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? 'Show Less' : '...Show More'}
                  </button>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                No Service Model Found
              </div>
            )}
          </div>
          <div className="col-span-12 md:col-span-3 space-y-2">
            <p className="text-black-500 text-h9 2xl:text-scaled-h9 font-semibold mt-3">
              Latest Review
            </p>

            {data.LatestReview ? (
              <>
                <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-400">
                  {data.LatestReview}
                </p>

                <div className="flex items-center gap-2">
                  <div className="text-olblue-700 ">
                    <Feather />
                  </div>
                  <p className="text-h10 2xl:text-scaled-h10 font-semibold text-olblue-700">
                    - {data.ReviewedBy}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-400">
                {`No reviews received yet`}
              </p>
            )}
          </div>
          <div className="col-span-12 md:col-span-3">
            <div className="flex flex-row md:flex-col gap-2 text-omblue-600 ">
              <a
                className="flex items-center justify-center w-full ipad:w-auto sm:flex-1 border border-[#BBCBED] rounded-[30px] gap-2 px-4 py-3.5 text-h9 2xl:text-scaled-h9 "
                href={data.CompanyWebsite || 'https://google.com'}
                target="_blank"
              >
                <Globe className="2xl:w-scaled-4 2xl:h-scaled-4 xs:w-4 xs:h-4 flex-shrink-0" />
                <p className="hidden sm:flex text-[14px] text-nowrap text-[#204FB4] font-[500]">View Website</p>
              </a>
              <button
                className="flex items-center justify-center w-full ipad:w-auto sm:flex-1 border border-[#BBCBED] rounded-[30px] bg-[#2357C6] gap-2 px-4 py-3.5 text-h9 2xl:text-scaled-h9 "
                onClick={() => {
                  const payload = {
                    UserId: data?.UserId,
                    ProfilePicture: data?.ProfilePicture,
                    FullName: data?.ChatUserName,
                    LastActive: data?.LastActive,
                    UserProfileId: data?.ProfileDetailId,
                  };
                  localStorage.setItem('chatDetails', JSON.stringify(payload));
                  router.push('/chats');
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_2739_52198)">
                    <path d="M7.99913 1.55859C4.44002 1.55859 1.55469 4.44393 1.55469 8.00304C1.55469 9.17548 1.87291 10.2715 2.41958 11.2181C2.8018 11.9346 2.37247 13.6288 1.55469 14.4475C2.6658 14.5079 4.1298 14.0057 4.78402 13.5826C5.21869 13.8333 5.90758 14.1657 6.8098 14.3364C7.19469 14.4093 7.59291 14.4475 7.99913 14.4475C11.5582 14.4475 14.4436 11.5621 14.4436 8.00304C14.4436 4.44393 11.5582 1.55859 7.99913 1.55859Z" stroke="#FBFBFD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path opacity="0.75" d="M7.99826 8.89496C7.5076 8.89496 7.10938 8.49585 7.10938 8.00608C7.10938 7.5163 7.5076 7.11719 7.99826 7.11719C8.48893 7.11719 8.88715 7.5163 8.88715 8.00608C8.88715 8.49585 8.48893 8.89496 7.99826 8.89496Z" fill="#FBFBFD" />
                    <path d="M4.88889 8.89496C4.39822 8.89496 4 8.49585 4 8.00608C4 7.5163 4.39822 7.11719 4.88889 7.11719C5.37956 7.11719 5.77778 7.5163 5.77778 8.00608C5.77778 8.49585 5.37956 8.89496 4.88889 8.89496Z" fill="#FBFBFD" />
                    <path opacity="0.5" d="M11.1076 8.89496C10.617 8.89496 10.2188 8.49585 10.2188 8.00608C10.2188 7.5163 10.617 7.11719 11.1076 7.11719C11.5983 7.11719 11.9965 7.5163 11.9965 8.00608C11.9965 8.49585 11.5983 8.89496 11.1076 8.89496Z" fill="#FBFBFD" />
                  </g>
                  <defs>
                    <clipPath id="clip0_2739_52198">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <p className="hidden sm:flex text-[14px] text-[#FBFBFD] font-[500]">Chat</p>
              </button>
              <button
                className="flex flex-1 px-5 py-3.5 md:hidden items-center justify-center gap-2 text-white bg-omblue-500 rounded-md"
                onClick={() =>
                  router.push(
                    `/profile/${add2040ToProfileDetailsId(
                      data?.ProfileDetailId
                    )}`
                  )
                }
              >
                <Eye className="w-4 h-4" />
                <p className="text-h9 2xl:text-scaled-h9 font-semibold">
                  View Profile
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultCard;

import React from 'react';
import Image from 'next/image';
import { renderProfileShape, profileTypes } from '@/utils/profile-shapes';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import Link from 'next/link';
import { size } from 'lodash';


export const NewProfileCard = ({ feed }) => {
  console.log('Rendering NewProfileCard with feed:', feed);
  const profileType =
    profileTypes.find((profile) => profile.value == feed?.User?.ProfileType)
      ?.label || '';

  return (
    <div className="relative p-8 mb-4  flex items-center bg-white rounded-2xl shadow-blur overflow-hidden justify-between gap-8 min-h-[214px]">

      <Image
        src={`/icons/signup/${feed?.User?.ProfileType}.svg`}
        alt="Profile Icon"
        width={560}
        height={480}
        className="absolute w-[140px] md:w-[280px] rotate-[10deg] md:ml-14 pointer-events-none"
      />
      <div className="flex-shrink-0">
        <Link href={`/profile/${add2040ToProfileDetailsId(feed?.User?.ProfileDetails?.Id)}`} className="text-sm text-gray-500 hover:text-gray-700">
          <h2 className="text-lg md:text-[34px] md:ml-8 mb-8 font-bold text-[#0A193A]">
            New {profileType === 'Black-owned Business' ? 'Business' : profileType}
          </h2>
        </Link>

      </div>

      <div className="absolute bottom-9 right-1/2 md:right-1/3 flex items-center gap-2">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.16658 14.9457C7.48551 14.7318 5.94896 13.8858 4.86924 12.5797C3.78952 11.2736 3.24765 9.60534 3.35377 7.91404C3.45989 6.22274 4.20603 4.6353 5.44054 3.47438C6.67505 2.31346 8.30529 1.66617 9.99992 1.66406C11.6966 1.6628 13.33 2.30851 14.5671 3.46963C15.8043 4.63075 16.5522 6.21989 16.6585 7.91326C16.7647 9.60663 16.2213 11.2768 15.139 12.5835C14.0566 13.8901 12.5168 14.7349 10.8333 14.9457L10.8333 16.6741C14.1216 16.7507 16.6666 17.2766 16.6666 17.9141C16.6666 18.6041 13.6816 19.1641 9.99992 19.1641C6.31825 19.1641 3.33325 18.6041 3.33325 17.9141C3.33325 17.2766 5.87825 16.7507 9.16658 16.6741L9.16658 14.9457ZM9.99992 13.3307C11.326 13.3307 12.5978 12.8039 13.5355 11.8663C14.4731 10.9286 14.9999 9.65681 14.9999 8.33073C14.9999 7.00465 14.4731 5.73288 13.5355 4.7952C12.5978 3.85752 11.326 3.33073 9.99992 3.33073C8.67384 3.33073 7.40207 3.85752 6.46438 4.7952C5.5267 5.73288 4.99992 7.00465 4.99992 8.33073C4.99992 9.65681 5.5267 10.9286 6.46438 11.8663C7.40207 12.8039 8.67384 13.3307 9.99992 13.3307ZM9.99992 9.9974C9.55789 9.9974 9.13397 9.8218 8.82141 9.50924C8.50885 9.19668 8.33325 8.77276 8.33325 8.33073C8.33325 7.8887 8.50885 7.46478 8.82141 7.15222C9.13397 6.83966 9.55789 6.66406 9.99992 6.66406C10.4419 6.66406 10.8659 6.83966 11.1784 7.15222C11.491 7.46478 11.6666 7.8887 11.6666 8.33073C11.6666 8.77276 11.491 9.19668 11.1784 9.50924C10.8659 9.8218 10.4419 9.9974 9.99992 9.9974Z" fill="#2357C6" />
        </svg>

        <p className="text-[10px] md:text-lg font-semibold  text-gray-600">
          {feed?.City || 'New York'}
        </p>
      </div>

      <div className="flex-shrink-0">
        <Link href={`/profile/${add2040ToProfileDetailsId(feed?.User?.ProfileDetails?.Id)}`} >
          {renderProfileShape(
            feed?.User?.ProfileType,
            feed?.User.ProfileDetails?.ProfilePicture,
            feed?.User.Name,   
          )}
        </Link>
      </div>
    </div>
  );
};

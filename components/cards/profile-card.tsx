import { cn } from '@/utils/utils';
import Image, { StaticImageData } from 'next/image';
import React from 'react';
import crown from '@/public/images/vector/crown.svg';
import { useRouter } from 'next/navigation';
import { checkOnlineStatus } from '@/utils/helper';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';

interface IProps {
  image?: string;
  StrategyName?: string;
  name: string;
  company?: string;
  icon?: string | React.ReactNode | StaticImageData;
  isImage?: boolean;
  variant?: 'sm' | 'lg' | 'xl';
  isTeamImage?: string[];
  profileId?: null;
  chatDetails?: any;
  className?: string;
  usernameClasses?: string;
}

const ProfileCard: React.FC<IProps> = ({
  image,
  StrategyName,
  name,
  company,
  icon = crown,
  isImage = true,
  variant = 'lg',
  isTeamImage,
  profileId,
  chatDetails,
  className,
  usernameClasses,
}) => {
  const router = useRouter();

  return (
    <div className={`flex items-start gap-2 ${className} `}>
      <div
        className={cn(
          'rounded-full flex flex-wrap gap-0 ',
          variant === 'xl'
            ? 'w-16 h-16'
            : variant === 'lg'
              ? 'w-12 h-12'
              : 'max-w-9 max-h-9 h-full w-full'
        )}
      >
        {!isTeamImage ? (
          <div className="relative">
            <Image
              src={image}
              alt={name}
              width={variant === 'xl' ? 64 : variant === 'lg' ? 48 : 36}
              height={variant === 'xl' ? 64 : variant === 'lg' ? 48 : 36}
              className="max-w-12 w-12 max-h-12 h-12 rounded-full border object-cover"
            />
            {checkOnlineStatus(chatDetails?.LastActive) === 'online' ? (
              <div className="absolute right-0 bottom-0 bg-green-500 rounded-full w-3 h-3 text-green-600 inline-block font-semibold">
                {/* <p>Active</p> */}
              </div>
            ) : (
              <div className="absolute right-0 bottom-0 bg-gray-500 rounded-full w-3 h-3 text-white inline-block font-semibold">
                {/* <p>{checkOnlineStatus(profileData.LastActive)}</p> */}
              </div>
            )}
          </div>
        ) : (
          <div className="flex">
            {/* Display the first image */}
            <Image
              src={isTeamImage[0]}
              alt={name}
              width={variant === 'xl' ? 64 : variant === 'lg' ? 24 : 36}
              height={variant === 'xl' ? 64 : variant === 'lg' ? 48 : 36}
              className={`${isTeamImage.length === 1 ? 'w-[24px]' : 'w-[24px]'
                } h-[24px] border-r`}
            />

            {/* Conditional rendering based on the length of isTeamImage */}
            {isTeamImage.length > 1 && (
              <div className="flex flex-col">
                {/* Display the second image */}
                <Image
                  src={isTeamImage[1]}
                  alt={name}
                  width={variant === 'xl' ? 64 : variant === 'lg' ? 24 : 36}
                  height={variant === 'xl' ? 64 : variant === 'lg' ? 24 : 36}
                  className={`w-[24px] ${isTeamImage.length === 2 ? 'h-[48px]' : 'h-[24px]'
                    } border-b border-l`}
                />

                {/* If more than 2 images are present, display the third image */}
                {isTeamImage.length > 2 && (
                  <Image
                    src={isTeamImage[2]}
                    alt={name}
                    width={variant === 'xl' ? 64 : variant === 'lg' ? 24 : 36}
                    height={variant === 'xl' ? 64 : variant === 'lg' ? 24 : 36}
                    className="w-[24px] h-[24px] border-t border-l"
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex-1">
        <p
          className={`font-semibold text-black-500 mb-1 mt-2 ms-2 ${usernameClasses} capitalize cursor-pointer
           ${variant === 'lg' || variant === 'xl'
              ? 'text-xs 2xl:text-scaled-h6'
              : 'text-xs 2xl:text-scaled-h10'
            }`}
          onClick={() => {
            profileId &&
              router.push(`/profile/${add2040ToProfileDetailsId(profileId)}`);
          }}
        >
          {name}
        </p>
        <div className="flex items-center gap-1.5 cursor-default ms-2">
          <div className="w-[14px] h-[14px] 3xl:w-4 3xl:h-4 flex items-center">
            {isImage ? (
              <Image
                src={icon as StaticImageData | string}
                alt={name}
                width={16}
                height={16}
              />
            ) : (
              React.isValidElement(icon) ? icon : null
            )}
          </div>
          <p
            className={` text-blue-300 ${usernameClasses}  ${variant === 'lg' || variant === 'xl'
              ? 'font-medium text-xs 2xl:text-xs text-nowrap truncate'
              : 'font-normal text-xs 2xl:text-xs text-nowrap max-w-20 truncate'
              }`}
          >
            {company === 'Black-owned Business' ? 'Business' : company}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

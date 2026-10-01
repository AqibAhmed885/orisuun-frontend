import { cn } from '@/utils/utils';
import Image from 'next/image';
import React from 'react';
import crown from '@/public/images/vector/crown.svg';
import { useRouter } from 'next/navigation';
import { checkOnlineStatus, TypeIcons } from '@/utils/helper';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';
import TeamProfile from '@/app/(dashboard)/(users)/(main)/settings/components/TeamProfileImage';
import BlackOwnedBusinessIcon from '@/icons/profile-types/black-owned-business-icon';
import ConsultantIcon from '@/icons/profile-types/consultant-icon';
import ExpertsIcon from '@/icons/profile-types/expert-icon';
import AdvocatesIcon from '@/icons/profile-types/advocate-icon';
import ProfessionalsIcon from '@/icons/profile-types/professional-icon';
import InvestorsIcon from '@/icons/profile-types/investor-icon';
import MentorsIcon from '@/icons/profile-types/mentor-icon';
import Users from '@/icons/users';


interface TeamMember {
    Name: string;
    ProfilePicture?: string;
    ProfileTypeId?: number;
    UserId?: string;
    Status?: string;
}

interface IProps {
    name: string;
    image?: string[];
    profileTypeIds?: number[];
    isImage?: boolean;
    icon?: any;
    variant?: 'sm' | 'lg' | 'xl';
    profileId?: string | null;
    chatDetails?: any;
    className?: string;
    usernameClasses?: string;
    teamMembers?: TeamMember[];
}

const TeamCard: React.FC<IProps> = ({
    name,
    profileTypeIds,
    isImage = true,
    icon,
    variant = 'lg',
    profileId,
    chatDetails,
    className,
    usernameClasses,
    teamMembers,
    image
}) => {
    const router = useRouter();
    const renderProfileTypeIcon = (userProfileType) => {
        switch (userProfileType) {
            case 1:
                return (
                    <p className="flex items-center gap-1">
                        <BlackOwnedBusinessIcon className="fill-[#2357C6] text-[#2357C6] w-4" />
                        Business Member
                    </p>

                );
            case 2:
                return (
                    <p className="flex items-center gap-1">
                        <ConsultantIcon className="fill-[#2357C6] text-[#2357C6] w-4" />{' '}
                        Consultant
                    </p>
                );
            case 3:
                return (
                    <p className="flex items-center gap-1">
                        <ExpertsIcon className="fill-[#2357C6] text-[#2357C6] w-4" /> Expert
                    </p>
                );
            case 4:
                return (
                    <p className="flex items-center gap-1">
                        <AdvocatesIcon className="fill-[#2357C6] text-[#2357C6] w-4" />{' '}
                        Advocate
                    </p>
                );
            case 6:
                return (
                    <p className="flex items-center gap-1">
                        <ProfessionalsIcon className="fill-[#2357C6] text-[#2357C6] w-4" />{' '}
                        Professional
                    </p>
                );
            case 7:
                return (
                    <p className="flex items-center gap-1">
                        <InvestorsIcon className="fill-[#2357C6] text-[#2357C6] w-4" />{' '}
                        Investor
                    </p>
                );
            case 8:
                return (
                    <p className="flex items-center gap-1">
                        <MentorsIcon className="fill-[#2357C6] text-[#2357C6] w-4" /> Mentor
                    </p>
                );
            default:
                return (
                    <p className="flex items-center gap-1">
                        <ProfessionalsIcon className="fill-[#2357C6] text-[#2357C6] w-4" />{' '}
                        Professional{' '}
                    </p>
                );
        }
    };
    return (
        <div className={cn('flex items-center gap-2 pb-3', className)}>
            <div
                className={cn(
                    'rounded-full flex flex-wrap gap-0',
                    variant === 'xl'
                        ? 'w-16 h-16'
                        : variant === 'lg'
                            ? 'w-12 h-12'
                            : 'w-9 h-9'
                )}
            >
                {teamMembers && teamMembers.length > 0 && (
                    <TeamProfile members={teamMembers} count={teamMembers.length} />
                )}
            </div>
            <div className="flex-1 flex flex-col justify-center">
                <p
                    className={cn(
                        'font-semibold text-black-500 capitalize cursor-pointer',
                        variant === 'lg' || variant === 'xl'
                            ? 'text-xs 2xl:text-scaled-h6'
                            : 'text-xs 2xl:text-scaled-h10',
                        usernameClasses
                    )}
                    onClick={() => {
                        profileId &&
                            router.push(`/settings/teamprofile/${profileId}`);
                    }}
                >
                    {name}
                </p>
                {profileTypeIds?.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap mt-1">
                        {profileTypeIds.map((typeId, idx) => (
                            <div key={idx} className="flex items-center gap-1 text-xs text-blue-300">
                                {renderProfileTypeIcon(typeId)}
                            </div>
                        ))}
                    </div>
                )}

                <p className='text-[#2357C6] text-xs flex mt-2 gap-2'> <Users className="w-4 h-4 " />{teamMembers.length} members</p>

            </div>
        </div>
    );
};

export default TeamCard;

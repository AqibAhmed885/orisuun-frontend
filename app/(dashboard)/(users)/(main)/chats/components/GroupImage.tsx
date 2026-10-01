import React from 'react';
import Image from 'next/image';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';

interface GroupImageProps {
    members: Array<{
        Id: string;
        ProfileImage?: string;
    }>;
    className?: string; // for external sizing like w-16, h-16
}

const GroupImage: React.FC<GroupImageProps> = ({ members, className = 'w-12 h-12' }) => {
    const visibleMembers = members.slice(0, 4);
    const borderSize = 2;

    if (visibleMembers.length === 0) {
        return (
            <div className={`relative rounded-full overflow-hidden bg-gray-200 ${className}`}>
                <Image
                    src={BASE_URL}
                    alt="Group"
                    fill
                    className="object-cover"
                />
            </div>
        );
    }

    if (visibleMembers.length === 1) {
        return (
            <div className={`relative rounded-full overflow-hidden ${className}`}>
                <Image
                    src={visibleMembers[0].ProfileImage || BASE_URL}
                    alt="Member 1"
                    fill
                    className="object-cover"
                />
            </div>
        );
    }

    if (visibleMembers.length === 2) {
        return (
            <div className={`relative flex rounded-full overflow-hidden bg-white ${className}`}>
                {visibleMembers.map((member, index) => (
                    <div
                        key={member.Id}
                        className="relative w-1/2 h-full"
                        style={{
                            borderRight: index === 0 ? `${borderSize}px solid white` : 'none',
                        }}
                    >
                        <Image
                            src={member.ProfileImage || BASE_URL}
                            alt={`Member ${index + 1}`}
                            fill
                            className="object-cover"
                        />
                    </div>
                ))}
            </div>
        );
    }

    if (visibleMembers.length === 3) {
        return (
            <div className={`relative overflow-hidden rounded-full bg-white ${className}`}>
                <div className="flex h-1/2 w-full">
                    {visibleMembers.slice(0, 2).map((member, index) => (
                        <div
                            key={member.Id}
                            className="relative w-1/2 h-full"
                            style={{
                                borderRight: index === 0 ? `${borderSize}px solid white` : 'none',
                                borderBottom: `${borderSize}px solid white`,
                            }}
                        >
                            <Image
                                src={member.ProfileImage || BASE_URL}
                                alt={`Member ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 relative">
                    <Image
                        src={visibleMembers[2].ProfileImage || BASE_URL}
                        alt="Member 3"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>
        );
    }

    // 4 Members
    return (
        <div className={`relative flex flex-wrap overflow-hidden rounded-full bg-white ${className}`}>
            {visibleMembers.map((member, index) => (
                <div
                    key={member.Id}
                    className="relative w-1/2 h-1/2"
                    style={{
                        borderRight: (index % 2 === 0) ? `${borderSize}px solid white` : 'none',
                        borderBottom: index < 2 ? `${borderSize}px solid white` : 'none',
                    }}
                >
                    <Image
                        src={member.ProfileImage || BASE_URL}
                        alt={`Member ${index + 1}`}
                        fill
                        className="object-cover"
                    />
                </div>
            ))}
        </div>
    );
};

export default GroupImage;

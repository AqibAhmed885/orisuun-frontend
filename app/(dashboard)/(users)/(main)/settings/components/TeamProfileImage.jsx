import Image from 'next/image';

const TeamProfile = ({ members = [], count }) => {
    // Ensure members is an array and take only the first 3 members
    const displayMembers = Array.isArray(members) ? members.slice(0, 3) : [];
    const memberCount = displayMembers.length;

    return (
        <div className="relative w-[60px] h-[60px] md:w-[90px] md:h-[90px]">
            {/* Single member */}
            {count == 1 && (
                <div className="absolute bottom-0 left-0 pb-4 px-2">
                    <Image
                        src={displayMembers[0]?.ProfilePicture || "https://orisuundocumentsdev.blob.core.windows.net/user-profile/defaultuser.png"}
                        alt="Team Member 1"
                        width={40}
                        height={40}
                        className="rounded-full border-2 border-profile-frame md:w-[60px] md:h-[60px]"
                    />
                </div>
            )}

            {/* Two members */}
            {count == 2 && (
                <>

                    <div className="absolute bottom-[px] md:left-[14px] z-10 border-[3.2px] rounded-full border-white">
                        <Image
                            src={displayMembers[0]?.ProfilePicture || "https://orisuundocumentsdev.blob.core.windows.net/user-profile/defaultuser.png"}
                            alt="Team Member 1"
                            width={32}
                            height={32}
                            className="rounded-full border-2 border-profile-frame md:w-[48px] md:h-[48px]"
                        />
                    </div>
                    <div className="absolute bottom-1 left-0 ">
                        <Image
                            src={displayMembers[1]?.ProfilePicture || "https://orisuundocumentsdev.blob.core.windows.net/user-profile/defaultuser.png"}
                            alt="Team Member 2"
                            width={32}
                            height={32}
                            className="rounded-full border-2 border-profile-frame md:w-[48px] md:h-[48px]"
                        />
                    </div>
                </>
            )}

            {/* Three members */}
            {count >= 3 && (
                <>
                    <div className="absolute bottom-[20px] left-0 md:bottom-[30px] border-[3.2px] rounded-full">
                        <Image
                            src={displayMembers[0]?.ProfilePicture || "https://orisuundocumentsdev.blob.core.windows.net/user-profile/defaultuser.png"}
                            alt="Team Member 1"
                            width={28}
                            height={28}
                            className="rounded-full border-2 border-profile-frame md:w-[42px] md:h-[42px]"
                        />
                    </div>
                    <div className="absolute bottom-0 left-0 z-20">
                        <Image
                            src={displayMembers[1]?.ProfilePicture || "https://orisuundocumentsdev.blob.core.windows.net/user-profile/defaultuser.png"}
                            alt="Team Member 2"
                            width={28}
                            height={28}
                            className="rounded-full border-2 border-profile-frame md:w-[42px] md:h-[42px]"
                        />
                    </div>
                    <div className="absolute bottom-2 left-4 z-25 md:bottom-4 md:left-6">
                        <Image
                            src={displayMembers[2]?.ProfilePicture || "https://orisuundocumentsdev.blob.core.windows.net/user-profile/defaultuser.png"}
                            alt="Team Member 3"
                            width={28}
                            height={28}
                            className="rounded-full border-2 border-profile-frame md:w-[42px] md:h-[42px]"
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default TeamProfile;
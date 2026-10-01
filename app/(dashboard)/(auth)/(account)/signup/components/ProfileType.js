import { renderProfileTypeIcon } from '@/components/ui/profile-type';
export const ProfileType = ({ selected, setSelectedProfile, profileTypes }) => {
    return (
        <>
            <div className="flex w-full xs:max-w-full xs:px-5 md:!px-0 xs:overflow-auto hide-scrollbar md:overflow-hidden xs:mb-10 md:!mb-0 items-center justify-between gap-2">
                {profileTypes?.map(
                    ({ UserProfileName, Id }) =>
                        UserProfileName !== 'Partners' && (
                            <label
                                key={Id}
                                className={`flex flex-col min-w-[74px] items-center text-xs justify-center cursor-pointer transition ${selected == Id
                                    ? 'border-[#2357C6] text-[#2357C6] font-semibold'
                                    : 'border-[#B2B3B3] text-[#828282]'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="profileType"
                                    value={Id}
                                    checked={selected == Id}
                                    onChange={() =>{ setSelectedProfile(Id)}}
                                    className="sr-only"
                                />
                                {renderProfileTypeIcon(
                                    Id,
                                    'radio',
                                    selected == Id
                                )}
                            </label>
                        )
                )}
            </div>
        </>
    );
};

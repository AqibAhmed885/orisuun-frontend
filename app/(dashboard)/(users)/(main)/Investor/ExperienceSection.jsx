'use client';

export default function ExperienceSection({ UsersProfessionalExperience }) {
    // Calculate the split point - half the items rounded up
    const splitPoint = Math.ceil(UsersProfessionalExperience?.length / 2);

    return (
        <>
            {UsersProfessionalExperience?.length > 0 ? (<div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2">
                {/* Left Column */}
                <div className="flex space-x-4">
                    {/* Left Vertical Bar - Only show if there are items in left column */}
                    {UsersProfessionalExperience?.length > 0 && (
                        <div className="w-1.5 rounded-t-xl lg:rounded-xl bg-[#BFD2FB]"></div>
                    )}

                    {/* Content */}
                    <div className="pl-2 space-y-6">
                        {UsersProfessionalExperience?.slice(0, splitPoint).map((exp, index) => (
                            <div key={index}>
                                <h3 className="text-[#0F172A] font-semibold text-lg">{exp?.CompanyName || exp?.title}</h3>
                                <p className="text-sm text-[#475569] font-medium">
                                    {(() => {
                                        const startYear = new Date(exp?.StartDate).getFullYear();
                                        const endYear = new Date(exp?.EndDate).getFullYear();
                                        return startYear === endYear ? `${startYear}` : `${startYear} - ${endYear}`;
                                    })()}
                                </p>
                                <p className="text-sm text-[#475569] mt-1">{exp?.Responsibility || exp?.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column - Only show if there are items beyond the split point */}
                {UsersProfessionalExperience?.length > splitPoint && (
                    <div className="flex space-x-4">
                        {/* Left Vertical Bar */}
                        <div className="w-1.5 rounded-b-xl lg:rounded-xl bg-[#BFD2FB]"></div>

                        {/* Content */}
                        <div className="pl-2 space-y-6">
                            {UsersProfessionalExperience?.slice(splitPoint).map((exp, index) => (
                                <div key={index + splitPoint}>
                                    <h3 className="text-[#0F172A] font-semibold text-lg">{exp?.CompanyName || exp?.title}</h3>
                                    <p className="text-sm text-[#475569] font-medium">
                                        {(() => {
                                            const startYear = new Date(exp?.StartDate).getFullYear();
                                            const endYear = new Date(exp?.EndDate).getFullYear();
                                            return startYear === endYear ? `${startYear}` : `${startYear} - ${endYear}`;
                                        })()}
                                    </p>
                                    <p className="text-sm text-[#475569] mt-1">{exp?.Responsibility || exp?.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>) : (<div className="text-gray-500 text-sm">No Experience</div>)}

        </>
    );
}
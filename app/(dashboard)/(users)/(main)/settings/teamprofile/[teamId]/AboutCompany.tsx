'use client';
import { useEffect, useState } from 'react';

const AboutCompany = ({ profileData }) => {
    const [expanded, setExpanded] = useState(false);
    const [showReadMore, setShowReadMore] = useState(false);

    const aboutText = profileData?.AboutCompany ||
        "We are a Black-owned specialty coffee company dedicated to sourcing the finest beans from Africa and delivering them to your cup with care and quality. Our mission is to connect African coffee farmers with American coffee lovers, ensuring that every sip supports sustainable practices and community development.";

    useEffect(() => {
        // Count sentences using regex (naive approach by splitting on ". ", "! ", or "? ")
        const sentenceCount = aboutText.split(/[\.\!\?]\s/).length;
        setShowReadMore(sentenceCount > 4); // You can adjust threshold to 3-5
    }, [aboutText]);

    return (
        <div className='bg-white p-4 rounded-xl border border-gray-200'>
            <h2 className='text-lg font-semibold text-gray-900'>Team Overview</h2>

            <p className={`text-gray-700 transition-all duration-300 ${!expanded ? 'line-clamp-4' : ''}`}>
                {aboutText}
            </p>

            {showReadMore && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-2 text-lg text-[#2357C6] focus:outline-none"
                >
                    {expanded ? 'Read Less' : 'Read More'}
                </button>
            )}

            <div className="flex flex-col gap-5 mt-5 md:flex-row">
                {profileData?.Mission && (
                    <div className="flex-1 p-4 bg-[#dfe6f5] rounded-md">
                        <h3 className="text-[#234FAD] font-semibold">Our Mission</h3>
                        <p>{profileData?.Mission}</p>
                    </div>
                )}

                {profileData?.Vision && (
                    <div className="flex-1 p-4 bg-[#dfe6f5] rounded-md">
                        <h3 className="text-[#234FAD] font-semibold">Our Vision</h3>
                        <p>{profileData?.Vision}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AboutCompany;

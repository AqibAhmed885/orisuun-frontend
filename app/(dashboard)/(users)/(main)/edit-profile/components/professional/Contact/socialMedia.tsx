'use client';

import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

const socialOptions = [
    'YouTube',
    // 'Twitter',
    'Instagram',
    'LinkedIn',
    'Facebook',
    'BlueSky',
    'Threads',
    'Reddit',
];

const keyMap: Record<string, string> = {
    YouTube: 'YoutubeUrl',
    // Twitter: 'TwitterUrl',
    Instagram: 'InstagramUrl',
    LinkedIn: 'LinkedinUrl',
    Facebook: 'FacebookUrl',
    BlueSky: 'BlueSkyUrl',
    Threads: 'ThreadsUrl',
    Reddit: 'RedditUrl',
};

const defaultSelected = ['YouTube', 'Threads', 'Facebook', 'LinkedIn', 'Reddit', 'Twitter', 'Instagram', 'BlueSky'];

const SocialMediaSection = () => {
    const {
        setValue,
        watch,
        trigger,
        formState: { errors },
    } = useFormContext();

    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(defaultSelected);
    const [isOpen, setIsOpen] = useState(true);

    const socialLinks = watch('SocialLinks') || {};

    const updateAllLinks = (platforms: string[], currentData: Record<string, string>) => {
        const updated: Record<string, string> = {};
        socialOptions.forEach((option) => {
            const key = keyMap[option];
            if (platforms.includes(option)) {
                updated[key] = currentData?.[key] || '';
            } else {
                updated[key] = ''; // not selected, so empty string
            }
        });
        setValue('SocialLinks', updated);
        trigger('SocialLinks');
    };

    const handleToggle = (platform: string) => {
        let newSelected: string[] = [];

        if (selectedPlatforms.includes(platform)) {
            newSelected = selectedPlatforms.filter((p) => p !== platform);
        } else {
            newSelected = [...selectedPlatforms, platform];
        }
        setSelectedPlatforms(newSelected);
        updateAllLinks(newSelected, socialLinks);
    };

    const handleUrlChange = (platform: string, value: string) => {
        const key = keyMap[platform];
        const updated = { ...socialLinks, [key]: value };

        // Ensure all keys exist (fill others with empty string)
        socialOptions.forEach((p) => {
            const mappedKey = keyMap[p];
            if (!(mappedKey in updated)) updated[mappedKey] = '';
        });

        setValue('SocialLinks', updated);
        trigger('SocialLinks');
    };

    return (
        <div className="w-full  space-y-6 mt-4">
            <div className="flex flex-col md:flex-row gap-6 justify-between">
                {/* Selection Box */}
                <div className="w-full md:w-[30%] gap-2">
                    <p className="text-[16px] font-semibold text-gray-800 mb-1">Social Media Links</p>
                    <p className="text-[14px] text-gray-500 mt-2">Select which social media you want to display</p>

                    <div className="relative mt-4">
                        <div
                            onClick={() => setIsOpen(!isOpen)}
                            className="border border-[#A1B6FF] bg-white text-[#0F172A] font-semibold text-[16px] px-4 py-3 rounded-[12px] shadow-[0_0_0_3px_#E0E7FF] flex items-center justify-between cursor-pointer"
                        >
                            Select social media
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        {isOpen && (
                            <div className="mt-2 border border-gray-200 max-h-[250px] bg-white p-4 rounded-[12px] shadow-lg space-y-4 overflow-auto absolute z-10 w-full">
                                {socialOptions.map((platform) => (
                                    <label key={platform} className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedPlatforms.includes(platform)}
                                            onChange={() => handleToggle(platform)}
                                            disabled={
                                                !selectedPlatforms.includes(platform) && selectedPlatforms.length >= 8
                                            }
                                            className="h-5 w-5 border border-gray-300 rounded-md text-[#2357C6] focus:ring-0"
                                        />
                                        <span className="text-[16px] text-gray-700 font-semibold">{platform}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* URL Inputs */}
                <div className="w-full max-h-[360px] md:w-[65%] space-y-6 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide">
                    {selectedPlatforms.map((platform) => {
                        const key = keyMap[platform];
                        return (
                            <div key={platform} className="flex items-center gap-3">
                                <label className="w-[100px] text-[16px] font-semibold text-gray-700">{platform}</label>
                                <div className="flex w-full">
                                    <span className="bg-gray-100 text-gray-500 px-3 py-3 rounded-l-md border border-r-0 border-gray-300 text-[15px]">
                                        https://
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="www.example.com"
                                        value={socialLinks[key] || ''}
                                        onChange={(e) => handleUrlChange(platform, e.target.value)}
                                        className="w-full text-[16px] text-gray-700 px-4 py-3 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SocialMediaSection;

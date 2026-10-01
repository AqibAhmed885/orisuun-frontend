import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import Image from 'next/image';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
interface BannerProps {
    title?: string;
    subtitle?: string;
    features?: string[];
    joinUrl?: string;
    onClose?: () => void;
    show: boolean;
    setShow: (show: boolean) => void;
    images?: Array<{
        title: string;
        description: string;
        amount: string;
        location: string;
        deadline: string;
        image?: string;
    }>;
}

const Banner: React.FC<BannerProps> = ({
    title = "Start saving your favourite opportunities.",
    subtitle = "You need to sign up to join the community to:",
    features = [
        "<span class='font-semibold text-gray-500'>Track every opportunity</span> — mark resources as applied, in progress, or completed",
        "<span class='font-semibold text-gray-500'>Get deadline alerts</span> so you never miss a funding or program opportunity",
        "<span class='font-semibold text-gray-500'>Access application tips</span> to strengthen your submissions",
        "<span class='font-semibold text-gray-500'>Connect with </span>investors, mentors, and revenue-generating opportunities",
        "<span class='font-semibold text-gray-500'>Save money and attract customers </span> through the Black-owned business Discount Portal"
    ],
    joinUrl = '/signup?profile=black-owned-businesses',
    onClose,
    show,
    setShow,

}) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex w-full h-full items-center justify-center bg-black-800 bg-opacity-75 p-4">
            <div className="bg-white relative rounded-2xl max-w-4xl w-full flex overflow-hidden shadow-2xl">
                {/* Close Button */}
                <div className="absolute top-4 right-4">
                    <button
                        onClick={() => {
                            setShow(false);
                            onClose && onClose();
                        }}
                        className="text-gray-400 hover:text-gray-600 transition"
                        aria-label="Close"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Left Section - Content */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
                   
                    {/* Title */}
                    <div>
                        <h2 className="text-3xl md:text-[40px] font-bold text-gray-900 mb-4">
                            {title}
                        </h2>

                        <p className="text-gray-600 text-base mb-2">
                            {subtitle}
                        </p>

                        {/* Features List */}
                        <div className="space-y-4 mb-8">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-gray-700 text-base" dangerouslySetInnerHTML={{ __html: feature }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div>
                        <button
                            onClick={() => {
                                window.location.href = joinUrl;
                                setShow(false);
                            }}
                            className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold text-base hover:bg-blue-700 transition mb-3"
                        >
                            Sign up for free
                        </button>
                        <p className="text-center text-gray-600 text-sm">
                            Already have an account?{' '}
                            <a href="/login" className="text-blue-600 hover:underline font-semibold">
                                Log in
                            </a>
                        </p>
                    </div>
                </div>

                {/* Right Section - Images */}
                <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-50 to-blue-100 ">
                    <Image
                        src={`${staticUrl}/resources/actions.svg`}
                        alt="Banner Image"
                        width={900}
                        height={900}
                        className=""

                    />

                </div>
            </div>
        </div>
    );
};

export default Banner;

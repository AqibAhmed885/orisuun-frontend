"use client";

import React from 'react';
import { renderProfileShape } from '@/utils/profile-shapes';
import { renderProfileTypeIcon } from '@/components/ui/profile-type';
import Image from 'next/image';

interface CheckoutProfileProps {
    size?: number;
    providerName?: string;
    providerAvatar?: string;
    providerProfileTypeId?: number;
    providerIsVerified?: boolean;
}

export default function CheckoutProfile({
    size = 180,
    providerName,
    providerAvatar,
    providerProfileTypeId = 6,
    providerIsVerified = false,
}: CheckoutProfileProps) {
    const profileType = String(providerProfileTypeId);
    const imageUrl = providerAvatar || '';
    const userName = providerName || 'Provider';

    return (
        <div className="flex items-center gap-4 justify-start">
            <div className="shrink-0">
                {renderProfileShape(profileType, imageUrl, '', size)}

            </div>
            <div className="min-w-0 pt-2 ">
                <div className="text-lg font-semibold flex gap-2  text-slate-800">
                    {userName}
                    {providerIsVerified && (
                        <>
                            <Image
                                src="/chat/verified.svg"
                                alt="Verified" width={20} height={20} />
                        </>
                    )}
                </div>
                <div className="mt-2 flex gap-2 bg-[#F5FAFF] items-center rounded-full px-2 py-1 text-sm text-slate-700 border border-omblue-100 w-max">
                    {renderProfileTypeIcon(providerProfileTypeId)}
                </div>

            </div>
        </div>
    );
}

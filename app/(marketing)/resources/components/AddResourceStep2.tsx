import { CalendarPicker } from '@/components/calendar/calendar';
import React, { useState, useEffect } from 'react';
import YoutubeIcon from '@/icons/socials/youtube';
import InstagramIcon from '@/icons/socials/instagram';
import LinkedinIcon from '@/icons/socials/linkedin';
import FacebookIcon from '@/icons/socials/facebook';
import BlueSkyIcon from '@/icons/socials/bluesky';
import ThreadSquare from '@/icons/socials/thread-square';
import TickRounded from '@/icons/tick-rounded';
import Gossip from '@/icons/gossip';
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from 'sonner';

interface AddResourceStep2Props {
    formData: {
        eligibility: string;
        description: string;
        email: string;
        expirationDate: string;
        website: string;
        socials: string[];
        captcha: string; // Changed from boolean to string for token
    };
    handleChange: (e: any) => void;
    addSocial?: () => void;
    removeSocial?: (index: number) => void;
    errors: {
        eligibility?: string;
        email?: string;
        expirationDate?: string;
        captcha?: string;
        description?: string;
        website?: string;
    };
}

const AddResourceStep2: React.FC<AddResourceStep2Props> = ({
    formData,
    handleChange,
    addSocial,
    removeSocial,
    errors,
}) => {
    const [showExpirationCalendar, setShowExpirationCalendar] = useState(false);
    const [socialPlatforms, setSocialPlatforms] = useState<string[]>([]);

    const PLATFORMS = [
        { key: 'YouTube', label: 'YouTube', Icon: YoutubeIcon },
        { key: 'Instagram', label: 'Instagram', Icon: InstagramIcon },
        { key: 'LinkedIn', label: 'LinkedIn', Icon: LinkedinIcon },
        { key: 'Facebook', label: 'Facebook', Icon: FacebookIcon },
        { key: 'BlueSky', label: 'BlueSky', Icon: BlueSkyIcon },
        { key: 'Threads', label: 'Threads', Icon: ThreadSquare },
        { key: 'Reddit', label: 'Reddit', Icon: Gossip },
    ];

    // map platform -> placeholder
    const platformPlaceholder = (p: string) => {
        switch (p) {
            case 'LinkedIn':
                return 'linkedin.com';
            case 'Facebook':
                return 'facebook.com';
            case 'Instagram':
                return 'instagram.com';
            case 'YouTube':
                return 'youtube.com';
            case 'BlueSky':
                return 'bsky.app';
            case 'Threads':
                return 'threads.net';
            case 'Reddit':
                return 'reddit.com';
            default:
                return '';
        }
    };

    // Keep socialPlatforms length in sync with formData.socials length
    useEffect(() => {
        const socialsLen = Array.isArray(formData.socials) ? formData.socials.length : 0;
        // map values and try to detect platform from existing URL (best-effort)
        const detected = (formData.socials || []).map((s: string, idx: number) => {
            const prevValue = socialPlatforms[idx] || '';
            if (prevValue) return prevValue;
            if (!s) return '';
            const url = s.toLowerCase();
            if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
            if (url.includes('instagram.com')) return 'Instagram';
            if (url.includes('linkedin.com')) return 'LinkedIn';
            if (url.includes('facebook.com')) return 'Facebook';
            if (url.includes('bluesky')) return 'BlueSky';
            if (url.includes('threads.net')) return 'Threads';
            if (url.includes('reddit.com')) return 'Reddit';
            return '';
        });

        if (socialPlatforms.length < socialsLen) {
            setSocialPlatforms((prev) => [...prev, ...detected.slice(prev.length)]);
        } else if (socialPlatforms.length > socialsLen) {
            setSocialPlatforms((prev) => prev.slice(0, socialsLen));
        } else if (detected.some((d, i) => d && !socialPlatforms[i])) {
            // if we detected values for empty slots, merge them in
            setSocialPlatforms((prev) => prev.map((p, i) => p || detected[i] || ''));
        }
    }, [formData.socials]);

    const togglePlatform = (platformKey: string) => {
        const existingIndex = socialPlatforms.indexOf(platformKey);

        // Toggle on: add platform and append a socials entry
        if (existingIndex === -1) {
            // add new blank socials entry via parent handler (if available)
            if (addSocial) addSocial();
            // push platform key into local platforms state so the newly added input is associated
            setSocialPlatforms((prev) => [...prev, platformKey]);
        } else {
            // Toggle off: remove the first occurrence of this platform
            if (removeSocial) removeSocial(existingIndex);
            setSocialPlatforms((prev) => prev.filter((p, i) => i !== existingIndex));
        }
    };

    return (
        <form>
            <div className="mb-4">
                <label className="block font-[550] text-gray-700 mb-1">
                    Who is eligible
                    <span className="text-red-500"> * </span>
                </label>
                <input
                    name="eligibility"
                    type="text"
                    placeholder="e.g. Businesses with under $1M in revenue"
                    value={formData.eligibility}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                />
                {errors.eligibility && <p className="text-red-500 text-sm">{errors.eligibility}</p>}
            </div>
            <div className="mb-4">
                <label className="block font-[550] text-gray-700 mb-1">Description<span className="text-red-500"> * </span></label>
                <textarea
                    name="description"
                    placeholder="e.g. 8-month program for Black tech founders with workspace, funding, and expert guidance."
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                    rows={3}
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>
            <div className="mb-4">
                <label className="block font-[550] text-gray-700 mb-1">Contact email
                </label>
                <input
                    name="email"
                    type="email"
                    placeholder="e.g. example@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div className="mb-4">
                <label className="block font-[550] text-gray-700 mb-1">
                    Expiration date (when should we remove this listing?) *
                </label>
                <div className="relative">
                    <input
                        name="expirationDate"
                        type="text"
                        value={formData.expirationDate}
                        onFocus={() => setShowExpirationCalendar(true)}
                        onClick={() => setShowExpirationCalendar(true)}
                        readOnly
                        placeholder="Select date"
                        className="w-full border rounded-lg px-4 py-2 cursor-pointer bg-white"
                    />
                    {showExpirationCalendar && (
                        <div className="absolute w-1/2 z-50 mt-2">
                            <CalendarPicker
                                selectedDate={formData.expirationDate ? new Date(formData.expirationDate) : undefined}
                                handleDateSelectFromCalender={(date) => {
                                    handleChange({
                                        target: {
                                            name: 'expirationDate',
                                            value: date.toISOString().slice(0, 10), // Format as YYYY-MM-DD
                                        },
                                    });
                                    setShowExpirationCalendar(false);
                                }}
                            />
                        </div>
                    )}
                </div>
                {errors.expirationDate && <p className="text-red-500 text-sm">{errors.expirationDate}</p>}
            </div>
            <div className="mb-4">
                <label className="block font-[550] text-gray-700 mb-1">Website<span className="text-red-500"> * </span></label>
                <input
                    name="website"
                    type="url"
                    placeholder=""
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                />
                {errors.website && <p className="text-red-500 text-sm">{errors.website}</p>}
            </div>
            <div className="mb-4 w-full">

                <label className="block font-[550] text-gray-700 mb-1">Social media handles</label>
                {/* Platform selector with icon + checkbox */}
                <div className="flex space-x-3">
                    <div className="mt-2 flex flex-col gap-3">
                        {PLATFORMS.map(({ key, label }) => {
                            const checked = socialPlatforms.includes(key);
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    aria-pressed={checked}
                                    onClick={() => togglePlatform(key)}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors duration-150 text-sm text-[#1A253C] ${checked ? 'bg-white border-omblue-600 text-omblue-600' : 'bg-white border-[#E5E7EB]'}`}
                                >
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${checked ? 'bg-white border-white' : 'border-gray-400'
                                        }`}>
                                        {checked && (
                                            <TickRounded className="w-4 h-4 text-white" />
                                        )}
                                    </div>
                                    <span className="font-medium">{label}</span>
                                </button>
                            );
                        })}
                    </div>
                    <div className="flex flex-col gap-3 mt-2 w-full">
                        {/* Only show inputs when a platform is selected for that index OR there's an existing non-empty URL */}
                        {Array.isArray(formData.socials) && formData.socials
                            .map((s, idx) => ({ s, idx }))
                            .filter(({ s, idx }) => {
                                const hasUrl = !!(s && String(s).trim().length > 0);
                                const hasPlatform = !!socialPlatforms[idx];
                                return hasPlatform || hasUrl;
                            })
                            .map(({ s, idx }) => (
                                <div key={idx} className="flex items-center ">
                                    {socialPlatforms[idx] ? (
                                        <div className="flex items-center w-36 pr-2">
                                            {/* show platform label/icon when selected via grid */}
                                            <div className="flex items-center  gap-2 px-3 py-1.5 bg-white w-full">
                                                <span className="w-6 h-6 flex font-semibold text-base items-center justify-center">
                                                    {(PLATFORMS.find(p => p.key === socialPlatforms[idx])?.Icon ?? null) as any}
                                                </span>
                                                <span className="text-sm text-gray-600 truncate">
                                                    {socialPlatforms[idx]}
                                                </span>
                                            </div>
                                        </div>
                                    ) : null}
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-l-lg border bg-gray-50  w-14">
                                        <span className="w-6 h-6 tracking-wide flex text-base px-3 text-gray-400 items-center justify-center">
                                            http://
                                        </span>
                                        
                                    </div>
                                    <input
                                        name={`socials[${idx}]`}
                                        type="text"
                                        placeholder={platformPlaceholder(socialPlatforms[idx])}
                                        value={s}
                                        onChange={(e) => {
                                            handleChange(e);
                                        }}
                                        className={`${socialPlatforms[idx] ? 'flex-1 border rounded-r-lg px-4 py-1.5' : 'w-full border rounded-lg px-4 py-1.5'}`}
                                        aria-label={`Social URL for ${socialPlatforms[idx] || 'Platform'}`}
                                    />

                                </div>
                            ))}

                        {/* +Add More intentionally removed — social platform grid drives inputs */}
                    </div>
                </div>

            </div>
            <div className="mb-4 w-full">
               
                <div className="recaptcha-container">
                    {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? (
                        <ReCAPTCHA
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                            onChange={(token) => {
                                handleChange({
                                    target: {
                                        name: 'captcha',
                                        value: token || '',
                                    },
                                });
                            }}
                            onErrored={() => toast.error('reCAPTCHA error. Please try again.')}
                        />
                    ) : (
                        <p className="text-yellow-600 text-xs">reCAPTCHA not configured</p>
                    )}
                </div>
                {errors.captcha && <p className="text-red-500 text-sm">{errors.captcha}</p>}
            </div>
        </form>
    );
};

export default AddResourceStep2;
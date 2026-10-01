'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState } from 'react';
import useOutsideClick from '@/hooks/useOutsideClick';
import { profileTypesWithIds } from '@/data/marketing/signupData';

type Props = {
    show: boolean;
    onClose: () => void;
};

export default function RoleSelectionModal({ show, onClose }: Props) {
    const [selectedRole, setSelectedRole] = useState(profileTypesWithIds[0]?.Id);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    useOutsideClick(dropdownRef, () => setDropdownOpen(false));
    useOutsideClick(modalRef, onClose);

    if (!show) return null;

    const chosen = profileTypesWithIds.find((p) => p.Id === selectedRole);

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40">
            <div ref={modalRef} className="relative w-[calc(100%-60px)] md:max-w-[510px] max-h-[calc(100vh-60px)] overflow-visible rounded-lg bg-white p-4 md:p-6 flex flex-col items-center justify-center">
                <button
                    type="button"
                    aria-label="Close"
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                    onClick={onClose}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>

                <div className="flex flex-col items-center justify-center gap-6">
                    <div className="w-full md:w-[460px] h-auto mx-auto">
                        <Image
                            src="/images/main-animation.png"
                            alt="Orisuun ecosystem"
                            width={1200}
                            height={1200}
                        />
                    </div>
                    <div className="w-full flex flex-col items-center justify-center">
                        <h2 className="md:text-2xl text-xl capitalize text-center font-semibold">There&apos;s a place for you here</h2>
                        <p className="mb-4 mt-4 text-sm">Select your desired role</p>

                        <div className="md:w-1/2 w-full relative" ref={dropdownRef}>
                            <button
                                type="button"
                                aria-haspopup="listbox"
                                aria-expanded={dropdownOpen}
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className={`w-full rounded-full px-4 py-2 text-sm flex items-center justify-between bg-white transition-[border] ${dropdownOpen ? 'border-2 ring-2 ring-[rgba(35,87,198,0.06)]' : 'border border-gray-200'}`}
                            >
                                <span>{chosen?.UserProfileName}</span>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-gray-500">
                                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>

                            <div
                                role="listbox"
                                className={`absolute mt-1 h-40 w-full overflow-auto bg-white border border-gray-200 rounded-xl shadow z-50 ${dropdownOpen ? 'block' : 'hidden'}`}
                            >
                                {profileTypesWithIds.map((p) => (
                                    <button
                                        key={p.Id}
                                        type="button"
                                        role="option"
                                        aria-selected={selectedRole === p.Id}
                                        className={`w-full text-left px-4 py-1 text-sm hover:bg-gray-50 ${selectedRole === p.Id ? 'bg-gray-100 font-medium' : ''}`}
                                        onClick={() => { setSelectedRole(p.Id); setDropdownOpen(false); }}
                                    >
                                        {p.UserProfileName}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 flex w-full justify-center">
                            <Link
                                href={`/signup?profile=${chosen?.slug ?? ''}`}
                                className="w-full px-6 py-3 font-medium text-base bg-[#0A1733] text-white rounded-full text-center"
                                onClick={onClose}
                            >
                                Sign up for free
                            </Link>
                        </div>

                        <div className="w-full text-center mt-4">
                            <p className="text-sm text-gray-500">
                                Already have an account?{' '}
                                <Link href="/signin" className="text-[#0d1f45] font-semibold" onClick={onClose}>
                                    Log in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

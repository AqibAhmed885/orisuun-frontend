"use client"
import React, { useRef, useState } from 'react'

type Props = {
    inviteEmails: string[]
    setInviteEmails: React.Dispatch<React.SetStateAction<string[]>>
}

const InviteSection: React.FC<Props> = ({ inviteEmails, setInviteEmails }) => {
    const [inviteEmail, setInviteEmail] = useState('')
    const [error, setError] = useState<string | null>(null)
    const inviteInputRef = useRef<HTMLInputElement | null>(null)

    const validateEmail = (email: string) => {
        // Basic, widely-used validation (no external deps)
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(email)
    }

    const addInvite = () => {
        const email = inviteEmail.trim()
        if (!email) return

        if (!validateEmail(email)) {
            setError('Please enter a valid email address')
            return
        }

        if (inviteEmails.includes(email)) {
            setError('This email is already added')
            setInviteEmail('')
            inviteInputRef.current?.focus()
            return
        }

        setInviteEmails(prev => [...prev, email])
        setInviteEmail('')
        setError(null)
        inviteInputRef.current?.focus()
    }

    const removeInvite = (index: number) => {
        setInviteEmails(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <div className="mt-6 p-4 border rounded-[18px]">
            <div className="mb-3 text-base font-semibold">Invite others to this meeting</div>
            <div className="flex items-center gap-3 w-full">
                <div className="flex-1 relative">
                    <input
                        ref={inviteInputRef}
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => { setInviteEmail(e.target.value); if (error) setError(null) }}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addInvite() } }}
                        placeholder="Enter user email"
                        aria-invalid={!!error}
                        className="w-full px-4 py-2.5 border rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-omblue-500"
                    />
                    <button onClick={addInvite} className="absolute right-1 text-sm top-1/2 -translate-y-1/2 bg-[#1E4ED8] text-white px-5 py-2 rounded-full">
                        Invite
                    </button>
                </div>
                {/* <button onClick={() => { setInviteEmail(''); inviteInputRef.current?.focus() }} className=" rounded-full border flex items-center justify-center">
                    <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.544271" y="0.540365" width="21.0833" height="21.0833" rx="10.5417" stroke="#101828" stroke-width="1.08333" />
                        <path d="M11.0781 6.5V15.6667" stroke="#101828" stroke-width="1.08333" stroke-linecap="round" />
                        <path d="M15.6641 11.082L6.4974 11.082" stroke="#101828" stroke-width="1.08333" stroke-linecap="round" />
                    </svg>
                </button> */}
            </div>

            {error && (
                <div className="text-sm text-red-600 mt-2">{error}</div>
            )}

            {inviteEmails.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {inviteEmails.map((email, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full">
                            <div className="text-sm">{email}</div>
                            <button onClick={() => removeInvite(idx)} className="text-gray-500">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g opacity="0.3">
                                        <path d="M4.35938 5.97222H15.6372M8.38715 8.38889V14.8333M11.6094 8.38889V14.8333M8.38715 2.75H11.6094C11.823 2.75 12.0279 2.83487 12.179 2.98594C12.3301 3.13701 12.4149 3.34191 12.4149 3.55556V5.97222H7.5816V3.55556C7.5816 3.34191 7.66647 3.13701 7.81754 2.98594C7.96861 2.83487 8.17351 2.75 8.38715 2.75ZM5.16493 5.97222H14.8316V16.4444C14.8316 16.6581 14.7467 16.863 14.5957 17.0141C14.4446 17.1651 14.2397 17.25 14.026 17.25H5.97049C5.75684 17.25 5.55194 17.1651 5.40087 17.0141C5.2498 16.863 5.16493 16.6581 5.16493 16.4444V5.97222Z" stroke="#101828" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                                    </g>
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default InviteSection

import React, { useState } from "react";
import Modal from "@/components/marketing/Modal/Modal";
import { Calendar } from "react-feather";
import { CircleDollarSign, DollarSign, TrendingUp, Tv, Users, UsersRound } from 'lucide-react';
import { Mail, Plus } from "lucide-react";
// Removed FaInstagram import; using our in-house svg icons instead
import XIcon from '@/icons/socials/x';
import FacebookIcon from '@/icons/socials/facebook';
import InstagramIcon from '@/icons/socials/instagram';
import YoutubeIcon from '@/icons/socials/youtube';
import LinkedInIcon from '@/icons/socials/linkedin';
import BlueSkyIcon from '@/icons/socials/bluesky';
import { submitUpdateRequest } from "@/app/api/admin/resources";
import { saveResourceForLater } from "@/app/api/marketing/resources";
import { toast } from "react-toastify";
import Image from "next/image";
import { formatCurrency } from "@/utils/currency";
import { formatDeadline } from "@/utils/deadline";
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;



type ResourceModalProps = {
    open: boolean;
    resource?: any;
    onClose: () => void;
    setBanner: (show: boolean) => void;
};

const ResourceModal: React.FC<ResourceModalProps> = ({ open, resource, onClose, setBanner }) => {

    const data = resource;
    const [showUpdateRequestModal, setShowUpdateRequestModal] = useState(false);
    const [updateReason, setUpdateReason] = useState('');
    const [requestType, setRequestType] = useState<'update' | 'deletion'>('update');
    const [isSavingForLater, setIsSavingForLater] = useState(false);

    if (!data) return null;


    const handleRequestUpdate = async () => {
        if (!updateReason.trim()) {
            toast.error('Please provide a reason for the update request.');
            return;
        }

        try {
            await submitUpdateRequest(data?.Id, updateReason, requestType);
            toast.success('Request submitted successfully.');
            setShowUpdateRequestModal(false);
            setUpdateReason('');
            onClose();
        } catch (error) {
            toast.error('Failed to submit update request. Please try again.');
        }
    };



    // Helper function to format dates
    const formatDate = (dateString: string | null) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };






    // Helper function to parse social links
    const parseSocialLinks = (links: string) => {
        if (!links || links.trim() === '') return [];
        return links.split(',').map(link => link.trim()).filter(link => link !== '');
    };

    const socialLinks = parseSocialLinks(data.SocialLinks || '');

    const handleSaveForLater = async () => {
        const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userData') || 'null') : null;
        const teamData = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('teamData') || 'null') : null;
        const userId = teamData?.isActive ? teamData?.teamId : currentUser?.Id;

        if (!userId) {
            onClose();
            setBanner(true);
            return;
        }

        const resourceId = data?.Id || data?.ResourceId;
        if (!resourceId) {
            toast.error('Unable to save this resource right now.');
            return;
        }

        try {
            setIsSavingForLater(true);
            await saveResourceForLater(String(userId), String(resourceId), 'saved');
            toast.success('Saved successfully');
        } catch (error) {
            toast.error('Failed to save resource. Please try again.');
        } finally {
            setIsSavingForLater(false);
        }
    };

    return (
        <Modal
            isOpen={open}
            closeModal={onClose}
            showCloseIcon={true}
            size="xl"
            variant="rounded-xl"
            position="center"
            animation="slide"
            backdropClassName="backdrop-blur-sm"
            title={data.Name || data.title} // Use Name from API, fallback to title
        >

            <div className="w-full md:min-w-[600px] relative">
                {/* Title */}
                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">
                    {data.Name || data.title}
                    {resource?.isBlackFocused && (
                        <span className="inline-block align-middle ml-2 relative group" aria-hidden={false}>
                            <Image
                                src={`${staticUrl}/resources/black-focused.svg`}
                                alt="Black Focused"
                                title="A resource for Black people"
                                width={20}
                                height={20}
                                style={{ display: 'inline-block' }}
                            />

                            {/* Visible tooltip on hover + accessible text for screen readers */}
                            {/* <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-omblue-900 text-white text-xs py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                A resource for Black people
                            </span> */}
                            {/* <span className="sr-only">A resource for Black people</span> */}
                        </span>
                    )}
                </h2>

                {/* Sponsor */}
                <div className="text-sm font-semibold text-gray-700">SPONSOR</div>
                <div className="mb-4 text-base font-medium text-gray-500">{data.Sponsor || data.org}</div>

                {/* Description */}
                <div className="text-sm font-semibold text-gray-700">DESCRIPTION</div>
                <div className="mb-4 text-base font-medium text-gray-500">{data.Description || data.description}</div>

                {/* prize amount */}
                {data.CompetitionDetails?.PrizeAmount && (
                    <>
                        <div className="text-sm font-semibold text-gray-700">PRIZE AMOUNT</div>
                        <div className="mb-4 text-base font-medium text-gray-500">
                            {data.CurrencySymbol} {" "} {data.CompetitionDetails.PrizeAmount}</div>
                    </>
                )}
            
                {data.AcceleratorDetails?.InvestmentAmount && (
                    <>
                        <div className="text-sm font-semibold text-gray-700">INVESTMENT AMOUNT</div>
                        <div className="mb-4 text-base font-medium text-gray-500">
                            {data.CurrencySymbol} {" "} {data.AcceleratorDetails.InvestmentAmount}</div>
                    </>
                )}
                {/* Location */}
                <div className="text-sm font-semibold text-gray-700">LOCATION</div>
                {data.IsLocationVirtual ? (
                    <div className="mb-4">
                        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            <span className="font-semibold">Virtual (Accessible Worldwide)</span>
                        </div>
                    </div>
                ) : data.IsNationWide ? (
                    <div className="mb-4">
                        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-semibold">Nationwide - {data.CountryName}</span>
                        </div>
                    </div>
                ) : data.IsStateWide ? (
                    <div className="mb-4">
                        <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 text-purple-700 px-3 py-2 rounded-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            <span className="font-semibold">State-wide - {data.StateName || data.CountryName}</span>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center mb-2 text-base font-medium text-gray-500">
                            <span className="mr-2">
                                {/* Location Icon */}
                                <svg width="16" height="16" className="md:w-5 md:h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.16536 14.9496C7.48429 14.7357 5.94774 13.8897 4.86802 12.5836C3.7883 11.2775 3.24643 9.60925 3.35255 7.91795C3.45867 6.22665 4.20481 4.63921 5.43932 3.47829C6.67383 2.31736 8.30407 1.67007 9.9987 1.66797C11.6954 1.66671 13.3287 2.31242 14.5659 3.47354C15.8031 4.63465 16.551 6.2238 16.6572 7.91717C16.7635 9.61054 16.2201 11.2807 15.1377 12.5874C14.0554 13.894 12.5156 14.7388 10.832 14.9496V16.678C14.1204 16.7546 16.6654 17.2805 16.6654 17.918C16.6654 18.608 13.6804 19.168 9.9987 19.168C6.31703 19.168 3.33203 18.608 3.33203 17.918C3.33203 17.2805 5.87703 16.7546 9.16536 16.678V14.9496ZM9.9987 13.3346C11.3248 13.3346 12.5966 12.8079 13.5342 11.8702C14.4719 10.9325 14.9987 9.66072 14.9987 8.33464C14.9987 7.00855 14.4719 5.73679 13.5342 4.7991C12.5966 3.86142 11.3248 3.33464 9.9987 3.33464C8.67262 3.33464 7.40085 3.86142 6.46316 4.7991C5.52548 5.73679 4.9987 7.00855 4.9987 8.33464C4.9987 9.66072 5.52548 10.9325 6.46316 11.8702C7.40085 12.8079 8.67262 13.3346 9.9987 13.3346V10.0013C9.55667 10.0013 9.13275 9.82571 8.82019 9.51315C8.50763 9.20059 8.33203 8.77666 8.33203 8.33464C8.33203 7.89261 8.50763 7.46869 8.82019 7.15613C9.13275 6.84357 9.55667 6.66797 9.9987 6.66797C10.4407 6.66797 10.8646 6.84357 11.1772 7.15613C11.4898 7.46869 11.6654 7.89261 11.6654 8.33464C11.6654 8.77666 11.4898 9.20059 11.1772 9.51315C10.8646 9.82571 10.4407 10.0013 9.9987 10.0013Z" fill="#98A2B3" />
                                </svg>
                            </span>
                            {data.Address || data.location}, {data.CityName || data.city}
                        </div>
                        <div className="mb-4 ml-7 text-sm font-medium text-gray-500">
                            {data.CityName || data.city}, {data.CountryName || data.country}
                            {data.StateName && `, ${data.StateName}`}
                        </div>
                    </>
                )}

                {/* Accelerator Details - Show only if available */}
                {data.AcceleratorDetails && (
                    <>
                        <div className="text-sm mb-2 font-semibold text-gray-700">ACCELERATOR TERMS</div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            {/* Investment Amount */}
                            <div className="bg-[#EEF4FF] rounded-lg p-4 flex gap-4">
                                <div className="mt-1">
                                    <CircleDollarSign className="text-omblue-600" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-500">Investment Amount</div>
                                    <div className="text-base  font-medium text-gray-700">{formatCurrency(data.AcceleratorDetails.InvestmentAmount, data.AcceleratorDetails.InvestmentCurrency)}</div>
                                </div>
                            </div>

                            {/* Equity */}
                            <div className="bg-[#EEF4FF] rounded-lg p-4 flex gap-4">
                                <div className="mt-1">
                                    <TrendingUp className="text-omblue-600" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-500">Equity</div>
                                    <div className="text-base font-medium text-gray-700">
                                        {data.AcceleratorDetails.EquityNegotiated 
                                            ? 'Negotiated' 
                                            : data.AcceleratorDetails.EquityAmount 
                                                ? `${data.AcceleratorDetails.EquityAmount}%` 
                                                : 'N/A'
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* Mentorship */}
                            <div className="bg-[#EEF4FF] rounded-lg p-4 flex gap-4">
                                <div className="mt-1">
                                    <UsersRound className="text-omblue-600" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-500">Mentorship</div>
                                    <div className="text-base font-medium text-gray-700">{data.AcceleratorDetails.HasMentors ? 'Yes' : 'No'}</div>
                                </div>
                            </div>

                            {/* Investor Day */}
                            <div className="bg-[#EEF4FF] rounded-lg p-4 flex gap-4">
                                <div className="mt-1">
                                    <Tv className="text-omblue-600 rotate-180" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-500">Investor Day</div>
                                    <div className="text-base font-medium text-gray-700">{data.AcceleratorDetails.HasInvestorDay ? 'Yes' : 'No'}</div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Grant Details - Show only if available */}
                {data.GrantDetails && (
                    <>
                        <div className="text-sm mb-2 font-semibold text-gray-700">GRANT AMOUNT</div>
                        <div className="mb-4 text-base font-medium text-gray-500">
                            {formatCurrency(data.GrantDetails.GrantAmount, data.GrantDetails.GrantCurrency)}
                            {data.GrantDetails.Frequency && (
                                <span className="ml-2 text-sm text-gray-400">({data.GrantDetails.Frequency})</span>
                            )}
                        </div>

                    </>
                )}

                {/* Specialty Financing Details - Show only for Specialty Financing resource types */}
                {((data.DebtAvailable !== undefined || data.EquityAvailable !== undefined) && (
                    String(data.ResourceTypeName || '').toLowerCase() === 'specialty financing' ||
                    String(data.ResourceTypeName || '').toLowerCase() === 'non-traditional or specialty financing' ||
                    Number(data.ResourceTypeId) === 8
                )) && (
                    <>
                        <div className="text-sm mb-2 font-semibold text-gray-700"></div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            {/* Equity Available */}
                            <div className="bg-[#EEF4FF] rounded-lg p-4 flex gap-4">
                                <div className="mt-1">
                                    <TrendingUp className="text-omblue-600" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-500">Equity Financing</div>
                                    <div className="text-base font-medium text-gray-700">
                                        {(data.EquityAvailable === true || String(data.EquityAvailable).toLowerCase() === 'yes') ? 'Yes' : 'No'}
                                    </div>
                                </div>
                            </div>

                            {/* Debt Available */}
                            <div className="bg-[#EEF4FF] rounded-lg p-4 flex gap-4">
                                <div className="mt-1">
                                    <DollarSign className="text-omblue-600" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-500">Debt Financing</div>
                                    <div className="text-base font-medium text-gray-700">
                                        {(data.DebtAvailable === true || String(data.DebtAvailable).toLowerCase() === 'yes') ? 'Yes' : 'No'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Important Dates */}
                <div className="text-sm mb-2 font-semibold text-gray-700">IMPORTANT DATES</div>
                <div className="mb-2 bg-[#EEF4FF] rounded-lg p-3 flex gap-3">
                    <Calendar className="text-omblue-600" />
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Application Deadline</span>
                        <span className="font-semibold text-[#1A253C]">{formatDeadline(data.ApplicationDeadline, data.DeadlineType)}</span>
                    </div>
                </div>

                {/* Competition Date - Show only if available */}
                {data.CompetitionDetails?.CompetitionDate && (
                    <div className="mb-4 bg-[#EEF4FF] rounded-lg p-3 flex items-center gap-3">
                        <Calendar className="text-omblue-600" />
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-500">Competition Date</span>
                            <span className="font-semibold text-[#1A253C]">{formatDate(data.CompetitionDetails.CompetitionDate)}</span>
                        </div>
                    </div>
                )}

                {/* Start Date - Show only if available */}
                {data.StartDate && data.EndDate && (
                    <div className="mb-4 bg-[#EEF4FF] rounded-lg p-3 flex items-center gap-3">
                        <Calendar className="text-omblue-600" />
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-500"> Program Duration</span>
                            <span className="font-semibold text-[#1A253C]">{formatDate(data.StartDate)} - {formatDate(data.EndDate)}</span>
                        </div>
                    </div>
                )}

                {/* End Date - Show only if available */}
                {/* {data.EndDate && (
                    <div className="mb-4 bg-[#EEF4FF] rounded-lg p-3 flex items-center gap-3">
                        <Calendar className="text-omblue-600" />
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-500">End Date</span>
                            <span className="font-semibold text-[#1A253C]">{formatDate(data.EndDate)}</span>
                        </div>
                    </div>
                )} */}

                {/* Eligibility */}
                <div className="text-sm mb-2 font-semibold text-gray-700">WHO IS ELIGIBLE</div>
                <div className="mb-4 text-base font-medium text-gray-500">{data.Eligibility}</div>

                {/* Contact & Links */}
                <div className="text-sm font-semibold text-gray-700">CONTACT & LINKS</div>
                <div className="mb-2 flex items-center gap-2 border border-olblue-100 rounded-lg p-3">
                    <Mail className="text-omblue-500" />
                    <span className="text-gray-500 font-medium text-sm">{data.ContactEmail || data.email}</span>
                </div>
                {data.WebsiteLink && (
                    <div className="mb-4 flex items-center gap-2 border border-olblue-100 rounded-lg p-3">
                        <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.4577 11.8753V13.7753C13.4577 14.2187 13.4577 14.4404 13.3714 14.6097C13.2955 14.7587 13.1744 14.8798 13.0254 14.9557C12.8561 15.042 12.6344 15.042 12.191 15.042H5.22435C4.78097 15.042 4.55929 15.042 4.38994 14.9557C4.24098 14.8798 4.11987 14.7587 4.04397 14.6097C3.95768 14.4404 3.95768 14.2187 3.95768 13.7753V11.8753M4.59102 11.8753H12.8243C14.1545 11.8753 14.8195 11.8753 15.3276 11.6165C15.7745 11.3888 16.1378 11.0254 16.3655 10.5786C16.6243 10.0705 16.6243 9.40545 16.6243 8.07533V4.59199C16.6243 3.26187 16.6243 2.59681 16.3655 2.08876C16.1378 1.64188 15.7745 1.27855 15.3276 1.05085C14.8195 0.791992 14.1545 0.791992 12.8243 0.791992H4.59102C3.26089 0.791992 2.59583 0.791992 2.08779 1.05085C1.6409 1.27855 1.27757 1.64188 1.04988 2.08876C0.791016 2.59681 0.791016 3.26187 0.791016 4.59199V8.07533C0.791016 9.40545 0.791016 10.0705 1.04988 10.5786C1.27757 11.0254 1.6409 11.3888 2.08779 11.6165C2.59583 11.8753 3.26089 11.8753 4.59102 11.8753Z" stroke="#2357C6" stroke-width="1.58333" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <a
                            href={(() => {
                                const raw = data.WebsiteLink?.trim() || '';
                                if (/^https?:\/\//i.test(raw)) return raw;
                                if (/^\/\//.test(raw)) return `https:${raw}`;
                                if (raw.startsWith('/')) return `${typeof window !== 'undefined' ? window.location.origin : ''}${raw}`;
                                return `https://${raw}`;
                            })()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-omblue-500 text-sm underline"
                        >
                            Visit website
                        </a>
                    </div>
                )}

                {/* Follow - Show only if social links are available */}
                {socialLinks.length > 0 && (
                    <>
                        <div className="text-sm mb-2 font-semibold text-gray-700">FOLLOW</div>
                        <div className="mb-4 flex gap-4">
                            {socialLinks.map((link, index) => (
                                <a key={index} aria-label={`Open link ${index + 1}`} href={link.startsWith('http') ? link : `https://${link}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-omblue-600 rounded-md border p-1 border-omblue-100">
                                    {link.includes('twitter') && <XIcon className="w-5 h-5" />}
                                    {link.includes('instagram') && <InstagramIcon className="w-5 h-5" />}
                                    {link.includes('linkedin') && <LinkedInIcon className="w-5 h-5" />}
                                    {link.includes('facebook') && <FacebookIcon className="w-5 h-5" />}
                                    {link.includes('youtube') && <YoutubeIcon className="w-5 h-5" />}
                                    {link.includes('bluesky') && <BlueSkyIcon className="w-5 h-5" />}
                                    {!link.includes('twitter') && !link.includes('instagram') && !link.includes('linkedin') && !link.includes('facebook') && !link.includes('youtube') && !link.includes('bluesky') && <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.4113 1.78125H17.0302L11.3088 8.32042L18.0395 17.2188H12.7694L8.64166 11.822L3.9186 17.2188H1.29819L7.41777 10.2244L0.960938 1.78125H6.36485L10.0959 6.71413L14.4113 1.78125ZM13.4922 15.6513H14.9433L5.57635 3.26642H4.01915L13.4922 15.6513Z" fill="#2357C6" />
                                    </svg>}
                                </a>
                            ))}
                        </div>
                    </>
                )}

                {/* Last updated and actions */}
                <div className="mb-4 flex justify-between text-sm border-t border-omblue-50 pt-4 text-gray-400">
                    <span>Last updated: {formatDate(data?.CreatedAt)}</span>
                    <button
                        onClick={() => setShowUpdateRequestModal(true)}
                        className="text-orange-500 flex items-center gap-1 font-medium hover:underline"
                    >
                        <Plus size={18} /> Request Update
                    </button>
                </div>

                {/* Update Request Modal */}
                {showUpdateRequestModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-lg">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-2xl font-semibold mb-2 text-gray-900">Request Update</h3>
                                    <p className="text-sm text-gray-600">Help us keep this resource accurate and up to date. Select the type of request and briefly explain what needs to be changed or removed</p>
                                </div>
                                <button onClick={() => { setShowUpdateRequestModal(false); setUpdateReason(''); }} className="text-gray-400 hover:text-gray-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                </button>
                            </div>

                            <div className="mt-6 space-y-4">
                                <div className="flex items-start gap-3">
                                    <label className="flex items-start gap-3">
                                        <input
                                            type="radio"
                                            name="requestType"
                                            value="update"
                                            checked={requestType === 'update'}
                                            onChange={() => setRequestType('update')}
                                            className="mt-1 h-4 w-4 text-omblue-600"
                                        />
                                        <div>
                                            <div className="font-semibold text-gray-800">Request update</div>
                                            <div className="text-sm text-gray-500">Something here needs correction or new information.</div>
                                        </div>
                                    </label>
                                </div>

                                <div className="flex items-start gap-3">
                                    <label className="flex items-start gap-3">
                                        <input
                                            type="radio"
                                            name="requestType"
                                            value="deletion"
                                            checked={requestType === 'deletion'}
                                            onChange={() => setRequestType('deletion')}
                                            className="mt-1 h-4 w-4 text-omblue-600"
                                        />
                                        <div>
                                            <div className="font-semibold text-gray-800">Request deletion</div>
                                            <div className="text-sm text-gray-500">This resource is no longer valid or should be removed.</div>
                                        </div>
                                    </label>
                                </div>

                                <textarea
                                    value={updateReason}
                                    onChange={(e) => setUpdateReason(e.target.value)}
                                    className="w-full border rounded-lg p-4 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-omblue-500 placeholder-gray-400"
                                    placeholder="Describe what's incorrect or missing..."
                                />

                                <button
                                    onClick={handleRequestUpdate}
                                    className="w-full mt-2 px-6 py-3 rounded-full bg-omblue-600 text-white font-semibold hover:bg-omblue-700"
                                >
                                    Submit Request
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex items-center text-sm justify-between gap-4 mt-6">
                    <button
                        className="px-6 py-1.5 rounded-full w-full border border-gray-300 text-omblue-500 font-semibold bg-white hover:bg-omblue-500 hover:text-white"
                        onClick={handleSaveForLater}
                        disabled={isSavingForLater}
                    >
                        {isSavingForLater ? 'Saving...' : 'Save for Later'}
                    </button>
                    <button
                        className="px-6 py-1.5 w-full rounded-full bg-omblue-500 text-white font-semibold hover:bg-[#2458C7]"
                        onClick={() => {
                            // Open the resource website in a new window
                            if (data.WebsiteLink) {
                                const raw = data.WebsiteLink?.trim() || '';
                                const url = /^https?:\/\//i.test(raw)
                                    ? raw
                                    : /^\/\//.test(raw)
                                        ? `https:${raw}`
                                        : raw.startsWith('/')
                                            ? `${window.location.origin}${raw}`
                                            : `https://${raw}`;
                                window.open(url, '_blank', 'noopener,noreferrer');
                                onClose();
                                return;
                            }

                            toast.error('Website link is not available.');
                        }}
                    >
                        Apply Now
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ResourceModal;
'use client';
import Favourite from '@/icons/favourite';
import Globe from '@/icons/globe';
import MessageIcon from '@/icons/message-icon';
import MessageWriting from '@/icons/message-writing';
import Hamburger from '@/icons/sidebar/hamburger';
import Tick from '@/icons/tick';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { getBusinessMemberDetails } from '@/app/api/dashboard/coFounder';
import PersonProfile from '@/icons/cofounder/person-profile';
import CorporateFare from '@/icons/cofounder/corporate-fare';
import Distance from '@/icons/cofounder/distance';
import { Calendar } from 'react-feather';
import Handyman from '@/icons/handyman';
import Paid from '@/icons/cofounder/paid';
import CellPhone from '@/icons/cofounder/cell-phone';
import MailEmail from '@/icons/cofounder/mail-email';
import { Router } from 'lucide-react';
import { trackOpportunityVisit } from '@/app/api/dashboard/businessDevelopment';

const CofounderMatchDetails = () => {
  const params = useParams();
  const opportunityId = params?.id;
  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData') || 'null');

  const router = useRouter();

  const [details, setDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // simple shimmer element
  const Shimmer: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`bg-gray-200/60 rounded ${className} animate-pulse`} />
  );

  useEffect(() => {
    if (!opportunityId) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const userId = currentUser?.Id ?? '';
        const res = await getBusinessMemberDetails(String(opportunityId), userId);
        if (mounted) setDetails(res?.Result ?? res ?? null);

        if (currentUser?.Id && opportunityId) {
          const isOwner = details?.UserId === currentUser.Id; 
          if (!isOwner) {
            try {
              await trackOpportunityVisit(String(opportunityId), currentUser.Id);
            } catch (trackError) {
              console.warn('Failed to track visit:', trackError); 
            }
          }
        }
      } catch (err: any) {
        console.error('Failed to load business member details', err);
        toast.error(err?.response?.data?.Message || 'Failed to load opportunity details');
        if (mounted) setDetails(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [opportunityId, currentUser?.Id]); // Add currentUser.Id to deps if needed

  const normalizeUrl = (url?: string) => {
    if (!url) return undefined;
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  };


  const businessDetails = [
    {
      icon: (
        <CorporateFare className="2xl:w-scaled-2 2xl:h-scaled-3 w-4 h-4 text-omblue-600" />
      ),
      name: details?.BusinessType
    },
    {
      icon: (
        <Distance className="2xl:w-scaled-2 2xl:h-scaled-3 w-4 h-4 text-omblue-600" />
      ),
      name: details?.BusinessLocation?.length ? details.BusinessLocation.map((loc: any) => loc?.Result?.value ?? loc?.value ?? '').filter(Boolean).join(', ') : '—'
    },
    {
      icon: (
        <Calendar className="2xl:w-scaled-2 2xl:h-scaled-3 w-4 h-4 text-omblue-600" />
      ),
      name: details?.YearsInBusiness ? `${details.YearsInBusiness} years` : '—',
    },
    {
      icon: (
        <Handyman className="2xl:w-scaled-2 2xl:h-scaled-3 w-4 h-4 text-omblue-600" />
      ),
      name: details?.BusinessIndustry,
    },
    // {
    //     icon: (
    //         <CorporateFare className="2xl:w-scaled-2 2xl:h-scaled-3 w-4 h-4 text-omblue-600" />
    //     ),
    //     name: 'Business type',
    // },
    {
      icon: (
        <Paid className="2xl:w-scaled-2 2xl:h-scaled-3 w-4 h-4 text-omblue-600" />
      ),
      name: details?.InvestmentRequired ? 'Paid' : 'Unpaid',
    },
  ];

  const contactDetails = [
    {
      icon: (
        <PersonProfile className="2xl:w-scaled-2 2xl:h-scaled-3 w-4 h-4 text-omblue-600" />
      ),
      name: details?.ContactName || '—',
    },
    {
      icon: (
        <CellPhone className="2xl:w-scaled-2 2xl:h-scaled-3 w-4 h-4 text-omblue-600" />
      ),
      name: details?.ContactPhone || '—',
    },
    {
      icon: (
        <MailEmail className="2xl:w-scaled-2 2xl:h-scaled-3 w-4 h-4 text-omblue-600" />
      ),
      name: details?.ContactEmail || '—',
    },
  ];

  return (
    <div className="px-6 lg:px-28">
      <div className="md:hidden flex items-center justify-between py-4">
        <Hamburger className="hamburger-top-icon" />
        <p className="text-h7 2xl:text-scaled-h7 font-semibold text-blue-600">
          Co Founder And Board Matcher
        </p>
        <Image
          src={currentUser?.ProfilePicture || BASE_URL}
          alt="user"
          width={32}
          height={32}
          className="rounded-full h-8 w-8 me-2"
        />
      </div>

      <div className="py-8 flex flex-col md:h-screen">
        <div className="flex items-center gap-2">
          <Tick className="bg-omblue-500 p-1.5 rounded-full text-white h-7 w-7" />
          <p className="text-omblue-700 font-medium text-h7 2xl:text-scaled-h7">
            {loading ? <Shimmer className="h-5 w-56" /> : 'Your new business development post was published'}
          </p>
        </div>

        <div className="my-8 flex-grow">
          <div className="md:p-6 md:border border-grey-600 rounded-md">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex-grow">
                {loading ? (
                  <>
                    <Shimmer className="h-8 w-3/4 mb-2" />
                    <Shimmer className="h-4 w-1/3" />
                  </>
                ) : (
                  <>
                    <h6 className="text-olblue-900 font-bold text-h6 md:text-h2 2xl:text-scaled-h2">
                      {details?.PostTitle ?? '—'}
                    </h6>
                    <p className="py-2 text-h9 2xl:text-scaled-h9 font-medium">
                      {details?.BusinessTagline || 'tagline not provided'}
                    </p>
                  </>
                )}
              </div>

              <button
                className="hidden md:flex items-center gap-2 border text-omblue-600 border-omblue-600 p-3 rounded-md"
                onClick={() => { /* keep design, wire action as needed */ }}
              >
                <MessageWriting className="w-4 h-4" /> Match
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-4">
              <div className="col-span-1">
                <div className="pe-6 h-full lg:border-r border-grey-600">
                  <div className="space-y-6 pb-8 lg:border-b-0 border-b border-grey-600">
                    <div className="space-y-4">
                      <p className="text-h9 2xl:text-scaled-h9 font-semibold text-black-500">
                        Role Description
                      </p>
                      {loading ? (
                        <Shimmer className="h-24 w-full" />
                      ) : (
                        <div className="text-blue-400 text-h10 2xl:text-scaled-h10 font-medium">
                          <div
                            className="text-editor"
                            dangerouslySetInnerHTML={{ __html: details?.RoleDescription ?? '' }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <p className="text-h9 2xl:text-scaled-h9 font-semibold text-black-500">
                        Preferred Experience
                      </p>
                      {loading ? (
                        <Shimmer className="h-16 w-full" />
                      ) : (
                        <div className="text-blue-400 text-h10 2xl:text-scaled-h10 font-medium">
                          <div
                            className="text-editor"
                            dangerouslySetInnerHTML={{ __html: details?.PreferredExperienceDescription ?? '' }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <p className="text-h9 2xl:text-scaled-h9 font-semibold text-black-500">
                        Business description
                      </p>
                      {loading ? (
                        <Shimmer className="h-12 w-full" />
                      ) : (
                        <p className="text-blue-400 text-h10 2xl:text-scaled-h10 font-medium">
                          {details?.BusinessDescription ?? '—'}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="text-h9 2xl:text-scaled-h9 font-semibold text-black-500">
                        Locations
                      </p>
                      {loading ? (
                        <Shimmer className="h-4 w-1/2" />
                      ) : (
                        <p className="text-blue-400 text-h10 2xl:text-scaled-h10 font-medium">
                          {(details?.BusinessLocation ?? [])
                            .map((loc: any) => loc?.Result?.value ?? loc?.value ?? '')
                            .filter(Boolean)
                            .join(', ') || '—'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="hidden lg:block space-y-4">
                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-2">
                        <Image
                          src={BASE_URL}
                          alt="profile"
                          width={56}
                          height={56}
                          className="w-14 h-14 rounded-full"
                        />
                        <div className="flex-1">
                          {loading ? (
                            <>
                              <Shimmer className="h-6 w-48 mb-2" />
                              <Shimmer className="h-4 w-32" />
                            </>
                          ) : (
                            <>
                              <p className="text-h8 2xl:text-scaled-h8 font-bold text-black-500">
                                {details?.BusinessName ?? '—'}
                              </p>
                              <p className="text-h10 2xl:text-scaled-h10 font-medium text-blue-300">
                                {details?.BusinessIndustry ?? ''}
                              </p>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="space-x-1 flex items-center">
                        {loading ? (
                          <>
                            <Shimmer className="h-8 w-8 rounded-full" />
                            <Shimmer className="h-8 w-8 rounded-full ml-2" />
                            <Shimmer className="h-8 w-8 rounded-full ml-2" />
                          </>
                        ) : (
                          <>
                            <button className="bg-green-50 border border-green-400 text-green-400 p-2 rounded-full">
                              <Favourite />
                            </button>
                            <button className="bg-white border border-omblue-100 text-omblue-400 p-2 rounded-full hidden md:block">
                              <MessageIcon />
                            </button>
                            <button className="bg-white border border-omblue-100 text-omblue-400 p-2 rounded-full hidden md:block">
                              <a
                                href={normalizeUrl(details?.BusinessWebsite)}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Globe />
                              </a>
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <p className="text-h10 2xl:text-scaled-h10 text-blue-400 font-medium">
                      {loading ? <Shimmer className="h-4 w-40" /> : `Expiry: ${details?.PostDuration ? `${details.PostDuration} days` : '—'}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 col-span-1 border-b lg:border-0 border-grey-600 pb-8">
                <div className="mb-2 space-y-4">
                  <p className="text-h9 2xl:text-scaled-h9 font-semibold text-black-500">
                    Business Details
                  </p>
                  {businessDetails.map((detail, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {detail.icon}
                      {loading ? (
                        <Shimmer className="h-4 w-40" />
                      ) : (
                        <p className="text-h9 2xl:text-scaled-h9 font-medium text-black-500">
                          {detail.name}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mb-2 space-y-4">
                  <p className="text-h9 2xl:text-scaled-h9 font-semibold text-black-500">
                    Contact Details
                  </p>
                  {contactDetails.map((detail, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {detail.icon}
                      {loading ? (
                        <Shimmer className="h-4 w-44" />
                      ) : (
                        <p className="text-h9 2xl:text-scaled-h9 font-medium text-black-500">
                          {detail.name}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:hidden block space-y-4">
                <div className="flex items-center gap-2">
                  <Image
                    src={BASE_URL}
                    alt="profile"
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-full"
                  />
                  <div className="flex-1">
                    {loading ? (
                      <>
                        <Shimmer className="h-6 w-44 mb-2" />
                        <Shimmer className="h-4 w-32" />
                      </>
                    ) : (
                      <>
                        <p className="text-h8 2xl:text-scaled-h8 font-bold text-black-500">
                          {details?.BusinessName || '—'}
                        </p>
                        <p className="text-h10 2xl:text-scaled-h10 font-medium text-blue-300">
                          {details?.BusinessTagline || '—'}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-auto py-4 w-full flex items-center justify-end">
          <button className="md:w-auto w-full border text-omblue-600 border-omblue-600 p-3 rounded-md"
            onClick={() => router.push('/dashboard')}
          >
            Back to BD
          </button>
        </div>
      </div>
    </div>
  );
};

export default CofounderMatchDetails;

import Image from "next/image";
import React, { memo } from "react";
import { Calendar } from "react-feather";
import { getCurrencySymbol } from "@/utils/currency";
import { formatDeadline } from "@/utils/deadline";
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

type ResourceCardProps = {
  title: string;
  org: string;
  location: string;
  country: string;
  amount?: string;
  currency?: string;
  deadline: string;
  deadlineType?: string;
  description: string;
  eligibility: string;
  eventDate: string;
  onClick?: () => void;
  isBlackFocused?: boolean;
  locationScope?: string;
  isVirtual?: boolean;
  debtAvailable?: boolean;
  equityAvailable?: boolean;
};

const formatDate = (dateString: string) => {
  if (!dateString || dateString === 'N/A') return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};


const ResourceCard: React.FC<ResourceCardProps> = ({
  title,
  org,
  location,
  country,
  amount,
  currency,
  deadline,
  deadlineType,
  description,
  eligibility,
  eventDate,
  onClick,
  isBlackFocused,
  locationScope,
  isVirtual,
  debtAvailable,
  equityAvailable,
}) => {
  const currencySymbol = getCurrencySymbol(currency);
  const formattedDeadline = formatDeadline(deadline, deadlineType);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border font-medium border-gray-200 p-6 w-full mx-auto  flex flex-col justify-between  h-full"
        style={{ boxShadow: "0 2px 12px 0 #3535350D" }}>
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 capitalize text-xl mb-1 leading-tight">
                <span className="align-middle">{title}</span>
                {isBlackFocused && (
                  <span className="inline-flex items-center ml-2 w-4 h-4 relative group flex-shrink-0" aria-hidden={false}>
                    <Image
                      src={`${staticUrl}/resources/black-focused.svg`}
                      alt="Black Focused"
                      title="A resource for Black people"
                      width={16}
                      height={16}
                      className="object-contain"
                    />

                    {/* Visible tooltip on hover + accessible text for screen readers */}
                    <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-omblue-900 text-white text-xs py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      A resource for Black people
                    </span>
                    <span className="sr-only">A resource for Black people</span>
                  </span>
                )}
              </h3>
              <div className="text-gray-500 text-sm">{org}</div>
              <div className="mt-2 flex items-center gap-2">
                {debtAvailable && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">Debt</span>
                )}
                {equityAvailable && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-semibold">Equity</span>
                )}
              </div>
            </div>
            {amount && (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-lg bg-white border border-gray-200 text-[#1A253C] font-medium shadow-sm text-base">
                  <span className="w-2 h-2 rounded-full bg-[#357CF6] mr-1 inline-block">

                  </span>
                  
                  {currencySymbol} {" "} {amount}
                </span>
              </div>
            )}

          </div>
          <div className="flex flex-col gap-1 text-gray-600 text-sm">
            {isVirtual ? (
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-2 py-1 rounded-md text-xs font-semibold">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Virtual
              </div>
            ) : locationScope === "Nationwide" ? (
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-2 py-1 rounded-md text-xs font-semibold">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Nationwide - {country}
              </div>
            ) : locationScope === "Statewide" ? (
              <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 text-purple-700 px-2 py-1 rounded-md text-xs font-semibold">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Statewide - {location}
              </div>
            ) : (
              <>
                <span className="inline-flex text-gray-700 items-center gap-1">
                  <svg width="16" height="16" className="md:w-5 md:h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.16536 14.9496C7.48429 14.7357 5.94774 13.8897 4.86802 12.5836C3.7883 11.2775 3.24643 9.60925 3.35255 7.91795C3.45867 6.22665 4.20481 4.63921 5.43932 3.47829C6.67383 2.31736 8.30407 1.67007 9.9987 1.66797C11.6954 1.66671 13.3287 2.31242 14.5659 3.47354C15.8031 4.63465 16.551 6.2238 16.6572 7.91717C16.7635 9.61054 16.2201 11.2807 15.1377 12.5874C14.0554 13.894 12.5156 14.7388 10.832 14.9496V16.678C14.1204 16.7546 16.6654 17.2805 16.6654 17.918C16.6654 18.608 13.6804 19.168 9.9987 19.168C6.31703 19.168 3.33203 18.608 3.33203 17.918C3.33203 17.2805 5.87703 16.7546 9.16536 16.678V14.9496ZM9.9987 13.3346C11.3248 13.3346 12.5966 12.8079 13.5342 11.8702C14.4719 10.9325 14.9987 9.66072 14.9987 8.33464C14.9987 7.00855 14.4719 5.73679 13.5342 4.7991C12.5966 3.86142 11.3248 3.33464 9.9987 3.33464C8.67262 3.33464 7.40085 3.86142 6.46316 4.7991C5.52548 5.73679 4.9987 7.00855 4.9987 8.33464C4.9987 9.66072 5.52548 10.9325 6.46316 11.8702C7.40085 12.8079 8.67262 13.3346 9.9987 13.3346ZM9.9987 10.0013C9.55667 10.0013 9.13275 9.82571 8.82019 9.51315C8.50763 9.20059 8.33203 8.77666 8.33203 8.33464C8.33203 7.89261 8.50763 7.46869 8.82019 7.15613C9.13275 6.84357 9.55667 6.66797 9.9987 6.66797C10.4407 6.66797 10.8646 6.84357 11.1772 7.15613C11.4898 7.46869 11.6654 7.89261 11.6654 8.33464C11.6654 8.77666 11.4898 9.20059 11.1772 9.51315C10.8646 9.82571 10.4407 10.0013 9.9987 10.0013Z" fill="#98A2B3" />
                  </svg>
                  {location}
                </span>
                <span className="ml-6 text-xs text-gray-400">{country}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
            <Calendar className="md:w-4 md:h-4 text-gray-400" />
            <span className="font-semibold">Apply by:</span>
            <span className="ml-1  text-[#1A253C]">{formattedDeadline}</span>
          </div>
          {/* New Event Date Section */}
          {eventDate && (
          <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
            <Calendar className="md:w-4 md:h-4 text-gray-400" />
            <span className="font-semibold">Event Date:</span>
            <span className="ml-1  text-[#1A253C]">{formatDate(eventDate)}</span>
          </div>
          )}

          <div className="text-gray-500 text-base mt-2 line-clamp-2 text-ellipsis whitespace-pre-wrap overflow-hidden break-words">{description}</div>

          <div className="mb-2 bg-[#EEF4FF] mt-2 rounded-md p-3 flex items-center gap-3">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold"> Eligibility</span>
              <span className="font-medium text-gray-700 line-clamp-1 text-ellipsis whitespace-pre-wrap overflow-hidden break-words">{eligibility}</span>
            </div>
          </div>
        </div>

        <button
          className="mt-2 bg-omblue-500 text-white font-semibold rounded-lg py-3 w-full text-center text-base hover:bg-omblue-600 transition"
          onClick={onClick}
        >
          View Details
        </button>
      </div>
    </>
  );
};

export default memo(ResourceCard);
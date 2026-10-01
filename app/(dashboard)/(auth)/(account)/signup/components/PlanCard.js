'use client';

import ChevronDown from '@/icons/chevron-down';
import InfoIcon from '@/icons/info-icon';
import {
  accessTo,
  basicPlanDetails,
  premiumPlanDetails,
} from '@/data/marketing/PricingData';
import { profileTypesWithIds } from '@/data/marketing/signupData';
import Image from 'next/image';
import React from 'react';

const normalizePlanKey = (value = '') => value.toLowerCase().replace(/[^a-z0-9]/g, '');

const PlanDetailsPopover = ({ planName, standardData, premiumData }) => {
  const isStandardPlan = planName === 'Standard';

  return (
    <div className="w-[520px] rounded-2xl border border-[#E4E9F5] bg-white p-5 shadow-[0px_16px_40px_rgba(16,24,40,0.14)]">
      <div className="  pb-2">
        <p className="text-sm font-bold uppercase ] text-[#001E5F]">{planName} plan</p>
      </div>

      {isStandardPlan ? (
        <div className="space-y-4">
          {standardData?.sections ? (
            standardData.sections.map((section) => (
              <div key={section.title}>
                <p className="mb-3 text-base font-light text-[#001E5F]">{section.title}</p>
                <div className="space-y-3">
                  {section.functions.map((item) => (
                    <div key={item.label} className="flex text-[#3D3D3D] items-start gap-3">
                      <Image src={item.icon} alt="" width={16} height={16} className="mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-[#475467]">{item.label}</p>
                        {item.coming ? <p className="text-xs text-[#2357C6]">{item.coming}</p> : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : standardData?.functions && standardData.functions.length ? (
            standardData.functions.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <Image src={item.icon} alt="" width={16} height={16} className="mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-[#475467]">{item.label}</p>
                  {item.coming ? <p className="text-xs text-[#2357C6]">{item.coming}</p> : null}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-[#475467]"> plan details for this profile type will be updated here.</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {premiumData?.sections ? (
            premiumData.sections.map((section) => (
              <div key={section.title}>
                <p className="mb-3 text-base font-light text-[#001E5F]">{section.title}</p>
                <div className="space-y-3">
                  {section.functions.map((item) => (
                    <div key={item.label} className="flex text-[#3D3D3D] items-start gap-3">
                      <Image src={item.icon} alt="" width={16} height={16} className="mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-[#475467]">{item.label}</p>
                        {item.coming ? <p className="text-xs text-[#2357C6]">{item.coming}</p> : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : premiumData?.functions && premiumData.functions.length ? (
            premiumData.functions.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <Image src={item.icon} alt="" width={16} height={16} className="mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-[#475467]">{item.label}</p>
                  {item.coming ? <p className="text-xs text-[#2357C6]">{item.coming}</p> : null}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-[#475467]">Premium plan details for this profile type will be updated here.</p>
          )}
        </div>
      )}
    </div>
  );
};

export const PlanCard = ({
  selectedPlan,
  setSelectedPlan,
  planDropdownOpen,
  setPlanDropdownOpen,
  planDropdownRef,
  availablePlanTypes,
  billings,
  billingFrequency,
  selectedBilling,
  setSelectedBilling,
  profileTypeId,
  noTrial = false,
}) => {
  const [activeTooltipPlan, setActiveTooltipPlan] = React.useState(null);
  const tooltipTimeoutRef = React.useRef(null);

  const profileName =
    profileTypesWithIds.find((profile) => profile.Id === profileTypeId)?.UserProfileName || 'this user type';
  const standardData =
    basicPlanDetails.find((item) => normalizePlanKey(item.type) === normalizePlanKey(profileName)) || basicPlanDetails[0] || {};
  const premiumData =
    premiumPlanDetails.find((item) => normalizePlanKey(item.type) === normalizePlanKey(profileName)) || {};

  const clearTooltipTimeout = () => {
    if (tooltipTimeoutRef.current) {
      window.clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }
  };

  const openTooltip = (planName) => {
    clearTooltipTimeout();
    setActiveTooltipPlan(planName);
  };

  const closeTooltip = () => {
    clearTooltipTimeout();
    tooltipTimeoutRef.current = window.setTimeout(() => {
      setActiveTooltipPlan(null);
    }, 120);
  };

  React.useEffect(() => {
    return () => clearTooltipTimeout();
  }, []);

  return (
    <div
      className="bg-white border border-[#E4E9F5] rounded-xl p-5 w-full"
      style={{ boxShadow: '0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[28px] font-semibold">{selectedPlan} Plan</h3>
        <div className="relative flex items-center gap-2" ref={planDropdownRef}>
          <div className="relative">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={planDropdownOpen}
              onClick={() => {
                setPlanDropdownOpen((s) => !s);
                setActiveTooltipPlan(null);
              }}
              className="border rounded-full px-4 py-1 text-xs flex items-center justify-between gap-2 "
            >
              <span className="truncate">{selectedPlan} Plan</span>
              <ChevronDown className="w-2 h-2 text-gray-600" />
            </button>

            <ul
              role="listbox"
              tabIndex={-1}
              className={`absolute right-0 mt-2 w-full bg-white border rounded-md shadow-md z-50 overflow-hidden ${planDropdownOpen ? 'block' : 'hidden'
                }`}
            >
              {availablePlanTypes.map((p) => (
                <li key={p} className="flex items-center gap-1">
                  <button
                    type="button"
                    role="option"
                    aria-selected={selectedPlan === p}
                    onClick={() => {
                      setSelectedPlan(p);
                      setPlanDropdownOpen(false);
                      setActiveTooltipPlan(null);
                    }}
                    className={`flex-1 text-left px-3 py-2 text-sm ${selectedPlan === p ? 'bg-nav-blue text-white' : 'hover:bg-gray-50'
                      }`}
                  >
                    {p} Plan
                  </button>


                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            aria-label={`View ${selectedPlan} plan details`}
            onMouseEnter={() => openTooltip(selectedPlan)}
            onMouseLeave={closeTooltip}
            onFocus={() => openTooltip(selectedPlan)}
            onBlur={closeTooltip}
            onClick={() => setActiveTooltipPlan((current) => (current === selectedPlan ? null : selectedPlan))}
            className="rounded-full p-1 text-[#3A627F] transition hover:bg-[#F2F7FC]"
          >
            <InfoIcon className="h-5 w-5" />
          </button>

          {activeTooltipPlan ? (
            <div
              className="absolute right-0 top-full z-[60] mt-3"
              onMouseEnter={() => openTooltip(activeTooltipPlan)}
              onMouseLeave={closeTooltip}
            >
              <PlanDetailsPopover
                planName={activeTooltipPlan}
                standardData={standardData}
                premiumData={premiumData}
              />
            </div>
          ) : null}
        </div>
      </div>

      {/* Compact segmented billing selector */}
      <div className=" h-[56px] md:h-[48px] rounded-full p-0.5 border border-[#E4E9F5] justify-between flex items-center "
        style={{
          boxShadow: '0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814'
        }}
      >
        {(billings && billings.length ? billings : billingFrequency).map((b, i) => {
          const name = b?.Name || b?.type;
          const free = noTrial ? '' : (b?.Free || b?.free || '');
          const isSelected = name === selectedBilling;
          return (
            <button
              key={i}
              onClick={() => setSelectedBilling(name)}
              className={`rounded-full md:px-6 h-full justify-center md:min-w-[160px] w-full flex flex-col items-center transition ${isSelected ? 'bg-nav-blue text-white py-2' : 'bg-transparent text-text-gray'
                } `}
            >
              <span className="font-medium text-sm  leading-4">{name === 'Annually' ? "Annual" : name}</span>
              {free ? (
                <small className={`text-[14px] lowercase ${isSelected ? 'text-white/80' : 'text-nav-blue'}`}>
                  {free === '5 Month Free' ? '5 months free' : free}
                </small>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PlanCard;
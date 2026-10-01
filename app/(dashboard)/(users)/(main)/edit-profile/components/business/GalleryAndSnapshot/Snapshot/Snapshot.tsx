'use client';

import React, { useEffect } from 'react';
import DynamicInputSection from './DynamicInputSection';
import ClientSizeSection from './ClientSizeSection';
import RevenueSection from './RevenueSection';
import BusinessHighlights from './BusinessHighlights';
import LocationsSection from './locationsSection';
import { useFormContext } from 'react-hook-form';

const Snapshot = ({currentUserData}) => {
    
    const { reset } = useFormContext();
    const mapBusinessTypeToLabel = (type) => {
        const map = {
            Individual: 'Individual',
            Enterprise: 'Enterprise',
            MidMarketBusiness: 'Middle Market',
            SmallBusiness: 'Business',
        };
        return map[type] || type;
    };

    useEffect(() => {
        if (currentUserData) {
            const mappedData = {
                businessChannels: (currentUserData.ChannelCategories || []).map(item => ({
                    name: item.BusinessChannelName,
                    percent: parseFloat(item.BusinessChannelPercentage || '0'),
                })),
                locations: (currentUserData.UserProfileLocations || []).map(loc => ({
                    cityId: loc.LocationName || '',
                })),
                products: (currentUserData.UserProfileServices || []).map(item => ({
                    name: item.ServiceName,
                    percent: parseFloat(item.Percentage || '0'),
                })),
                clientSizes: (currentUserData.ClientBySizes || []).map(item => ({
                    label: mapBusinessTypeToLabel(item.BusinessType),
                    percent: parseFloat(item.BusinessPercentage || '0'),
                })),
                revenue: (currentUserData.LastRevenues || []).map(rev => ({
                    year: rev.Year.toString(),
                    amount: rev.Revenue.toString(),
                })),
                businessHighlights: {
                    growth: parseFloat(currentUserData.BusinessGrowth || '0'),
                    investment: parseFloat(currentUserData.AmountOfInvestment || '0'),
                    RegularCustomers: parseFloat(currentUserData.RegularCustomers || '0'),
                },
                revenueCurrency: currentUserData.CurrencySymbol || '',
            };
            reset(mappedData);
        }
    }, [currentUserData])

    return (
        <>
            <div className='w-[95%] mx-auto min-h-[34rem] bg-white border-1 border-black-900 rounded-2xl shadow-[#1018280F] shadow-md'>
                <div className="max-w-[97%] mx-auto">
                    <div className="pt-5 pb-4 mb-6">
                        <h2 className="text-[16px] font-semibold text-gray-900 mb-1">Business Snapshot</h2>
                        <p className="text-[12px] font-normal text-gray-600 mb-4">
                            Provide key details about your business operations and market
                        </p>
                        <DynamicInputSection name="businessChannels" title="Business Channels" />
                        <ClientSizeSection name="clientSizes" />
                        <LocationsSection name="locations" currentUserData={currentUserData}/>
                        <DynamicInputSection name="products" title="Service or Product Splits" />
                    </div>
                </div>
            </div>
            <div className='w-[95%] mb-5 mx-auto min-h-[28rem] bg-white border-1 border-black-900 rounded-2xl shadow-[#1018280F] shadow-md'>
                <div className="max-w-[97%] mx-auto">
                    <div className="pt-5">
                        <RevenueSection />
                    </div>
                </div>
            </div>
            <div className='w-[95%] mx-auto min-h-[10rem] bg-white border-1 border-black-900 rounded-2xl shadow-[#1018280F] shadow-md'>
                <div className="max-w-[97%] mx-auto">
                    <div className="pt-5">
                        <BusinessHighlights />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Snapshot;

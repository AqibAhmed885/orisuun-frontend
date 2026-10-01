'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/data/store';
import DoughnutChart from '@/components/ui/dough-chat';

const BusinessSnapshot = ({ profileData }) => {


    const clientsBySizeData = profileData?.ClientBySizes?.map((item: any, index: number) => ({
        name: item?.BusinessType === "MidMarketBusiness" ? "Middle Market" :
            item?.BusinessType === "SmallBusiness" ? "Small Business" :
                item?.BusinessType,
        color:
            item?.BusinessType === "Individual" || index === 0 ? '#4a5578' :  // Individual
                item?.BusinessType === "SmallBusiness" || index === 1 ? '#2357c6' :  // Small Business
                    item?.BusinessType === "MidMarketBusiness" || index === 2 ? '#22ccee' :  // Middle Market
                        '#b9e6fe',  // Enterprise
        percent: item?.BusinessPercentage?.toString(),
    }));

    const businessChannelsData = profileData?.ChannelCategories?.map((item: any, index: number) => ({
        name: item?.BusinessChannelName,
        color: index === 0
            ? '#4a5578'
            : index === 1
                ? '#2357c6'
                : index === 2
                    ? '#22ccee'
                    : '#b9e6fe',
        percent: item?.BusinessChannelPercentage?.toString(),
    }));

    const dataSet = [
        clientsBySizeData?.length > 0 && {
            title: 'Clients by Size',
            sections: clientsBySizeData
        },
        businessChannelsData?.length > 0 && {
            title: 'Business Channels',
            sections: businessChannelsData
        }
    ].filter(Boolean);

    return (
        <div className="w-full p-6 bg-white rounded-xl border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Business Snapshot</h2>
            <p className="text-sm text-gray-500 mb-6">Key metrics and business fundamentals</p>

            {/* First Row: Clients by Size and Business Channels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {dataSet.map((item, index) => (
                    <div key={index} className="bg-white ">
                        <h3 className="font-semibold text-gray-900 mb-4">{item.title}</h3>
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="w-full md:w-1/2 h-48">
                                <DoughnutChart data={item} />
                            </div>
                            <div className="w-full md:w-1/3 space-y-3 ">
                                {item.sections.map((section, ind) => (
                                    <div key={ind} className="flex items-center">
                                        <div className="flex w-[90%] items-center gap-1.5 flex-grow">
                                            <span
                                                className="w-3.5 h-3.5 rounded-sm"
                                                style={{ background: section.color }}
                                            ></span>
                                            <p className="text-sm font-medium text-gray-700">
                                                {section.name}
                                            </p>
                                        </div>
                                        <p className="w-[10%] text-sm font-semibold text-gray-700">
                                            {section.percent}%
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Second Row: Service or Product Splits */}
            {profileData?.UserProfileServices?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                    <div className="bg-white ">
                        <h3 className="font-semibold text-gray-900 mb-4">Service or Product Splits</h3>
                        <div className="space-y-3">
                            {profileData?.UserProfileServices?.map((item, index) => (<div key={index} >
                                <div className="flex justify-between text-sm text-gray-700">
                                    <span>{item?.ServiceName}</span><span>{item?.Percentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 h-2 rounded-full">
                                    <div
                                        className="bg-[#2D65DD] h-2 rounded-full"
                                        style={{ width: `${item.Percentage}%` }}
                                    ></div>
                                </div>
                            </div>))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BusinessSnapshot;
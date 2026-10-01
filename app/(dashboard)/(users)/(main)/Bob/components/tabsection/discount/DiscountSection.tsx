'use client'

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { DiscountPortalService } from '@/app/api/dashboard/discount-portal';

const DiscountSection = ({ profileData }) => {
    const [apiDiscounts, setApiDiscounts] = useState<any[]>([]);
    const [isDiscountLoading, setIsDiscountLoading] = useState(false);
    const [favouriteDiscounts, setFavouriteDiscounts] = useState<Record<string, boolean>>({});

    const discounts = apiDiscounts.length > 0
        ? apiDiscounts
        : (Array.isArray(profileData?.Discounts) ? profileData.Discounts : []);

    useEffect(() => {
        const fetchBobProfileDiscounts = async () => {
            try {
                setIsDiscountLoading(true);;

                const res = await DiscountPortalService.getMyDiscountDetails(profileData?.UserId);
                if (res.status !== 200) return;

                const allDiscounts = Array.isArray(res.data?.Result) ? res.data.Result : [];
                setApiDiscounts(allDiscounts);
            } catch (error) {
                console.error('Failed to fetch Bob profile discounts:', error);
            } finally {
                setIsDiscountLoading(false);
            }
        };

        fetchBobProfileDiscounts();
    }, [profileData?.UserId]);

    const getExpiryDate = (discount) => {
        const value = discount?.ExpiryDate || discount?.ExpirationDate || discount?.ValidTill || discount?.Expiry;
        return value ? new Date(value) : null;
    };

    const isDiscountExpired = (discount) => {
        if (typeof discount?.IsExpired === 'boolean') return discount.IsExpired;
        if (typeof discount?.IsExpired === 'number') return discount.IsExpired === 1;
        if (typeof discount?.Status === 'string') return discount.Status.toLowerCase() === 'expired';

        const expiryDate = getExpiryDate(discount);
        return expiryDate ? expiryDate.getTime() < Date.now() : false;
    };

    const activeDiscounts = discounts.filter((discount) => !isDiscountExpired(discount));
    const expiredDiscounts = discounts.filter((discount) => isDiscountExpired(discount));

    const formatExpiryDate = (discount) => {
        const expiryDate = getExpiryDate(discount);
        if (!expiryDate || Number.isNaN(expiryDate.getTime())) return '-';
        return expiryDate.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        });
    };

    const getDiscountId = (discount, index) => String(discount?.Id ?? discount?.DiscountId ?? index);

    const handleGetCode = async (discount) => {
        const code = discount?.Code || discount?.CouponCode;
        if (!code) {
            toast.info('Discount code is not available.');
            return;
        }

        try {
            await navigator.clipboard.writeText(code);
            toast.success(`Code copied: ${code}`);
        } catch {
            toast.success(`Code: ${code}`);
        }
    };

    const toggleFavouriteDiscount = (discount, index) => {
        const discountId = getDiscountId(discount, index);
        setFavouriteDiscounts((prev) => ({ ...prev, [discountId]: !prev[discountId] }));
    };

    const renderDiscountTable = (discountList, emptyText) => (
        <div className="overflow-x-auto discount-table-list">
            <table className="min-w-[760px] w-full table-fixed text-left overflow-auto">
                <colgroup>
                    <col className="w-[10.2857%]" />
                    <col className="w-[8.2857%]" />
                    <col className="w-[12.2857%]" />
                    <col className="w-[12.2857%]" />
                    <col className="w-[10.2857%]" />
                    <col className="w-[12.2857%]" />
                    <col className="w-[12.2857%]" />
                </colgroup>
                <thead>
                    <tr className="bg-[#F8FAFC] text-[#475467] text-xs">
                        <th className="px-3 py-3 font-semibold">Redeemable</th>
                        <th className="px-3 py-3 font-semibold">Category</th>
                        <th className="px-3 py-3 font-semibold">Discount</th>
                        <th className="px-3 py-3 font-semibold">Expiration Date</th>
                        <th className="px-3 py-3 font-semibold">Customer Type</th>
                        <th className="px-3 py-3 font-semibold">Number of Discount</th>
                        <th className="px-3 py-3 font-semibold">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {discountList.length > 0 ? (
                        discountList.map((discount, index) => {
                            const discountId = getDiscountId(discount, index);
                            const isFavourite = favouriteDiscounts[discountId] ?? !!discount?.IsFavourite;

                            return (
                                <tr key={discountId} className="border-b border-[#EAECF0] text-[#344054]">
                                    <td className="px-3 py-3">
                                        <span className="inline-flex items-center rounded-full border border-[#D0D5DD] bg-white px-3 py-1 text-xs font-semibold text-[#344054]">
                                            {discount?.DiscountActivation === 'Online Only' ? 'Online' : discount?.DiscountActivation}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3">
                                        <span className="inline-flex items-center rounded-full bg-[#F2F4F7] px-3 py-1 text-xs font-semibold text-[#344054]">
                                            {discount?.CompanyCategory || discount?.DiscountCategory || 'General'}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3 text-xs text-[#1849A9] break-words">
                                        {discount?.Title || discount?.DiscountDescription || discount?.Description || '-'}
                                    </td>
                                    <td className="px-3 text-xs py-3">{formatExpiryDate(discount)}</td>
                                    <td className="px-3 py-3">
                                        <span className="inline-flex items-center rounded-full border border-[#D0D5DD] bg-white px-3 py-1 text-xs font-semibold text-[#344054]">
                                            {discount?.ActiveDiscount === 'New Customers Only' ? 'New' : discount?.ActiveDiscount}
                                        </span>
                                    </td>
                                    <td className="px-3 text-xs py-3">{discount?.NumberOfDiscount ?? discount?.RemainingDiscount ?? '-'}</td>
                                    <td className="discount-action-cell px-3 py-3 bg-transparent shadow-none">
                                        <span className="discount-action-wrap inline-flex items-center gap-2 whitespace-nowrap">
                                            <button
                                                type="button"
                                                onClick={() => handleGetCode(discount)}
                                                className="rounded-md h-9 bg-[#2357C6] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1849A9]"
                                            >
                                                Get the code
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => toggleFavouriteDiscount(discount, index)}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#D0D5DD] bg-white text-[#344054] shadow-none"
                                                aria-label="Toggle discount favorite"
                                            ><svg width="20" height="20" viewBox="0 0 20 20" fill={isFavourite ? '#2357C6' : 'none'} xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.40229 2.8739C9.59436 2.48478 9.6904 2.29022 9.82077 2.22806C9.9342 2.17398 10.066 2.17398 10.1794 2.22806C10.3098 2.29022 10.4058 2.48478 10.5979 2.8739L12.4201 6.56554C12.4768 6.68041 12.5052 6.73785 12.5466 6.78245C12.5833 6.82193 12.6273 6.85393 12.6762 6.87665C12.7314 6.90232 12.7948 6.91158 12.9215 6.93011L16.9976 7.52589C17.4268 7.58863 17.6414 7.62 17.7407 7.72483C17.8271 7.81604 17.8678 7.94138 17.8513 8.06595C17.8324 8.20912 17.6771 8.36045 17.3663 8.66312L14.418 11.5348C14.326 11.6243 14.2801 11.6691 14.2504 11.7224C14.2242 11.7695 14.2073 11.8213 14.2008 11.8749C14.1935 11.9354 14.2043 11.9986 14.226 12.1251L14.9217 16.1812C14.9951 16.609 15.0318 16.8229 14.9628 16.9499C14.9028 17.0603 14.7962 17.1378 14.6726 17.1607C14.5306 17.187 14.3385 17.086 13.9543 16.884L10.3104 14.9677C10.1969 14.908 10.1401 14.8781 10.0803 14.8664C10.0273 14.856 9.97286 14.856 9.91991 14.8664C9.8601 14.8781 9.80333 14.908 9.68979 14.9677L6.04585 16.884C5.66168 17.086 5.46959 17.187 5.32756 17.1607C5.20398 17.1378 5.09735 17.0603 5.03736 16.9499C4.96841 16.8229 5.0051 16.609 5.07848 16.1812L5.77415 12.1251C5.79584 11.9986 5.80669 11.9354 5.79935 11.8749C5.79285 11.8213 5.77601 11.7695 5.74975 11.7224C5.7201 11.6691 5.67414 11.6243 5.58224 11.5348L2.63388 8.66312C2.32313 8.36045 2.16776 8.20912 2.14885 8.06595C2.1324 7.94138 2.17304 7.81604 2.25946 7.72483C2.35878 7.62 2.57339 7.58863 3.00262 7.52589L7.07867 6.93011C7.20543 6.91158 7.26881 6.90232 7.32401 6.87665C7.37288 6.85393 7.41688 6.82193 7.45357 6.78245C7.495 6.73785 7.52336 6.68041 7.58006 6.56554L9.40229 2.8739Z" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>


                                            </button>
                                        </span>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={7} className="px-3 py-6 text-center text-xs text-[#667085]">{emptyText}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="overview-content ">
            <style jsx>{`
                .discount-table-list table tr td:nth-last-child(-n+2) {
                    background: transparent !important;
                    box-shadow: none !important;
                }

                .discount-table-list table tr td.discount-action-cell,
                .discount-table-list table tr td:nth-last-child(-n+2).discount-action-cell {
                    background: transparent !important;
                    box-shadow: none !important;
                }

                .discount-table-list table tr td:nth-last-child(-n+2) > div,
                .discount-table-list table tr td.discount-action-cell > div,
                .discount-table-list table tr td.discount-action-cell > span.discount-action-wrap {
                    background: transparent !important;
                    padding: 0 !important;
                    height: auto !important;
                    margin-left: 0 !important;
                    width: auto !important;
                    border-radius: 0 !important;
                    box-shadow: none !important;
                }
            `}</style>
            <div className='space-y-6'>
                <section className='rounded-xl border border-[#EAECF0] bg-white p-4 shadow-sm'>
                    <h2 className="text-base leading-[40px] font-semibold text-[#1D2939]">Active Discounts</h2>
                    <p className="mt-1 mb-4 text-xs text-[#475467]">These discounts are currently visible to Orisuun members only.</p>
                    {isDiscountLoading
                        ? <p className="px-3 py-6 text-sm text-[#667085]">Loading discounts...</p>
                        : renderDiscountTable(activeDiscounts, 'No active discounts available.')}
                </section>

                <section className='rounded-xl border border-[#EAECF0] bg-white p-4 shadow-sm'>
                    <h2 className="text-base leading-[40px] font-semibold text-[#1D2939]">Expired Discounts</h2>
                    <p className="mt-1 mb-4 text-xs text-[#475467]">These discounts are currently expired.</p>
                    {isDiscountLoading
                        ?
                        <p className="px-3 py-6 text-sm text-[#667085]">Loading discounts...</p>
                        : renderDiscountTable(expiredDiscounts, 'No expired discounts available.')}
                </section>
            </div>
        </div>
    );
};

export default DiscountSection;

'use client';

import { useEffect, useState } from 'react';
import swal from 'sweetalert';
import Loader from '@/components/ui/loader';
import Tooltip from '@/components/ui/tooltip';
import Link from 'next/link';
import { DiscountManagementService } from '@/app/api/dashboard/discount-portal';

interface Discount {
    Id: number;
    CompanyLogo: string;
    CompanyName: string;
    CompanyWebsite: string;
    CompanySlogan: string;
    CompanyIndustry: string;
    CompanyType: string;
    CompanyDescription: string;
    DiscountDescription: string;
    DiscountActivation: string;
    ActiveDiscount: string;
    ProposalDuration: number;
    NumberOfDiscount: number;
    Code: string;
    CreatedDateTime: string;
    UpdatedDateTime: string;
    IsFavourite: boolean;
    DiscountType: string;
    DiscountFor: string;
    IsStartUps: boolean;
    DiscountCreatorUserId: string;
    TermsOfUsing: string;
    IsActive: boolean;
}

const DiscountManagementPage = () => {
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [loading, setLoading] = useState(true);
    const currentUser = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userData'));

    useEffect(() => {
        const fetchDiscounts = async () => {
            try {
                const response = await DiscountManagementService.getAllDiscounts(currentUser?.Token, currentUser?.Id);
                if (response.status === 200) {
                    setDiscounts(response.data.Result);
                }
            } catch (error) {
                console.error('Error fetching discounts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDiscounts();
    }, []);

    const handleDeleteDiscount = async (discountId: number) => {
        try {
            const discount = discounts.find(d => d.Id === discountId);

            if (!discount) {
                swal('Error!', 'Discount not found.', 'error');
                return;
            }

            const isActive = discount.IsActive;

            const title = isActive ? 'Are you sure you want to deactivate this discount?' : 'Are you sure you want to permanently delete this discount?';
            const text = isActive
                ? 'This will deactivate the discount, but it will not be permanently removed.'
                : 'This will permanently delete the discount. This action cannot be undone!';
            const confirmButtonText = isActive ? 'Deactivate' : 'Delete';

            const willDelete = await swal({
                title: title,
                text: text,
                icon: 'warning',
                dangerMode: true,
                buttons: {
                    cancel: {
                        text: 'Cancel',
                        value: null,
                        visible: true,
                        className: 'swal-button--cancel',
                        closeModal: true,
                    },
                    confirm: {
                        text: confirmButtonText,
                        value: true,
                        visible: true,
                        className: 'swal-button--confirm',
                        closeModal: false,
                    },
                },
            });

            if (willDelete) {
                const response = await DiscountManagementService.deleteDiscount(discountId, currentUser?.Token);

                if (response.status === 200) {
                    if (isActive) {
                        setDiscounts(discounts.map(d => d.Id === discountId ? { ...d, IsActive: false } : d));
                        swal('Deactivated!', 'The discount has been deactivated.', 'success');
                    } else {
                        setDiscounts(discounts.filter(d => d.Id !== discountId));
                        swal('Deleted!', 'The discount has been permanently deleted.', 'success');
                    }
                } else {
                    swal('Error!', 'Failed to perform the action on the discount.', 'error');
                }
            }
        } catch (error) {
            swal('Error!', 'Failed to perform the action on the discount.', 'error');
        }
    };

    const handleTogglePause = async (discount: Discount) => {
        try {
            const newStatus = !discount.IsActive;
            const action = newStatus ? 'activate' : 'pause';  // toggling action based on status
            const actionText = newStatus ? 'Restore' : 'Pause'; // changed the action text dynamically

            // Display a confirmation dialog with action based on current status
            const willProceed = await swal({
                title: 'Are you sure?',
                text: `Do you want to ${actionText} this discount?`,
                icon: 'warning',
                buttons: {
                    cancel: {
                        text: 'Cancel',
                        value: null,
                        visible: true,
                        className: 'swal-button--cancel',
                        closeModal: true,
                    },
                    confirm: {
                        text: 'Confirm',
                        value: true,
                        visible: true,
                        className: 'swal-button--confirm',
                        closeModal: false,
                    },
                },
            });

            if (willProceed) {
                // Single API call to toggle the discount status (Pause/Restore)
                const response = await DiscountManagementService.toggleDiscountStatus(
                    discount.Id,
                    newStatus,  // Passing the toggled status (true for activate/false for pause)
                    currentUser?.Token
                );

                if (response.status === 200) {
                    // Update the discount state with the new status
                    setDiscounts(discounts.map(d =>
                        d.Id === discount.Id ? { ...d, IsActive: newStatus } : d
                    ));
                    swal('Success!', `Discount has been ${actionText}d.`, 'success');
                } else {
                    swal('Error!', `Failed to ${actionText} the discount.`, 'error');
                }
            }
        } catch (error) {
            swal('Error!', 'Failed to update discount status.', 'error');
        }
    };

    if (loading) {
        return <Loader />;
    }


    return (
        <div className="p-4 md:p-6 tracking-wide">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h2 className="text-xl font-semibold text-[#0B1636] flex items-center gap-3">
                            <div className="h-8 w-1 rounded-r-lg bg-[#0B1636]"></div>
                            <span>Discount Management</span>
                        </h2>
                        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            Total Discounts: {discounts.length}
                        </div>
                        <Link href='/discount-portal/create'>
                            <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-[#0B1636] text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed">
                                Create Discount
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {discounts.length > 0 ? (
                        <div className="min-w-full">
                            <div className="hidden md:grid grid-cols-12 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="col-span-3">Company</div>
                                <div className="col-span-3">Discount Details</div>
                                <div className="col-span-1">Activation</div>
                                <div className="col-span-1">Eligibility</div>
                                <div className="col-span-1">Duration</div>
                                <div className="col-span-1">Status</div>
                                <div className="col-span-2 text-right">Actions</div>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {discounts.map((discount) => (
                                    <div key={discount.Id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 hover:bg-gray-50">
                                        <div className="md:col-span-3">
                                            <div className="flex items-center">
                                                <div>
                                                    <div className="font-medium text-gray-900">{discount.CompanyName}</div>
                                                    <div className="text-sm text-gray-500">{discount.CompanyIndustry}</div>
                                                    <div className="text-xs text-blue-500 truncate max-w-[180px]">
                                                        <a href={discount.CompanyWebsite} target="_blank" rel="noopener noreferrer">
                                                            {discount.CompanyWebsite}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:col-span-3">
                                            <div className="text-sm font-medium text-gray-900 line-clamp-2">{discount.DiscountDescription}</div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                <span className="font-semibold">Code:</span> {discount.Code}
                                            </div>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                                <div className="text-sm text-gray-500">
                                                    <span className="font-semibold">Type:</span> {discount.DiscountType}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    <span className="font-semibold">For:</span> {discount.DiscountFor}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    <span className="font-semibold">Startup:</span> {discount.IsStartUps ? 'Yes' : 'No'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:col-span-1">
                                            <div className="text-sm text-gray-900 line-clamp-3">{discount.DiscountActivation}</div>
                                        </div>
                                        <div className="md:col-span-1">
                                            <div className="text-sm text-gray-900 line-clamp-3">{discount.ActiveDiscount}</div>
                                        </div>
                                        <div className="md:col-span-1">
                                            <div className="text-sm text-gray-900">
                                                {discount.ProposalDuration} months
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {discount.NumberOfDiscount} uses
                                            </div>
                                        </div>
                                        <div className="md:col-span-1">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${discount.IsActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {discount.IsActive ? 'Active' : 'Paused'}
                                            </span>
                                        </div>
                                        <div className="md:col-span-2">
                                            <div className="flex justify-end space-x-2">
                                                <Tooltip content={discount.IsActive ? 'Pause' : 'Restore'}>
                                                    <button
                                                        onClick={() => handleTogglePause(discount)}
                                                        className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-yellow-600 transition-colors"
                                                    >
                                                        {discount.IsActive ? (
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="20"
                                                                height="20"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            >
                                                                <rect x="6" y="4" width="4" height="16"></rect>
                                                                <rect x="14" y="4" width="4" height="16"></rect>
                                                            </svg>
                                                        ) : (
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="16"
                                                                height="16"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="#2357c6"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="w-4 h-4 sm:w-5 sm:h-5"
                                                            >
                                                                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                                                                <path d="M21 3v5h-5"></path>
                                                                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                                                                <path d="M8 16H3v5"></path>
                                                            </svg>
                                                        )}
                                                    </button>
                                                </Tooltip>
                                                <Tooltip content={discount.IsActive ? 'Soft Delete' : 'Delete Permanently'}>
                                                    <button
                                                        onClick={() => handleDeleteDiscount(discount.Id)}
                                                        className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-red-600 transition-colors"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="20"
                                                            height="20"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <polyline points="3 6 5 6 21 6"></polyline>
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                            <line x1="10" y1="11" x2="10" y2="17"></line>
                                                            <line x1="14" y1="11" x2="14" y2="17"></line>
                                                        </svg>
                                                    </button>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            No discounts found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DiscountManagementPage;
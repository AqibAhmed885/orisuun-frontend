"use client"
import { resetAuthState } from '@/data/slices/auth-slice'
import { resetUserState } from '@/data/slices/user-slice'
import Eye from '@/icons/eye'
import { apiEndpoint } from '@/utils/utils'
import axios from 'axios'
import moment from 'moment'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import Modal from '../../../../../components/ui/modal/modal'
import ShowFeedback from './components/ShowFeedback'
import swal from 'sweetalert';

const normalizeValue = (value) => {
    if (typeof value === 'string' && value.trim()) {
        return value.trim()
    }

    return ''
}

const getIpAddress = (record) => {
    return (
        normalizeValue(
            record?.IpAddress ||
            record?.IP ||
            record?.User_IP_address ||
            record?.UserIpAddress ||
            record?.IPAddress
        ) || 'N/A'
    )
}

const getCountryName = (record) => {
    return normalizeValue(record?.CountryName || record?.Country_name || record?.Country) || record?.AccountDeletionCountry || 'N/A'
}

const getCityName = (record) => {
    return normalizeValue(record?.CityName || record?.City_name || record?.City) || record?.AccountDeletionCity || 'N/A'
}

const getCreatedDateTime = (record) => {
    return normalizeValue(
        record?.CreatedDateTime ||
        record?.CreatedDate ||
        record?.CreatedAt ||
        record?.CreatedOn ||
        record?.LastActive ||
        record?.Date ||
        record?.DeletedDateTime ||
        record?.DeletedDate ||
        record?.DeletionDate ||
        record?.DateCreated ||
        record?.InsertedDateTime
    )
}

const getPlanType = (record) => {
    return (
        normalizeValue(record?.PlanType || record?.SubscriptionPlanType || record?.UserSubscribedPlanType) ||
        'Not_Selected'
    )
}

const formatPlanType = (planType) => {
    if (!planType || planType === 'N/A') {
        return 'N/A'
    }

    return planType === 'Not_Selected' ? 'Free' : planType
}

const formatDateTime = (value) => {
    return value ? moment(value).format('DD MMM, YYYY hh:mm a') : 'N/A'
}

const isUnavailable = (value) => {
    return !value || value === 'N/A'
}

const getUniqueOptions = (records, getter) => {
    return Array.from(
        new Set(
            records
                .map(getter)
                .filter((value) => !isUnavailable(value))
        )
    ).sort((a, b) => a.localeCompare(b))
}

const isTestAccount = (record) => {
    const explicitFlag = record?.IsTestAccount || record?.IsTestUser || record?.IsTest
    const email = normalizeValue(record?.Email || record?.UserEmail || record?.User_Email).toLowerCase()

    if (explicitFlag === true) {
        return true
    }

    if (!email) {
        return false
    }

    const [localPart = '', domain = ''] = email.split('@')

    return (
        localPart === 'test' ||
        localPart.startsWith('test.') ||
        localPart.startsWith('test_') ||
        localPart.startsWith('testing') ||
        localPart.includes('+test') ||
        domain === 'example.com' ||
        domain === 'test.com' ||
        domain.endsWith('.test') ||
        domain.includes('mailinator')
    )
}

const parseDeletionFeedback = (user) => {
    const rawReason = normalizeValue(user?.AccountDeletionReason || user?.DeletionReason || user?.Reason)
    const reasonMatch = rawReason.match(/reason:\s*(.+?)(?:;\s*willReturn:\s*(.+))?$/i)

    return {
        reason: normalizeValue(user?.UserAnswers || user?.ReasonForDeleting || (reasonMatch ? reasonMatch[1] : rawReason)),
        willReturn: normalizeValue(user?.WillReturn || user?.Will_you_return || user?.WillYouReturn || (reasonMatch ? reasonMatch[2] : '')),
    }
}

const hasDeletedUserIdentity = (user) => {
    return Boolean(
        normalizeValue(user?.Email || user?.UserEmail) ||
        normalizeValue(user?.FirstName) ||
        normalizeValue(user?.LastName) ||
        normalizeValue(user?.Name)
    )
}

const hasDeleteUserFeedbackAnswers = (user) => {
    const { reason, willReturn } = parseDeletionFeedback(user)

    return Boolean(reason || willReturn)
}

const getProfileTypeName = (profileType) => {
    const pt = Number(profileType)
    switch (pt) {
        case 1:
            return 'Black-Owned Business'
        case 2:
            return 'Consultant'
        case 3:
            return 'Expert'
        case 4:
            return 'Advocate'
        case 6:
            return 'Professional'
        case 7:
            return 'Investor'
        case 8:
            return 'Mentor'
        default:
            return 'Professional'
    }
}

const applyFeedbackFilters = (records, filters, fields) => {
    const search = filters.search.trim().toLowerCase()

    return records.filter((record) => {
        if (filters.country && getCountryName(record) !== filters.country) {
            return false
        }

        if (filters.city && getCityName(record) !== filters.city) {
            return false
        }

        if (filters.accountType && normalizeValue(record.AccountType) !== filters.accountType) {
            return false
        }

        if (filters.planType && formatPlanType(getPlanType(record)) !== filters.planType) {
            return false
        }

        if (!search) {
            return true
        }

        return fields.some((field) => normalizeValue(record?.[field]).toLowerCase().includes(search))
    })
}

const getYearlyCounts = (records) => {
    return Object.entries(
        records.reduce((counts, record) => {
            const createdDate = getCreatedDateTime(record)
            const parsedDate = moment(createdDate)

            if (!createdDate || !parsedDate.isValid()) {
                return counts
            }

            const year = parsedDate.format('YYYY')
            counts[year] = (counts[year] || 0) + 1

            return counts
        }, {})
    ).sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
}

const FeedbackDashboard = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const PAGE_SIZE = 50
    const [activeTab, setActiveTab] = useState('marketing')
    const [feedbackList, setFeedbackList] = useState([])
    const [onboardingList, setOnboardingList] = useState([])
    const [deleteUserList, setDeleteUserList] = useState([])
    const [feedbackData, setFeedbackData] = useState()
    const [showModal, setShowModal] = useState(false)
    const [marketingTotal, setMarketingTotal] = useState(0)
    const [onboardingTotal, setOnboardingTotal] = useState(0)
    const [deleteUserTotal, setDeleteUserTotal] = useState(0)
    const [pageByTab, setPageByTab] = useState({
        marketing: 0,
        onboarding: 0,
        deleteUser: 0,
    })
    const [hasMoreByTab, setHasMoreByTab] = useState({
        marketing: true,
        onboarding: true,
        deleteUser: true,
    })
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const loadingTabRef = useRef({})
    const [filters, setFilters] = useState({
        search: '',
        country: '',
        city: '',
        accountType: '',
        planType: '',
    })
    const currentUser = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userData'))

    const removeRowById = (setList, setTotal, id) => {
        setList(prev => prev.filter(item => item.Id !== id))
        setTotal(prev => Math.max(prev - 1, 0))
    }

    const handleTokenExpiration = useCallback(() => {
        toast.error("Token is expired")
        dispatch(resetUserState());
        dispatch(resetAuthState());
        localStorage.clear();
        Cookies.remove('token', { path: '/' });
        Cookies.remove('userData', { path: '/' });
        router.push('/signin');
    }, [dispatch, router])

    const loadFeedbackPage = useCallback(async (tab, pageNumber) => {
        if (loadingTabRef.current[tab] || !hasMoreByTab[tab]) {
            return
        }

        loadingTabRef.current[tab] = true
        setIsLoadingMore(true)

        try {
            if (tab === 'marketing') {
                const res = await axios.get(`${apiEndpoint}/Admin/GetMarketingFeedBackList?pageNumber=${pageNumber}&pageSize=${PAGE_SIZE}`, {
                    headers: {
                        XApiKey: currentUser?.Token,
                    },
                })

                if (res.status === 200) {
                    const items = res.data.Result || []
                    const mappedItems = items.map((item) => ({
                            ...item,
                            IpAddress: getIpAddress(item),
                            CountryName: getCountryName(item),
                            CityName: getCityName(item),
                            CreatedDateTime: getCreatedDateTime(item),
                    }))

                    setFeedbackList(prev => pageNumber === 1 ? mappedItems : [...prev, ...mappedItems])
                    setMarketingTotal(res.data.TotalCount || mappedItems.length)
                    setPageByTab(prev => ({ ...prev, marketing: pageNumber }))
                    setHasMoreByTab(prev => ({ ...prev, marketing: items.length === PAGE_SIZE }))
                }
            } else if (tab === 'onboarding') {
                const res = await axios.get(`${apiEndpoint}/Admin/GetOnboardingFeedbacks?pageNumber=${pageNumber}&pageSize=${PAGE_SIZE}`, {
                    headers: {
                        XApiKey: currentUser?.Token,
                    },
                })

                if (res.status === 200) {
                    const items = res.data.Result || []
                    const mappedItems = items
                        .filter((item) => !isTestAccount(item))
                        .map((item) => ({
                            ...item,
                            IpAddress: getIpAddress(item),
                            CountryName: getCountryName(item),
                            CityName: getCityName(item),
                            PlanType: getPlanType(item),
                            // Keep raw SubmittedAt from API and also set LastActive for existing UI usage
                            SubmittedAt: item?.SubmittedAt || getCreatedDateTime(item),
                            LastActive: item?.SubmittedAt || item?.LastActive || getCreatedDateTime(item),
                            ProfileType: item?.ProfileType ?? item?.ProfileTypeId ?? '',
                            ProfileTypeName: getProfileTypeName(item?.ProfileType ?? item?.ProfileTypeId ?? ''),
                        }))

                    setOnboardingList(prev => pageNumber === 1 ? mappedItems : [...prev, ...mappedItems])
                    setOnboardingTotal(res.data.TotalCount || mappedItems.length)
                    setPageByTab(prev => ({ ...prev, onboarding: pageNumber }))
                    setHasMoreByTab(prev => ({ ...prev, onboarding: items.length === PAGE_SIZE }))
                }
            } else if (tab === 'deleteUser') {
                const res = await axios.get(`${apiEndpoint}/User/GetAllDeletedUsers?pageNumber=${pageNumber}&pageSize=${PAGE_SIZE}`, {
                    headers: {
                        XApiKey: currentUser?.Token,
                    },
                })

                if (res.status === 200) {
                    const items = res.data.Result?.Users || []
                    const mappedItems = items
                        .filter((user) => hasDeletedUserIdentity(user) && hasDeleteUserFeedbackAnswers(user))
                        .map((user) => {
                            const { reason, willReturn } = parseDeletionFeedback(user)
                            const fallbackName = normalizeValue(user.Name)
                            const fullName = `${normalizeValue(user.FirstName)} ${normalizeValue(user.LastName)}`.trim()

                            return ({
                                Id: user.Id,
                                IP: getIpAddress(user),
                                CountryName: getCountryName(user),
                                CityName: getCityName(user),
                                Name: fullName || fallbackName,
                                UserEmail: user.Email || user.UserEmail,
                                AccountType: getPlanType(user),
                                UserAnswers: reason,
                                WillReturn: willReturn,
                                // Use LastActive returned by API for deleted users when available
                                LastActive: user?.LastActive || getCreatedDateTime(user),
                                ProfileType: user?.ProfileType ?? user?.ProfileTypeId ?? '',
                                ProfileTypeName: getProfileTypeName(user?.ProfileType ?? user?.ProfileTypeId ?? ''),
                            })
                        })

                    setDeleteUserList(prev => pageNumber === 1 ? mappedItems : [...prev, ...mappedItems])
                    setDeleteUserTotal(res.data.Result?.TotalCount || mappedItems.length)
                    setPageByTab(prev => ({ ...prev, deleteUser: pageNumber }))
                    setHasMoreByTab(prev => ({ ...prev, deleteUser: items.length === PAGE_SIZE }))
                }
            }
        } catch (error) {
            if (error?.response?.data === 'Token is expired.') {
                handleTokenExpiration()
            } else if (tab === 'deleteUser') {
                console.error('Error fetching delete user feedback:', error)
            } else {
                console.error('Error fetching feedback:', error)
            }
        } finally {
            loadingTabRef.current[tab] = false
            setIsLoadingMore(false)
        }
    }, [PAGE_SIZE, currentUser?.Token, handleTokenExpiration, hasMoreByTab])

    useEffect(() => {
        if (pageByTab[activeTab] === 0) {
            loadFeedbackPage(activeTab, 1)
        }
    }, [activeTab, loadFeedbackPage, pageByTab])

    useEffect(() => {
        if (pageByTab[activeTab] > 0 && hasMoreByTab[activeTab] && !loadingTabRef.current[activeTab]) {
            loadFeedbackPage(activeTab, pageByTab[activeTab] + 1)
        }
    }, [activeTab, hasMoreByTab, loadFeedbackPage, pageByTab])

    const activeRecords = activeTab === 'marketing' ? feedbackList : activeTab === 'onboarding' ? onboardingList : deleteUserList
    const countryOptions = useMemo(() => getUniqueOptions(activeRecords, getCountryName), [activeRecords])
    const cityOptions = useMemo(() => getUniqueOptions(activeRecords, getCityName), [activeRecords])
    const accountTypeOptions = useMemo(() => getUniqueOptions(activeRecords, (record) => normalizeValue(record.AccountType)), [activeRecords])
    const planTypeOptions = useMemo(() => getUniqueOptions(activeRecords, (record) => formatPlanType(getPlanType(record))), [activeRecords])

    const filteredMarketingList = useMemo(() => applyFeedbackFilters(
        feedbackList,
        filters,
        ['IpAddress', 'CountryName', 'CityName', 'CreatedDateTime']
    ), [feedbackList, filters])

    const filteredOnboardingList = useMemo(() => applyFeedbackFilters(
        onboardingList,
        filters,
        ['IpAddress', 'CountryName', 'CityName', 'Name', 'Email', 'AccountType', 'PlanType', 'SelectedAnswers', 'SubmittedAt']
    ), [onboardingList, filters])

    const filteredDeleteUserList = useMemo(() => applyFeedbackFilters(
        deleteUserList,
        filters,
        ['IP', 'CountryName', 'CityName', 'Name', 'ProfileTypeName', 'UserEmail', 'AccountType', 'UserAnswers', 'WillReturn', 'LastActive']
    ), [deleteUserList, filters])

    const activeFilteredRecords = activeTab === 'marketing' ? filteredMarketingList : activeTab === 'onboarding' ? filteredOnboardingList : filteredDeleteUserList
    const activeTotal = activeTab === 'marketing' ? marketingTotal : activeTab === 'onboarding' ? onboardingTotal : deleteUserTotal
    const yearlyCounts = useMemo(() => getYearlyCounts(activeFilteredRecords), [activeFilteredRecords])

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            ...(key === 'country' ? { city: '' } : {}),
        }))
    }

    const clearFilters = () => {
        setFilters({
            search: '',
            country: '',
            city: '',
            accountType: '',
            planType: '',
        })
    }

    useEffect(() => {
        clearFilters()
    }, [activeTab])

    const handleView = async (id) => {
        try {
            const res = await axios.get(`${apiEndpoint}/Admin/GetMarketingFeedById?id=${id}`, {
                headers: {
                    XApiKey: currentUser?.Token,
                },
            })
            if (res.status == 200) {
                setFeedbackData(res.data?.Result)
                setShowModal(!showModal)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleDeleteOnboarding = async (id) => {
        try {
            const willDelete = await swal({
                title: 'Are you sure?',
                text: 'This will delete the onboarding feedback. Do you want to continue?',
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
                        text: 'Delete',
                        value: true,
                        visible: true,
                        className: 'swal-button--confirm',
                        closeModal: false,
                    },
                },
            });

            if (willDelete) {
                const res = await axios.post(
                    `${apiEndpoint}/Admin/DeleteOnboardingFeedback?feedbackId=${id}`,
                    null,
                    {
                        headers: {
                            XApiKey: currentUser?.Token,
                        },
                    }
                )

                if (res.status === 200) {
                    removeRowById(setOnboardingList, setOnboardingTotal, id)
                    swal('Deleted!', 'Feedback has been deleted!', 'success')
                }
            } else {
                swal('Cancelled', 'Feedback is safe.', 'info')
            }
        } catch (error) {
            if (error?.response?.data === 'Token is expired.') {
                handleTokenExpiration()
            } else {
                swal('Failed!', 'Something went wrong while deleting feedback.', 'error')
                console.error(error)
            }
        }
    }

    const handleDeleteMarketing = async (id) => {
        try {
            const willDelete = await swal({
                title: 'Are you sure?',
                text: 'This will delete the marketing feedback. Do you want to continue?',
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
                        text: 'Delete',
                        value: true,
                        visible: true,
                        className: 'swal-button--confirm',
                        closeModal: false,
                    },
                },
            })

            if (willDelete) {
                removeRowById(setFeedbackList, setMarketingTotal, id)
                swal('Deleted!', 'Feedback has been deleted!', 'success')
            } else {
                swal('Cancelled', 'Feedback is safe.', 'info')
            }
        } catch (error) {
            if (error?.response?.data === 'Token is expired.') {
                handleTokenExpiration()
            } else {
                swal('Failed!', 'Something went wrong while deleting feedback.', 'error')
                console.error(error)
            }
        }
    }

    const handleDeleteDeletedUser = async (id) => {
        try {
            const willDelete = await swal({
                title: 'Are you sure?',
                text: 'This will delete the deleted user feedback. Do you want to continue?',
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
                        text: 'Delete',
                        value: true,
                        visible: true,
                        className: 'swal-button--confirm',
                        closeModal: false,
                    },
                },
            })

            if (willDelete) {
                removeRowById(setDeleteUserList, setDeleteUserTotal, id)
                swal('Deleted!', 'Feedback has been deleted!', 'success')
            } else {
                swal('Cancelled', 'Feedback is safe.', 'info')
            }
        } catch (error) {
            if (error?.response?.data === 'Token is expired.') {
                handleTokenExpiration()
            } else {
                swal('Failed!', 'Something went wrong while deleting feedback.', 'error')
                console.error(error)
            }
        }
    }


    return (
        <>
            <div className="p-6 tracking-wide">
                {/* Tabs */}
                <div className="border-b border-gray-200 px-5">
                    <nav className="-mb-px flex space-x-8  ">
                        <button
                            onClick={() => setActiveTab('marketing')}
                            className={`py-4 px-1 border-b-2 text-[17px]  ${activeTab === 'marketing' ? 'border-[#0B1636] font-semibold text-[#0B1636]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Marketing
                        </button>
                        <button
                            onClick={() => setActiveTab('onboarding')}
                            className={`py-4 px-1 border-b-2 text-[17px]  ${activeTab === 'onboarding' ? 'border-[#0B1636] font-semibold text-[#0B1636]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Onboarding
                        </button>
                        <button
                            onClick={() => setActiveTab('deleteUser')}
                            className={`py-4 px-1 border-b-2 text-[17px]  ${activeTab === 'deleteUser' ? 'border-[#0B1636] font-semibold text-[#0B1636]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Offboarding
                        </button>
                    </nav>
                </div>
                <div className="bg-white rounded-lg shadow-md py-5 mt-5">
                    <div className="flex justify-between items-center mb-4 pe-5">
                        <h2 className="text-xl font-semibold text-[#0B1636] flex items-center gap-3">
                            <div className="h-12 w-[8px] rounded-r-lg bg-[#0B1636]"></div>
                            <span>Feedback List</span>
                        </h2>
                    </div>

                    {/* Tab Content */}
                    <div className="px-5 py-4">
                        <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(event) => handleFilterChange('search', event.target.value)}
                                placeholder="Search feedback"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            />
                            <select
                                value={filters.country}
                                onChange={(event) => handleFilterChange('country', event.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            >
                                <option value="">All countries</option>
                                {countryOptions.map((country) => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                            <select
                                value={filters.city}
                                onChange={(event) => handleFilterChange('city', event.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            >
                                <option value="">All cities</option>
                                {cityOptions
                                    .filter((city) => !filters.country || activeRecords.some((record) => getCityName(record) === city && getCountryName(record) === filters.country))
                                    .map((city) => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                            </select>
                            {activeTab !== 'marketing' ? (
                                <select
                                    value={filters.accountType}
                                    onChange={(event) => handleFilterChange('accountType', event.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="">All account types</option>
                                    {accountTypeOptions.map((accountType) => (
                                        <option key={accountType} value={accountType}>{accountType}</option>
                                    ))}
                                </select>
                            ) : (
                                <div className="hidden xl:block" />
                            )}
                            {activeTab === 'onboarding' ? (
                                <select
                                    value={filters.planType}
                                    onChange={(event) => handleFilterChange('planType', event.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="">All plan types</option>
                                    {planTypeOptions.map((planType) => (
                                        <option key={planType} value={planType}>{planType}</option>
                                    ))}
                                </select>
                            ) : (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    Clear filters
                                </button>
                            )}
                            {activeTab === 'onboarding' && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 xl:col-start-5"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                        <div className="mb-4 flex flex-col gap-2 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 md:flex-row md:items-center md:justify-between">
                            <div className="font-medium text-[#0B1636]">
                                Showing {activeFilteredRecords.length} result{activeFilteredRecords.length === 1 ? '' : 's'}
                                {activeRecords.length !== activeFilteredRecords.length ? ` from ${activeRecords.length} loaded rows` : ` from ${activeRecords.length} loaded rows`}
                                {activeTotal ? ` of ${activeTotal} total` : ''}
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="font-medium text-[#0B1636]">Yearly data:</span>
                                {yearlyCounts.length > 0 ? (
                                    yearlyCounts.map(([year, count]) => (
                                        <span key={year} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200">
                                            {year}: {count}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-gray-500">No dated rows loaded</span>
                                )}
                            </div>
                        </div>
                        {activeTab === 'marketing' ? (
                            <div className="overflow-x-auto">
                                {filteredMarketingList.length > 0 ? (
                                    <table className="min-w-full table-fixed bg-white">
                                        <thead className="bg-gray-200">
                                            <tr>
                                                <th className="w-[20%] px-2 py-3 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                                    Ip
                                                </th>
                                                <th className="w-[20%] px-2 py-3 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                                    Country
                                                </th>
                                                <th className="w-[20%] px-2 py-3 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                                    City
                                                </th>
                                                <th className="w-[20%] px-2 py-3 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                                    Created Date and Time
                                                </th>
                                                <th className="w-[20%] px-2 py-3 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredMarketingList.map((data, index) => (
                                                <tr key={index}>
                                                    <td className="truncate px-2 py-3 text-sm text-gray-800 border-t">
                                                        {data.IpAddress}
                                                    </td>
                                                    <td className="truncate px-2 py-3 text-sm text-gray-800 border-t">
                                                        {data?.CountryName}
                                                    </td>
                                                    <td className="truncate px-2 py-3 text-sm text-gray-800 border-t">
                                                        {data?.CityName}
                                                    </td>
                                                    <td className="truncate px-2 py-3 text-sm text-gray-800 border-t">
                                                        {formatDateTime(data?.CreatedDateTime)}
                                                    </td>
                                                    <td className="px-2 py-3 text-sm text-gray-800 border-t">
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                type="button"
                                                                className="cursor-pointer"
                                                                onClick={() => handleView(data?.Id)}
                                                                aria-label="View feedback"
                                                            >
                                                                <Eye className="w-6 h-6" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="text-red-600 hover:text-red-800"
                                                                onClick={() => handleDeleteMarketing(data?.Id)}
                                                                aria-label="Delete feedback"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    version="1.1"
                                                                    width="16"
                                                                    height="16"
                                                                    x="0"
                                                                    y="0"
                                                                    viewBox="0 0 24 24"
                                                                    className="w-4 h-4 sm:w-5 sm:h-5"
                                                                >
                                                                    <g>
                                                                        <path
                                                                            d="m21 5H3a1 1 0 0 0 0 2h2v12a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V7h2a1 1 0 0 0 0-2zM11 16a1 1 0 0 1-2 0v-5a1 1 0 0 1 2 0zm4 0a1 1 0 0 1-2 0v-5a1 1 0 0 1 2 0zm-5-12h4a1 1 0 0 0 0-2h-4a1 1 0 0 0 0 2z"
                                                                            fill="#ef4444"
                                                                            opacity="1"
                                                                            data-original="#ef4444"
                                                                        ></path>
                                                                    </g>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No marketing feedback available</p>
                                )}
                            </div>
                        ) : activeTab === 'onboarding' ? (
                            <div className="overflow-x-auto">
                                {filteredOnboardingList.length > 0 ? (
                                        <table className="min-w-full table-fixed bg-white">
                                        <thead className="bg-gray-200">
                                            <tr>
                                                    <th className="w-[10%] px-2 py-3 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                                    IpAddress
                                                </th>
                                                    <th className="w-[10%] px-2 py-3 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                                        Country
                                                    </th>
                                                    <th className="w-[10%] px-2 py-3 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                                        City
                                                    </th>
                                                    <th className="w-[10%] px-2 py-3 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                                    Name
                                                </th>
                                                    <th className="w-[12%] px-2 py-3 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                                    Email
                                                </th>
                                                    <th className="w-[10%] px-2 py-3 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                                    Account Type
                                                </th>
                                                    <th className="w-[9%] px-2 py-3 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                                    Plan Type
                                                </th>
                                                    <th className="w-[13%] px-2 py-3 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                                    Created Date and Time
                                                </th>
                                                    <th className="w-[12%] px-2 py-3 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                                    Selected Options
                                                </th>
                                                    <th className="w-[4%] px-2 py-3 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredOnboardingList.map((data, index) => (
                                                <tr key={index}>
                                                    <td className="truncate px-2 py-3 text-sm text-gray-800 border-t">
                                                        {data.IpAddress || 'N/A'}
                                                    </td>
                                                    <td className="truncate px-2 py-3 text-sm text-gray-800 border-t">
                                                        {data.CountryName || 'N/A'}
                                                    </td>
                                                    <td className="truncate px-2 py-3 text-sm text-gray-800 border-t">
                                                        {data.CityName || 'N/A'}
                                                    </td>
                                                    <td className="truncate px-2 py-3 text-sm text-gray-800 border-t">
                                                        {data.Name}
                                                    </td>
                                                    <td className="truncate px-2 py-3 text-sm text-gray-800 border-t">
                                                        {data.Email}
                                                    </td>
                                                    <td className="truncate px-2 py-3 text-sm text-gray-800 border-t">
                                                        {data.AccountType}
                                                    </td>
                                                    <td className="truncate px-2 py-3 text-sm text-gray-800 border-t">
                                                        {formatPlanType(data.PlanType)}
                                                    </td>
                                                    <td className="truncate px-2 py-3 text-sm text-gray-800 border-t">
                                                        {formatDateTime(data.LastActive)}
                                                    </td>
                                                    <td className="truncate px-2 py-3 text-sm text-gray-800 border-t">
                                                        <ul className=" list-inside space-y-1">
                                                            {data.SelectedAnswers?.split('|').map((option, idx) => (
                                                                <li key={idx}>{idx + 1}. {option}</li>
                                                            ))}
                                                        </ul>
                                                    </td>

                                                    <td className="px-2 py-3 text-sm text-gray-800 border-t">
                                                        <button
                                                            onClick={() => handleDeleteOnboarding(data.Id)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                version="1.1"
                                                                width="16"
                                                                height="16"
                                                                x="0"
                                                                y="0"
                                                                viewBox="0 0 24 24"
                                                                className="w-4 h-4 sm:w-5 sm:h-5"
                                                            >
                                                                <g>
                                                                    <path
                                                                        d="m21 5H3a1 1 0 0 0 0 2h2v12a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V7h2a1 1 0 0 0 0-2zM11 16a1 1 0 0 1-2 0v-5a1 1 0 0 1 2 0zm4 0a1 1 0 0 1-2 0v-5a1 1 0 0 1 2 0zM10 4h4a1 1 0 0 0 0-2h-4a1 1 0 0 0 0 2z"
                                                                        fill="#ef4444"
                                                                        opacity="1"
                                                                        data-original="#ef4444"
                                                                    ></path>
                                                                </g>
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No onboarding data available</p>
                                )}
                            </div>
                        ) : activeTab === 'deleteUser' ? (
                            <div className="overflow-x-auto">
                                {filteredDeleteUserList.length > 0 ? (
                                            <table className="min-w-full table-fixed bg-white">
                                        <thead className="bg-gray-200">
                                            <tr>
                                                        <th className="w-[8%] px-2 py-3 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                                    IP
                                                </th>
                                                        <th className="w-[9%] px-2 py-3 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                                            Country
                                                        </th>
                                                        <th className="w-[9%] px-2 py-3 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                                            City
                                                        </th>

                                                        <th className="w-[10%] px-2 py-3 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                                    Name
                                                </th>

                                                        <th className="w-[9%] px-2 py-3 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                                    Accoun Type
                                                </th>

                                                        <th className="w-[13%] px-2 py-3 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                                    User Email
                                                </th>
                                                        <th className="w-[10%] px-2 py-3 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                                    Plan Type
                                                </th>
                                                        <th className="w-[13%] px-2 py-3 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                                    Created Date and Time
                                                </th>
                                                        <th className="w-[15%] px-2 py-3 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                                    Why are you deleting your account?
                                                </th>
                                                        <th className="w-[9%] px-2 py-3 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                                    Will you return?
                                                </th>
                                                        <th className="w-[4%] px-2 py-3 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">
                                                            Action
                                                        </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredDeleteUserList.map((data, index) => (
                                                <tr key={index}>
                                                    <td className="truncate px-2 py-3 text-sm text-gray-800 border-t">
                                                        {data.IP || 'N/A'}
                                                    </td>
                                                    <td className="truncate px-2 py-3 text-sm text-gray-800 border-t">
                                                        {data.CountryName || 'N/A'}
                                                    </td>
                                                    <td className="truncate px-2 py-3 text-sm text-gray-800 border-t">
                                                        {data.CityName || 'N/A'}
                                                    </td>
                                                    <td className="truncate px-2 py-3 text-sm text-gray-800 border-t">
                                                        {data.Name || 'N/A'}
                                                    </td>
                                                        <td className="truncate px-2 py-3 text-sm text-gray-800 border-t">
                                                            {data.ProfileTypeName || 'N/A'}
                                                        </td>
                                                    <td className="truncate px-2 py-3 text-sm text-gray-800 border-t">
                                                        {data.UserEmail || 'N/A'}
                                                    </td>
                                                    <td className="truncate px-2 py-3 text-sm text-gray-800 border-t">
                                                        {formatPlanType(data.AccountType)}
                                                    </td>
                                                    <td className="truncate px-2 py-3 text-sm text-gray-800 border-t">
                                                        {formatDateTime(data.LastActive)}
                                                    </td>
                                                    <td className="truncate px-2 py-3 text-sm text-gray-800 border-t">
                                                        {data.UserAnswers || 'N/A'}
                                                    </td>
                                                    <td className="truncate px-2 py-3 text-sm text-gray-800 border-t">
                                                        {data.WillReturn || 'N/A'}
                                                    </td>
                                                    <td className="px-2 py-3 text-sm text-gray-800 border-t">
                                                        <button
                                                            type="button"
                                                            className="text-red-600 hover:text-red-800"
                                                            onClick={() => handleDeleteDeletedUser(data?.Id)}
                                                            aria-label="Delete feedback"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                version="1.1"
                                                                width="16"
                                                                height="16"
                                                                x="0"
                                                                y="0"
                                                                viewBox="0 0 24 24"
                                                                className="w-4 h-4 sm:w-5 sm:h-5"
                                                            >
                                                                <g>
                                                                    <path
                                                                        d="m21 5H3a1 1 0 0 0 0 2h2v12a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V7h2a1 1 0 0 0 0-2zM11 16a1 1 0 0 1-2 0v-5a1 1 0 0 1 2 0zm4 0a1 1 0 0 1-2 0v-5a1 1 0 0 1 2 0zm-5-12h4a1 1 0 0 0 0-2h-4a1 1 0 0 0 0 2z"
                                                                        fill="#ef4444"
                                                                        opacity="1"
                                                                        data-original="#ef4444"
                                                                    ></path>
                                                                </g>
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No offboarding feedback available</p>
                                )}
                            </div>
                        ) : null}
                        {isLoadingMore && (
                            <div className="flex justify-center py-5 text-sm text-gray-500">
                                Loading all feedback...
                            </div>
                        )}
                        {!isLoadingMore && hasMoreByTab[activeTab] && (
                            <div className="flex justify-center py-5 text-sm text-gray-500">
                                Preparing more feedback...
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Modal
                showModal={showModal}
                setShowModal={setShowModal}
                title="Feedback"
            >
                <ShowFeedback feedbackData={feedbackData} />
            </Modal>
        </>
    )
}

export default FeedbackDashboard

'use client';

import Input from '@/components/ui/input';
import SearchIcon from '@/icons/sidebar/search-icon';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { data } from '../../../../../data/dashboard/discount-portal';
import { DiscountPortalService } from '@/app/api/dashboard/discount-portal';
import DiscountSection from './components/discount-section';
import ShimmerCard from './components/shimmerCard';
import ListView from './components/list-view';
import Select from 'react-select';
import { Grip,  Menu } from 'lucide-react';
import { ListBulletIcon } from '@heroicons/react/24/solid';
import Pagination from '@/components/ui/admin-pagination';

type DiscountFilterCriteria = {
  searchQuery: string;
  industrySearch: string;
  category: string;
  city: string;
  discountType: string;
};

const normalizeFilterValue = (value: unknown) =>
  String(value ?? '').trim().toLowerCase();

const filterDiscountList = (
  dataList: any[],
  { searchQuery, industrySearch, category, city, discountType }: DiscountFilterCriteria
) => {
  const query = normalizeFilterValue(searchQuery);
  const industry = normalizeFilterValue(industrySearch);
  const selectedCategory = normalizeFilterValue(category);
  const selectedCity = normalizeFilterValue(city);
  const selectedDiscountType = normalizeFilterValue(discountType);

  return dataList.filter((item: any) => {
    const searchableValues = [
      item?.CompanyName,
      item?.CompanySlogan,
      item?.CompanyType,
      item?.CompanyCategory,
      item?.CompanyIndustry,
      item?.CompanyDescription,
      item?.DiscountDescription,
      item?.DiscountActivation,
      item?.DiscountType,
      item?.ActiveDiscount,
    ].map(normalizeFilterValue);

    const matchesSearch =
      !query || searchableValues.some((value) => value.includes(query));
    const matchesIndustry =
      !industry || normalizeFilterValue(item?.CompanyIndustry).includes(industry);
    const itemCategory = normalizeFilterValue(
      item?.CompanyCategory || item?.CompanyType
    );
    const matchesCategory =
      !selectedCategory || itemCategory === selectedCategory;
    const matchesCity =
      !selectedCity || normalizeFilterValue(item?.City) === selectedCity;
    const matchesDiscountType =
      !selectedDiscountType ||
      normalizeFilterValue(item?.DiscountActivation) === selectedDiscountType ||
      normalizeFilterValue(item?.DiscountType) === selectedDiscountType;

    return (
      matchesSearch &&
      matchesIndustry &&
      matchesCategory &&
      matchesCity &&
      matchesDiscountType
    );
  });
};

const DiscountPortal = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [industrySearch, setIndustrySearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [allDiscounts, setAllDiscounts] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    ByAllDiscounts: false,
    ByBusinessType: false,
    ByOfferType: false,
    ByOnline: false,
    ByInStore: false,
    ByNewCustomers: false,
    ByStartUps: false,
    ByPartnerDiscounts: false,
    ByMemberDiscounts: false,
  });

  const [faviouritData, setFavouriteData] = useState([]);
  const [expireData, setExpireData] = useState([]);
  const [isNewData, setIsNewData] = useState([]);
  const [isMostPopulatedData, setMostPopulatedData] = useState([]);
  const [usedData, setUsedData] = useState([]);
  const [inMyCityDiscounts, setInMyCityDiscounts] = useState([]);
  const [isStartUpsData, setIsStartUpsData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [discountType, setDiscountType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 9;
  const [sectionFilter, setSectionFilter] = useState('Most Popular');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // current user data
  const userData =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData') || '{}');

  const isBlackOwnedBusinessUser =
    userData?.UserProfileTypeId === 1 ||
    (userData?.UserProfileName || '')
      .toString()
      .toLowerCase()
      .includes('black-owned business');

  const parseAmount = (value: unknown) => {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
      const normalized = value.replace(/[^\d.-]/g, '');
      const parsed = Number(normalized);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  };

  const getDiscountAmount = (discount: any) => {
    const amountFields = [
      discount?.Amount,
      discount?.DiscountAmount,
      discount?.SavingsAmount,
      discount?.CreditAmount,
      discount?.EstimatedSavings,
      discount?.NumberOfDiscount,
    ];

    for (const field of amountFields) {
      const amount = parseAmount(field);
      if (amount > 0) return amount;
    }

    return 0;
  };

  const formatAmount = (value: number) =>
    `$${Math.round(value).toLocaleString('en-US')}`;

  const discountMetrics = useMemo(() => {
    const memberDiscounts = allDiscounts.filter((item: any) =>
      (item?.DiscountType || '').toString().toLowerCase().includes('member')
    );

    const partnerDiscounts = allDiscounts.filter((item: any) =>
      (item?.DiscountType || '').toString().toLowerCase().includes('partner')
    );

    const memberAmount = memberDiscounts.reduce(
      (sum: number, item: any) => sum + getDiscountAmount(item),
      0
    );
    const partnerAmount = partnerDiscounts.reduce(
      (sum: number, item: any) => sum + getDiscountAmount(item),
      0
    );

    return {
      totalAmount: memberAmount + partnerAmount,
      memberAmount,
      partnerAmount,
      totalDiscountCount: allDiscounts.length,
    };
  }, [allDiscounts]);

  const setters = {
    setIsNewData,
    setMostPopulatedData,
    setFavouriteData,
    setExpireData,
    setUsedData,
  };

  const sectionOptions = [
    { value: 'Favourite', label: 'Favourite' },
    { value: 'New', label: 'New' },
    { value: 'Most Popular', label: 'Most Popular' },
    { value: 'In My City', label: 'In My City' },
    { value: 'Used', label: 'Used' },
    { value: 'Expiring Soon', label: 'Expiring Soon' },
    { value: 'Start Ups', label: 'Start Ups' },
  ];

  const sectionDataMap = useMemo(
    () => ({
      Favourite: faviouritData,
      New: isNewData,
      'Most Popular': isMostPopulatedData,
      'In My City': inMyCityDiscounts,
      Used: usedData,
      'Expiring Soon': expireData,
      'Start Ups': isStartUpsData,
    }),
    [faviouritData, isNewData, isMostPopulatedData, inMyCityDiscounts, usedData, expireData, isStartUpsData]
  );

  const filteredData = useMemo(() => {
    return filterDiscountList(sectionDataMap[sectionFilter] || [], {
      searchQuery,
      industrySearch,
      category,
      city,
      discountType,
    });
  }, [sectionDataMap, sectionFilter, searchQuery, industrySearch, category, city, discountType]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const res = await DiscountPortalService.getDiscountDetails(userData?.Id);
        if (res.status === 200) {
          const result = res.data?.Result || [];
          const favs = result.filter((item: any) => item.IsFavourite);
          const expiring = result.filter((item: any) => item.IsExpiringSoon);
          const used = result.filter((item: any) => item.IsExpired);
          const isNew = result.filter((item: any) => item.IsNew);
          const mostPop = result.filter((item: any) => item.IsMostPopulated);
          const inMyCity = result.filter((item: any) => item.IsInMyCity);
          const startUps = result.filter((item: any) => item.IsStartUps);

          setAllDiscounts(result);
          setFavouriteData(favs);
          setExpireData(expiring);
          setUsedData(used);
          setIsNewData(isNew);
          setMostPopulatedData(mostPop);
          setInMyCityDiscounts(inMyCity);
          setIsStartUpsData(startUps);
        }
      } catch (error) {
        console.error('Failed to fetch discounts', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleFilterToggle = async (key: string) => {
    let updatedFilters: any;
    if (key === 'ByAllDiscounts') {
      updatedFilters = Object.keys(filters).reduce(
        (acc, k) => ({ ...acc, [k]: k === 'ByAllDiscounts' ? !filters[k] : false }),
        {}
      );
    } else {
      updatedFilters = {
        ...filters,
        [key]: !filters[key],
        ByAllDiscounts: false,
      };
      if (Object.values(updatedFilters).every((v) => !v)) {
        updatedFilters.ByAllDiscounts = true;
      }
    }

    setFilters(updatedFilters);

    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const res = await DiscountPortalService.getSelectedDiscountCodes(
        updatedFilters,
        userData?.Id || ''
      );
      if (res.status === 200) {
        const result = res.data?.Result || [];
        setFavouriteData(result.filter((i: any) => i.IsFavourite));
        setExpireData(result.filter((i: any) => i.IsExpiringSoon));
        setUsedData(result.filter((i: any) => i.IsExpired));
        setIsNewData(result.filter((i: any) => i.IsNew));
        setMostPopulatedData(result.filter((i: any) => i.IsMostPopulated));
        setInMyCityDiscounts(result.filter((i: any) => i.IsInMyCity));
        setIsStartUpsData(result.filter((i: any) => i.IsStartUps));
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.Message || 'Failed to apply filters');
    }
  };

  const getPaginatedData = (list: any[]) => {
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    return list.slice(startIdx, startIdx + PAGE_SIZE);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, industrySearch, category, city, discountType, viewMode, sectionFilter]);

  const industryOptions = useMemo(() => {
    const set = new Set<string>();
    allDiscounts.forEach((d: any) => {
      if (d.CompanyIndustry) set.add(d.CompanyIndustry.trim());
    });
    return Array.from(set).filter(Boolean).map((s) => ({ value: s, label: s }));
  }, [allDiscounts]);

  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    allDiscounts.forEach((d: any) => d.CompanyCategory && set.add(d.CompanyCategory));
    return Array.from(set).map((v) => ({ value: v, label: v }));
  }, [allDiscounts]);

  const discountTypeOptions = useMemo(() => {
    const set = new Set<string>();
    allDiscounts.forEach((d: any) => {
      if (d.DiscountActivation) set.add(d.DiscountActivation);
    });
    return Array.from(set).filter(Boolean).map((v) => ({ value: v, label: v }));
  }, [allDiscounts]);

  function applyFilters(dataList: any[]) {
    return filterDiscountList(dataList, {
      searchQuery,
      industrySearch,
      category,
      city,
      discountType,
    });
  }

  const handleViewAll = (section: string) => {
    setSectionFilter(section);
    setCurrentPage(1);
    setExpandedSection((currentSection) =>
      currentSection === section ? null : section
    );
  };

  return (
    <div className="md:p-6">
      {/* Hero Section */}
      {/* <div className=" rounded-xl ">
        <div className="text-center max-w-4xl mx-auto py-6">
          {isBlackOwnedBusinessUser ? (
            <>
              <h1 className="text-3xl md:text-7xl font-bold text-omblue-700 mb-4">
                Exclusive Discounts
              </h1>
              <p className="text-3xl md:text-4xl font-bold text-omblue-700 mb-2">
                {formatAmount(discountMetrics.totalAmount)} in credits and savings
              </p>
              <p className="text-[22px] text-black-900 mb-2">
                {formatAmount(discountMetrics.memberAmount)} from our business members (like you)
              </p>
              <p className="text-[22px] text-black-900 mb-6">
                {formatAmount(discountMetrics.partnerAmount)} from our partners
              </p>
            </>
          ) : (
            <>
                <h1 className="text-3xl md:text-4xl font-bold text-omblue-700 mb-4">
                  Exclusive Discounts Just for You!
                </h1>
                <p className="text-lg md:text-[28px] font-medium text-black-900 mb-2">
                  {formatAmount(discountMetrics.totalAmount)} in savings
                </p>
                <p className="text-[22px] text-black-600 mb-6">
                  from Black-owned businesses ready for you to discover
                </p>
            </>
          )}

          <div className="mt-8 flex items-center justify-center gap-2">
            <h2 className="text-xl text-black-900">Easy to Use</h2>
            <HoverCard openDelay={100} closeDelay={150}>
              <HoverCardTrigger asChild>
                <button
                  type="button"
                  aria-label="Show Easy to Use instructions"
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-omblue-700 transition-colors hover:bg-omblue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-omblue-500 focus-visible:ring-offset-2"
                >
                  <Info className="h-5 w-5" aria-hidden="true" />
                </button>
              </HoverCardTrigger>
              <HoverCardContent
                align="center"
                side="bottom"
                sideOffset={8}
                collisionPadding={16}
                className="w-[calc(100vw-2rem)] max-w-md rounded-xl border border-gray-200 bg-white p-4 text-left text-gray-700 shadow-xl sm:p-5"
              >
                <h3 className="mb-3 text-base font-semibold text-omblue-700">
                  Easy to Use
                </h3>
                <ol className="list-decimal space-y-3 pl-5 text-sm leading-6 sm:text-base">
                  <li>
                    Search and explore discounts from Black-owned businesses
                    worldwide by <strong>city, business name, category, or industry</strong>.
                  </li>
                  <li>
                    Once you find a discount you&apos;d like to use, click{' '}
                    <strong>&quot;Get the Code&quot;</strong> to receive your personalized
                    discount code.
                  </li>
                  <li>
                    Redeem your discount <strong>in-store or online</strong>, as
                    specified by the participating business.
                  </li>
                </ol>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </div> */}

      {/* 🔍 Filters */}
      <div className="bg-white border flex flex-col gap-4 p-4 rounded-xl shadow-lg mb-6">
        <div className="flex items-center flex-col md:flex-row  justify-between gap-2">
          <div className="flex items-center justify-between w-full gap-4">
            <h1 className="text-lg font-semibold">Search & Filter</h1>
            <button
              type="button"
              className="md:hidden px-3 py-2 rounded-md border bg-white text-sm"
              aria-label={isFilterOpen ? 'Hide discount filters' : 'Show discount filters'}
              aria-expanded={isFilterOpen}
              onClick={() => setIsFilterOpen((isOpen) => !isOpen)}
            >
              <Menu />
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                setViewMode('grid');
                setExpandedSection(null);
              }}
              className={`flex items-center gap-2 text-nowrap font-medium px-3 py-2 rounded-md ${viewMode === 'grid' ? 'bg-omblue-500 text-white' : 'bg-white border'
                }`}
            >
              <Grip className="w-4 h-4" /> Card View
            </button>
            <button
              onClick={() => {
                setViewMode('list');
                setExpandedSection(null);
              }}
              className={`flex items-center gap-2 text-nowrap font-medium px-3 py-2 rounded-md ${viewMode === 'list' ? 'bg-omblue-500 text-white' : 'bg-white border'
                }`}
            >
              <ListBulletIcon className="w-4 h-4" /> List View
            </button>
          </div>
        </div>

        <div className={`${isFilterOpen ? 'grid' : 'hidden'} grid-cols-1 md:grid md:grid-cols-4 gap-3 items-center`}>
          <Input
            icon={<SearchIcon />}
            placeholder="Search for discount"
            className="rounded-md shadow-sm px-2 border-[#c7c7c7] "
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select
            className="w-full md:min-w-[260px]"
            options={industryOptions}
            value={industryOptions.find((o) => o.value === industrySearch) || null}
            onChange={(opt) => setIndustrySearch(opt?.value || '')}
            placeholder="Industry"
            isClearable
            styles={{
              control: (base) => ({
                ...base,
                minHeight: 50,
                height: 50,
                borderRadius: 8,
              }),
              valueContainer: (base) => ({
                ...base,
                height: 50,
                padding: '0 8px',
              }),
              input: (base) => ({
                ...base,
                margin: 0,
                padding: 0,
              }),
              indicatorsContainer: (base) => ({
                ...base,
                height: 50,
              }),
            }}
          />
          <Select
            className="w-full md:min-w-[260px]"
            options={categoryOptions}
            value={categoryOptions.find((o) => o.value === category) || null}
            onChange={(opt) => setCategory(opt?.value || '')}
            placeholder="Category"
            isClearable
            styles={{
              control: (base) => ({
                ...base,
                minHeight: 50,
                height: 50,
                borderRadius: 8,
              }),
              valueContainer: (base) => ({
                ...base,
                height: 50,
                padding: '0 8px',
              }),
              input: (base) => ({
                ...base,
                margin: 0,
                padding: 0,
              }),
              indicatorsContainer: (base) => ({
                ...base,
                height: 50,
              }),
            }}
          />
          <Select
            className="w-full md:min-w-[260px]"
            options={discountTypeOptions}
            value={discountTypeOptions.find((o) => o.value === discountType) || null}
            onChange={(opt) => setDiscountType(opt?.value || '')}
            placeholder="Discount Type"
            isClearable
            styles={{
              control: (base) => ({
                ...base,
                minHeight: 50,
                height: 50,
                borderRadius: 8,
              }),
              valueContainer: (base) => ({
                ...base,
                height: 50,
                padding: '0 8px',
              }),
              input: (base) => ({
                ...base,
                margin: 0,
                padding: 0,
              }),
              indicatorsContainer: (base) => ({
                ...base,
                height: 50,
              }),
            }}
          />
        </div>
      </div>

      {/* 🏷️ Main Content */}
      <div className="bg-white border rounded-lg shadow-sm min-h-[80vh] relative">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4">
          <div className="flex items-center gap-4">
            {viewMode === 'list' && (
              <div className="min-w-[220px]">
                <Select
                  options={sectionOptions}
                  value={sectionOptions.find(opt => opt.value === sectionFilter) || null}
                  onChange={opt => setSectionFilter(opt?.value || '')}
                  classNamePrefix="custom-section-select"
                  placeholder="Select Section"
                  isClearable={false}
                  menuPlacement="auto"
                />
              </div>
            )}

          </div>

          
        </div>

        <div className="p-4 pt-0 h-full">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
              {Array.from({ length: 3 }).map((_, idx) => (
                <ShimmerCard key={idx} />
              ))}
            </div>
          ) : viewMode === 'list' ? (
            <>
              <ListView data={getPaginatedData(filteredData)} />
              <div className="mt-2 flex justify-center pr-4">
                <Pagination
                  total={filteredData.length}
                  show={PAGE_SIZE}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          ) : (
            <>
              {(expandedSection === null || expandedSection === 'Favourite') && applyFilters(faviouritData).length > 0 && (
                <DiscountSection title="Favourite" data={expandedSection === 'Favourite' ? applyFilters(faviouritData) : getPaginatedData(applyFilters(faviouritData))} setters={setters} onViewAll={() => handleViewAll('Favourite')} isExpanded={expandedSection === 'Favourite'} />
              )}
              {(expandedSection === null || expandedSection === 'New') && applyFilters(isNewData).length > 0 && (
                <DiscountSection title="New Arrivals" data={expandedSection === 'New' ? applyFilters(isNewData) : getPaginatedData(applyFilters(isNewData))} setters={setters} onViewAll={() => handleViewAll('New')} isExpanded={expandedSection === 'New'} />
              )}
              {(expandedSection === null || expandedSection === 'Most Popular') && applyFilters(isMostPopulatedData).length > 0 && (
                <DiscountSection title="Most Popular" data={expandedSection === 'Most Popular' ? applyFilters(isMostPopulatedData) : getPaginatedData(applyFilters(isMostPopulatedData))} setters={setters} onViewAll={() => handleViewAll('Most Popular')} isExpanded={expandedSection === 'Most Popular'} />
              )}
              {(expandedSection === null || expandedSection === 'In My City') && applyFilters(inMyCityDiscounts).length > 0 && (
                <DiscountSection title="In My City" data={expandedSection === 'In My City' ? applyFilters(inMyCityDiscounts) : getPaginatedData(applyFilters(inMyCityDiscounts))} setters={setters} onViewAll={() => handleViewAll('In My City')} isExpanded={expandedSection === 'In My City'} />
              )}
              {(expandedSection === null || expandedSection === 'Used') && applyFilters(usedData).length > 0 && (
                <DiscountSection title="Used" data={expandedSection === 'Used' ? applyFilters(usedData) : getPaginatedData(applyFilters(usedData))} setters={setters} onViewAll={() => handleViewAll('Used')} isExpanded={expandedSection === 'Used'} />
              )}
              {(expandedSection === null || expandedSection === 'Expiring Soon') && applyFilters(expireData).length > 0 && (
                <DiscountSection title="Expired" data={expandedSection === 'Expiring Soon' ? applyFilters(expireData) : getPaginatedData(applyFilters(expireData))} setters={setters} onViewAll={() => handleViewAll('Expiring Soon')} isExpanded={expandedSection === 'Expiring Soon'} />
              )}
              {(expandedSection === null || expandedSection === 'Start Ups') && applyFilters(isStartUpsData).length > 0 && (
                <DiscountSection title="Start Ups" data={expandedSection === 'Start Ups' ? applyFilters(isStartUpsData) : getPaginatedData(applyFilters(isStartUpsData))} setters={setters} onViewAll={() => handleViewAll('Start Ups')} isExpanded={expandedSection === 'Start Ups'} />
              )}
            </>
          )}
        </div>


        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 p-4 gap-4">
            {data.map((filter, index) => (
              <div
                key={index}
                onClick={() => handleFilterToggle(filter.key)}
                className={`border rounded-lg p-6 cursor-pointer transition ${filters[filter.key]
                  ? 'bg-blue-50 text-blue-600 border-blue-600'
                  : 'bg-gray-100 text-gray-500 border-transparent'
                  }`}
              >
                <Image
                  src={filter.image}
                  alt={filter.text}
                  width={32}
                  height={32}
                  className="w-8 h-8 mx-auto mb-2"
                />
                <h5 className="text-black-400 text-h5 2xl:text-scaled-h5 font-semibold text-center">
                  {filter.text}
                </h5>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountPortal;

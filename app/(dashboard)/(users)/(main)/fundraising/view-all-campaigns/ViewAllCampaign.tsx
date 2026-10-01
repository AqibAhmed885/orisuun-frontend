'use client';

import { CampaignSection } from '@/app/(dashboard)/(users)/(main)/fundraising/view-all-campaigns/components/active-fundraising';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  defaultCampaignList,
  setCampaignList,
  setFavouriteCampaigns,
} from '@/data/slices/campaign-slice';
import { RootState } from '@/data/store';
import { ListingSkeletonList } from '@/components/feed-card-skeleton/listingsSkeleton';
import { fundraisingData, fundraisingSectionTitle } from '@/data/dashboard/fundraising';
import { CampaignService } from '@/app/api/dashboard/fundraising';
import Input from '@/components/ui/input';
import Select from 'react-select';
import SearchIcon from '@/icons/sidebar/search-icon';
import { Grip } from 'lucide-react';
import { ListBulletIcon } from '@heroicons/react/24/solid';
import ListView from './components/list-view';
import { cn } from '@/utils/utils';
import { useRouter } from 'next/navigation';
import { CampaignFavoriteService } from '@/app/api/dashboard/fundraising';
import Pagination from '@/components/ui/admin-pagination';
import {  Menu } from 'react-feather';

const ViewAllCampaign = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    Purpose: null,
    GoalsAlmostReached: false,
    MyCamapigns: false,
  });
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [goal, setGoal] = useState('');
  const disptach = useDispatch();
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  // mobile filter drawer toggle
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));
  const router = useRouter();
  const { favouriteCampaigns = [] } = useSelector((state: RootState) => state.campaign);

  const { campaignList = defaultCampaignList } = useSelector(
    (state: RootState) => state.campaign
  );

  // selected section for header dropdown (default to popularCampaigns)
  const [selectedSection, setSelectedSection] = useState<
    keyof typeof fundraisingSectionTitle | 'all'
  >('all');
  const [sectionDropdownOpen, setSectionDropdownOpen] = useState(false);

  // sections list for dropdown
  const sectionKeys = Object.keys(fundraisingSectionTitle) as Array<
    keyof typeof fundraisingSectionTitle
  >;

  const fetchFavouriteCampaigns = async () => {
    try {
      const response = await CampaignService.getFavouriteCampaigns(currentUser.Id);
      if (response.status === 200) {
        disptach(setFavouriteCampaigns(response.data.Result || []));
      } else {
        toast.error('Failed to create campaign');
        disptach(setFavouriteCampaigns(response.data.Result || []));
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      disptach(setFavouriteCampaigns([]));
    }
  };

  const fetchCampaignList = async () => {
    setIsLoading(true);
    try {
      const response = await CampaignService.getAllCampaigns(currentUser.Id, filters);
      if (response.status === 200) {
        disptach(setCampaignList(response.data.Result));
      } else {
        toast.error('Failed to create campaign');
      }
    } catch (error) {
      toast.error('Error creating campaign!', { type: 'error' });
      console.error('Error creating campaign:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignList();
  }, [filters]);

  useEffect(() => {
    fetchFavouriteCampaigns();
  }, []);

  const allCampaigns = Object.values(campaignList).flat();

  // --- build select options (react-select expects { value,label }) ---
  const industryOptions = Array.from(
    new Set(allCampaigns.map((c: any) => c.Industry).filter(Boolean))
  ).map((v) => ({ value: v, label: v }));

  const locationOptions = Array.from(
    new Set(allCampaigns.map((c: any) => c.UserCity).filter(Boolean))
  ).map((v) => ({ value: v, label: v }));

  const goalOptions = Array.from(
    new Set(allCampaigns.map((c: any) => String(c.Goal)).filter(Boolean))
  ).map((v) => ({ value: v, label: v }));

  // helper to apply search + select filters to any list of campaigns
  const applyFilters = (list: any[]) => {
    const q = search?.trim().toLowerCase();
    return list.filter((c: any) => {
      const matchesSearch =
        !q ||
        (c.Title && c.Title.toLowerCase().includes(q)) ||
        (c.UserCompanyName && c.UserCompanyName.toLowerCase().includes(q));

      const matchesIndustry = !industry || String(c.Industry) === String(industry);
      const matchesLocation = !location || String(c.UserCity) === String(location);
      const matchesGoal = !goal || String(c.Goal) === String(goal);

      return matchesSearch && matchesIndustry && matchesLocation && matchesGoal;
    });
  };

  // campaigns for the selected section (raw from store or computed)
  const campaignsForSelectedSectionRaw =
    selectedSection === 'all' ? allCampaigns : (campaignList[selectedSection] || []);

  // filtered campaigns for the selected section (used for list view)
  const campaignsForSelectedSection = applyFilters(campaignsForSelectedSectionRaw);

  // filtered per-section lists (used for card view grouped by sections)
  const filteredCampaignList: Record<string, any[]> = {};
  Object.keys(campaignList).forEach((section) => {
    filteredCampaignList[section] = applyFilters(campaignList[section] || []);
  });

  // combined filtered list (useful for "all" list)
  const combinedCampaigns = Object.values(filteredCampaignList).flat();


  // view handler
  const handleView = (id: string | number) => {
    router.push(`/fundraising/${id}`);
  };

  // toggle favourite handler (reuses CampaignFavoriteService logic)
  const handleToggleFavourite = async (campaignId: number) => {
    if (!currentUser?.Id) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const existing = favouriteCampaigns.find((f: any) => f.CampaignId === campaignId);

      if (existing) {
        // unfavourite
        const payload = { CampaignId: campaignId, UserId: currentUser.Id };
        const res = await CampaignFavoriteService.unfavoriteCampaign(payload);
        if (res.status === 201) {
          const newFavs = favouriteCampaigns.filter((f: any) => f.Id !== existing.Id);
          const newCampaignList = { ...campaignList };
          newCampaignList.favouriteCampaigns = newCampaignList.favouriteCampaigns?.filter((c: any) => c.Id !== campaignId) || [];
          disptach(setFavouriteCampaigns(newFavs));
          disptach(setCampaignList(newCampaignList));
          toast.success('Campaign removed from favourites');
        }
      } else {
        // favourite
        const payload = { CampaignId: campaignId, UserId: currentUser.Id };
        const res = await CampaignFavoriteService.favoriteCampaign(payload);
        if (res.status === 201) {
          const newFavouriteCampaigns = [...(favouriteCampaigns || []), res.data.Result];
          const newCampaignList = { ...campaignList };
          newCampaignList.favouriteCampaigns = [...(newCampaignList.favouriteCampaigns || []), /* optionally push campaign object */];
          disptach(setFavouriteCampaigns(newFavouriteCampaigns));
          disptach(setCampaignList(newCampaignList));
          toast.success('Campaign added to favourites');
        }
      }
    } catch (error) {
      console.error('Error updating favourite status:', error);
      toast.error('Error updating favourite status!');
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Helper for paginated data
  const getPaginatedData = (list: any[]) => {
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    return list.slice(startIdx, startIdx + PAGE_SIZE);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, selectedSection, viewMode, search, industry, location, goal]);

  return (
    <div className="xs:p-4 md:!p-6 tracking-wide space-y-10">
      {/* Filters Bar */}
      <div className="bg-white flex flex-col gap-4 p-4 rounded-xl shadow-lg mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Search & Filter</h1>
          {/* mobile filters button */}
          <button
            className="md:hidden px-3 py-2 border rounded-md text-sm bg-white"
            onClick={() => setIsFilterOpen(true)}
          >
            <Menu />
          </button>
        </div>

        {/* Desktop filters */}
        <div className="hidden md:grid grid-cols-4 gap-3 items-center">
          <Input
            icon={<SearchIcon />}
            placeholder="Search businesses..."
            containerClass="flex-1"
            className="rounded-md shadow-sm px-2 border-[#E3E3E2]"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Select
            className="min-w-[260px]"
            options={industryOptions}
            value={industryOptions.find(o => o.value === industry) || null}
            onChange={opt => setIndustry(opt?.value || '')}
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
            className="min-w-[260px]"
            options={locationOptions}
            value={locationOptions.find(o => o.value === location) || null}
            onChange={opt => setLocation(opt?.value || '')}
            placeholder="Location"
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
            className="min-w-[260px]"
            options={goalOptions}
            value={goalOptions.find(o => o.value === goal) || null}
            onChange={opt => setGoal(opt?.value || '')}
            placeholder="Goal"
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
        {/* Mobile filter drawer */}
        {isFilterOpen && (
          <div className=" flex">
            <div className="absolute inset-0 bg-black/40" onClick={() => setIsFilterOpen(false)} />
            <div className="relative w-full ">
              
              <div className="flex flex-col gap-3">
                <Input
                  icon={<SearchIcon />}
                  placeholder="Search businesses..."
                  containerClass="w-full"
                  className="rounded-md shadow-sm px-2 border-[#E3E3E2]"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <Select options={industryOptions} value={industryOptions.find(o => o.value === industry) || null} onChange={opt => setIndustry(opt?.value || '')} placeholder="Industry" isClearable />
                <Select options={locationOptions} value={locationOptions.find(o => o.value === location) || null} onChange={opt => setLocation(opt?.value || '')} placeholder="Location" isClearable />
                <Select options={goalOptions} value={goalOptions.find(o => o.value === goal) || null} onChange={opt => setGoal(opt?.value || '')} placeholder="Goal" isClearable />
                <div className="flex gap-2 mt-4">
                  <button
                    className="flex-1 px-4 py-2 border rounded-md"
                    onClick={() => {
                      setSearch('');
                      setIndustry('');
                      setLocation('');
                      setGoal('');
                    }}
                  >
                    Reset
                  </button>
                  <button className="flex-1 px-4 py-2 bg-omblue-600 text-white rounded-md" onClick={() => setIsFilterOpen(false)}>Apply</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Mode Toggle */}
      <div className="bg-white rounded-xl border min-h-[70vh] p-6"  >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Section dropdown - only show in list view */}
            {viewMode === 'list' ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSectionDropdownOpen(v => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md bg-white text- font-semibold"
                >
                  <span>
                    {selectedSection === 'all'
                      ? 'All Campaigns'
                      : fundraisingSectionTitle[selectedSection].title}
                  </span>
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.353a.75.75 0 011.14.98l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </button>

                {sectionDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-44 bg-white border rounded-md shadow-sm z-40">
                    <button
                      type="button"
                      className={cn('w-full text-left px-3 py-2 text-sm hover:bg-gray-100', selectedSection === 'all' && 'bg-gray-100')}
                      onClick={() => { setSelectedSection('all'); setSectionDropdownOpen(false); }}
                    >
                      All Campaigns
                    </button>
                    {sectionKeys.map((key) => (
                      <button
                        key={key}
                        type="button"
                        className={cn(
                          'w-full text-left px-3 py-2 text-sm hover:bg-gray-100',
                          selectedSection === key && 'bg-gray-100'
                        )}
                        onClick={() => { setSelectedSection(key); setSectionDropdownOpen(false); }}
                      >
                        {fundraisingSectionTitle[key].title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <h2 className="text-lg !leading-6 font-semibold text-blue-500">All Campaigns</h2>
            )}
          </div>

          <div className="flex items-center gap-2 my-4 md:mt-0">
            <button
              aria-label="Card view"
              onClick={() => setViewMode('card')}
              className={`flex items-center gap-2 font-medium px-3 py-2 rounded-md ${viewMode === 'card' ? 'bg-omblue-500 text-white' : 'bg-white border'}`}
            >
              <Grip className="w-4 h-4" />
              <span className="hidden sm:inline">Card View</span>
            </button>
            <button
              aria-label="List view"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 font-medium px-3 py-2 rounded-md ${viewMode === 'list' ? 'bg-omblue-500 text-white' : 'bg-white border'}`}
            >
              <ListBulletIcon className="w-4 h-4" />
              <span className="hidden sm:inline">List View</span>
            </button>
          </div>
        </div>
        {/* Campaign List */}
        {isLoading ? (
          <ListingSkeletonList />
        ) : (
            <>
              {viewMode === 'list' ? (
                (() => {
                  const baseList = selectedSection === 'all' ? combinedCampaigns : campaignsForSelectedSection;
                  const paginatedList = getPaginatedData(baseList);

                  return baseList.length > 0 ? (
                    <>
                      <ListView
                        data={paginatedList}
                        onView={handleView}
                        onFavourite={handleToggleFavourite}
                      />
                      <div className="flex justify-center mt-6 pr-4">
                        <Pagination
                          total={baseList.length}
                          show={PAGE_SIZE}
                          currentPage={currentPage}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mx-auto mb-4 h-16 w-16 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                        />
                      </svg>
                      <h2 className="text-lg font-semibold mb-2">No campaigns found</h2>
                      <p className="text-gray-400 mb-2">
                        We couldn&#39;t find any fundraising campaigns matching your filters.
                      </p>
                      <p className="text-gray-400">
                        Try adjusting your search or filter criteria.
                      </p>
                    </div>
                  )
                })()
              ) : (
                  <>
                    {Object.keys(filteredCampaignList).map((section) =>
                      filteredCampaignList[section]?.length ? (
                        <CampaignSection
                          key={fundraisingSectionTitle[section]?.type || section}
                          title={fundraisingSectionTitle[section]?.title || section}
                          campaigns={filteredCampaignList[section]}
                        // ensure responsive grid inside section if needed
                        />
                      ) : null
                    )}
                    {viewMode === 'card' && (
                      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {fundraisingData.map(({ icon: Icon, label, value }, index) => (
                          <div
                            key={index}
                            className="col-span-1 cursor-pointer text-[#080808] shadow-md hover:bg-opacity-20 min-h-[126px] xs:px-2 xs:py-4 md:!p-6 bg-white border-2 border-[#F2F4F7] flex flex-col items-center gap-4 box-border xs:rounded-lg md:rounded"
                            onClick={() => {
                              if (value == '90')
                                setFilters({
                                  Purpose: null,
                                  GoalsAlmostReached: !filters.GoalsAlmostReached,
                                  MyCamapigns: false,
                                });
                              else {
                                setFilters({
                                  Purpose: filters.Purpose ? null : value,
                                  GoalsAlmostReached: false,
                                  MyCamapigns: false,
                                });
                              }
                            }}
                          >
                            <Icon className="xs:max-w-[32px] xs:max-h-[32px] md:min-w-[40px] md:min-h-[40px]" />
                            <span className="text-[20px] text-center leading-[120%] text-black-500-custom font-medium">
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
              </>
            )}

          </>
        )}
      </div>



    </div>
  );
};

export default ViewAllCampaign;

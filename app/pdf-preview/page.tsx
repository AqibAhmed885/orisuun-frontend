'use client';

import React, { useEffect, useState, Suspense } from 'react';
import '@/styles/global.css';
import { useSearchParams } from 'next/navigation';
import { pluralizeResourceTypeName } from '@/utils/resourceType';

function PDFPreviewContent() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const currentDate = new Date();
  const dateShow = currentDate.getDate();
  const monthShow = currentDate.toLocaleString('en-US', { month: 'short' });
  const yearStr = currentDate.getFullYear().toString();
  const yearShow1 = parseInt(yearStr.slice(0, 2));
  const yearShow2 = parseInt(yearStr.slice(2));

  // Generate PDF title based on query parameters and resource data
  const getPDFTitle = () => {
    // Check for special views first
    if (searchParams.get('recent') === 'true') {
      return 'Recently Added';
    }

    if (searchParams.get('deadline') === 'true') {
      return 'Upcoming Deadlines';
    }

    // Check if we have resources to extract info from
    if (resources.length > 0) {
      const firstResource = resources[0];

      // If resourceTypeId is present, show resource type name (pluralized)
      if (searchParams.get('resourceTypeId')) {
        return pluralizeResourceTypeName(firstResource.ResourceTypeName);
      }

      // If cityId is present, show city name
      if (searchParams.get('cityId')) {
        return firstResource.CityName;
      }

      // If stateId is present, show state name
      if (searchParams.get('stateId')) {
        return firstResource.StateName;
      }

      // If countryId is present, show country name
      if (searchParams.get('countryId')) {
        return firstResource.CountryName;
      }
    }

    return 'Resources';
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        // Build query string from URL params
        const params = new URLSearchParams();
        const resourceTypeId = searchParams.get('resourceTypeId');
        const cityId = searchParams.get('cityId');
        const stateId = searchParams.get('stateId');
        const countryId = searchParams.get('countryId');
        const recent = searchParams.get('recent');
        const deadline = searchParams.get('deadline');

        if (resourceTypeId) params.append('resourceTypeId', resourceTypeId);
        if (cityId) params.append('cityId', cityId);
        if (stateId) params.append('stateId', stateId);
        if (countryId) params.append('countryId', countryId);
        if (recent) params.append('recent', recent);
        if (deadline) params.append('deadline', deadline);

        const queryString = params.toString();
        const url = `/api/preview/resources${queryString ? `?${queryString}` : ''}`;

        const res = await fetch(url);
        const data = await res.json();
        if (!cancelled) {
          if (res.ok && data?.ok) {
            setResources(Array.isArray(data.resources) ? data.resources : []);
          } else {
            setError(data?.error || 'Failed to load resources');
          }
        }
      } catch (err: any) {
        if (!cancelled) setError(String(err?.message || err || 'Failed to load'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  // Format resource location
  const formatLocation = (resource: any) => {
    if (resource.IsLocationVirtual) return 'Online';
    if (resource.IsNationWide) return `${resource.CountryName} (Nationwide)`;
    if (resource.IsStateWide) return `${resource.StateName} (Statewide)`;
    return resource.CityName || resource.Address || 'Location TBD';
  };

  // Format deadline
  const formatDeadline = (deadline?: string, deadlineType?: string) => {
    if (!deadline) return 'Rolling';
    if (deadlineType === 'Rolling') return 'Rolling';
    const date = new Date(deadline);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Group resources by type
  const groupResourcesByType = (resourcesArray: any[]) => {
    const grouped: { [key: string]: { title: string; resources: any[] } } = {};
    resourcesArray.forEach((resource) => {
      // Normalize type name by trimming whitespace and falling back to 'Other' — ensure pluralized headings
      const rawTitle = (resource.ResourceTypeName || 'Other');
      const title = typeof rawTitle === 'string' ? pluralizeResourceTypeName(rawTitle.trim() || 'Other') : 'Other';
      const typeKey = title.toLowerCase();
      if (!grouped[typeKey]) {
        grouped[typeKey] = {
          title,
          resources: [],
        };
      }
      grouped[typeKey].resources.push(resource);
    });
    return grouped;
  };

  const transformedResources = groupResourcesByType(resources);

  // Pagination settings — first content page uses a 3x3 grid (9) and following pages use 12
  const firstPageCapacity = 9; // show up to 9 resources on the first/content pages
  const pageCapacity = 12;

  // Generate all pages content keeping resource groups intact. Each page will contain resources
  // from a single ResourceTypeName (group). If a group is larger than a page, it spills to additional pages
  // but remains labeled with its group title.
  const generatePages = () => {
    const queuedPages: Array<{ chunk: any[]; isFirstPage: boolean }> = [];
    let firstPageUsed = false;

    const groups = Object.entries(transformedResources); // preserves insertion order

    // Build queued pages from groups while preserving group boundaries
    for (let gi = 0; gi < groups.length; gi++) {
      const [, data] = groups[gi];
      const title = data.title;
      const items = data.resources.map((r) => ({ ...r, category: title }));

      let idx = 0;
      while (idx < items.length) {
        const capacity = !firstPageUsed ? firstPageCapacity : pageCapacity;
        const chunk = items.slice(idx, idx + capacity);
        queuedPages.push({ chunk, isFirstPage: !firstPageUsed });
        firstPageUsed = true;
        idx += capacity;
      }
    }

    // Convert queued pages into actual React page elements, choosing background images appropriately
    return queuedPages.map((p, i) => {
      if (p.isFirstPage) {
        return createPageContent(p.chunk, i, '', true);
      }
      const isLastContentPage = i === queuedPages.length - 1;
      return createPageContent(p.chunk, i, isLastContentPage ? '/ContentPageLast.jpg' : 'resourcePDF/ContentPage.jpg', false);
    });
  };

  // Create content for each page
  const createPageContent = (pageResources: any[], pageIndex: number, backgroundImage: string, isFirstPage: boolean) => {
    return (
      <div key={`page-${pageIndex}`} className="relative overflow-hidden w-[595px] h-[842px] bg-[#0A193A] text-white">
        {/* Background decorative layers */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <img src={`/pdf/pdf-bg-content1.svg`} alt="Decorative Layer" className="absolute -top-[140px] left-0 w-full h-full object-full" />
          <img src={`/pdf/pdf-bg-content2.svg`} alt="Decorative Layer" className="absolute -bottom-[100px] -left-[20px] w-full h-full object-full" />
        </div>

        {/* Top-right date block for first page */}
        {isFirstPage && (
          <div className="absolute right-[52px] top-[48px] z-20">
            <div className="flex items-center gap-2 pl-2">
              <span className="text-[14px] font-bold leading-none">{dateShow}</span>
              <span className="text-[14px] font-bold leading-none text-[#69B3E7]">{monthShow.toUpperCase()}</span>
            </div>
            <div className="text-[44px] font-bold leading-[0.85]">
              <div>{yearShow1}</div>
              <div>{yearShow2}</div>
            </div>
          </div>
        )}

        {/* Optional first-page hero / headline */}
        {pageIndex === 0 && (
          <div className='relative z-20 mt-[80px] ml-[34px] text-[45px] w-2/3'>
            <h1 className='leading-none'>RESOURCES FOR
              BLACK-OWNED
              BUSINESSES</h1>
            <p className='text-[15px] w-2/3'>Discover and track key resources useful to Black-owned businesses</p>
          </div>
        )}

        {/* group title resources type */}
        <h1 className={`text-xl font-[600] px-9 relative z-20 ${isFirstPage ? 'p-2' : 'pt-[3rem]'}`}>
          {pageResources.length > 0 ? pageResources[0].category.toUpperCase() : 'RESOURCES'}
        </h1>

        {/* Content area — render grid (3 columns) */}
        <div className={`relative z-20 px-2  w-full`}>
          {pageResources.length === 0 ? (
            <div className="p-6 text-white">No resources found for this page</div>
          ) : (
            <div className={`grid grid-cols-3 gap-2 px-6 pb-8 `}>
              {pageResources.map((resource: any, index: number) => {
                const cityOrCountry = resource.CityName || resource.CountryName || '';
                const sponsor = resource.Sponsor || resource.ContactName || '';
                const deadline = formatDeadline(resource.ApplicationDeadline, resource.DeadlineType);
                const grantAmount = resource.GrantDetails?.GrantAmount ?? resource.CompetitionDetails?.PrizeAmount ?? resource.AcceleratorDetails?.InvestmentAmount;

                // If this PDF is for a specific city, the city is redundant on every card.
                // Use a compact, more useful header for city views: Sponsor (ContactName) → Resource Name → State → Country.
                const isCityView = Boolean(searchParams.get('cityId'));
                const headerText = isCityView
                  ? (sponsor || resource.Name || resource.StateName || resource.CountryName || '')
                  : (resource.CityName || resource.CountryName || '');

                return (
                  <div
                    key={`${pageIndex}-${index}`}
                    className="bg-white rounded-2xl overflow-hidden p-3 h-[135px] flex flex-col "
                  >
                    <div>
                      <h3
                        className="text-sm text-[#0A3E6B] font-bold leading-tight mb-1"
                        style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                      >{headerText || '—'}</h3>
                      <div className="h-[2px] w-full bg-[#5EAEDB] mt-1 mb-1" />

                      <p className="text-[12px] font-semibold text-gray-900 leading-tight  truncate">{resource.Name || resource.ResourceTypeName || 'Untitled'}</p>
                      {sponsor ? <p className="text-[9px] text-gray-500 mb-1">{sponsor}</p> : null}

                      <div className="text-[7px] text-gray-500 ">
                        <div className="flex items-center gap-2">
                          <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 6-9 11-9 11s-9-5-9-11a9 9 0 1 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                          <span>{isCityView ? (resource.StateName || resource.CountryName || 'Location TBD') : (resource.CountryName ? `${resource.CountryName}` : cityOrCountry || 'Location TBD')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                          <span>Apply by: {deadline}</span>
                        </div>
                        {grantAmount ? (
                          <div className="flex items-center gap-2">
                            <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22"></path><path d="M17 5H9a3 3 0 0 0 0 6h6a3 3 0 1 1 0 6H7"></path></svg>
                            <span>Grant amount: {typeof grantAmount === 'number' ? `$${grantAmount}` : grantAmount}</span>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="text-xs text-gray-400 leeding-none">
                      {resource.Description ? (
                        <p className="text-[7px] leading-snug h-[34px] overflow-hidden text-ellipsis">{resource.Description}</p>
                      ) : (
                          <p className="text-[10px] leading-snug h-[34px] overflow-hidden text-ellipsis">No description available</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <p className="-rotate-90 absolute bottom-7 left-[24px] z-20 text-[12px] font-[700] text-white">
          {dateShow}&nbsp;&nbsp;<span className="text-[#69B3E7]">{monthShow.toUpperCase()}</span>
        </p>
        <div className="absolute left-[50px] -bottom-8 z-20 text-white w-[59px] h-[92px]">
          <div className="text-[26px] font-[600] leading-[0.85]">
            <div>{yearShow1}</div>
            <div>{yearShow2}</div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-6 text-center text-gray-500">Loading resources for preview…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div role="alert" className="p-6 text-center text-red-600">
          Failed to load resources: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[595px]">
      {/* Cover page */}
      <div className="relative overflow-hidden w-full h-[842px] bg-[#0A193A] text-white">
        <img
          src="/pdf-bg.svg"
          alt="Decorative Layer"
          className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none z-10"
        />
        <div className="absolute top-[85px] left-[449.5px] z-20 text-sm font-light font-sans">
          <span>
            {dateShow} {monthShow} {yearShow1}
            {yearShow2}
          </span>
        </div>

        <div className="mt-[125px] mx-8 relative z-20">
          <h1 className='flex flex-col font-[500] tracking-widest' style={{ lineHeight: '60px' }}>
            <span className='text-5xl' >BLACK BUSINESS</span>
            <span className='text-[65px] flex items-center gap-1 '>
              <img src="/pdf/star.svg" alt="" />
              RESOURCES</span>
            <span className='text-[65px] font-[700]'>SNAPSHOT</span>
          </h1>

          <div>
            {/* Subtitle */}
            <h1 className='text-[40px] uppercase mt-[90px]'>{getPDFTitle()}</h1>
          </div>


        </div>
        <a href="https://orisuun.com/" target="_blank" className="absolute top-[799px] left-[466px] z-20 text-xl font-light">
          <span>orisuun.com</span>
        </a>        
      </div>

      {/* Content pages */}
      {generatePages()}

      {/* Promo page
      <div className="relative overflow-hidden w-full h-[842px] bg-[#0A193A] text-white">
        <img
          src="/resourcePDF/PromoPage.jpg"
          alt="Decorative Layer"
          className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none z-10"
        />
        <a href="https://orisuun.com/" target="_blank" className="absolute top-[799px] left-[466px] z-20 text-xl font-light">
          <span>orisuun.com</span>
        </a>
      </div> */}
    </div>
  );
}

export default function PDFPreviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-6 text-center text-gray-500">Loading...</div>
      </div>
    }>
      <PDFPreviewContent />
    </Suspense>
  );
}

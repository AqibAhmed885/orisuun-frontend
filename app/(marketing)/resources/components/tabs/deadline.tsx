import React, { useState, useEffect, memo, useMemo, useCallback } from "react";
import ResourceCard from "../resourceCard";
import { getAllResources } from "@/app/api/marketing/resources";
import ResourceModal from "../ResourceModal";
import Banner from "../banner";
import Image from "next/image";
import { pluralizeResourceTypeName } from '@/utils/resourceType';
import { ArrowDownToLine } from "lucide-react";
import { downloadResourcesPDFFromAPI } from '@/utils/pdfGenerator';
import { toast } from "react-toastify";
import { ResourceLoader } from "../resourceLoader";
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;


function DeadlineTab({ viewMode = "card" }) {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await getAllResources({ includeExpired: false, page: 1, pageSize: 50 });
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter out resources with past deadlines
        const filtered = data?.filter((res: any) => {
          if (!res.ApplicationDeadline) return true; // Keep resources with no deadline
          const deadline = new Date(res.ApplicationDeadline);
          deadline.setHours(0, 0, 0, 0);
          return deadline >= today;
        }) || [];

        // Sort by ApplicationDeadline ascending (earliest first)
        const sorted = filtered.sort((a: any, b: any) => {
          const dateA = new Date(a.ApplicationDeadline || '9999-12-31');
          const dateB = new Date(b.ApplicationDeadline || '9999-12-31');
          return dateA.getTime() - dateB.getTime();
        }).slice(0, 12); // Limit to 12

        const mapped = sorted.map((res: any) => {
          // Get the appropriate amount and currency based on resource type
          let amount = null;
          if (res.GrantDetails?.GrantAmount) {
            amount = res.GrantDetails.GrantAmount.toLocaleString();
          } else if (res.CompetitionDetails?.PrizeAmount) {
            amount = res.CompetitionDetails.PrizeAmount.toLocaleString();
          } else if (res.AcceleratorDetails?.InvestmentAmount) {
            amount = res.AcceleratorDetails.InvestmentAmount.toLocaleString();
          }

          const displayCountry = res.CountryName || '';
          const displayLocation = res.CityName
            ? res.CityName
            : (res.IsLocationVirtual ? '' : (res.IsNationWide ? '' : (res.Address || displayCountry || '')));

          return {
            title: res.Name,
            org: res.Sponsor,
            location: displayLocation,
            country: displayCountry,
            amount: amount,
            currency: res.CurrencySymbol,
            deadline: res.ApplicationDeadline,
            deadlineType: res.DeadlineType,
            description: res.Description,
            type: pluralizeResourceTypeName(res.ResourceTypeName),
            isBlackFocused: res.isBlackFocused === true || res.IsBlackFocused === true || res.IsBlackFocused === 'Yes',
            eligibility: res.Eligibility,
            eventDate: res.CompetitionDetails?.CompetitionDate || null,
            locationScope: res.IsNationWide ? "Nationwide" : res.IsStateWide ? "Statewide" : "Specific",
            isVirtual: !!res.IsLocationVirtual,
            CityName: res.CityName,
            CountryName: res.CountryName,
            ...res
          };
        });
        setResources(mapped);
      } catch (err) {
        console.error('Failed to fetch resources:', err);
        setError('Failed to load resources');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Memoize grouped data for list view
  const groupedResources = useMemo(() => {
    return resources.reduce((acc, res) => {
      const type = res.type || 'General';
      if (!acc[type]) acc[type] = [];
      let cityLabel = 'Virtual';
      if (res.isVirtual || res.IsLocationVirtual) {
        cityLabel = 'Virtual';
      } else if (res.CityName) {
        cityLabel = res.CityName;
      } else if (res.IsNationWide) {
        cityLabel = 'Nationwide';
      } else if (res.CountryName) {
        cityLabel = res.CountryName.split(',')[0];
      }
      acc[type].push({ title: res.title, city: cityLabel, resource: res });
      return acc;
    }, {} as Record<string, { title: string; city: string; resource: any }[]>);
  }, [resources]);

  // Memoize click handlers
  const handleResourceClick = useCallback((res: any) => {
    setSelectedResource(res);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleDownloadPDF = useCallback(async () => {
    setDownloadingPDF(true);
    try {
      const filename = `Upcoming-Deadlines-${new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).replace(/,/g, '').replace(/\s+/g, '-')}`;

      await downloadResourcesPDFFromAPI(
        filename,
        undefined, // resourceTypeId
        undefined, // cityId
        undefined, // countryId
        undefined, // stateId
        false, // isBlackFocused
        false, // isRecent
        true // isDeadline
      );

      toast.success('Your resources have been downloaded successfully.');
    } catch (error) {
      console.error('PDF download failed:', error);
      toast.error('Failed to download PDF. Please try again.');
    } finally {
      setDownloadingPDF(false);
    }
  }, []);

  if (loading) {
    return (
      <ResourceLoader/>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (viewMode === "list") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
        {Object.entries(groupedResources).map(([type, items]: [string, { title: string; city: string; resource: any }[]]) => (
          <div key={type}>
            <h3 className="font-bold text-2xl mb-2 text-[#1A253C]">
              {type}
            </h3>
            <ul className="space-y-1">
              {items.map((item, idx) => (
                <li key={idx} className="text-[#4B5563] text-base">
                  <span
                    className="border-b border-[#4B5563] cursor-pointer hover:text-[#357CF6]"
                    onClick={() => handleResourceClick(item.resource)}
                  >
                    {item.title}
                  </span>
                  {item.city && <span className="text-gray-500 ml-2">
                    ({item.city || "Virtual"})
                    {item.resource.isBlackFocused && (
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
                          <span className="sr-only">A resource for Black people</span>
                        </span>
                      </span>
                    )}
                  </span>}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <ResourceModal
          open={modalOpen}
          setBanner={setShowBanner}
          resource={selectedResource}
          onClose={handleCloseModal}
        />
      </div>
    );
  }

  // Card view
  return (
    <>
      {showBanner &&
        <Banner 
          show={showBanner}
          setShow={setShowBanner}
        />
      }
      <div className="flex justify-end mb-4">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-omblue-600 text-white font-semibold hover:bg-omblue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleDownloadPDF}
          disabled={downloadingPDF}
        >
          <ArrowDownToLine size={16} /> {downloadingPDF ? 'Downloading...' : 'Download PDF'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((res, idx) => (
          <ResourceCard key={idx} {...res} onClick={() => handleResourceClick(res)} />
        ))}

        <ResourceModal
          open={modalOpen}
          setBanner={setShowBanner}
          resource={selectedResource}
          onClose={handleCloseModal}
        />
      </div>
    </>
  );
}

export default memo(DeadlineTab);

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import SearchIcon from '@/icons/sidebar/search-icon';
import Input from '@/components/ui/input';
import Hamburger from '@/icons/sidebar/hamburger';
import Image from 'next/image';
import CustomSelect from '@/components/ui/select';
import MultiSectionCheckboxAccordion from '@/components/ui/checbox-dropdown';
import FavouriteCardDetails from '@/components/cards/favourite-card-details';
import { cn } from '@/utils/utils';
import ChevronRight from '@/icons/chevron-right';
import Switch from '@/components/ui/switch';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import Filters from '@/icons/filters';
import { sections } from '@/data/dashboard/discount-portal';
import { DiscountSearchService } from '@/app/api/dashboard/discount-portal';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState(query);
  const [discoutData, setDiscountData] = useState(null);
  const [isCustomers, setIsCustomers] = useState(true);
  const [isStartUps, setIsStartUps] = useState(true);
  const [isFilter, setIsFilter] = useState(false)
  const [offerData, setOfferData] = useState([]);
  const currentUser = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userData'))
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/discount-portal/search-results?q=${encodeURIComponent(searchQuery)}`
      );
    }
  };

  const categorizeOptions = (selectedOptions) => {
    const categories = {
      BusinessType: [],
      OfferType: [],
      TypeOfUsage: [],
      TypeOfDiscount: []
    };

    selectedOptions.forEach((option) => {
      sections.forEach((section) => {
        const match = section.options.find((item) => item.id === option);
        if (match) {
          switch (section.title) {
            case 'By Business type':
              categories.BusinessType.push(option);
              break;
            case 'By Offer type':
              categories.OfferType.push(option);
              break;
            case 'Type of usage':
              categories.TypeOfUsage.push(option);
              break;
            case 'Type of discount':
              categories.TypeOfDiscount.push(option);
              break;
            default:
              break;
          }
        }
      });
    });
    return categories;
  };


  useEffect(() => {
    (async () => {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (query) {
        const categorizedOptions = categorizeOptions(selectedOptions);
        const payload = {
          MainSearch: query,
          SortBy: "",
          BusinessType: categorizedOptions.BusinessType,
          OfferType: selectedOffer,
          TypeOfUsage: categorizedOptions.TypeOfUsage,
          TypeOfDiscount: categorizedOptions.TypeOfDiscount,
          IsNewCustomers: isCustomers,
          IsStartUps: isStartUps,
          UserId: userData?.Id
        };

        const res = await DiscountSearchService.getFilteredDiscountCode(payload);
        if (res.status === 200) {
          setDiscountData(res.data?.Result || null);
        }
      }
    })()
  }, [query, selectedOptions, isCustomers, isStartUps, selectedOffer]);

  useEffect(() => {
    (async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData?.Id) {
          console.error('User ID not found');
          return;
        }
        const res = await DiscountSearchService.getOfferTypeList(userData.Id);
        if (res.status === 200) {
          const data = [
            {
              title: 'By Offer type',
              options: res.data?.Result.map(item => ({
                id: item,
                label: `${item} %`
              }))
            },
          ];
          setOfferData(data);
        }
      } catch (error) {
        console.error('Error fetching offer type list:', error);
        setOfferData([]);
      }
    })();
  }, []);

  return (
    <div className="px-6">
      <div className="lg:hidden flex items-center justify-between py-4">
        <Hamburger className="hamburger-top-icon" />
        <p className="text-h7 2xl:text-scaled-h7 font-semibold text-blue-600">
          Profile Search
        </p>
        <Image
          src={
            currentUser?.ProfilePicture ||
            BASE_URL
          }
          alt="user"
          width={32}
          height={32}
          className="rounded-full h-8 w-8 me-2"
        />
      </div>
      <div className="py-8">
        <div className='mb-8 mt-3'>
          <Breadcrumbs
            breadcrumbs={[
              { title: 'Discount Portal', url: '/discount-portal' },
              { title: "All Discounts" },
            ]}
          />
        </div>
        <form
          onSubmit={handleSearch}
          className="flex flex-row items-center gap-4 mx-auto w-full mb-3"
        >
          <Input
            icon={<SearchIcon />}
            placeholder="Search for discount"
            containerClass="flex-1"
            className="md:rounded-br-none md:rounded-tr-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="hidden md:block max-w-[170px] w-full 2xl:w-auto  2xl:max-w-none bg-blue-500 text-white px-4 py-3 rounded-br-md rounded-tr-md box-border"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => setIsFilter(true)}
            className="hidden ipad:flex border bg-white text-h9 2xl:text-scaled-h9 font-medium py-3 rounded-md focus:outline-none focus:border-omblue-500 focus:bg-[#f3f7f9] transition-colors duration-200 border-black-200 w-[46px] flex align-center justify-center"
          >
            <Filters className="w-5 h-5" />
          </button>
        </form>

        <div className="grid grid-cols-12 gap-3">
          <div className={cn("col-span-3 filter-container", isFilter ? 'show-filter' : "")}>
            <div
              className={cn(
                'block flex-none hide-scrollbar bg-white shadow-filter-primary p-4 max-w-md transition-all',
                !showFilters
                  ? 'max-h-16 overflow-hidden'
                  : 'max-h-[60rem] overflow-y-auto'
              )}
            >
              <div
                className="flex items-center gap-2 mb-4"
              >
                <div className="h-7 w-1 bg-blue-500 rounded-e-md"></div>
                <h6 className="text-h6 2xl:text-scaled-h6 text-blue-500 font-semibold">
                  Filters & Sort
                </h6>
                <ChevronRight className="ms-auto rotate-90" />
              </div>
              <div className="space-y-2">
                <label className="text-h8 2xl:text-scaled-h8 font-semibold text-black-500">
                  Sort By
                </label>

                <CustomSelect
                  placeholder="Select number of employees"
                  options={[]}
                  onChange={function (selectedOption: any): void {
                    throw new Error('Function not implemented.');
                  }}
                  error={undefined}
                  value={undefined}
                />
              </div>
              <hr className="mt-4 mb-1 border-b-black-500 mx-auto" />
              <MultiSectionCheckboxAccordion
                sections={offerData}
                selectedOptions={selectedOffer}
                onChange={setSelectedOffer}
                defaultClosedSections={[]}
              />
              <MultiSectionCheckboxAccordion
                sections={sections}
                selectedOptions={selectedOptions}
                onChange={setSelectedOptions}
              />
              <Switch
                label="New Customers Only"
                isOn={isCustomers}
                onToggle={() => setIsCustomers(!isCustomers)}
              />
              <Switch
                label="Ideal for startups?"
                isOn={isStartUps}
                onToggle={() => setIsStartUps(!isStartUps)}
              />
            </div>
          </div>
          <div className="col-span-9 ipad:col-span-12 space-y-4">
            {discoutData && discoutData.map((discoutData, index) => (
              < FavouriteCardDetails key={index} discoutData={discoutData} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

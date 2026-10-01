'use client';

import { LineChart } from '@/components/ui/MapChart';
import Bag from '@/icons/business-development/bag';
import Africa from '@/icons/region/africa';
import Asia from '@/icons/region/asia';
import CentralAmericaAndCaribbean from '@/icons/region/central-america-and-carribbean';
import Europe from '@/icons/region/europe';
import NorthAmerica from '@/icons/region/north-america';
import SouthAmerica from '@/icons/region/south-america';
import Hamburger from '@/icons/sidebar/hamburger';
import User from '@/icons/user';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';
import { getRegionListAction } from '@/server-actions/businessDevelopment';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

interface Region {
  Id: number;
  RegionName: string;
  IconName: any;
}

const regionIcons: { [key: string]: any } = {
  Africa,
  Asia,
  CentralAmericaAndCaribbean,
  Europe,
  NorthAmerica,
  SouthAmerica,
};

const createSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const Explore = () => {
  const [industry, setIndustry] = useState('');
  const [continent, setContinent] = useState<string>();
  const router = useRouter()
  const [regions, setRegions] = useState<Region[]>([]);
  const currentUser = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userData'))
  const fetchRegions = useCallback(async () => {
    try {
      const response = await getRegionListAction();
      setRegions(
        response.data.map((region: any) => ({
          ...region,
          IconName:
            regionIcons[region.RegionName.split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join('')] || (() => null),
        }))
      );
    } catch (error) {
      console.error('Error fetching regions:', error);
    }
  }, []);

  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);
  return (
    <div className="md:px-14 px-4">
      <div>
        <div className="md:hidden flex items-center justify-between py-5 px-4">
          <Hamburger className="hamburger-top-icon" />
          <p>Explore</p>
          <Image
            src={
              currentUser?.ProfilePicture || BASE_URL
            }
            alt="image"
            width={32}
            height={32}
            className="rounded-full h-8 w-8 me-2"
          />
        </div>
      </div>
      <div className="md:py-14 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 md:mb-20">
          <div className="space-y-6 w-full">
            <h1 className="text-h11 2xl:text-scaled-h11 font-medium text-blue-500">
              Explore our database
            </h1>
            <p className="text-h9 2xl:text-scaled-h9 text-[#58595A] font-medium">
              Discover opportunities, expand your network, and be part of a
              thriving community!
            </p>
          </div>
          <div className="space-y-4 w-full">
            <h6 className="text-h6 2xl:text-scaled-h6 font-semibold text-blue-500">
              Explore by Industry
            </h6>
            <div className="flex w-full gap-4">
              <Link className='w-full' href={`explore/industry?q=goods-producing-industries`}>
                <button
                  className={`w-full border rounded-lg p-6 space-y-4 ${industry === 'goods-producing-industry'
                    ? 'shadow-[0px_0px_0px_4px_#2357C61A] border-omblue-600 bg-olblue-50'
                    : 'border-[#D2D4DA]'
                    }`}
                  onClick={() => setIndustry('goods-producing-industry')}
                  type="button"
                >
                  <Bag className="text-omblue-500" />
                  <h5 className="md:h5 text-left font-semibold text-black-400">
                    Goods-Producing Industries
                  </h5>
                </button>
              </Link>
              <Link className='w-full' href={`explore/industry?q=service-producing-industries`}>
                <button
                  className={`w-full border rounded-lg p-6 space-y-4 ${industry === 'service-producing-industry'
                    ? 'shadow-[0px_0px_0px_4px_#2357C61A] border-omblue-600 bg-olblue-50'
                    : 'border-[#D2D4DA]'
                    }`}
                  onClick={() => setIndustry('service-producing-industry')}
                  type="button"
                >
                  <User className="text-omblue-500" />
                  <h5 className="md:h5 text-left font-semibold text-black-400">
                    Service-Producing Industries
                  </h5>
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <h6 className="text-h6 2xl:text-scaled-h6 font-semibold text-blue-500">
            Explore by Geography
          </h6>
          <LineChart />
          <div className="md:hidden grid grid-cols-12 gap-4">
            {regions.map((item) => {
              const Icon = item.IconName;
              return (
                <button
                  key={item.Id}
                  className={`col-span-6 w-full border rounded-lg p-6 space-y-4 ${continent === item.RegionName
                    ? 'shadow-[0px_0px_0px_4px_#2357C61A] border-omblue-600 bg-olblue-50'
                    : 'border-[#D2D4DA]'
                    }`}
                  onClick={() => {
                    const regionSlug = createSlug(item.RegionName);
                    if (item.RegionName) setContinent(item.RegionName);
                    router.push(`explore/geography?q=${regionSlug}`);
                  }}
                  type="button"
                >
                  <Icon
                    className={
                      continent === item.RegionName
                        ? 'text-omblue-500'
                        : 'text-omblue-300'
                    }
                  />
                  <h5 className="text-h5 2xl:text-scaled-h5 text-left font-semibold text-black-400">
                    {item.RegionName}
                  </h5>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;

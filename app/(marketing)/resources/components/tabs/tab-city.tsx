import React, { useEffect, useState, memo, useCallback, useMemo } from "react";
import { useRouter } from 'next/navigation';
import Africa from "@/icons/region/africa";
import NorthAmerica from "@/icons/region/north-america";
import Europe from "@/icons/region/europe";
import SouthAmerica from "@/icons/region/south-america";
import CentralAmericaAndCaribbean from "@/icons/region/central-america-and-carribbean";
import Asia from "@/icons/region/asia";
import { leaderboard } from "@/app/api/dashboard/leaderboard";
import { getRegionsWithResourceCounts } from "@/app/api/marketing/resources";
import { toSlug } from "../../utils/slug-utils";
import Image from "next/image";


const RegionSkeleton = () => (
	<div className="bg-white flex flex-col justify-between border-gray-200 min-h-[220px]">
		<hr className="pb-2 mx-2" />
		<div className="p-6 border-r mb-2">
			<div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-3/4"></div>
			<div className="flex-1 flex items-start justify-start mb-4">
				<div className="w-20 h-20 bg-gray-200 rounded animate-pulse"></div>
			</div>
			<div className="flex items-end justify-between">
				<div className="flex items-center gap-1 ml-4">
					{Array.from({ length: 6 }).map((_, i) => (
						<div
							key={i}
							className="w-8 h-8 bg-gray-200 rounded-full animate-pulse -ml-4"
						/>
					))}
				</div>
				<div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
			</div>
		</div>
	</div>
);

function TabCity({ onContinentSelect, setContinentId }) {
	const router = useRouter();
	const [regions, setRegions] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [flagUrls, setFlagUrls] = useState<Record<string, string>>({});

	// Memoize icon getter
	const getIcon = useCallback((name: string) => {
		switch (name.toLowerCase()) {
			case 'africa':
				return Africa;
			case 'asia':
				return Asia;
			case 'europe':
				return Europe;
			case 'north america':
				return NorthAmerica;
			case 'south america':
				return SouthAmerica;
			case 'central america and caribbean':
				return CentralAmericaAndCaribbean;
			default:
				return Asia; // Default icon
		}
	}, []);

	useEffect(() => {
		const fetchRegions = async () => {
			try {
				const regionData = await getRegionsWithResourceCounts();

				// Map API data to the structure
				const mappedRegions = regionData.map((region) => ({
					id: region.id,
					title: region.name,
					resources: region.resourceCount,
					Icon: getIcon(region.name), // Dynamic icon based on name
					flags: region.countryBreakdown.slice(0, 6).map(c => c.countryName), // Top 6 countries from API
				}));
				const filtered = mappedRegions.filter(c => c.resources > 0);

				setRegions(filtered);
			} catch (error) {
				console.error("Failed to fetch regions:", error);
				// No fallback to dummy data; show error message instead
				setRegions([]);
			} finally {
				setLoading(false);
			}
		};

		fetchRegions();
	}, [getIcon]);

	useEffect(() => {
		const fetchFlags = async () => {
			// Collect all unique countries from the API regions' flags
			const allCountries = regions.flatMap((r) => r.flags || []);
			const uniqueCountries = [...new Set(allCountries)];
			const flagPromises = uniqueCountries.map(async (country) => {
				const url = await leaderboard.fetchCountryFlag(country);
				return { country, url };
			});
			const results = await Promise.all(flagPromises);
			const flagMap = results.reduce(
				(acc, { country, url }) => {
					if (url) acc[country] = url;
					return acc;
				},
				{} as Record<string, string>
			);
			setFlagUrls(flagMap);
		};
		if (regions.length > 0) {
			fetchFlags();
		}
	}, [regions]);


	if (loading) {
		return (
			<div className="">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
					{Array.from({ length: 6 }).map((_, idx) => (
						<RegionSkeleton key={idx} />
					))}
				</div>
			</div>
		);
	}

	if (regions.length === 0) {
		return <div className="text-center py-8">No regions available.</div>;
	}


	return (
		<div className="">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
				{regions.map((region, idx) => (
					<div
						key={region.id}
						className="bg-white flex flex-col  justify-between border-gray-200 min-h-[220px] cursor-pointer"
						onClick={
							() => {
								// Navigate via URL for proper deep linking support
								const regionSlug = toSlug(region.title);
								router.push(`/resources/${regionSlug}`);
								// Also call legacy handlers for compatibility
								onContinentSelect(region.title, region.id);
								setContinentId(region.id);
							}

						}
					>
						<hr className="pb-2 mx-2" />
						<div className="p-6 border-r border-l mb-2">
							<h3 className="font-semibold text-[#1A253C] text-2xl mb-4">
								{region.title}
							</h3>
							<div className="flex-1 flex items-start justify-start mb-4">
								<region.Icon
									width={80}
									height={80}
									className="text-[#2458C7]"
								/>
							</div>
							<div className="flex items-end flex-row-reverse justify-between">
								<div className="flex items-center gap-1 ml-4">
									{region?.flags.map((country, i) =>
										flagUrls[country] ? (
											<div key={i} className={`relative group w-8 ${i === 0 ? '' : '-ml-4'}`} style={{ zIndex: i }}>
												<Image
													src={flagUrls[country]}
													alt={`${country} flag`}
													width={80}
													height={80}
													className={`rounded-full opacity-90 object-cover w-8 h-8   `}
													loading="lazy"
													priority={false}
												/>
												<div className="absolute left-0 top-10 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
													{country}
												</div>
											</div>
										) : (
											<div
												key={i}
												className="w-[24px] h-[16px] bg-gray-200 rounded-full animate-pulse"
											/>
										)
									)}
								</div>
								<div className="text-xs text-gray-400">
									{region.resources} resources
								</div>
							</div>
						</div>
						<hr className="mx-2" />
					</div>
				))}
			</div>
		</div>
	);
}

export default memo(TabCity);
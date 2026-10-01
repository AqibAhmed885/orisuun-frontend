'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import Favourite from '@/icons/favourite';
import { favouriteService } from '@/app/api/dashboard/favourites';
import { getFavouriteProfiles } from '@/app/api/dashboard/dashboard';
import { renderProfileTypeIcon } from '@/components/ui/profile-type';
import { leaderboard } from '@/app/api/dashboard/leaderboard';

interface FavouriteProfileItem {
	id: string | number;
	profileId: string | number | null;
	favouriteId: string | number | null;
	name: string;
	profileType: string;
	location: string;
	image: string;
}

const normalizeFavorites = (response: any[]): FavouriteProfileItem[] => {
	return (response || []).map((entry: any) => ({
		id: entry?.FavouriteId ?? entry?.Id ?? `${entry?.ProfileId || ''}-${entry?.CompanyName || ''}`,
		profileId: entry?.ProfileTypeId ?? entry?.UserProfileDetailId ?? null,
		favouriteId: entry?.FavouriteId ?? entry?.Id ?? null,
		name: entry?.CompanyName || entry?.ProfileName ,
		profileType: entry?.ProfileType || entry?.ProfileTypeName ,
		location: entry?.CountryName ,
		image: entry?.ProfilePicture || entry?.CompanyLogo || BASE_URL,
	}));
};

const Favourites = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [items, setItems] = useState<FavouriteProfileItem[]>([]);
	const [countryFlags, setCountryFlags] = useState<Record<string, string>>({});

	const currentUser =
		typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userData') || 'null') : null;

	const teamData =
		typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('teamData') || 'null') : null;

	const activeUserId = useMemo(() => {
		if (teamData?.isActive) {
			return teamData?.teamId;
		}

		return currentUser?.Id;
	}, [currentUser?.Id, teamData?.isActive, teamData?.teamId]);

	const fetchFavouriteProfiles = useCallback(async () => {
		if (!activeUserId) {
			setItems([]);
			setLoading(false);
			return;
		}

		try {
			setLoading(true);

            const result = await getFavouriteProfiles(String(activeUserId), '0');
			setItems(normalizeFavorites(result || []));
		} catch (error) {
			console.error('Error fetching favourite profiles:', error);
			setItems([]);
		} finally {
			setLoading(false);
		}
	}, [activeUserId]);

	useEffect(() => {
		fetchFavouriteProfiles();
	}, [fetchFavouriteProfiles]);

	useEffect(() => {
		const countriesToFetch = Array.from(
			new Set(
				items
					.map((item) => item.location?.trim())
					.filter((country): country is string => !!country && country !== 'Location not available' && !countryFlags[country])
			)
		);

		if (!countriesToFetch.length) {
			return;
		}

		let cancelled = false;

		const fetchFlags = async () => {
			const fetchedFlags = await Promise.all(
				countriesToFetch.map(async (country) => {
					const flagUrl = await leaderboard.fetchCountryFlag(country);
					return [country, flagUrl] as const;
				})
			);

			if (cancelled) {
				return;
			}

			setCountryFlags((prev) => {
				const next = { ...prev };

				fetchedFlags.forEach(([country, flagUrl]) => {
					if (flagUrl) {
						next[country] = flagUrl;
					}
				});

				return next;
			});
		};

		fetchFlags();

		return () => {
			cancelled = true;
		};
	}, [items, countryFlags]);

	const handleUnFavourite = async (item: FavouriteProfileItem) => {
		if (!activeUserId || !item.favouriteId) {
			return;
		}

		try {
			const success = await favouriteService.unFavouriteProfile({
				Id: Number(item.favouriteId),
				UserId: activeUserId,
			});

			if (success) {
				setItems((prev) => prev.filter((entry) => entry.id !== item.id));
			}
		} catch (error) {
			console.error('Error removing favourite profile:', error);
		}
	};

	return (
		<div className="w-full mt-6">
			<div className="w-full mt-4 bg-white border border-[#EAECF0] rounded-lg shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] p-4 md:p-5">
				<p className="text-sm text-[#344054] mb-4">
					You have {items.length.toLocaleString()} favourite profile{items.length === 1 ? '' : 's'}
				</p>

				{loading ? (
					<div className="space-y-3">
						{Array.from({ length: 5 }).map((_, index) => (
							<div key={index} className="h-[76px] border border-[#EAECF0] rounded-lg animate-pulse bg-gray-50" />
						))}
					</div>
				) : items.length === 0 ? (
					<p className="text-sm text-[#667085] py-10 text-center">No favourite profiles yet.</p>
				) : (
					<div className="max-h-screen overflow-y-auto pr-1 space-y-3">
						{items.map((item) => (
							<div
								key={item.id}
								className="w-full border-b border-[#EAECF0]  p-3 md:p-2 flex items-center justify-between gap-3"
							>
								<div
									className="flex items-center gap-3 min-w-0 cursor-pointer"
									onClick={() => {
										if (!item.profileId) {
											return;
										}

										const numericProfileId = Number(item.profileId);
										if (Number.isNaN(numericProfileId)) {
											return;
										}

										router.push(`/profile/${add2040ToProfileDetailsId(numericProfileId)}`);
									}}
								>
									<Image
										src={item.image}
										alt={item.name}
										width={48}
										height={48}
										className="w-12 h-12 rounded-full object-cover border"
									/>

									<div className="min-w-0">
										<div className="min-w-0 flex items-center gap-2">
											<p className="text-sm font-medium text-[#101828] truncate">{item.name}</p>
											<div className="flex flex-wrap items-center gap-2 mt-1">
												<span className="inline-flex items-center rounded-full border border-[#B2DDFF] bg-[#EFF8FF] gap-1 px-2 py-0.5 text-[11px] text-[#1849A9]">
													{renderProfileTypeIcon(
														Number(item.profileId),
														'default',
														false,
														'w-3.5 h-3.5 flex-shrink-0'
													)}
												</span>
											</div>
										</div>
										<span className="inline-flex mt-1 items-center gap-1 rounded-[4px] border-0.5 border-[#FCFCFD33] bg-[#F5F8FF] px-2 py-0.5 text-[11px] text-[#667085]">
											{countryFlags[item.location] ? (
												<Image
													src={countryFlags[item.location]}
													alt={`${item.location} flag`}
													width={20}
													height={14}
													className="h-3 w-4 rounded-[3px] object-cover"
												/>
											) : null}
											{item.location}
										</span>
									</div>
								</div>

								<button
									className="h-9 min-w-[98px] px-3 rounded-md border border-omblue-100 bg-olblue-50 text-xs font-medium text-omblue-700 hover:bg-olblue-100 transition-colors inline-flex items-center justify-center gap-2"
									onClick={() => handleUnFavourite(item)}
								>
									<Favourite className="w-4 h-4" />
									Favourited
								</button>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Favourites;

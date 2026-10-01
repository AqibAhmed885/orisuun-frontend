import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import BrowseDropdown from './BrowseDropDown';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../data/store';
import CommunityMembersModal from '../../communities/components/community-members-modal';
import EmptyIcon from '@/icons/community/empty';


type Member = {
	id: string;
	name: string;
	ProfilePicture: string;
};

type TrendingCommunity = {
	id: string;
	title: string;
	description: string;
	image: string;
	members: number; // Keep this for the count
	Members: any[]; // Add this for the actual members array
	isJoined?: boolean;
	city?: string;
	country?: string;
};


type TrendingCommunitiesProps = {
	onJoinSuccess?: () => void;
};

const TrendingCommunities: React.FC<TrendingCommunitiesProps> = ({onJoinSuccess}) => {
	const [communities, setCommunities] = useState<TrendingCommunity[]>([]);
	const [filteredCommunities, setFilteredCommunities] = useState<TrendingCommunity[]>([]);
	const [loading, setLoading] = useState(true);
	const [joiningCommunityId, setJoiningCommunityId] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedLocation, setSelectedLocation] = useState('');
	const [selectedSubject, setSelectedSubject] = useState('');
	const base = process.env.NEXT_PUBLIC_APP_BASE_URL;

	// Get current user from Redux store
	const { currentUser } = useSelector((state: RootState) => state.user);
	const userId = useSelector((state: any) => state.user?.currentUser?.UserId || state.auth?.user?.id || '');
	const [browseOpen, setBrowseOpen] = useState(false);
	const browseRef = useRef<HTMLDivElement | null>(null);
	const [selectedCommunity, setSelectedCommunity] = useState<TrendingCommunity | null>(null);
	const [showMembersModal, setShowMembersModal] = useState(false);

	useEffect(() => {
		function onClickOutside(e: MouseEvent) {
			if (browseRef.current && !browseRef.current.contains(e.target as Node)) {
				setBrowseOpen(false);
			}
		}
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape') setBrowseOpen(false);
		}
		document.addEventListener('mousedown', onClickOutside);
		document.addEventListener('keydown', onKey);
		return () => {
			document.removeEventListener('mousedown', onClickOutside);
			document.removeEventListener('keydown', onKey);
		};
	}, []);


	// Join community function
	const handleJoinCommunity = async (communityId: string) => {
		if (!userId || !currentUser) {
			console.error('User not authenticated');
			return;
		}

		setJoiningCommunityId(communityId);
		

		try {
			const payload = {
				CommunityId: communityId,
				UserIds: [userId],
				IsAdmin: false
			};

			const response = await axios.post(
				`${base}/api/Chat/AddCommunityMembers`,
				payload,
				{
					headers: {
						'Content-Type': 'application/json',
						accept: '*/*',
						XApiKey: 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
					},
					timeout: 30000,
				}
			);

			if (response.data?.Success) {
				fetchTrending(); // Refetch trending communities
				onJoinSuccess?.(); // Trigger parent refresh (for CommunitiesList)
			} else {
				console.error('Failed to join community:', response.data?.Message);
			}
		} catch (error) {
			console.error('Error joining community:', error);
		} finally {
			setJoiningCommunityId(null);
		}
	};

	const fetchTrending = React.useCallback(async () => {
		setLoading(true);
		try {
			const res = await axios.get(`${base}/api/Chat/GetTrendingCommunities`, {
				params: { page: 1, pageSize: 10 },
				headers: {
					accept: '*/*',
					XApiKey: 'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
				},
				timeout: 30000,
			});

			const apiCommunities = res.data?.Result?.Communities || [];
			const mappedCommunities = apiCommunities.map((c: any) => ({
				id: c.Id,
				title: c.Name,
				description: c.Description,
				image: c.ProfilePhotoUrl || '/chat/community.jpg',
				members: Array.isArray(c.Members) ? c.Members.length : 0,
				Members: c.Members || [],
				city: c.City,
				country: c.Country,
				isJoined:
					userId &&
					Array.isArray(c.Members) &&
					c.Members.some((member: any) => member.UserId === userId),
			}));

			setCommunities(mappedCommunities);
		} catch (err) {
			setCommunities([]);
			console.error('Failed to fetch trending communities', err);
		} finally {
			setLoading(false);
		}
	}, [base, userId]);


	useEffect(() => {
		fetchTrending();
		// ...rest of your cleanup if needed
	}, [base, userId]);

	const mappedMembers = Array.isArray(selectedCommunity?.Members)
		? selectedCommunity.Members.map((m: any) => ({
			id: m.UserId,
			name: m.UserName || m.Name,
			ProfilePicture: m.ProfilePicture,
			UserName: m.UserName,
			IsActive: m.IsActive,
			UserType: m.UserType,
			Location: m.Location,
			Country: m.Country,
			IsAdmin: m.IsAdmin,
			IsVerified: m.IsVerified,
		}))
		: [];
	// Filter communities based on search query
	useEffect(() => {
		const filtered = communities.filter(community => {
			const searchLower = searchQuery.toLowerCase();
			const locationString = community.city && community.country ? `${community.city}, ${community.country}` : community.city || community.country || '';
			const subjectString = community.description || '';

			const matchesSearch = community.title.toLowerCase().includes(searchLower);
			const matchesLocation = !selectedLocation || locationString === selectedLocation;
			const matchesSubject = !selectedSubject || subjectString === selectedSubject;

			return matchesSearch && matchesLocation && matchesSubject;
		});
		setFilteredCommunities(filtered);
	}, [searchQuery, communities, selectedLocation, selectedSubject]);

	function truncateWords(text = '', maxWords = 20) {
		const words = text.split(' ');
		return words.length > maxWords
			? words.slice(0, maxWords).join(' ') + '...'
			: text;
	}

	const locations = Array.from(new Set(communities.map(c => c.city && c.country ? `${c.city}, ${c.country}` : c.city || c.country).filter(Boolean)));
	const subjects = Array.from(new Set(communities.map(c => c.description).filter(Boolean)));

	return (
		<div className='w-full h-full bg-white p-4 rounded-lg shadow-xl'>
			{/* Mobile: Title on top, Desktop: Title and search on same line */}
			<div className="grid grid-cols-1 md:grid-cols-2  w-full items-center mb-4">
				<h3 className="text-xl font-semibold text-nowrap text-gray-800 mb-3 md:mb-0">
					Trending Communities
				</h3>
				<div className="flex items-center gap-3">
					<div className="relative flex-1 md:flex">
						<input
							type="text"
							placeholder="Search your communities"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10 pr-3 py-2 border rounded-lg w-full  focus:outline-none focus:ring-2 focus:ring-olblue-500 text-sm"
						/>
						<svg
							className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>

					{/* Filter button */}
					<div className="relative" ref={browseRef}>
						<button
							type="button"
							onClick={() => setBrowseOpen(prev => !prev)}
							className="inline-flex items-center justify-center md:gap-2 text-gray-600 md:text-[#2357C6] border border-gray-300 md:border-[#BFD2FB] rounded-lg bg-gray-100 md:bg-[#F5F8FF] hover:bg-gray-200 md:hover:shadow transition md:px-3 md:py-1.5 md:w-auto md:h-auto md:rounded-md"
							aria-haspopup="true"
							aria-expanded={browseOpen}
						>
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M8.33333 15H11.6667V13.3333H8.33333V15ZM2.5 5V6.66667H17.5V5H2.5ZM5 10.8333H15V9.16667H5V10.8333Z" fill="#6B7280" className="md:fill-[#2357C6]" />
							</svg>
							<span className='hidden md:inline font-semibold'>Browse</span>
						</button>
						<BrowseDropdown
							open={browseOpen}
							onClose={() => setBrowseOpen(false)}
							data={communities}
							onSelectLocation={loc => {
								setSelectedLocation(loc);
								setBrowseOpen(false);
							}}
							onSelectSubject={sub => {
								setSelectedSubject(sub);
								setBrowseOpen(false);
							}}
						/>
					</div>
				</div>
			</div>

			{loading ? (
				// Show loading skeletons
				<div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
					{Array.from({ length: 5 }).map((_, idx) => (
						<div key={idx} className="flex gap-2 md:gap-3 p-2 md:p-4 animate-pulse min-w-[200px] md:min-w-[350px]">
							<div className="w-12 h-12 md:w-20 md:h-20 rounded-lg bg-gray-300" />
							<div className="flex-1 space-y-2">
								<div className="h-4 bg-gray-200 rounded" />
								<div className="h-4 bg-gray-300 rounded" />
								<div className="h-4 bg-gray-300 rounded w-1/2" />
							</div>
						</div>
					))}
				</div>
			) : communities.length === 0 ? (
				<div className="flex w-full h-full flex-col items-center justify-center py-32">

					<EmptyIcon />

					<h2 className="text-lg font-semibold text-gray-700 mb-2">No trending communities yet</h2>
					<p className="text-base text-gray-400">Check back soon to discover popular communities worth joining.</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
					{filteredCommunities.map(c => (
						<div
							key={c.id}
							id={`community-${c.id}`}
							className="flex gap-2 md:gap-3 p-2 md:p-4"
							style={{ minWidth: '200px' }}
						>
							<Image
								src={c.image}
								alt={c.title}
								className="w-12 h-12 md:w-14 md:h-14 rounded-md mt-1 object-cover flex-shrink-0"
								width={120}
								height={120}
							/>
							<div className="flex-1 min-w-0">
								<h1 className="text-base md:text-lg tracking-wide capitalize font-semibold text-gray-900 truncate">{c.title}</h1>
								<div
									className="text-sm md:text-[15.5] text-gray-600 tracking-wide font-medium overflow-hidden"
									style={{
										display: '-webkit-box',
										WebkitLineClamp: 2,
										WebkitBoxOrient: 'vertical',
										lineClamp: 2, // for future compatibility
										wordSpacing: '0.12em',
									}}
								>
									{truncateWords(c.description, 18)}
								</div>
								<a
									className="block text-sm md:text-sm text-[#2357C6] hover:underline cursor-pointer"
									onClick={() => {
										setSelectedCommunity(c);
										setShowMembersModal(true);
									}}
								>
									{c.members.toLocaleString()} members
								</a>
								<button
									onClick={() => handleJoinCommunity(c.id)}
									disabled={joiningCommunityId === c.id || c.isJoined}
									className={`px-2 md:px-4 py-1 mt-1 md:mt-2 text-sm md:text-sm rounded-full border bg-[#F6F9FF] font-semibold transition ${c.isJoined
											? 'border-omblue-600 text-omblue-600 bg-[#F6F9FF] cursor-not-allowed'
											: joiningCommunityId === c.id
												? 'border-gray-300 text-gray-500 bg-gray-50 cursor-not-allowed'
												: 'border-[#85A9F6] text-[#2357C6] bg-[#F6F9FF] hover:bg-[#E4EBFF] '
										}`}
								>
									{joiningCommunityId === c.id
										? 'Joining...'
										: c.isJoined
											? 'Joined'
											: 'Join'
									}
								</button>
							</div>
						</div>
					))}
				</div>
			)}

			<CommunityMembersModal
				isOpen={showMembersModal}
				onClose={() => setShowMembersModal(false)}
				members={mappedMembers}
				onChat={(member) => {
					// Handle starting a chat with the member
					
					// You can navigate to a chat page or open a chat modal here
				}}
				onRemove={(member) => {
					// Handle removing the member (only if admin)
				
					// Implement removal logic if needed
				}}
				isCurrentUserAdmin={false} // Assuming users can't remove members from trending communities
			/>
		</div>
	);
};

export default TrendingCommunities;


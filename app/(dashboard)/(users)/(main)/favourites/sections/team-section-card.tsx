import Loader from '@/components/ui/loader';
import CustomSelect from '@/components/ui/select';
import Eye from '@/icons/eye';
import Favourite from '@/icons/favourite';
import { TypeIcons } from '@/utils/helper';
import { favouriteService } from '../../../../../api/dashboard/favourites';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';
import TeamCard from '@/components/cards/team-card';
import axios from 'axios';
import { toast } from 'react-toastify';

const TeamSectionCard = () => {
  const [profileType, setProfileType] = useState({
    label: 'Black-owned Business',
    value: 1,
  });
  const [profileTypes, setProfileTypes] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));

  const teamData = JSON.parse(localStorage.getItem('teamData'));
  useEffect(() => {
    fetchProfileTypes();
  }, []);

  const fetchProfileTypes = async () => {
    try {
      const types = await favouriteService.getProfileTypes();
      setProfileTypes(types);
    } catch (error) {
      console.error('Error fetching profile types:', error);
    }
  };

  const fetchFavouriteTeams = async () => {
    setLoader(true);
    try {
      const teamsList = await favouriteService.getTeamList({
        userId: (teamData && teamData?.isActive) ? teamData?.teamId : currentUser?.Id,
        isTeam: (teamData && teamData?.isActive) ? true : false
      });
      setTeams(teamsList.Result);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoader(false);
    }
  };

  // const setUnFavourite = async (profile) => {
  //   try {
  //     const success = await favouriteService.unFavouriteProfile({
  //       Id: profile.FavouriteId,
  //       UserId: (teamData && teamData?.isActive) ? teamData?.teamId : currentUser?.Id,
  //     });

  //     if (success) {
  //       setTeams((prevList) =>
  //         prevList.filter((pro) => pro.ProfileId !== profile.ProfileId)
  //       );
  //     }
  //   } catch (error) {
  //     console.error('Error updating favourite status:', error);
  //   }
  // };

  const handleFavorite = async (team) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/Favourite/SetRemoveFavoriteTeam?userId=${(teamData && teamData?.isActive ? teamData.teamId : currentUser.Id)}&teamId=${team.TeamId}`,
        null,
        {
          headers: {
            'Content-Type': 'application/json',
            'XApiKey': process.env.NEXT_PUBLIC_API_KEY
          }
        }
      );
      if (response.data.StatusCode == 200) {
        fetchFavouriteTeams();
        toast.success('Updated favorite teams!');
      } else {
        throw new Error(response.data?.Message || 'Failed to update favorite status');
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (profileType) {
      fetchFavouriteTeams();
    }
  }, [profileType]);

  const TeamCardShimmer = () => (
    <div className="flex items-center gap-2 pb-3 animate-pulse">
      {/* Team avatar group */}
      <div className="rounded-full bg-gray-200 w-16 h-16" />
      {/* Info */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="h-4 w-32 bg-gray-200 rounded mb-2 mt-2" />
        <div className="flex items-center gap-2 flex-wrap mt-1">
          <div className="h-3 w-20 bg-gray-100 rounded" />
        </div>
        <div className="flex gap-2 mt-2">
          <div className="w-4 h-4 bg-gray-200 rounded" />
          <div className="h-3 w-16 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="w-full py-6 flex gap-40">
        <div className="w-full md:w-[45%] flex flex-col gap-1">
          <label className="text-black-500 text-h8 2xl:text-scaled-h8 font-semibold mb-1">
            Profile Type
          </label>
          <CustomSelect
            placeholder="Select Profile Type"
            options={profileTypes.map((type) => ({
              value: type.Id,
              label: type.UserProfileName,
            }))}
            onChange={setProfileType}
            value={profileType}
            className="w-full z-20"
          />
        </div>
      </div>
      {loader ? (
        <div className="grid grid-cols-12 gap-5">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div className="col-span-6" key={idx}>
              <div className="w-full h-full p-4 rounded-md border border-grey-600">
                <TeamCardShimmer />
              </div>
            </div>
          ))}
        </div>
      ) : teams.length > 0 ? (
        <div className="grid grid-cols-12 gap-5">
          {teams.map((team, index) => (
            <div className="col-span-6" key={index}>
              <div className="w-full h-full p-4 rounded-md border border-grey-600">
                <div className="w-full flex items-center justify-between">
                  <TeamCard
                    teamMembers={team?.TeamMembers}
                    name={team?.TeamName}
                    profileTypeIds={team?.ProfileTypeIds}
                    isImage={false}
                    icon={team?.ProfileTypeIds}
                    variant="xl"
                    profileId={team.TeamId}
                  />
                  <div className="w-1/2 flex items-center justify-end gap-4">
                    <div
                      onClick={() => { handleFavorite(team)}}
                      className="w-10 h-10 flex items-center justify-center border border-omblue-500 bg-omblue-50 rounded-full p-2 cursor-pointer"
                    >
                      <Favourite className={"w-5 h-5 text-omblue-500"} />
                    </div>
                    <button
                      className="flex items-center gap-2 border border-omblue-100 px-5 py-3.5 rounded-md"
                      onClick={() =>
                        router.push(`/settings/teamprofile/${team?.TeamId}`)
                      }
                    >
                      <Eye className="w-4 h-4 text-omblue-500" />
                      <p className="text-h9 2xl:text-scaled-h9 text-omblue-500 font-medium">
                        View Profile
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="w-full text-center">No Teams found</p>
      )}
    </div>
  );
};

export default TeamSectionCard;

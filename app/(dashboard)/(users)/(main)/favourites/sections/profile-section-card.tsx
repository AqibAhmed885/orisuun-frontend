import ProfileCard from '@/components/cards/profile-card';
import Loader from '@/components/ui/loader';
import CustomSelect from '@/components/ui/select';
import Eye from '@/icons/eye';
import Favourite from '@/icons/favourite';
import { TypeIcons } from '@/utils/helper';
import { favouriteService } from '../../../../../api/dashboard/favourites';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BASE_URL } from '@/public/defaultProfile/defaultProfile';

const ProfileSectionCard = () => {
  const [profileType, setProfileType] = useState({
    label: 'Black-owned Business',
    value: 1,
  });
  const [location, setLocation] = useState(null);
  const [profileTypes, setProfileTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));
  
  const teamData = JSON.parse(localStorage.getItem('teamData'));
  
  useEffect(() => {
    fetchProfileTypes();
  }, []);

  useEffect(() => {
    if (profileType) {
      fetchLocationsByProfileType(profileType);
    }
  }, [profileType]);
  const fetchProfileTypes = async () => {
    try {
      const types = await favouriteService.getProfileTypes();
      setProfileTypes(types);
    } catch (error) {
      console.error('Error fetching profile types:', error);
    }
  };

  const fetchLocationsByProfileType = async (profileTypeId) => {
    try {
      const locationsList = await favouriteService.getLocationsByProfileType({
        ProfileTypeId: profileTypeId.value,
        UserId: currentUser?.Id,
      });
      setLocations(locationsList);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const fetchFilteredProfiles = async () => {
    setLoader(true);
    try {
      const profilesList = await favouriteService.getProfileList({
        UserProfileDetailId: profileType?.value,
        Locations: location?.label,
        UserId: (teamData && teamData?.isActive) ? teamData?.teamId : currentUser?.Id,
      });
      setProfiles(profilesList);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoader(false);
    }
  };

  const setUnFavourite = async (profile) => {
    try {
      const success = await favouriteService.unFavouriteProfile({
        Id: profile.FavouriteId,
        UserId: (teamData && teamData?.isActive) ? teamData?.teamId : currentUser?.Id,
      });

      if (success) {
        setProfiles((prevList) =>
          prevList.filter((pro) => pro.ProfileId !== profile.ProfileId)
        );
      }
    } catch (error) {
      console.error('Error updating favourite status:', error);
    }
  };
  useEffect(() => {
    if (profileType) {
      fetchFilteredProfiles();
    }
  }, [profileType, location]);

  const ProfileCardShimmer = () => (
    <div className="flex items-start gap-2 w-full animate-pulse">
      {/* Avatar */}
      <div className="rounded-full bg-gray-200 w-16 h-16" />
      {/* Info */}
      <div className="flex-1">
        <div className="h-4 w-32 bg-gray-200 rounded mb-2 mt-2 ms-2" />
        <div className="flex items-center gap-1.5 ms-2">
          <div className="w-4 h-4 bg-gray-200 rounded" />
          <div className="h-3 w-20 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );


  return (
    <div>
      <div className="w-full py-6 flex md:gap-40 gap-4">
        <div className="w-full flex flex-col gap-1">
          <label className="text-black-500 text-h8 2xl:text-scaled-h8 font-semibold mb-1">
            Profile Type
          </label>
          <CustomSelect
            placeholder="Select Profile Type"
            options={profileTypes.map((type) => ({
              value: type.Id,
              label: type.UserProfileName ? type.UserProfileName : type.UserProfileDetailName,
            }))}
            onChange={setProfileType}
            value={
              profileType.label === 'Black-owned Business'
                ? { label: ' Business', value: 1 }
                : profileType
            }
            className="w-full"
          />
        </div>
        <div className="w-full flex flex-col gap-1">
          <label className="text-black-500 text-h8 2xl:text-scaled-h8 font-semibold mb-1">
            Location
          </label>
          <CustomSelect
            placeholder="Select Location"
            options={locations.map((location) => ({
              value: location.Id,
              label: location.LocationName,
            }))}
            onChange={setLocation}
            value={location}
            className="w-full"
          />
        </div>
      </div>
      {loader ? (
        <div className="grid grid-cols-12 gap-5">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div className="col-span-6" key={idx}>
              <div className="w-full h-full p-4 rounded-md border border-grey-600">
                <ProfileCardShimmer />
              </div>
            </div>
          ))}
        </div>
      ) : profiles.length > 0 ? (
        <div className="grid md:grid-cols-12 gap-5">
          {profiles.map((profile, index) => (
            <div className="md:col-span-6" key={index}>
              <div className="w-full h-full p-4 rounded-md border border-grey-600">
                <div className="w-full flex items-center justify-between">
                  <ProfileCard
                    image={
                      profile?.ProfilePicture || BASE_URL
                    }
                    name={profile?.CompanyName}
                    company={profile?.ProfileType}
                    isImage={false}
                    icon={TypeIcons[profile.ProfileType]}
                    variant="lg"
                    profileId={profile.ProfileId}
                  />
                  <div className="w-1/2 flex items-center justify-end gap-4">
                    <div
                      className="w-10 h-10 flex items-center justify-center border border-green-500 bg-green-50 rounded-full p-2 cursor-pointer"
                      onClick={() => setUnFavourite(profile)}
                    >
                      <Favourite className="w-5 h-5 text-green-500 " />
                    </div>
                    <button
                      className="flex items-center gap-2 border border-omblue-100 px-5 py-3.5 rounded-md"
                      onClick={() =>
                        router.push(`/profile/${profile?.ProfileId}`)
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
        <p className="w-full text-center">No Profile found</p>
      )}
    </div>
  );
};

export default ProfileSectionCard;

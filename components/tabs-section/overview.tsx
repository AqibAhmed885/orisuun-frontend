import React, { useEffect, useRef, useState } from 'react';
import CircleHalfDotted from './icons/overview/circle-half-dotted';
import Nodes from './icons/overview/nodes';
import UserSearch from './icons/user-search';
import Earth from './icons/overview/earth';
import CellPhone from '@/icons/cofounder/cell-phone';
import MailEmail from '@/icons/cofounder/mail-email';
import AlarmClock from './icons/overview/alarm-clock';
import UsersBasic from '././icons/overview/users-basic';
import Calendar from '@/icons/cofounder/calendar';
import Language from './icons/overview/language';
import Handyman from '@/icons/handyman';
import CorporateFare from '@/icons/cofounder/corporate-fare';
import { cn } from '@/utils/utils';
import ImageIcon from './icons/overview/image-icon';
import VideoIcon from '././icons/overview/video-icon';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/data/store';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Video from 'yet-another-react-lightbox/plugins/video';
import axios from 'axios';
import 'mapbox-gl/dist/mapbox-gl.css';
import moment from 'moment';
import Map, { Marker } from 'react-map-gl';
import FileIcon from '@/icons/upload-icons/file-icon';
import router from 'next/router';

const tabs = [
  {
    name: 'All',
    icon: null,
  },
  {
    name: 'Photos',
    icon: <ImageIcon className={'w-6 h-6'} />,
  },
  {
    name: 'Videos',
    icon: <VideoIcon className={'w-6 h-6'} />,
  },
];
// const MapboxMap: any = MapboxGL({
//   accessToken:
//     'pk.eyJ1Ijoib3Jpc3V1biIsImEiOiJjbTE2eXZsdWYwY2V2MmltejFlbjJzajFpIn0.5a8sMLj2eWcJykZrKji8jg',
// });
const OverviewTab = () => {
  const { profileData } = useSelector((state: RootState) => state.user);

  const [selectedTab, setSelectedTab] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  // const photos = profileData.BusinessPhotos || [];
  // const videos = profileData.BusinessVideos || [];

  // Filter based on the selected tab
  const allMedia = [
    ...(profileData.BusinessPhotos?.map(
      (photo: { ProfilePicture: string }) => ({
        type: 'image',
        url: photo.ProfilePicture,
      })
    ) || []),
    ...(profileData.BusinessVideos?.map((video: { ProfileVideo: string }) => ({
      type: 'video',
      url: video.ProfileVideo,
    })) || []),
  ];


  // Filter based on the selected tab
  const filteredItems = allMedia?.filter(
    (item) =>
      selectedTab === 0 || item.type === (selectedTab === 1 ? 'image' : 'video')
  );

  const handleItemClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [showMap, setShowMap] = useState(false);

  const handleSeeOnMapClick = async () => {
    setShowMap(!showMap);
    let locationValue =
      profileData.CityName || profileData.StateName || profileData.CountryName;

    if (locationValue) {
      try {
        // Use Mapbox Geocoding API to get the coordinates
        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${locationValue}.json`,
          {
            params: {
              access_token:
                'pk.eyJ1Ijoib3Jpc3V1biIsImEiOiJjbTE2eXZsdWYwY2V2MmltejFlbjJzajFpIn0.5a8sMLj2eWcJykZrKji8jg', // Your Mapbox access token
            },
          }
        );

        if (response.data.features.length > 0) {
          const { center } = response.data.features[0]; // center returns [longitude, latitude]
          const [lng, lat] = center; // Destructure the coordinates
          setCoordinates({ lat: lat || 0, lng: lng || 0 });
          // setShowMap(true);
        }
      } catch (error) {
        console.error('Error fetching geocode:', error);
      }
    }
  };
  const formatAddress = () => {
    const { CityName, StateName, CountryName } = profileData;

    const parts = [];

    if (CityName) {
      parts.push(CityName);
    }

    if (StateName) {
      parts.push(StateName);
    }

    if (CountryName) {
      parts.push(CountryName);
    }

    return parts.join(', ');
  };


  // if (!profileData.AdditionalInfo) return null;
  return (
    <div className="grid grid-cols-12 gap-10">
      <div className="col-span-12 md:col-span-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div title="Verified">
              <CircleHalfDotted className="text-omblue-500" />
            </div>
            <h6 className="text-h6 2xl:text-scaled-h6 font-semibold text-blue-500">
              Orisuun Member Since:
            </h6>
            <h6 className="text-h6 2xl:text-scaled-h6 font-semibold text-omblue-500">
              {profileData.BusinessSince || new Date().getFullYear()}
            </h6>
          </div>
          {profileData.BlackOwnershipPercentage && <div className="flex items-center gap-2">
            <div title="Ownership percentage">
              <UserSearch className="text-omblue-500" />
            </div>
            <h6 className="text-h6 2xl:text-scaled-h6 font-semibold text-blue-500">
              Black ownership percentage:
            </h6>
            <h6 className="text-h6 2xl:text-scaled-h6 font-semibold text-omblue-500">
              {profileData.BlackOwnershipPercentage}
            </h6>
          </div>}
          {profileData.PublicCompany === "false" && <div className="flex items-center gap-2">
            <div title="Ethnicity">
              <Nodes className="text-omblue-500" />
            </div>
            <h6 className="text-h6 2xl:text-scaled-h6 font-semibold text-blue-500">
              Ethnicity of Black ownership:
            </h6>
            <h6 className="text-h6 2xl:text-scaled-h6 font-semibold text-omblue-500">
              {profileData?.EthinicityBlackOwnershipName}
            </h6>

          </div>}

          <div className="grid grid-cols-12 gap-4 pt-4">
            <div className="col-span-12 md:col-span-6 space-y-3">
              {profileData.WebsiteUrl && (
                <div className="flex items-center gap-2">
                  <div title="Website">
                    <Earth className={'text-omblue-500 w-6 h-6'} />
                  </div>
                  <a
                    href={profileData.WebsiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-h9 2xl:text-scaled-h9 font-medium text-blue-500 hover:underline"
                  >
                    {profileData.WebsiteUrl}
                  </a>
                </div>
              )}
              {profileData.PhoneNumber && (
                <div className="flex items-center gap-2">
                  <div title="Phone Number">
                    <CellPhone className={'text-omblue-500 w-6 h-6'} />
                  </div>
                  <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-500">
                    {profileData.PhoneNumber}
                  </p>
                </div>
              )}
              {(profileData.EmailIdForQueries || profileData.UserEmailId) && (
                <div className="flex items-center gap-2">
                  <div title="Email">
                    <MailEmail className={'text-omblue-500 w-6 h-6'} />
                  </div>
                  <a
                    href={`mailto:${profileData.EmailIdForQueries || profileData.UserEmailId}`}
                    target="_blank"
                    className="text-h9 2xl:text-scaled-h9 font-medium text-blue-500"
                  >
                    {profileData.EmailIdForQueries || profileData.UserEmailId}
                  </a>
                </div>
              )}

              {profileData.Hours && (
                <div className="flex items-center gap-2">
                  <div title="Hours">
                    <AlarmClock className={'text-omblue-500 w-6 h-6'} />
                  </div>
                  <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-500">
                    {profileData.Hours}
                  </p>
                </div>
              )}
              {profileData.NumberOfEmployess && (
                <div className="flex items-center gap-2">
                  <div title="No of Employees">
                    <UsersBasic className={'text-omblue-500 w-6 h-6'} />
                  </div>
                  <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-500">
                    {profileData.NumberOfEmployess}
                  </p>
                </div>
              )}
              {profileData.BusinessSince && (
                <div className="flex items-center gap-2">
                  <div title="Business Since">
                    <Calendar className={'text-omblue-500 w-6 h-6'} />
                  </div>
                  <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-500">
                    In Business Since{' '}
                    {(profileData.BusinessSince).split("/")[1] + "/" + (profileData.BusinessSince).split("/")[2]}
                  </p>
                </div>
              )}
            </div>
            <div className="col-span-12 md:col-span-6 space-y-3">
              {profileData?.Languages?.length > 0 && (
                <div className="flex items-start gap-2">
                  <div title="Language">
                    <Language className={'text-omblue-500 w-6 h-6'} />
                  </div>
                  <ul className="list-none space-y-3">
                    {profileData?.Languages?.map((language, index) => (
                      <li
                        className="text-h9 2xl:text-scaled-h9 font-medium text-blue-500"
                        key={index}
                      >
                        {language}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {profileData?.UserProfileIndustrySelectionInformation?.length >
                0 && (
                  <div className="flex items-start gap-2">
                    <div title="Industries">
                      <Handyman className={'text-omblue-500 w-6 h-6'} />
                    </div>
                    <ul className="list-none space-y-3">
                      {profileData?.UserProfileIndustrySelectionInformation?.map(
                        (info, index) => (
                          <li
                            className="text-h9 2xl:text-scaled-h9 font-medium text-blue-500"
                            key={index}
                          >
                            {info.IndustryName}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              {profileData.BussinessType && (
                <div className="flex items-start gap-2">
                  <div title="Business Type">
                    <CorporateFare className={'text-omblue-500 w-6 h-6'} />
                  </div>
                  <p className="text-h9 2xl:text-scaled-h9 font-medium text-blue-500">
                    {profileData.BussinessType}
                  </p>
                </div>
              )}
            </div>
            {profileData.Address && (
              <div className="col-span-12 flex items-start gap-3">
                {/* <CircleHalfDotted className="text-omblue-500" /> */}
                <h6 className="text-h6 2xl:text-scaled-h6 font-semibold text-blue-500">
                  Location:
                </h6>
                <h6 className="text-h6 2xl:text-scaled-h6 font-semibold text-blue-500 break-all">
                  {formatAddress()}
                </h6>
                <button
                  // target="_blank"
                  // href={`https://www.google.com/maps?q=${encodeURIComponent(
                  //   profileData.Address
                  // )}`}
                  // rel="noreferrer"
                  onClick={handleSeeOnMapClick}
                  className="text-h6 2xl:text-scaled-h6 font-semibold text-omblue-500 underline whitespace-nowrap"
                >
                  {showMap ? 'Hide' : 'See on map'}
                </button>
              </div>
            )}
          </div>
          {showMap && (
            <>
              <p> {profileData.Address}</p>
              {coordinates?.lat && coordinates?.lng && (
                <Map
                  mapboxAccessToken={
                    'pk.eyJ1Ijoib3Jpc3V1biIsImEiOiJjbTE2eXZsdWYwY2V2MmltejFlbjJzajFpIn0.5a8sMLj2eWcJykZrKji8jg'
                  }
                  initialViewState={{
                    longitude: coordinates?.lng,
                    latitude: coordinates?.lat,
                    zoom: 10,
                  }}
                  style={{ width: '100%', height: '400px' }}
                  mapStyle="mapbox://styles/mapbox/streets-v11"
                >
                  <Marker
                    longitude={coordinates?.lng}
                    latitude={coordinates?.lat}
                  >
                    <div>
                      <svg
                        width="70"
                        height="70"
                        viewBox="0 0 60 60"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M30.4705 17.7245C30.4705 22.4021 21.9999 34.7441 21.9999 34.7441C21.9999 34.7441 13.5293 22.4014 13.5293 17.7245C13.5293 13.0476 17.3215 9.25391 21.9999 9.25391C26.6783 9.25391 30.4705 13.0461 30.4705 17.7245Z"
                          fill="#2357C6"
                        />
                        <path
                          d="M24.8145 20.1647C26.3692 18.61 26.3692 16.0892 24.8145 14.5345C23.2597 12.9797 20.739 12.9797 19.1843 14.5345C17.6295 16.0892 17.6295 18.61 19.1843 20.1647C20.739 21.7195 23.2597 21.7195 24.8145 20.1647Z"
                          fill="white"
                        />
                        <path
                          d="M14.9805 18.4687C14.9805 14.4051 18.2746 11.111 22.3381 11.111C23.4655 11.1101 24.5779 11.3688 25.5893 11.8669C26.6007 12.365 27.4838 13.0893 28.1703 13.9836C27.5256 12.8615 26.5962 11.9294 25.476 11.2814C24.3558 10.6334 23.0844 10.2924 21.7903 10.293C17.7267 10.293 14.4326 13.5871 14.4326 17.6506C14.4314 19.273 14.969 20.8499 15.9609 22.1338C15.3178 21.0194 14.9796 19.7553 14.9805 18.4687Z"
                          fill="#4F79D1"
                        />
                        <path
                          d="M20.0029 31.5043C21.157 33.4381 22.0002 34.7439 22.0002 34.7439C22.0002 34.7439 30.4708 22.4012 30.4708 17.7243C30.4708 17.4788 30.4578 17.2361 30.4374 16.9961C30.0995 18.2957 29.635 19.5592 29.0508 20.7683C27.4468 24.1047 25.0759 26.2428 22.5492 28.9502C21.7367 29.8232 20.8892 30.6863 20.0029 31.5043Z"
                          fill="#4F79D1"
                        />
                      </svg>
                    </div>
                  </Marker>
                </Map>
              )}
            </>
          )}
        </div>
      </div>
      <div className="col-span-12 md:col-span-6 small-767:mb-20">
        <div className="space-y-4">
          <h6 className="text-h6 2xl:text-scaled-h6 font-semibold text-blue-500">
            Gallery
          </h6>
          <div className="flex items-center gap-0 overflow-x-auto hide-scrollbar mb-10">
            {tabs?.map((tab, index) => (
              <div
                key={index}
                className={cn(
                  'min-w-[60px] px-4 py-3 border-b text-h8 2xl:text-scaled-h8 flex items-center gap-2 cursor-pointer',
                  selectedTab === index
                    ? 'border-omblue-600 text-omblue-600 font-semibold'
                    : 'border-transparent text-[#797B82] font-medium'
                )}
                style={{
                  fontVariationSettings:
                    selectedTab === index ? "'wght' 600" : "'wght' 500",
                  textRendering: 'optimizeLegibility',
                }}
                onClick={() => setSelectedTab(index)}
              >
                {tab.icon ?? null}
                <p>{tab.name}</p>
              </div>
            ))}
          </div>
          {filteredItems.length ? (
            <div className="grid grid-cols-12 gap-4">
              {filteredItems?.map((item, index) => (
                <div
                  key={index}
                  className="col-span-12 md:col-span-6"
                  onClick={() => handleItemClick(index)}
                >
                  {item.type === 'image' ? (
                    <Image
                      src={item.url}
                      alt="placeholder image"
                      width={260}
                      height={170}
                      className="w-full h-auto aspect-[2/1] object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full aspect-w-16 aspect-h-9">
                      <iframe
                        src={item.url}
                        allow="fullscreen; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full rounded-md"
                      ></iframe>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-h9 2xl:text-scaled-h9 pt-5 font-medium text-blue-500">
              No{' '}
              {selectedTab === 2
                ? ' videos'
                : selectedTab === 1
                  ? 'images'
                  : 'items'}{' '}
              posted yet
            </p>
          )}

          {lightboxOpen && (
            <div
              className="custom-lightbox-container"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                zIndex: 999,
                margin: 0,
              }}
            >
              <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={filteredItems?.map((item) => ({
                  type: item.type,
                  src: item.url,
                  poster: item.type === 'video' ? item.url : undefined,
                  sources: item.type === 'video' ? [{ src: item.url, type: 'video/mp4' }] : undefined,
                  autoplay: item.type === 'video' ? true : undefined,
                  controls: item.type === 'video' ? true : undefined,
                  muted: item.type === 'video' ? true : undefined,
                }))}
                plugins={[Video]}
                index={lightboxIndex}
                styles={{
                  container: {
                    width: '80vw',
                    height: '80vh',
                    margin: 'auto',
                    zIndex: 1000, // Ensure it stays above the backdrop
                  },
                  button: {
                    padding: 0,
                    margin: '0 10px 10px 10px',
                    background: 'black',
                    borderRadius: '50%',
                  },
                  icon: {
                    opacity: 0.8,
                    boxShadow: 'none',
                  },
                }}
                className="custom-lightbox"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;

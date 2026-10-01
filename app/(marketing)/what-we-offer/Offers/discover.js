'use client';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
import Image from 'next/image';
const Dbserch = staticUrl + "/what we offer/database_search.png";
const Public = staticUrl + "/what we offer/public.png";
const Personlized = staticUrl + "/what we offer/personlized.png";
const Calender_sec = staticUrl + "/what we offer/calender_sec.png";
const leadership_badges = staticUrl + "/what we offer/leadership_badges.png";
import dynamic from 'next/dynamic';
import {
  calendarData,
  leaderboardData,
  publicProfilesData,
  searchData,
  feedData,
} from './popups/constants';
import { useState } from 'react';
import { getShimmerPlaceholder } from '@/utils/shimmerPlaceholder';

// Dynamic import for popup component
const OfferPopup = dynamic(() => import('./popups/OfferPopup'), {
  ssr: false
});

export const Discover = () => {

  const [activePopup, setActivePopup] = useState(null);

  const handleOpenPopup = (popupName) => {
    setActivePopup(popupName);
  };

  const handleClosePopup = () => {
    setActivePopup(null);
  };


  return (
    <>
      <OfferPopup
        isOpen={activePopup === 'calendar'}
        onClose={handleClosePopup}
        data={calendarData}
      />
      <OfferPopup
        isOpen={activePopup === 'leaderboard'}
        onClose={handleClosePopup}
        data={leaderboardData}
      />
      <OfferPopup
        isOpen={activePopup === 'personalizedFeed'}
        onClose={handleClosePopup}
        data={feedData}
      />
      <OfferPopup
        isOpen={activePopup === 'databaseSearch'}
        onClose={handleClosePopup}
        data={searchData}
      />
      <OfferPopup
        isOpen={activePopup === 'publicProfile'}
        onClose={handleClosePopup}
        data={publicProfilesData}
      />

      <div className=" text-white relative z-10">
        {/* Section Header */}
        <h2 className="text-[72px] md:text-[64px] lg:text-[48px] font-black md:mb-14 mb-8 relative inline-block">
          Discover
        </h2>

        {/* Grid Layout */}
        <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
          {/* Card 1 */}

          <div
            className="bg-skyblue rounded-[50px] border border-z-black relative overflow-hidden flex flex-col "
            onClick={() => handleOpenPopup('publicProfile')}
          >
            <div
              className="absolute inset-0 z-10 top-auto bottom-12 h-[332px]"
              style={{
                background:
                  'linear-gradient(0deg, #B9D9EB 40%, rgba(185, 217, 235, 0.00) 100%)',
              }}
            ></div>
            <div className="text-center px-3 mb-[-32px]">
              <Image
                alt="Customizable Public Profile Page"
                className="mx-auto md:px-0 px-4"
                src={Public}
                priority={false}
                placeholder="blur"
                blurDataURL={getShimmerPlaceholder(400, 300)} width={733} height={500}/>
            </div>
            <div className="flex flex-col gap-3 pt-0 md:p-8 md:pr-16 p-6 relative z-10  mt-auto min-h-[210px]">
              <div className="size-[32px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                >
                  <path
                    d="M11.451 15.6296C15.4949 15.6296 18.7732 12.3514 18.7732 8.30748C18.7732 4.26358 15.4949 0.985352 11.451 0.985352C7.40713 0.985352 4.12891 4.26358 4.12891 8.30748C4.12891 12.3514 7.40713 15.6296 11.451 15.6296Z"
                    fill="#001E5F"
                  />
                  <path
                    d="M12.6609 18.4811C12.6609 17.8075 12.1141 17.2607 11.4405 17.2607C7.06512 17.2607 3.0054 19.4411 0.582593 23.094C0.209978 23.6554 0.362929 24.4136 0.924293 24.7863C1.13257 24.9229 1.36525 24.9897 1.59793 24.9897C1.99332 24.9897 2.38058 24.7977 2.61652 24.4446C4.58536 21.475 7.88357 19.7031 11.4405 19.7031C12.1141 19.7031 12.6609 19.1564 12.6609 18.4827V18.4811Z"
                    fill="#001E5F"
                  />
                  <path
                    d="M26.9372 18.1882C26.5613 17.6073 25.9235 17.2607 25.2303 17.2607H16.4357C15.6318 17.2607 14.9029 17.7359 14.5758 18.4681L11.8585 24.5829H7.77114C7.0975 24.5829 6.55078 25.1296 6.55078 25.8032C6.55078 26.4769 7.0975 27.0236 7.77114 27.0236H22.7001C23.504 27.0236 24.2329 26.5485 24.56 25.8162L27.0902 20.1229C27.3733 19.4916 27.3163 18.7675 26.9388 18.1882H26.9372Z"
                    fill="#001E5F"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold leading-[110%] text-blue-strong">
                Customizable Public Profile Page
              </h3>
              <p className="text-lg font-medium leading-[137%] text-blue-strong mt-1 opacity-70">
                Increase your web presence with a beautiful, easy-to-follow
                webpage (personalized web address).
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div
            className="bg-skyblue rounded-[50px] border border-z-black relative overflow-hidden flex flex-col"
            onClick={() => handleOpenPopup('databaseSearch')}
          >
            <div
              className="absolute inset-0 z-10 top-auto bottom-12 h-[332px]"
              style={{
                background:
                  'linear-gradient(0deg, #B9D9EB 40%, rgba(185, 217, 235, 0.00) 100%)',
              }}
            ></div>
            <div className="text-center px-3 mb-[-32px] pt-5">
              <Image
                alt="Database Search & Explore Functionality"
                className="mx-auto md:px-0 px-4"
                src={Dbserch}
                priority={false}
                placeholder="blur"
                blurDataURL={getShimmerPlaceholder(400, 300)} width={733} height={500}/>
            </div>
            <div className="flex flex-col gap-3 pt-0 md:p-8 md:pr-16 p-6 relative z-10  mt-auto min-h-[210px]">
              <div className="size-[32px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M18.9213 18.9203L8.0013 24.0003L13.0813 13.0803L24.0013 8.00033M16.0013 2.66699C14.2503 2.66699 12.5165 3.01187 10.8989 3.68193C9.28118 4.35199 7.81133 5.33412 6.57321 6.57224C4.07273 9.07272 2.66797 12.4641 2.66797 16.0003C2.66797 19.5365 4.07273 22.9279 6.57321 25.4284C7.81133 26.6665 9.28118 27.6487 10.8989 28.3187C12.5165 28.9888 14.2503 29.3337 16.0013 29.3337C19.5375 29.3337 22.9289 27.9289 25.4294 25.4284C27.9299 22.9279 29.3346 19.5365 29.3346 16.0003C29.3346 14.2494 28.9898 12.5156 28.3197 10.8979C27.6496 9.2802 26.6675 7.81035 25.4294 6.57224C24.1913 5.33412 22.7214 4.35199 21.1037 3.68193C19.4861 3.01187 17.7523 2.66699 16.0013 2.66699ZM16.0013 14.5337C15.6123 14.5337 15.2393 14.6882 14.9642 14.9632C14.6892 15.2383 14.5346 15.6113 14.5346 16.0003C14.5346 16.3893 14.6892 16.7624 14.9642 17.0374C15.2393 17.3125 15.6123 17.467 16.0013 17.467C16.3903 17.467 16.7633 17.3125 17.0384 17.0374C17.3134 16.7624 17.468 16.3893 17.468 16.0003C17.468 15.6113 17.3134 15.2383 17.0384 14.9632C16.7633 14.6882 16.3903 14.5337 16.0013 14.5337Z"
                    fill="#001E5F"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold leading-[110%] text-blue-strong">
                Database Search & Explore Functionality
              </h3>
              <p className="text-lg font-medium leading-[137%] text-blue-strong mt-1 opacity-70">
                Explore our databases of businesses, mentors, and investors by
                country, city, or industry.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div
            className="bg-skyblue rounded-[50px] border border-z-black relative overflow-hidden flex flex-col"
            onClick={() => handleOpenPopup('personalizedFeed')}
          >
            <div
              className="absolute inset-0 z-10 top-auto bottom-12 h-[332px]"
              style={{
                background:
                  'linear-gradient(0deg, #B9D9EB 40%, rgba(185, 217, 235, 0.00) 100%)',
              }}
            ></div>
            <div className="text-center px-3 mb-[-32px] pt-5">
              <Image 
              alt="Personalized Feed" 
              className="mx-auto md:px-0 px-4" 
              src={Personlized}
              width={400}
              height={300}
              priority={false}
              sizes="(max-width: 768px) 100vw, 400px"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==" />
            </div>
            <div className="flex flex-col gap-3 pt-0 md:p-8 md:pr-16 p-6 relative md:mt-5 z-10 min-h-[210px]">
              <div className="size-[32px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M20 29V28.985C20.1 28.995 20.2013 29 20.304 29C21.0139 28.9995 21.7013 28.7505 22.2469 28.2962C22.7925 27.842 23.1619 27.2111 23.291 26.513L23.938 23H26.75C27.612 23 28.4386 22.6576 29.0481 22.0481C29.6576 21.4386 30 20.612 30 19.75V10.91C30.0002 10.5202 29.922 10.1343 29.7702 9.7752C29.6184 9.41615 29.3959 9.09126 29.1161 8.81983C28.8363 8.54841 28.5048 8.33597 28.1413 8.19513C27.7778 8.0543 27.3897 7.98794 27 8H19.267V6.25C19.267 5.38805 18.9246 4.5614 18.3151 3.9519C17.7056 3.34241 16.879 3 16.017 3H5.25C4.38805 3 3.5614 3.34241 2.9519 3.9519C2.34241 4.5614 2 5.38805 2 6.25V24.5C2 25.6935 2.47411 26.8381 3.31802 27.682C4.16193 28.5259 5.30653 29 6.5 29H20ZM19.267 10H24.326C24.286 10.124 24.2533 10.2517 24.228 10.383L21.325 26.15C21.2783 26.4046 21.1381 26.6326 20.9319 26.7891C20.7257 26.9456 20.4684 27.0193 20.2106 26.9957C19.9528 26.9721 19.7132 26.853 19.5387 26.6617C19.3643 26.4705 19.2677 26.2209 19.268 25.962L19.267 10ZM7 10C6.73478 10 6.48043 9.89464 6.29289 9.70711C6.10536 9.51957 6 9.26522 6 9C6 8.73478 6.10536 8.48043 6.29289 8.29289C6.48043 8.10536 6.73478 8 7 8C7.26522 8 7.51957 8.10536 7.70711 8.29289C7.89464 8.48043 8 8.73478 8 9C8 9.26522 7.89464 9.51957 7.70711 9.70711C7.51957 9.89464 7.26522 10 7 10ZM6 16C6 15.7348 6.10536 15.4804 6.29289 15.2929C6.48043 15.1054 6.73478 15 7 15H14C14.2652 15 14.5196 15.1054 14.7071 15.2929C14.8946 15.4804 15 15.7348 15 16C15 16.2652 14.8946 16.5196 14.7071 16.7071C14.5196 16.8946 14.2652 17 14 17H7C6.73478 17 6.48043 16.8946 6.29289 16.7071C6.10536 16.5196 6 16.2652 6 16ZM7 21H14C14.2652 21 14.5196 21.1054 14.7071 21.2929C14.8946 21.4804 15 21.7348 15 22C15 22.2652 14.8946 22.5196 14.7071 22.7071C14.5196 22.8946 14.2652 23 14 23H7C6.73478 23 6.48043 22.8946 6.29289 22.7071C6.10536 22.5196 6 22.2652 6 22C6 21.7348 6.10536 21.4804 6.29289 21.2929C6.48043 21.1054 6.73478 21 7 21Z"
                    fill="#001E5F"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold leading-[110%] text-blue-strong">
                Personalized Feed
              </h3>
              <p className="text-lg font-medium leading-[137%] text-blue-strong mt-1 opacity-70">
                Keep track of all platform activity and Black business events
                around the world.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div
            onClick={() => handleOpenPopup('leaderboard')}
            className="xl:col-start-1 xl:col-span-2 bg-skyblue rounded-[50px] border border-z-black relative overflow-hidden flex xl:flex-row flex-col-reverse justify-between"
          >
            <div
              className="absolute inset-0 z-10 top-auto bottom-12 md:h-full h-[250px] bg-gradient-to-t from-[#B9D9EB] from-40% to-transparent xl:bg-gradient-to-r"
              // style={{
              //   background:
              //     'linear-gradient(90deg, #B9D9EB 40%, rgba(185, 217, 235, 0.00) 100%)',
              // }}
            ></div>
            <div className="flex flex-col gap-3 pt-0 xl:p-8 xl:pr-16 p-6 relative z-10 xl:w-[400px] w-full mt-auto min-h-[210px]">
              <div className="size-[32px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M9.96797 28.0003C7.94575 28.0003 6.22352 27.2892 4.8013 25.867C3.37908 24.4448 2.66797 22.7225 2.66797 20.7003C2.66797 18.7892 3.30708 17.139 4.5853 15.7497C5.86352 14.3603 7.45775 13.5883 9.36797 13.4337L4.0013 2.66699H13.3346L16.0013 8.00033L18.668 2.66699H28.0013L22.668 13.367C24.5569 13.5448 26.1404 14.3283 27.4186 15.7177C28.6969 17.107 29.3355 18.7568 29.3346 20.667C29.3346 22.7114 28.6235 24.4448 27.2013 25.867C25.7791 27.2892 24.0457 28.0003 22.0013 28.0003C21.8013 28.0003 21.596 27.995 21.3853 27.9843C21.1746 27.9737 20.9689 27.9457 20.768 27.9003C21.9902 27.1003 22.9457 26.0617 23.6346 24.7843C24.3235 23.507 24.668 22.1345 24.668 20.667C24.668 18.2448 23.8289 16.195 22.1506 14.5177C20.4724 12.8403 18.4226 12.0012 16.0013 12.0003C13.58 11.9994 11.5302 12.8385 9.85197 14.5177C8.17375 16.1968 7.33464 18.2465 7.33464 20.667C7.33464 22.1781 7.64575 23.6003 8.26797 24.9337C8.89019 26.267 9.86797 27.2559 11.2013 27.9003C11.0013 27.9448 10.796 27.9728 10.5853 27.9843C10.3746 27.9959 10.1689 28.0012 9.96797 28.0003ZM16.0013 26.667C14.3346 26.667 12.9182 26.0839 11.752 24.9177C10.5857 23.7514 10.0022 22.3345 10.0013 20.667C10.0004 18.9994 10.584 17.583 11.752 16.4177C12.92 15.2523 14.3364 14.6688 16.0013 14.667C17.6662 14.6652 19.0831 15.2488 20.252 16.4177C21.4209 17.5865 22.004 19.003 22.0013 20.667C21.9986 22.331 21.4155 23.7479 20.252 24.9177C19.0884 26.0874 17.6715 26.6705 16.0013 26.667ZM13.5346 24.3337L16.0013 22.467L18.468 24.3337L17.5346 21.3003L20.0013 19.5337H16.968L16.0013 16.3337L15.0346 19.5337H12.0013L14.468 21.3003L13.5346 24.3337Z"
                    fill="#001E5F"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold leading-[110%] text-blue-strong">
                Leaderboard and Badges
              </h3>
              <p className="text-lg font-medium leading-[137%] text-blue-strong mt-1 opacity-70">
                Compete with all of Orisuun’s members for the number one spot in
                reviews, ratings, and investments.
              </p>
            </div>
            <div className="text-center xl:pr-14 p-6 flex items-center">
              <Image
                alt="Leaderboard and Badges"
                src={leadership_badges}
                className="mx-auto md:px-0 px-4"
                priority={false}
                placeholder="blur"
                blurDataURL={getShimmerPlaceholder(400, 300)} width={733} height={500}/>
            </div>
          </div>

          {/* Card 5 */}
          <div
            onClick={() => handleOpenPopup('calendar')}
            className="bg-skyblue rounded-[50px] border border-z-black relative overflow-hidden flex flex-col"
          >
            <div
              className="absolute inset-0 z-10 top-auto bottom-12 h-[332px]"
              style={{
                background:
                  'linear-gradient(0deg, #B9D9EB 40%, rgba(185, 217, 235, 0.00) 100%)',
              }}
            ></div>
            <div className="text-center px-3 mb-[-32px] pt-6">
              <Image
                alt="Global Black Business Calendar"
                src={Calender_sec}
                className="mx-auto md:px-0 px-4"
                priority={false}
                placeholder="blur"
                blurDataURL={getShimmerPlaceholder(400, 300)} width={733} height={500}/>
            </div>
            <div className="flex flex-col gap-3 pt-0 md:p-8 md:pr-16 p-6 relative z-10 min-h-[210px]">
              <div className="size-[32px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M6.66667 29.3337C5.93333 29.3337 5.30578 29.0728 4.784 28.551C4.26222 28.0292 4.00089 27.4012 4 26.667V8.00033C4 7.26699 4.26133 6.63944 4.784 6.11766C5.30667 5.59588 5.93422 5.33455 6.66667 5.33366H8V2.66699H10.6667V5.33366H21.3333V2.66699H24V5.33366H25.3333C26.0667 5.33366 26.6947 5.59499 27.2173 6.11766C27.74 6.64033 28.0009 7.26788 28 8.00033V14.667H25.3333V13.3337H6.66667V26.667H16V29.3337H6.66667ZM18.6667 29.3337V25.2337L26.0333 17.9003C26.2333 17.7003 26.4556 17.5559 26.7 17.467C26.9444 17.3781 27.1889 17.3337 27.4333 17.3337C27.7 17.3337 27.9556 17.3839 28.2 17.4843C28.4444 17.5848 28.6667 17.7345 28.8667 17.9337L30.1 19.167C30.2778 19.367 30.4169 19.5892 30.5173 19.8337C30.6178 20.0781 30.6676 20.3225 30.6667 20.567C30.6658 20.8114 30.6213 21.0617 30.5333 21.3177C30.4453 21.5737 30.3009 21.8012 30.1 22.0003L22.7667 29.3337H18.6667ZM27.4333 21.867L28.6667 20.567L27.4333 19.3337L26.1667 20.6003L27.4333 21.867Z"
                    fill="#001E5F"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold leading-[110%] text-blue-strong">
                Global Black Business Calendar
              </h3>
              <p className="text-lg font-medium leading-[137%] text-blue-strong mt-1 opacity-70">
                Stay up-to-date on all of the Black business events,
                conferences, meetups, webinars, and grand openings in your
                neighborhood and around the world
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

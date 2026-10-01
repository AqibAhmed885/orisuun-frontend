'use client';
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
import Image from 'next/image';
const chat = staticUrl + "/what we offer/chat.svg";
const feedback_review = staticUrl + "/what we offer/feedback_review.svg";
const profileteam = staticUrl + "/what we offer/Profile-Team.svg";
const chatone = staticUrl + "/what we offer/chatone.svg";
import Chat from './popups/chat';
import FormTeams from './popups/FormTeams';
import Feedbackreviews from './popups/feedback-reviews';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  privateChatData,
  teamFormingData,
  feedbackReviewData,
} from './popups/constants';
import { getShimmerPlaceholder } from '@/utils/shimmerPlaceholder';

// Dynamic import for popup component
const OfferPopup = dynamic(() => import('./popups/OfferPopup'), {
  ssr: false
});

export const Collab = () => {
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
        isOpen={activePopup === 'Chat'}
        onClose={handleClosePopup}
        data={privateChatData}
      />
      <OfferPopup
        isOpen={activePopup === 'formteams'}
        onClose={handleClosePopup}
        data={teamFormingData}
      />
      <OfferPopup
        isOpen={activePopup === 'feedbackreviews'}
        onClose={handleClosePopup}
        data={feedbackReviewData}
      />

      <div className=" text-white relative z-10">
        {/* Section Header */}
        <h2 className="text-[72px] md:text-[64px] lg:text-[48px] font-black md:mb-14 mb-8 relative inline-block">
          Collab
        </h2>

        {/* Grid Layout */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
          {/* Card 1 */}
          <div
            onClick={() => handleOpenPopup('Chat')}
            className="bg-skyblue rounded-[60px] border border-z-black relative overflow-hidden flex flex-col"
          >
            <div
              className="absolute inset-0 z-10 top-auto bottom-12 md:h-[210px]  h-[250px]"
              style={{
                background:
                  'linear-gradient(0deg, #B9D9EB 40%, rgba(185, 217, 235, 0.00) 100%)',
              }}
            ></div>
            <div className="text-center px-3 md:mb-[-32px] md:pt-20 py-10 relative">
              <Image 
                alt="Chat Platform" 
                className="mx-auto" 
                src={chatone}
                priority={false}
                placeholder="blur"
                blurDataURL={getShimmerPlaceholder(400, 300)} width={733} height={500}/>
              <Image
                alt="Profile Team"
                src={profileteam}
                className="mx-auto absolute bottom-[-20px] right-[25%] z-10"
                priority={false}
                placeholder="blur"
                blurDataURL={getShimmerPlaceholder(400, 300)} width={733} height={500}/>
            </div>
            <div className="flex flex-col gap-3 pt-0 md:p-10 p-6 md:pr-[46%]  relative z-10 mt-auto">
              <div className="size-[26px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M10.8773 24.8137C11.0235 24.8407 11.1744 24.8512 11.4762 24.8722C12.1031 24.9487 12.7004 24.5212 12.7859 23.9046C12.8715 23.288 12.4219 22.7224 11.7826 22.6414C11.6784 22.6279 11.5711 22.6204 11.4653 22.6144C11.4109 22.6114 11.358 22.6114 11.3082 22.6024C10.3671 22.4299 9.46025 22.1044 8.61872 21.6348C8.23917 21.4233 7.76785 21.4368 7.40075 21.6663C6.97609 21.9333 6.21389 22.2424 5.38636 22.4629C5.90434 21.1322 6.04589 19.6305 5.4828 18.6104C4.73148 17.3562 4.33483 15.9325 4.33483 14.4969C4.33327 9.94827 8.17073 6.24879 12.8855 6.24879C15.8923 6.24879 18.6238 7.73849 20.1933 10.2333C20.5277 10.7629 21.2433 10.9324 21.7955 10.6114C22.3461 10.2888 22.5235 9.59723 22.189 9.06616C20.1917 5.89325 16.7136 4 12.8855 4C6.88432 3.9985 2 8.70761 2 14.4969C2 16.3286 2.50554 18.1393 3.44196 19.7025C3.70173 20.1736 3.34085 22.1104 2.34221 23.075C2.01711 23.3885 1.91289 23.8581 2.07778 24.2721C2.2411 24.6862 2.64398 24.9697 3.10286 24.9937C3.21641 24.9997 3.32997 25.0027 3.44818 25.0027C4.99126 25.0027 6.81121 24.4972 8.0494 23.8956C8.94693 24.3276 9.89579 24.6367 10.8773 24.8152V24.8137Z"
                    fill="#001E5F"
                  />
                  <path
                    d="M28.9024 24.0515C29.6195 22.8558 29.999 21.4952 29.999 20.1195C29.999 15.7764 26.3358 12.2435 21.8326 12.2435C17.3293 12.2435 13.6645 15.7764 13.6645 20.1195C13.6645 24.4625 17.3278 27.9955 21.8326 27.9955C22.3381 27.9955 22.8452 27.9505 23.3414 27.859C24.0227 27.7345 24.6854 27.5259 25.3169 27.2379C26.2455 27.6595 27.5335 28 28.6379 28C28.7266 28 28.8121 27.9985 28.8961 27.994C29.3566 27.97 29.7595 27.6865 29.9228 27.2724C30.0877 26.8583 29.9834 26.3888 29.6583 26.0752C29.0735 25.5112 28.8059 24.323 28.9024 24.0515Z"
                    fill="#001E5F"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold leading-[110%] text-blue-strong">
                Chat
              </h3>
              <p className="text-lg font-medium leading-[137%] text-blue-strong mt-1 opacity-70 min-h-[70px]">
                Take care of business right on the platform with our private
                chat. Chat one-on-one or in groups
              </p>
            </div>
          </div>
          <div
            onClick={() => handleOpenPopup('formteams')}
            className="bg-skyblue rounded-[60px] border border-z-black relative overflow-hidden flex flex-col"
          >
            <div
              className="absolute inset-0 z-10 top-auto bottom-12 md:h-[210px]  h-[250px]"
              style={{
                background:
                  'linear-gradient(0deg, #B9D9EB 40%, rgba(185, 217, 235, 0.00) 100%)',
              }}
            ></div>
            <div className="text-center px-3 md:mb-[-32px] pt-20 small-767:py-10  relative">
              <Image 
                alt="Form Teams" 
                className="mx-auto" 
                src={chat}
                priority={false}
                placeholder="blur"
                blurDataURL={getShimmerPlaceholder(400, 300)} width={733} height={500}/>
            </div>
            <div className="flex flex-col gap-3 pt-0 md:p-8 p-6 md:pr-[34%] relative z-10 w-auto mt-auto">
              <div className="size-[26px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M10.3763 15.9873C13.003 15.9873 15.1323 13.8579 15.1323 11.2313C15.1323 8.60462 13.003 6.47529 10.3763 6.47529C7.74964 6.47529 5.62031 8.60462 5.62031 11.2313C5.62031 13.8579 7.74964 15.9873 10.3763 15.9873Z"
                    fill="#16357A"
                  />
                  <path
                    d="M21.1837 11.6643C23.8103 11.6643 25.9397 9.53499 25.9397 6.90833C25.9397 4.28167 23.8103 2.15234 21.1837 2.15234C18.557 2.15234 16.4277 4.28167 16.4277 6.90833C16.4277 9.53499 18.557 11.6643 21.1837 11.6643Z"
                    fill="#16357A"
                  />
                  <path
                    d="M30.1699 19.617C28.7673 15.8952 25.1562 13.3944 21.1837 13.3944C18.7331 13.3944 16.4242 14.3508 14.6827 15.954C17.8891 17.1802 20.5369 19.7052 21.789 23.0257C21.9827 23.5377 22.0692 24.0686 22.1038 24.5995C24.1981 24.5131 26.27 24.1499 28.2692 23.4823C29.0579 23.2194 29.7116 22.6401 30.0696 21.8929C30.4155 21.1666 30.4518 20.3572 30.1716 19.617H30.1699Z"
                    fill="#16357A"
                  />
                  <path
                    d="M19.3622 23.9399C17.9596 20.2182 14.3485 17.7174 10.376 17.7174C6.40342 17.7174 2.79233 20.2182 1.38974 23.9399C1.10957 24.6819 1.14589 25.4895 1.49178 26.2159C1.84805 26.963 2.50351 27.5424 3.29214 27.8053C5.58366 28.5697 7.96857 28.9588 10.376 28.9588C12.7834 28.9588 15.1683 28.5697 17.4598 27.8053C18.2484 27.5424 18.9021 26.963 19.2601 26.2159C19.606 25.4895 19.6423 24.6801 19.3622 23.9399Z"
                    fill="#16357A"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold leading-[110%] text-blue-strong">
                Form Teams
              </h3>
              <p className="text-lg font-medium leading-[137%] text-blue-strong mt-1 opacity-70 min-h-[70px]">
                Members can form teams to conduct business as a unit. Teams can
                create their own profile page
              </p>
            </div>
          </div>

          <div
            onClick={() => handleOpenPopup('feedbackreviews')}
            className="md:col-start-1 md:col-span-2 bg-skyblue rounded-[60px] border border-z-black relative overflow-hidden flex md:flex-row flex-col-reverse justify-between"
          >
            <div
              className="absolute inset-0 z-10 top-auto bottom-12 md:h-full  h-[250px] 
             bg-gradient-to-t from-[#B9D9EB] from-20% to-transparent 
             md:bg-gradient-to-r"
              // style={{
              //   background:
              //     'linear-gradient(90deg, #B9D9EB 40%, rgba(185, 217, 235, 0.00) 100%)',
              // }}
            ></div>
            <div className="flex flex-col gap-3 pt-0 md:p-8  p-6  pr-16 relative z-10 md:w-[430px] w-full mt-auto">
              <div className="size-[26px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M5.64468 26.0737L1.48408 30.2343C1.25916 30.4592 0.999847 30.5157 0.706158 30.4038C0.41247 30.292 0.265625 30.0764 0.265625 29.757V4.42636C0.265625 3.62105 0.535423 2.94918 1.07502 2.41075C1.61461 1.87232 2.2859 1.60194 3.08888 1.59961H28.909C29.7132 1.59961 30.3845 1.86941 30.9229 2.409C31.4613 2.9486 31.7311 3.62047 31.7323 4.42462V23.2504C31.7323 24.0546 31.4625 24.7264 30.9229 25.266C30.3833 25.8056 29.712 26.0748 28.909 26.0737H5.64468ZM15.999 17.6249L18.9184 19.401C19.1701 19.5595 19.423 19.5467 19.6771 19.3625C19.93 19.1772 20.0244 18.929 19.9603 18.6178L19.1858 15.3191L21.7556 13.1112C22.0004 12.8932 22.0761 12.6415 21.9829 12.356C21.8896 12.0704 21.6834 11.9131 21.364 11.884L17.9796 11.578L16.651 8.46459C16.5275 8.18139 16.3101 8.03979 15.999 8.03979C15.6878 8.03979 15.4704 8.18139 15.3469 8.46459L14.0183 11.5763L10.6339 11.884C10.3157 11.9131 10.1094 12.0704 10.015 12.356C9.92065 12.6415 9.9964 12.8932 10.2423 13.1112L12.8121 15.3191L12.0394 18.6161C11.9741 18.9284 12.068 19.1772 12.3209 19.3625C12.5738 19.5478 12.8272 19.5607 13.0813 19.401L15.999 17.6249Z"
                    fill="#16357A"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold leading-[110%] text-blue-strong">
                Feedback and Reviews
              </h3>
              <p className="text-lg font-medium leading-[137%] text-blue-strong mt-1 opacity-70 min-h-[70px]">
                Give and receive public or private reviews from members you have
                interacted with
              </p>
            </div>

            <div className="text-center md:px-11 md:pt-16 p-10 md:pb-14 pr-0 relative">
              <Image
                alt="Feedback and Reviews"
                className="mx-auto size-auto small-767:object-cover small-767:h-[160px] small-767:object-left"
                src={feedback_review}
                priority={false}
                placeholder="blur"
                blurDataURL={getShimmerPlaceholder(400, 300)} width={733} height={500}/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

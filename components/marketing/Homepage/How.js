// 'use client';
// import { useState } from 'react';
// import WistiaEmbed from './WitsiaEmbed';
// import Link from 'next/link';
// import { Button } from '..';

// const How = () => {
//   const videoList = [
//     { id: 'j7eh2674jx', title: 'Video 1' },
//     { id: 'abc123xyz', title: 'Video 2' },
//     { id: 'def456uvw', title: 'Video 3' },
//     { id: 'ghi789rst', title: 'Video 4' },
//   ];

//   const [activeVideo, setActiveVideo] = useState(videoList[0].id);
//   const otherVideos = videoList.filter((video) => video.id !== activeVideo);

//   return (
//     <section className="px-4 lg:px-[80px] mx-auto mt-[120px] md:mt-[131px] text-center pb-0 md:pb-[26px]">
//       <div className="w-[95%] mx-auto">
//         <h2 className="block text-blue-strong text-[28px] md:text-[48px] font-semibold leading-[110%] mx-auto mb-2">
//           A new way to connect with the Black business community
//         </h2>

//         <p className="text-base text-center font-medium text-[#5B657B] mx-auto mb-[60px] md:mb-5 leading-[30px]">
//           On a platform designed for real connection and shared success, we make it easy to build relationships that move you forward.
//         </p>
//         <Link href="/signup">
//           <Button className="text-base font-bold leading-[150%] text-white py-2.5 px-5 mb-5 md:mb-0">
//             Join the community
//           </Button>
//         </Link>

//         {/* --- Mobile Layout --- */}
//         <div className="md:hidden w-full border h-auto border-gray-300 rounded-lg">
//           <WistiaEmbed videoId={activeVideo} autoPlay />
//         </div>
//         <div className="md:hidden flex mt-5 gap-2 flex-col sm:flex-row">
//           {otherVideos.map((video) => (
//             <div
//               key={video.id}
//               className="w-full border border-gray-300 rounded-lg cursor-pointer"
//               onClick={() => setActiveVideo(video.id)}
//             >
//               <WistiaEmbed videoId={video.id} autoPlay={false} />
//             </div>
//           ))}
//         </div>

//         {/* --- Desktop Layout --- */}
//         <div className="hidden md:flex gap-2 mt-10">
//           <div className="w-[70%] border border-gray-300 rounded-lg">
//             <WistiaEmbed videoId={activeVideo} autoPlay />
//           </div>
//           <div className="w-[30%] flex flex-col gap-2">
//             {otherVideos.map((video) => (
//               <div
//                 key={video.id}
//                 className="w-full border border-gray-300 rounded-lg cursor-pointer"
//                 onClick={() => setActiveVideo(video.id)}
//               >
//                 <WistiaEmbed videoId={video.id} autoPlay={false} />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default How;

import Link from 'next/link';
import WistiaEmbed from './WitsiaEmbed';
import { Button } from '../Button';

const How = () => {
  return (
    <section className="px-4 lg:px-[80px] mx-auto mt-[120px] md:mt-[131px] text-center pb-0 md:pb-[86px]">
      <div className="mx-auto max-w-[1126px] 2xl:max-w-[1024px] 2k:max-w-[1100px]">

        <h2 className="block text-[#001E5F] text-[26px] md:text-[48px] font-[450px] leading-[110%] max-w-[1250px] mx-auto mb-4 ">
          A new way to connect with the Black business community
        </h2>

        {/* <h2 className="md:hidden text-blue-strong text-[24px] leading-[28.8px] font-semibold md:max-w-[598px] mx-auto mb-4">
          How we can help you
        </h2> */}


        <p className="text-[#5B657B] text-[18px] text-center font-[500px] max-w-[734px] mx-auto mb-[10px] md:mb-2 leading-[30px]">
          On a platform designed for real connection and shared success, we make it easy to build relationships that move you forward.
        </p>
        <Link href="/signup">
          <Button className="text-base font-bold leading-[150%] text-white py-2 lg:py-2.5 px-2 lg:px-5 mb-10">
            Join the community
          </Button>
        </Link>
        <div className="w-full h-auto border border-gray-300 rounded-lg">
          <WistiaEmbed />
        </div>
      </div>
    </section>
  );
};

export default How;

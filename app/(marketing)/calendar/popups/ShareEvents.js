import { useEffect, useState } from 'react';
import {
  BlueSkyIcon,
  InstagramIcon,
  EmailIcon,
  LinkedIcon,
  CloseIcon,
} from '../../../../public/icons/calendar/Icons.tsx'; // Ensure correct path
import { Slide } from 'react-toastify';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';

const ToastContainer = dynamic(
  () => import('react-toastify').then(mod => mod.ToastContainer),
  { ssr: false }
);

const ShareEvents = ({ isOpen, onClose, eventData }) => {
  if (!isOpen || !eventData) return null;

  const [message, setMessage] = useState('')
  const eventIsArray = Array.isArray(eventData)

  // Message to Share
  useEffect(() => {
    if (!eventIsArray) {
      setMessage(encodeURIComponent(`Hey, Checkout this event!
        ${eventData.title} 🎉
        📅 Date: ${eventData.EventDate.split("T")[0]}
        🕒 Event Time: ${eventData.EventStartTime} - ${eventData.EventEndTime}
        🔗 Link: ${eventData.link}`))
    }
    else {
      setMessage(
        'Hey, check out these events!\n\n' +
        eventData
          .map((item, i) =>
            `${i + 1}. ${item.title} 🎉\n` +
            `📅 Date: ${item.EventDate.split("T")[0]}\n` +
            `🕒 Time: ${item.EventStartTime} - ${item.EventEndTime}\n` +
            `🔗 Link: ${item.link}\n`
          )
          .join('\n')
      );
    }
  }, [])


  // Social Media Share URLs
  const shareUrls = {
    email: `mailto:?subject=Check%20out%20this%20event!&body=${message}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${eventData?.link}`,
    linkedinFull: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent('https://orisuun.com/calendar')}`,
    instagram: `https://www.instagram.com`,
    blueSky: `https://bsky.app/`,
  };

  // Function to open share link
  const handleShare = (platform) => {
    navigator.clipboard.writeText(decodeURIComponent(message));
    toast.success("Event details are copied to clipboard!")
    setTimeout(() => {
      window.open(shareUrls[platform], "_blank");
    }, 1000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.57)] z-50">
      <ToastContainer
        transition={Slide}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        containerId="containerA"
        position="top-center"
        toastStyle={{ marginTop: '15vh' }}
      />
      <div className="bg-white md:p-12 p-5 rounded-[20px] shadow-price5 w-[90%] md:w-[559px]">
        <div className="flex gap-2 justify-between items-start">
          <div className="flex flex-col gap-1 justify-between items-start">
            <h2 className="text-2xl font-semibold text-blue-strong">
              Share Event{eventIsArray && "s"}
            </h2>
            <p className="text-blu-ray-300 text-base font-medium">
              Click below to share event{eventIsArray && "s"} with your network
            </p>
          </div>
          {/* Close Button */}
          <button onClick={onClose} className=" ">
            <CloseIcon size={30} />
          </button>
        </div>

        {/* Social Share Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 md:gap-2 gap-3 mt-7">
          <button onClick={() => handleShare("email")} className="md:size-[111px] size-full flex flex-col gap-3 items-center p-4 border border-[#EEEFF2] justify-center rounded-lg text-blue-strong font-semibold">
            <EmailIcon size={30} />
            Email
          </button>
          <button onClick={() => { handleShare(eventIsArray ? "linkedinFull" : "linkedin") }} className="md:size-[111px] size-full flex flex-col gap-3 items-center p-4 border border-[#EEEFF2] justify-center rounded-lg text-blue-strong font-semibold">
            <LinkedIcon size={30} />
            Linkedin
          </button>
          <button onClick={() => handleShare("instagram")} className="md:size-[111px] size-full flex flex-col gap-3 items-center p-4 border border-[#EEEFF2] justify-center rounded-lg text-blue-strong font-semibold">
            <InstagramIcon size={30} />
            Instagram
          </button>
          <button onClick={() => handleShare("blueSky")} className="md:size-[111px] size-full flex flex-col gap-3 items-center p-4 border border-[#EEEFF2] justify-center rounded-lg text-blue-strong font-semibold">
            <BlueSkyIcon size={30} />
            BlueSky
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareEvents;
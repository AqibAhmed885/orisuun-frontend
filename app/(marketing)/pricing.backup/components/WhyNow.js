'use client';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Image from 'next/image';
// import closebutton from '../../../../public/icons/closebutton.svg';
import { toast } from 'react-toastify';
import { Slide } from 'react-toastify';
import { getSpotsLeftCount, sendFreeAccountMessage } from '../../../api/marketing/pricing';
// import ShoutUsImg from '../../../../public/home/images/webp/ShoutUsOut.webp'
// import sendMessSvg from '../../../../public/home/images/sendMessSvg.webp'

const ToastContainer = dynamic(
  () => import('react-toastify').then(mod => mod.ToastContainer),
  { ssr: false }
);

export const WhyNow = () => {
  const [counter, setCounter] = useState(17);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accountType, setAccountType] = useState('');
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const fetchSpotsLeftCount = async () => {
    const result = await getSpotsLeftCount();
    return result;
  };

  useEffect(() => {
    const getInitialCount = async () => {
      const initialCount = await fetchSpotsLeftCount();
      setCounter(initialCount);
    };
    getInitialCount();
  }, []);


  const handleSendMessage = async () => {
    if (!accountType || !message || !attachment) {
      toast.error('Please fill in all fields and attach a PDF or image before sending the message!');
      return;
    }

    setIsSending(true);

    const formData = new FormData();
    formData.append('accountType', accountType);
    formData.append('additionalInfo', message);
    formData.append('file', attachment);

    try {
      const result = await sendFreeAccountMessage(formData);
      await fetchSpotsLeftCount();

      toast.success(typeof result === 'string' ? result : 'Message sent successfully!');
      setIsModalOpen(false);
      setAccountType('');
      setMessage('');
      setAttachment(null);

      const updatedCount = await fetchSpotsLeftCount();
      setCounter(updatedCount <= 0 ? 17 : updatedCount); // <-- Reset to 17 if 0 or less
    } catch (error) {
      toast.error(error.message || 'An error occurred while sending the message');
      console.error('Error:', error);
    } finally {
      setIsSending(false);
    }
  };
  return (
    <>
      <ToastContainer
        transition={Slide}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <section id='get-a-free-account' className="stop pt-8 md:pt-[100px] p-4 lg:px-16">
        <h3 className="hidden lg:block text-center font-[450px] text-blue-strong md:text-[64px] small-500:text-h2 leading-[110%] ">
          Get a <span className='font-semibold'>free account</span> for one year in
          <br />
          just 3 easy steps

        </h3>

        <h3 className="lg:hidden text-center font-[450px] text-blue-strong text-[40px] lg:text-[64px] leading-[110%] ">
          Get a free account for one year in
          just 3 easy steps

        </h3>

        <p className='text-[#5B657B] text-[18px] text-center pt-8 lg:pt-5'>No credit card. No catch. Just create your profile and start connecting and building today. Oh, and <br /> we’ll verify your profile for free, too</p>
        <p className="md:text-xl text-base leading-[110%] text-[#2357C6] text-center font-semibold md:mt-4 mt-5">
          {counter} of 3000 spots left
        </p>
        <div className="flex w-full flex-wrap gap-10 pt-[50px] small-500:pt-10 pb-8 lg:pb-16">
          <div className="w-full lg:w-[48%] border border-[#D8D9D9] bg-[#F8F8F8] rounded-3xl px-[28px] small-500:px-4 small-500:py-5">
            <div className="relative size-[32px] small-500:size-[24px] mt-2 lg:my-10">
              <svg width="65" height="62" viewBox="0 0 56 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_2253_213010)">
                  <path d="M42.4354 20.3024C43.1991 21.6251 44.9061 22.0826 46.2288 21.3189L51.0388 18.5419C52.3615 17.7782 52.8189 16.0711 52.0552 14.7484C51.2915 13.4257 49.5845 12.9683 48.2618 13.7319L43.4518 16.509C42.1291 17.2726 41.6717 18.9797 42.4354 20.3024Z" fill="url(#paint0_linear_2253_213010)" />
                  <path d="M43.9909 33.8473C43.8082 35.3637 44.8717 36.7058 46.3742 36.8644C48.1903 37.0665 50.1202 37.299 51.9503 37.5251C53.4667 37.7078 54.8328 36.6304 54.9914 35.1279C54.9775 35.1039 55.0016 35.09 54.9877 35.066C55.1704 33.5496 54.0931 32.1835 52.5906 32.0248C50.7605 31.7987 48.8306 31.5662 47.0385 31.3503C45.5221 31.1676 44.1699 32.269 43.9872 33.7854C44.0011 33.8094 43.9909 33.8473 43.9909 33.8473Z" fill="url(#paint1_linear_2253_213010)" />
                  <path d="M36.8038 0.494914C36.79 0.470865 36.7659 0.48475 36.752 0.460701C35.3474 -0.139276 33.7314 0.50515 33.1555 1.89584C32.4363 3.59374 31.6486 5.39527 30.9534 7.07927C30.3534 8.48385 31.0219 10.086 32.4126 10.6619C32.4265 10.686 32.4506 10.6721 32.4644 10.6961C33.869 11.2961 35.461 10.6656 36.061 9.261C36.7941 7.58716 37.5438 5.77547 38.263 4.07757C38.8529 2.71093 38.1844 1.10878 36.8038 0.494914Z" fill="url(#paint2_linear_2253_213010)" />
                  <path d="M14.2203 26.9669L4.60043 32.5209C1.95498 34.0482 1.04017 37.4624 2.56752 40.1078L5.34453 44.9177C6.87189 47.5632 10.286 48.478 12.9315 46.9506L15.3364 45.5621L19.5019 52.777C20.2656 54.0997 21.9727 54.5572 23.2954 53.7935C24.6181 53.0298 25.0755 51.3227 24.3119 50L20.1463 42.7851L22.5513 41.3966L38.7416 41.669L22.0796 12.8095L14.2203 26.9669Z" fill="url(#paint3_linear_2253_213010)" />
                  <path d="M36.4269 23.7688C34.5802 20.5702 31.5191 18.4896 28.168 17.7949L37.4571 33.8841C38.5449 30.6587 38.2736 26.9674 36.4269 23.7688Z" fill="url(#paint4_linear_2253_213010)" />
                </g>
                <defs>
                  <linearGradient id="paint0_linear_2253_213010" x1="40.8988" y1="17.9186" x2="46.5413" y2="23.8019" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2357C6" />
                    <stop offset="1" stop-color="#5EA8FF" />
                  </linearGradient>
                  <linearGradient id="paint1_linear_2253_213010" x1="42.7688" y1="33.0859" x2="52.6869" y2="40.4045" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2357C6" />
                    <stop offset="1" stop-color="#5EA8FF" />
                  </linearGradient>
                  <linearGradient id="paint2_linear_2253_213010" x1="27.8861" y1="4.19671" x2="37.8539" y2="11.5125" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2357C6" />
                    <stop offset="1" stop-color="#5EA8FF" />
                  </linearGradient>
                  <linearGradient id="paint3_linear_2253_213010" x1="-4.8868" y1="27.9602" x2="36.0343" y2="51.4492" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2357C6" />
                    <stop offset="1" stop-color="#5EA8FF" />
                  </linearGradient>
                  <linearGradient id="paint4_linear_2253_213010" x1="28.0297" y1="17.6595" x2="39.6328" y2="16.5479" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2357C6" />
                    <stop offset="1" stop-color="#5EA8FF" />
                  </linearGradient>
                  <clipPath id="clip0_2253_213010">
                    <rect width="56" height="56" fill="white" transform="translate(0 0.5)" />
                  </clipPath>
                </defs>
              </svg>

            </div>
            <div className="flex flex-col justify-between gap-8 small-500:mt-8 pt-6">
              <div>
                <h6 className="text-blue-strong font-semibold text-[26px] pb-3">Shout Us Out</h6>
                <ul className="list flex gap-1 flex-col list-disc">
                  <li className="text-blu-ray-300 md:text-[18px] text-base font-[450px] ml-7">
                    Follow our company profile on LinkedIn, Instagram, or Bluesky
                  </li>
                  <li className="text-blu-ray-300 flex flex-col md:text-[18px] text-base font-[450px] ml-7">
                    Repost your favorite post of ours <span className='pt-1'>AND</span>
                  </li>

                  <li className="text-blu-ray-300 md:text-[18px] text-base font-[450px] ml-7">
                    Comment on one of our posts
                  </li>
                </ul>
              </div>
              <div className="mt-auto">
                <Image
                  src={`${process.env.NEXT_PUBLIC_STATIC_URL}/home/images/webp/ShoutUsOut.webp`}
                  alt="Business"
                  width={300}
                  height={400}
                  className="w-full object-contain"
                />
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[48%] border border-[#D8D9D9] bg-[#5FAFDD] rounded-3xl p-[26px] small-500:px-4 small-500:py-5">
            <div className="relative size-[32px] small-500:size-[24px] lg:py-5">
              <svg width="56" height="57" viewBox="0 0 56 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.5161 7.89846L11.5188 6.90043L10.5176 3.89999C10.1944 2.93047 8.58806 2.93047 8.26489 3.89999L7.26369 6.90043L4.26642 7.89846C3.78166 8.06005 3.45215 8.51312 3.45215 9.0264C3.45215 9.53967 3.78166 9.99275 4.26642 10.1543L7.26369 11.1524L8.26489 14.1528C8.42647 14.6376 8.87955 14.9639 9.38966 14.9639C9.89976 14.9639 10.356 14.6344 10.5144 14.1528L11.5156 11.1524L14.5129 10.1543C14.9977 9.99275 15.3272 9.53967 15.3272 9.0264C15.3272 8.51312 15.0008 8.06005 14.5161 7.89846Z" fill="white" />
                <path d="M28.0014 44.2458C28.0014 41.5115 29.744 39.0972 32.3389 38.2355L34.0815 37.6525L34.6645 35.9067C35.5104 33.3783 37.9247 31.6864 40.6749 31.6864C41.8123 31.6864 42.8579 32.035 43.7925 32.5514L52.6291 23.9398C53.2786 23.3093 53.5099 22.362 53.2311 21.5033C52.9523 20.6447 52.2077 20.0174 51.3142 19.8875L36.6764 17.7615L30.1306 4.49557C29.3321 2.87337 26.6675 2.87337 25.8691 4.49557L19.3233 17.7583L4.68545 19.8843C3.79197 20.0142 3.04741 20.6415 2.76859 21.5002C2.48977 22.3588 2.72106 23.3061 3.37058 23.9366L13.9624 34.2592L11.4594 48.8368C11.3073 49.7303 11.6717 50.6301 12.4036 51.1624C13.1386 51.6915 14.105 51.7644 14.9066 51.343L27.9982 44.4581L28.0363 44.4771C28.0363 44.3979 27.9982 44.325 27.9982 44.2458H28.0014Z" fill="white" />
                <path d="M47.5124 42.7441L43.5107 41.4102L42.1768 37.4086C41.7428 36.1159 39.6041 36.1159 39.1701 37.4086L37.8362 41.4102L33.8346 42.7441C33.1882 42.9596 32.751 43.5647 32.751 44.2459C32.751 44.9271 33.1882 45.5323 33.8346 45.7477L37.8362 47.0816L39.1701 51.0833C39.3855 51.7296 39.9939 52.1668 40.675 52.1668C41.3562 52.1668 41.9614 51.7296 42.18 51.0833L43.5139 47.0816L47.5155 45.7477C48.1619 45.5323 48.5991 44.9271 48.5991 44.2459C48.5991 43.5647 48.1619 42.9596 47.5155 42.7441H47.5124Z" fill="white" />
                <path d="M44.636 12.6764C45.9484 12.6764 47.0123 11.6125 47.0123 10.3001C47.0123 8.98772 45.9484 7.92383 44.636 7.92383C43.3237 7.92383 42.2598 8.98772 42.2598 10.3001C42.2598 11.6125 43.3237 12.6764 44.636 12.6764Z" fill="white" />
              </svg>

            </div>
            <div className="flex flex-col h-full justify-between gap-3 small-500:mt-5 pt-8 lg:pt-16">
              {/* Top Content */}
              <div>
                <h6 className="text-[#FFFFFF] font-semibold text-[26px] pb-3">
                  Let Us Know What You Think
                </h6>
                <ul className="list flex gap-1 flex-col">
                  <li className="text-[#EDEEF0] md:text-[18px] text-base font-[450px]">
                    Use the &quot;Feedback&quot; button on the right and
                    <div>complete our two-minute, anonymous survey.</div>
                  </li>
                </ul>
              </div>

              {/* Image pinned to bottom */}
              <div className="mt-auto mb-[4rem] lg:mb-[2.5rem]">
                <div className="bg-gray-100 p-6 rounded-xl shadow-xl max-w-4xl mx-auto ">
                  <div className="text-center">
                    <h1 className="text-3xl md:text-[30px] font-semibold text-[#001E5F] mt-5 mb-2">
                      Your Opinion is Everything!
                    </h1>
                    <p className="text-gray-600 text-base md:text-lg">
                      Please help us improve. Our anonymous survey takes{' '}<br />
                      <span className="font-semibold text-transparent bg-clip-text bg-[linear-gradient(to_right,_#3156bf_0%,_#3156bf_65%,_#6a83c7_100%)]">
                        less than two minutes
                      </span>.
                      Feel free to also answer the<br /> open-ended questions below.
                    </p>
                  </div>

                  <div className="mt-10 space-y-4"><div className="h-5 bg-[#e2e8f5] rounded-full w-full"></div>
                    <div className="h-5 bg-[#e2e8f5] rounded-full w-3/4"></div>
                    <div className="h-5 bg-[#e2e8f5] rounded-full w-11/12"></div>
                    <div className="h-5 bg-[#e2e8f5] rounded-full w-1/2"></div>

                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
        <div className="flex flex-col md:flex-row  justify-between bg-[#0A1734] text-white rounded-3xl px-6 py-10 md:py-16 md:px-12">
          {/* Left Section */}
          <div className="max-w-md md:w-1/2 w-full gap-10 flex flex-col justify-between">
            {/* Icon */}
            <div>
              <div className="w-10 h-10">
                <svg width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.4919 49.4637H8.50245C7.32479 49.4637 6.369 48.508 6.369 47.3303V42.3411C6.369 39.5506 8.01318 37.0019 10.5591 35.8499C11.6258 35.3635 12.8945 35.8385 13.3809 36.9137C13.8674 37.9861 13.3895 39.2519 12.3171 39.7355C11.2958 40.1992 10.6359 41.2203 10.6359 42.3411V45.197H13.4919C14.6127 45.197 15.6339 44.537 16.0975 43.5159C16.5811 42.4435 17.8498 41.9684 18.9194 42.452C19.9918 42.9384 20.4697 44.2014 19.9833 45.2738C18.8312 47.8196 16.2824 49.4637 13.4919 49.4637Z" fill="white" />
                  <path d="M41.1408 32.0737C50.884 21.3729 49.8122 9.30843 49.6487 7.94471C49.5388 7.02038 48.8127 6.29432 47.8882 6.18447C46.5189 6.01568 34.4605 4.94935 23.7553 14.691L21.0408 14.206C16.9248 13.4746 12.7151 15.1973 10.3007 18.6026L5.26836 25.7079C4.75655 26.4313 4.77798 27.4011 5.31927 28.1004C5.7105 28.6041 6.30003 28.8801 6.90831 28.8801C7.14947 28.8801 7.39332 28.8372 7.62645 28.7488C7.66129 28.7354 10.4883 27.7012 14.69 27.8673C14.2345 29.0408 13.9102 30.0777 13.6798 30.9189C13.4895 31.6155 13.6851 32.3603 14.197 32.8721L22.9648 41.6384C23.348 42.0216 23.8598 42.2279 24.385 42.2279C24.5618 42.2279 24.7414 42.2038 24.9155 42.1555C25.7543 41.9251 26.7913 41.6009 27.9623 41.1455C28.1177 45.3116 27.0941 48.1784 27.0834 48.2079C26.7672 49.0357 27.0298 49.9708 27.7292 50.512C28.0909 50.7906 28.525 50.9326 28.9591 50.9326C29.3664 50.9326 29.7738 50.8094 30.1221 50.5629L37.2339 45.526C40.6371 43.1174 42.3601 38.9057 41.6258 34.8011L41.1381 32.079L41.1408 32.0737ZM34.3747 16.77C36.9632 16.77 39.0641 18.8678 39.0641 21.4586C39.0641 24.0494 36.9632 26.1473 34.3747 26.1473C31.7862 26.1473 29.6853 24.0494 29.6853 21.4586C29.6853 18.8678 31.7862 16.77 34.3747 16.77ZM11.4637 23.9182L13.5833 20.9282C15.1 18.7875 17.7394 17.697 20.3387 18.1632L20.4298 18.1793C18.7818 20.1619 17.4661 22.1499 16.472 24.0012C14.6284 23.8217 12.9027 23.7922 11.4637 23.9182ZM34.9133 42.2439L31.9148 44.3659C32.0434 42.9298 32.0113 41.2044 31.829 39.3611C33.6807 38.3671 35.669 37.0516 37.6519 35.4039L37.6707 35.5057C38.1316 38.0858 37.0517 40.7302 34.9133 42.2439Z" fill="white" />
                </svg>
              </div>
              {/* Title */}
              <h2 className="text-3xl font-semibold pt-16">Send Us a Message</h2>

              {/* Description */}
              <p className="text-[#C9C9C9] text-[19px] leading-relaxed pt-5">
                Use the button below to send us a message, include proof of the first two steps and the email address you would like to use for your account
              </p>

            </div>

            {/* Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white  text-[#2357C6] font-bold text-[19px] px-8 py-3 rounded-full w-fit hover:opacity-90 transition"
            >
              Message Us
            </button>
          </div>

          {/* Right Section - Image */}
          <div className="md:w-[37%] w-full mt-10 md:mt-0">
            <Image
              src={`${process.env.NEXT_PUBLIC_STATIC_URL}/home/images/webp/ShoutUsOut.webp`}
              alt="Send Message Illustration"
              width={300}
              height={300}
              className="w-full h-auto object-contain rounded-xl"
            />
          </div>
        </div>

      </section>

      {/* Modal for sending message */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 py-20 flex justify-center items-center z-[1000]">
          <div className="bg-white rounded-[20px] p-[5%] m-[3%] md:m-0 md:p-[3%] w-full max-w-[440px] h-auto max-h-[563px] relative z-[1001]">
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute md:top-8 top-4 md:right-10 right-4 bg-gray-200 text-white hover:bg-gray-300 rounded-full w-5 h-5 flex items-center justify-center text-xl font-bold z-[1002]"
            >
              <Image src={`${process.env.NEXT_PUBLIC_STATIC_URL}/icons/closebutton.svg`} alt="Close" width={16} height={16} />
            </button>

            <h3 className="text-[#001E5F] text-[24px] font-semibold mb-1">Send Us a Message</h3>
            <h3 className="text-[#5B657B] text-[16px] mb-3">Please provide the following details</h3>

            <p className="text-[#000000] font-NeueHaas text-[16px] pb-1">Account Type</p>
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className={`w-full p-2 mb-1 px-3 ${accountType ? "text-black" : "text-[#8D8D8D]"} border  border-gray-300 rounded-md`}
            >
              <option value="" disabled className="text-black">
                Select Account Type
              </option>
              <option value="Black-owned Business" className="text-black">
                Black-owned Business
              </option>
              <option value="Strategy Consultants" className="text-black">
                Strategy Consultants
              </option>
              <option value="Expert" className="text-black">
                Expert
              </option>
              <option value="Advocate" className="text-black">
                Advocate
              </option>
              <option value="Professional" className="text-black">
                Professional
              </option>
              <option value="Investor" className="text-black">
                Investor
              </option>
              <option value="Mentor" className="text-black">
                Mentor
              </option>
            </select>

            <p className="text-[#000000] font-NeueHaas py-1 text-[16px]">Additional Information</p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full mb-4 p-2 h-[9rem] border border-gray-300 rounded-md resize-none"
              placeholder="Provide your email address and any additional details that you wish to include"
            />

            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg, application/pdf"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
                  if (!allowedTypes.includes(file.type)) {
                    toast.error("Only PDF and image files (PNG, JPG, JPEG) are allowed.");
                    e.target.value = ""; // Reset input field
                    return;
                  }
                  setAttachment(file);
                }
              }}
              className="w-full mb-4"
            />

            <div className="flex w-full">
              <button
                onClick={handleSendMessage}
                disabled={isSending}
                className={`px-6 py-2 w-full rounded-[5px] bg-[#2357C6] text-white font-semibold hover:bg-blue-700 ${isSending ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
              >
                {isSending ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending message...
                  </span>
                ) : (
                  'Send'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

'use client';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Image from 'next/image';
// import closebutton from '../../../../public/icons/closebutton.svg';
import { toast } from 'react-toastify';
import { Slide } from 'react-toastify';
import { getSpotsLeftCount, sendFreeAccountMessage } from '@/app/api/marketing/pricing';

// import ShoutUsImg from '../../../../public/home/images/webp/ShoutUsOut.webp'
// import sendMessSvg from '../../../../public/home/images/sendMessSvg.webp'

const ToastContainer = dynamic(
  () => import('react-toastify').then(mod => mod.ToastContainer),
  { ssr: false }
);

export const EasySteps = () => {
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
      <section id='get-a-free-account' className="stop max-w-[1280px] mx-auto ">
        <h3 className=" text-center font-[450px] text-blue-strong md:text-[42px] small-500:text-h2 leading-[110%] ">
                  Get a {" "}<span className='relative  text-[#001E5F] inline-block -rotate-2 mx-1.5'>
                      <svg width="251" height="55" viewBox="0 0 251 55" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute md:-bottom-1 left-1/2 -translate-x-1/2 -z-0 size-[110%]">
                          <path fillRule="evenodd" clipRule="evenodd" d="M173.511 1.54483C164.72 1.45304 157.322 1.32063 153.502 1.15481C145.956 0.827227 128.077 1.33934 113.769 2.29876C102.77 3.0343 84.7523 4.70632 68.3982 6.3882C63.8166 6.37203 59.1755 6.33254 54.6015 6.26774C13.7398 5.68916 8.50479 5.97516 6.48828 8.89626C4.39934 11.924 4.39565 12.1786 6.44053 12.2344C7.00154 12.2497 7.57972 12.4205 8.07633 12.6887C7.1715 13.1165 6.65222 13.6176 6.2627 14.2175C6.17587 14.3513 6.09277 14.4799 6.0134 14.6034C2.85112 13.8442 2.40482 14.3114 2.96993 17.5869C3.09655 18.3207 3.10147 19.1681 3.00475 20.0373C2.70361 20.337 2.62675 20.8618 2.70709 21.6783C2.42066 22.8159 1.97838 23.8907 1.42643 24.6903C-0.631977 27.6722 -0.568942 27.9225 2.315 28.2192L2.45131 28.233C2.20625 28.9821 1.89378 29.6734 1.52725 30.238C-0.468551 33.3121 -0.400476 33.5595 2.48702 33.7269C4.19634 33.8257 6.02175 33.8048 6.54343 33.6804C6.97609 33.577 8.48121 34.9969 10.1353 37.0125C8.89821 37.2949 9.32468 37.6913 11.1086 38.6393C11.3013 38.7417 11.4904 38.8515 11.6751 38.9674C12.5518 40.0272 13.4758 40.8886 14.4467 41.5514C15.4661 42.9814 15.6672 44.2945 14.4123 44.3819C10.7467 44.6372 15.3397 48.1701 23.9431 51.7129C33.304 55.5676 33.8232 55.5615 79.0532 51.0716C88.6891 50.1152 98.5952 49.0294 107.587 47.9626C112.652 48.1699 118.779 48.313 125.042 48.3707C129.802 48.6247 134.628 48.8322 139.115 48.9659C165.574 49.7586 231.648 49.1859 222.827 48.2403C215.323 47.4358 219.187 45.4233 231.008 43.9797C237.102 43.2354 242.301 41.7006 242.56 40.5691C242.82 39.4376 244.659 38.5562 246.646 38.6104C249.337 38.6838 250.264 37.7218 250.272 34.8461C250.276 33.7493 250.106 32.884 249.69 32.1746C250.192 31.5554 250.386 30.6091 250.362 29.2359C250.317 26.6367 249.325 25.3805 246.404 24.5063C247.676 24.4297 247.958 24.2234 247.393 23.7131C247.788 23.2375 247.717 22.3078 247.373 20.711C247.256 20.1678 247.203 19.5536 247.208 18.9083C247.655 18.765 247.648 18.553 247.235 18.2125C247.35 16.5171 247.829 14.7118 248.56 13.4697C250.428 10.296 250.356 10.052 247.542 10.0295C246 10.0174 244.364 10.1129 243.729 10.2466C243.283 9.54035 242.082 8.5594 240.28 7.42777C239.857 6.94569 239.42 6.42132 238.985 5.86983C236.524 2.74817 233.728 1.26052 230.601 1.40941C229.903 1.44269 228.998 1.47288 227.915 1.5C221.422 -0.648531 213.618 -0.315933 176.424 1.40695C175.456 1.45183 174.484 1.49781 173.511 1.54483ZM21.1384 16.9308C20.9845 16.9756 20.8321 17.0207 20.6812 17.0661C20.3059 16.9558 19.9327 16.84 19.5632 16.7191C20.0912 16.7835 20.6172 16.8543 21.1384 16.9308ZM11.2267 11.7694C12.0584 11.6116 13.0309 11.4662 14.1737 11.3304C12.0618 11.1878 11.1564 11.2856 11.2267 11.7694Z" fill="#BAD9FF" />
                      </svg>

                      <span className='relative inline-block z-10 md:px-2'>free account</span>
                      
                  </span> for one year in
          <br />
          just 3 easy steps

        </h3>
        {/* <p className="md:text-xl text-base leading-[110%] text-[#2357C6] text-center font-semibold md:mt-4 mt-5">
          {counter} of 3000 spots left
        </p> */}
              <div className='flex flex-col md:flex-row gap-4 py-10 px-4'>
                  <div className="flex md:w-1/2 w-full gap-4 flex-col ">
                      <div className="w-full max-h-[400px]  p-4 overflow-hidden  bg-[#BAD9FF]/60 rounded-3xl ">
                          
                              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <g clipPath="url(#clip0_949_28704)">
                                      <path d="M42.4354 19.8024C43.1991 21.1251 44.9061 21.5826 46.2288 20.8189L51.0388 18.0419C52.3615 17.2782 52.8189 15.5711 52.0552 14.2484C51.2915 12.9257 49.5845 12.4683 48.2618 13.2319L43.4518 16.009C42.1291 16.7726 41.6717 18.4797 42.4354 19.8024Z" fill="black" />
                                      <path d="M43.9909 33.3473C43.8082 34.8637 44.8717 36.2058 46.3742 36.3644C48.1903 36.5665 50.1202 36.799 51.9503 37.0251C53.4667 37.2078 54.8328 36.1304 54.9914 34.6279C54.9775 34.6039 55.0016 34.59 54.9877 34.566C55.1704 33.0496 54.0931 31.6835 52.5906 31.5248C50.7605 31.2987 48.8306 31.0662 47.0385 30.8503C45.5221 30.6676 44.1699 31.769 43.9872 33.2854C44.0011 33.3094 43.9909 33.3473 43.9909 33.3473Z" fill="black" />
                                      <path d="M36.8038 -0.00508551C36.79 -0.0291351 36.7659 -0.0152496 36.752 -0.0392991C35.3474 -0.639276 33.7314 0.00515022 33.1555 1.39584C32.4363 3.09374 31.6486 4.89527 30.9534 6.57927C30.3534 7.98385 31.0219 9.58601 32.4126 10.1619C32.4265 10.186 32.4506 10.1721 32.4644 10.1961C33.869 10.7961 35.461 10.1656 36.061 8.761C36.7941 7.08716 37.5438 5.27547 38.263 3.57757C38.8529 2.21093 38.1844 0.608776 36.8038 -0.00508551Z" fill="black" />
                                      <path d="M14.2203 26.4669L4.60043 32.0209C1.95498 33.5482 1.04017 36.9624 2.56752 39.6078L5.34453 44.4177C6.87189 47.0632 10.286 47.978 12.9315 46.4506L15.3364 45.0621L19.5019 52.277C20.2656 53.5997 21.9727 54.0572 23.2954 53.2935C24.6181 52.5298 25.0755 50.8227 24.3119 49.5L20.1463 42.2851L22.5513 40.8966L38.7416 41.169L22.0796 12.3095L14.2203 26.4669Z" fill="black" />
                                      <path d="M36.4308 23.2688C34.5841 20.0702 31.523 17.9896 28.1719 17.2949L37.461 33.3841C38.5488 30.1587 38.2775 26.4674 36.4308 23.2688Z" fill="black" />
                                  </g>
                                  <defs>
                                      <clipPath id="clip0_949_28704">
                                          <rect width="56" height="56" fill="white" />
                                      </clipPath>
                                  </defs>
                              </svg>
                          <div className="">
                              <div className="max-w-md">
                                  <h6 className="text-[#00091E] font-medium text-2xl  mt-2">Shout Us Out</h6>
                                  <p className="text-blu-ray-300 text-base">
                    Comment on or repost a post of ours on social media
                  </p>
                                 
                              </div>
                              <div className="md:mt-6 -mb-4">
                                  <Image
                                      src={`/homepage-new/shout.svg`}
                                      alt="Business"
                                      width={300}
                                      height={400}
                                      className="w-full object-contain"
                                  />
                              </div>
                          </div>
                      </div>
                      <div className="w-full max-h-[400px] bg-[#BAD9FF]/60 rounded-3xl p-4 overflow-hidden">
                              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M14.5122 7.39846L11.5149 6.40043L10.5137 3.39999C10.1905 2.43047 8.58415 2.43047 8.26098 3.39999L7.25978 6.40043L4.26251 7.39846C3.77775 7.56005 3.44824 8.01312 3.44824 8.5264C3.44824 9.03967 3.77775 9.49275 4.26251 9.65434L7.25978 10.6524L8.26098 13.6528C8.42257 14.1376 8.87564 14.4639 9.38575 14.4639C9.89586 14.4639 10.3521 14.1344 10.5105 13.6528L11.5117 10.6524L14.509 9.65434C14.9937 9.49275 15.3233 9.03967 15.3233 8.5264C15.3233 8.01312 14.9969 7.56005 14.5122 7.39846Z" fill="black" />
                                  <path d="M27.9975 43.7458C27.9975 41.0115 29.7401 38.5972 32.335 37.7355L34.0776 37.1525L34.6606 35.4067C35.5065 32.8783 37.9208 31.1864 40.671 31.1864C41.8084 31.1864 42.854 31.535 43.7886 32.0514L52.6252 23.4398C53.2747 22.8093 53.506 21.862 53.2272 21.0033C52.9483 20.1447 52.2038 19.5174 51.3103 19.3875L36.6725 17.2615L30.1266 3.99557C29.3282 2.37337 26.6636 2.37337 25.8652 3.99557L19.3194 17.2583L4.68154 19.3843C3.78806 19.5142 3.0435 20.1415 2.76468 21.0002C2.48587 21.8588 2.71716 22.8061 3.36667 23.4366L13.9585 33.7592L11.4555 48.3368C11.3034 49.2303 11.6678 50.1301 12.3997 50.6624C13.1347 51.1915 14.1011 51.2644 14.9027 50.843L27.9943 43.9581L28.0324 43.9771C28.0324 43.8979 27.9943 43.825 27.9943 43.7458H27.9975Z" fill="black" />
                                  <path d="M47.5085 42.2441L43.5068 40.9102L42.1729 36.9086C41.7389 35.6159 39.6002 35.6159 39.1662 36.9086L37.8323 40.9102L33.8307 42.2441C33.1843 42.4596 32.7471 43.0647 32.7471 43.7459C32.7471 44.4271 33.1843 45.0323 33.8307 45.2477L37.8323 46.5816L39.1662 50.5833C39.3816 51.2296 39.9899 51.6668 40.6711 51.6668C41.3523 51.6668 41.9575 51.2296 42.1761 50.5833L43.51 46.5816L47.5116 45.2477C48.158 45.0323 48.5952 44.4271 48.5952 43.7459C48.5952 43.0647 48.158 42.4596 47.5116 42.2441H47.5085Z" fill="black" />
                                  <path d="M44.6321 12.1764C45.9445 12.1764 47.0084 11.1125 47.0084 9.8001C47.0084 8.48772 45.9445 7.42383 44.6321 7.42383C43.3198 7.42383 42.2559 8.48772 42.2559 9.8001C42.2559 11.1125 43.3198 12.1764 44.6321 12.1764Z" fill="black" />
                              </svg>
                          <div className="flex flex-col h-full gap-3 small-500:mt-5 ">
                              {/* Top Content */}
                              <div className="max-w-md">
                                  <h6 className="text-[#00091E] font-medium text-2xl">
                                      Let Us Know What You Think
                                  </h6>
                                  <ul className="list flex gap-1 flex-col">
                                      <li className="text-[#3F495D]  text-base ">
                                          Use the "Feedback" button on the right and complete our two-minute, anonymous survey (be sure to add your suggestions).
                                      </li>
                                  </ul>
                              </div>

                              {/* Image pinned to bottom */}
                              <div className="">
                                  <Image
                                      src={`/homepage-new/opinion.svg`}
                                      alt="Feedback"
                                      width={300} 
                                      height={400}
                                      className="w-full object-contain"
                                    />

                              </div>
                          </div>

                      </div>
                  </div>
                  <div className="relative flex flex-col md:w-1/2 w-full  justify-between bg-[#002B4C] text-white rounded-3xl  overflow-hidden">
                      {/* Left Section */}
                      <div className=" w-full gap-4 flex flex-col justify-between p-6">
                          {/* Icon */}
                          <div>
                                  <svg width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M13.4919 49.4637H8.50245C7.32479 49.4637 6.369 48.508 6.369 47.3303V42.3411C6.369 39.5506 8.01318 37.0019 10.5591 35.8499C11.6258 35.3635 12.8945 35.8385 13.3809 36.9137C13.8674 37.9861 13.3895 39.2519 12.3171 39.7355C11.2958 40.1992 10.6359 41.2203 10.6359 42.3411V45.197H13.4919C14.6127 45.197 15.6339 44.537 16.0975 43.5159C16.5811 42.4435 17.8498 41.9684 18.9194 42.452C19.9918 42.9384 20.4697 44.2014 19.9833 45.2738C18.8312 47.8196 16.2824 49.4637 13.4919 49.4637Z" fill="white" />
                                      <path d="M41.1408 32.0737C50.884 21.3729 49.8122 9.30843 49.6487 7.94471C49.5388 7.02038 48.8127 6.29432 47.8882 6.18447C46.5189 6.01568 34.4605 4.94935 23.7553 14.691L21.0408 14.206C16.9248 13.4746 12.7151 15.1973 10.3007 18.6026L5.26836 25.7079C4.75655 26.4313 4.77798 27.4011 5.31927 28.1004C5.7105 28.6041 6.30003 28.8801 6.90831 28.8801C7.14947 28.8801 7.39332 28.8372 7.62645 28.7488C7.66129 28.7354 10.4883 27.7012 14.69 27.8673C14.2345 29.0408 13.9102 30.0777 13.6798 30.9189C13.4895 31.6155 13.6851 32.3603 14.197 32.8721L22.9648 41.6384C23.348 42.0216 23.8598 42.2279 24.385 42.2279C24.5618 42.2279 24.7414 42.2038 24.9155 42.1555C25.7543 41.9251 26.7913 41.6009 27.9623 41.1455C28.1177 45.3116 27.0941 48.1784 27.0834 48.2079C26.7672 49.0357 27.0298 49.9708 27.7292 50.512C28.0909 50.7906 28.525 50.9326 28.9591 50.9326C29.3664 50.9326 29.7738 50.8094 30.1221 50.5629L37.2339 45.526C40.6371 43.1174 42.3601 38.9057 41.6258 34.8011L41.1381 32.079L41.1408 32.0737ZM34.3747 16.77C36.9632 16.77 39.0641 18.8678 39.0641 21.4586C39.0641 24.0494 36.9632 26.1473 34.3747 26.1473C31.7862 26.1473 29.6853 24.0494 29.6853 21.4586C29.6853 18.8678 31.7862 16.77 34.3747 16.77ZM11.4637 23.9182L13.5833 20.9282C15.1 18.7875 17.7394 17.697 20.3387 18.1632L20.4298 18.1793C18.7818 20.1619 17.4661 22.1499 16.472 24.0012C14.6284 23.8217 12.9027 23.7922 11.4637 23.9182ZM34.9133 42.2439L31.9148 44.3659C32.0434 42.9298 32.0113 41.2044 31.829 39.3611C33.6807 38.3671 35.669 37.0516 37.6519 35.4039L37.6707 35.5057C38.1316 38.0858 37.0517 40.7302 34.9133 42.2439Z" fill="white" />
                                  </svg>
                              {/* Title */}
                              <h2 className="text-2xl font-medium pt-2">
                                  Send Us a Message
                              </h2>

                              {/* Description */}
                              <p className="text-[#AFB2B9] text-[18px] leading-relaxed ">
                                  Use the button below to send us a message, include proof of the first two steps and the email address you would like to use for your account
                              </p>

                          </div>

                          {/* Button */}
                          <button
                              onClick={() => setIsModalOpen(true)}
                              className="bg-[#E6F1FF]  text-[#00091E] flex items-center gap-2 text-[14px] px-8 py-3 rounded-md w-fit hover:opacity-90 transition"
                          >
                              Send us  a message
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12.9989 7.91027C13.025 7.85263 13.0385 7.79007 13.0385 7.72677C13.0385 7.66348 13.025 7.60092 12.9989 7.54328C12.9759 7.484 12.9414 7.42985 12.8975 7.38393L8.06862 2.5551C7.97769 2.46417 7.85437 2.41309 7.72577 2.41309C7.59718 2.41309 7.47386 2.46417 7.38293 2.5551C7.292 2.64603 7.24092 2.76935 7.24092 2.89794C7.24092 3.02654 7.292 3.14986 7.38293 3.24079L11.3909 7.24389H2.89695C2.76888 7.24389 2.64605 7.29477 2.5555 7.38532C2.46494 7.47588 2.41406 7.5987 2.41406 7.72677C2.41406 7.85484 2.46494 7.97766 2.5555 8.06822C2.64605 8.15878 2.76888 8.20966 2.89695 8.20966H11.3909L7.38293 12.2128C7.33767 12.2576 7.30174 12.3111 7.27723 12.3699C7.25271 12.4287 7.24009 12.4919 7.24009 12.5556C7.24009 12.6193 7.25271 12.6825 7.27723 12.7413C7.30174 12.8002 7.33767 12.8536 7.38293 12.8984C7.42782 12.9437 7.48123 12.9796 7.54007 13.0041C7.59891 13.0287 7.66203 13.0413 7.72577 13.0413C7.78952 13.0413 7.85264 13.0287 7.91148 13.0041C7.97032 12.9796 8.02373 12.9437 8.06862 12.8984L12.8975 8.06962C12.9414 8.0237 12.9759 7.96954 12.9989 7.91027Z" fill="#00091E" />
                              </svg>

                          </button>
                      </div>

                      {/* Right Section - Image */}
                      <div className=" md:absolute -bottom-10  left-10 w-full ">
                          <Image
                              src={`/homepage-new/feedback1.svg`}
                              alt="Send Message Illustration"
                              width={300}
                              height={300}
                              className="w-full h-auto object-contain rounded-xl"
                          />
                      </div>
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

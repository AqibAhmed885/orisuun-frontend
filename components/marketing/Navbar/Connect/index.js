import Image from 'next/image';
import Link from 'next/link';

const Connect = ({ closePopover }) => {
  return (
    <>
      <div className="flex justify-center gap-[138px] pb-[32px]">
        <div className="max-w-[201px] ">
          <h2 className="text-blue-strong text-[20px] font-semibold leading-7">
            Connect with Orisuun!
          </h2>
          <p className="text-blue-strong text-[14px] font-medium leading-[130%] mt-2">
            We&apos;re building something great, and we want you to be a part of
            it
          </p>
        </div>
        <div>
          <div className="flex gap-9">
            {/* column 1 */}
            <div className=" space-y-9">
              <Link
                href="resources"
                className="flex gap-3 items-start"
                onClick={closePopover}
              >
                <div className=" p-3 border-2 border-none rounded bg-[#F0F7FD] ">
                  <Image
                    src="/icons/info.svg"
                    width={28}
                    height={28}
                    alt="info"
                  />
                </div>
                <div className="max-w-[240px] space-y-1 ">
                  <p className=" text-blue-strong font-semibold leading-6 text-base">
                    Global Black Business Resources
                  </p>
                  <p className="text-sm text-[#6E6E6E] font-medium leading-[130%]">
                    Discover and track resources for Black-Owned businesses around the world
                  </p>
                </div>
              </Link>
              <Link
                href="how-you-can-help-us"
                className="flex gap-3 items-start"
                onClick={closePopover}
              >
                <div className=" p-3 border-2 border-none rounded bg-[#F0F7FD] ">
                  <Image
                    src="/icons/plant.svg"
                    width={24}
                    height={24}
                    alt="plant"
                  />
                </div>
                <div className="max-w-[250px] space-y-1">
                  <p className=" text-blue-strong font-semibold leading-6 text-base">
                    Help Us Grow
                  </p>
                  <p className="text-sm text-[#6E6E6E] font-medium leading-[130%]">
                    Tap your network and connect Orisuun to the people we serve
                  </p>
                </div>
              </Link>
            </div>
            {/* column 2 */}
            <div className=" space-y-9">
              <Link
                href="calendar"
                className="flex gap-3 items-start"
                onClick={closePopover}
              >
                <div className=" p-3 border-2 border-none rounded bg-[#F0F7FD] ">
                  {/* <Image
                    src="/icons/launcher.svg"
                    width={28}
                    height={28}
                    alt="launcher"
                  /> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M6.66667 29.3337C5.93333 29.3337 5.30578 29.0728 4.784 28.551C4.26222 28.0292 4.00089 27.4012 4 26.667V8.00033C4 7.26699 4.26133 6.63944 4.784 6.11766C5.30667 5.59588 5.93422 5.33455 6.66667 5.33366H8V2.66699H10.6667V5.33366H21.3333V2.66699H24V5.33366H25.3333C26.0667 5.33366 26.6947 5.59499 27.2173 6.11766C27.74 6.64033 28.0009 7.26788 28 8.00033V14.667H25.3333V13.3337H6.66667V26.667H16V29.3337H6.66667ZM18.6667 29.3337V25.2337L26.0333 17.9003C26.2333 17.7003 26.4556 17.5559 26.7 17.467C26.9444 17.3781 27.1889 17.3337 27.4333 17.3337C27.7 17.3337 27.9556 17.3839 28.2 17.4843C28.4444 17.5848 28.6667 17.7345 28.8667 17.9337L30.1 19.167C30.2778 19.367 30.4169 19.5892 30.5173 19.8337C30.6178 20.0781 30.6676 20.3225 30.6667 20.567C30.6658 20.8114 30.6213 21.0617 30.5333 21.3177C30.4453 21.5737 30.3009 21.8012 30.1 22.0003L22.7667 29.3337H18.6667ZM27.4333 21.867L28.6667 20.567L27.4333 19.3337L26.1667 20.6003L27.4333 21.867Z"
                      fill="#2357c6"
                    ></path>
                  </svg>
                </div>
                <div className="max-w-[235px] space-y-1 ">
                  <p className=" text-blue-strong font-semibold leading-6 text-base">
                    Global Black Business Calendar
                  </p>
                  <p className="text-sm text-[#6E6E6E] font-medium leading-[130%]">
                  Discover and track key events in the Black business community
                  </p>
                </div>
              </Link>
              <Link
                href="insights"
                className="flex gap-3 items-start"
                onClick={closePopover}
              >
                <div className=" p-3 border-2 border-none rounded bg-[#F0F7FD] ">
                  <Image
                    src="/icons/articles.svg"
                    width={24}
                    height={24}
                    alt="check-bag"
                  />
                </div>
                <div className="max-w-[290px] space-y-1">
                  <p className=" text-blue-strong font-semibold leading-6 text-base">
                    Articles and Insights
                  </p>
                  <p className="text-sm text-[#6E6E6E] font-medium leading-[130%]">
                    Want to know everything about Black-owned businesses around
                    the world? Check out our research!
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Connect;

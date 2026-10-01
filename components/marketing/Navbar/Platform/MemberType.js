import Image from 'next/image';
import Link from 'next/link';
const MemberType = ({ closePopover }) => {
  return (
    <div className="grid grid-cols-2 grid-rows-4 gap-x-1.5 gap-y-9 mb-[84px]">
      {/* link 1 */}
      <Link
        href="/black-owned-businesses"
        className="flex gap-3 items-start"
        onClick={closePopover}
      >
        <div className="p-1.5 border-2 border-none rounded bg-[#F0F7FD]">
          <Image src="/icons/crown.svg" width={24} height={24} alt="crown" />
        </div>
        <div className="max-w-[235px] space-y-1 ">
          <p className=" text-blue-strong font-semibold leading-6 text-base">
            Black-Owned Businesses
          </p>
          <p className="text-sm text-blue-strong font- leading-[130%]">
            Global businesses with 25%+ Black ownership, of any size or industry
          </p>
        </div>
      </Link>

      {/* link 2 */}
      <Link
        href="/mentors"
        className="flex gap-3 items-start"
        onClick={closePopover}
      >
        <div className="p-1.5 border-2 border-none rounded bg-[#F0F7FD]">
          <Image
            src="/icons/interview.svg"
            width={24}
            height={24}
            alt="interview"
          />
        </div>
        <div className="max-w-[263px] space-y-1  ">
          <p className=" text-blue-strong font-semibold leading-6 text-base">
            Mentors
          </p>
          <p className="text-sm text-blue-strong font- leading-[130%]">
            Successful entrepreneurs and high-level executives at multinational
            corporations
          </p>
        </div>
      </Link>

      {/* link 3 */}
      <Link
        href="/experts"
        className="flex gap-3 items-start"
        onClick={closePopover}
      >
        <div className="p-1.5 border-2 border-none rounded bg-[#F0F7FD]">
          <Image src="/icons/users.svg" width={24} height={24} alt="users" />
        </div>
        <div className="max-w-[235px] space-y-1">
          <p className=" text-blue-strong font-semibold leading-6 text-base">
            Experts
          </p>
          <p className="text-sm text-blue-strong font- leading-[130%]">
            Highly-recognized individuals or groups excelling in their fields
          </p>
        </div>
      </Link>

      {/* link 4 */}
      <Link
        href="/investors"
        className="flex gap-3 items-start"
        onClick={closePopover}
      >
        <div className="p-1.5 border-2 border-none rounded bg-[#F0F7FD] flex-shrink-0">
          <Image
            src="/icons/subscription.svg"
            width={24}
            height={24}
            alt="subscription"
          />
        </div>
        <div className="max-w-[292px] space-y-1">
          <p className=" text-blue-strong font-semibold leading-6 text-base">
            Investors
          </p>
          <p className="text-sm text-blue-strong font- leading-[130%]">
            Professional investors and institutions actively seeking impactful
            investment opportunities
          </p>
        </div>
      </Link>

      {/* link 5 */}
      <Link
        href="/professionals"
        className="flex gap-3 items-start"
        onClick={closePopover}
      >
        <div className="p-1.5 border-2 border-none rounded bg-[#F0F7FD]">
          <Image
            src="/icons/briefcase.svg"
            width={24}
            height={24}
            alt="briefcase"
          />
        </div>
        <div className="max-w-[235px] space-y-1">
          <p className=" text-blue-strong font-semibold leading-6 text-base">
            Professionals
          </p>
          <p className="text-sm text-blue-strong font- leading-[130%]">
            Those licensed and active in fields like law, accounting,
            architecture, IT, etc
          </p>
        </div>
      </Link>

      {/* link 6 */}
      <Link
        href="/partners"
        className="flex gap-3 items-start"
        onClick={closePopover}
      >
        <div className="p-1.5 border-2 border-none rounded bg-[#F0F7FD]">
          <Image
            src="/icons/partners-menu.svg"
            width={24}
            height={24}
            alt="partners-menu"
          />
        </div>
        <div className="max-w-[235px] space-y-1">
          <p className=" text-blue-strong font-semibold leading-6 text-base">
            Partners
          </p>
          <p className="text-sm text-blue-strong font- leading-[130%]">
            Large, multinational corporations
          </p>
        </div>
      </Link>

      {/* link 7 */}
      <Link
        href="/strategy-consultants"
        className="flex gap-3 items-start"
        onClick={closePopover}
      >
        <div className="p-1.5 border-2 border-none rounded bg-[#F0F7FD]">
          <Image
            src="/icons/strategy-consultant.svg"
            width={24}
            height={24}
            alt="strategy-consultant"
          />
        </div>
        <div className="max-w-[235px] space-y-1">
          <p className=" text-blue-strong font-semibold leading-6 text-base">
            Strategy Consultants
          </p>
          <p className="text-sm text-blue-strong font- leading-[130%]">
            Current or recent strategy consultants from national firms
          </p>
        </div>
      </Link>

      {/* link8*/}
      <Link
        href="/advocates"
        className="flex gap-3 items-start"
        onClick={closePopover}
      >
        <div className="p-1.5 border-2 border-none rounded bg-[#F0F7FD] flex-shrink-0">
          <Image
            src="/icons/advocates-menu.svg"
            width={24}
            height={24}
            alt="advocates-menu"
          />
        </div>
        <div className="max-w-[270px] space-y-1">
          <p className=" text-blue-strong font-semibold leading-6 text-base">
            Advocates
          </p>
          <p className="text-sm text-blue-strong font- leading-[130%]">
            Supporters of Black-owned businesses (clients and customers)
          </p>
        </div>
      </Link>
    </div>
  );
};

export default MemberType;

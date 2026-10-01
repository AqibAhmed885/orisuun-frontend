import MailEmail from '@/icons/cofounder/mail-email';
import Globe from '@/icons/globe';
import GlobeNetwork from '@/icons/globe-network';
import TickRounded from '@/icons/tick-rounded';
import ProfileImage from '@/public/fundraising/Profile.png';
import Image from 'next/image';
import { useCampaignDetails } from './context/campaign-context';
import moment from 'moment';
import { CampaignSkeleton } from '@/components/feed-card-skeleton/campaignDetaIlsSkeleton';
import Link from 'next/link';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import { useRouter } from 'next/navigation';
const CampaignStats = () => {
  const { campaignInfo, userInfo, contributors } = useCampaignDetails();
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <h2 className=" xs:text-h1 lg:!text-4xl font-semibold">
            {campaignInfo.Title}
          </h2>
          <p className="text-h8 text-blue-300">{campaignInfo.Summary}</p>
        </div>
        <div className="flex xs:flex-wrap lg:!flex-nowrap gap-6 lg:!gap-2 justify-between items-start">
          <div className="flex gap-3 max-w-full">
            <div className="relative max-w-[60px] max-h-[60px] min-w-[60px] min-h-[60px] rounded-full bg-gradient-to-b from-[#737DFE] to-[#00FFB8] p-[2px]">
              <div className="bg-white rounded-full max-w-[56px] max-h-[56px] min-w-[56px] min-h-[56px] flex items-center justify-center">
                <Image
                  src={userInfo.image || ProfileImage.src}
                  alt="Logo"
                  width={80}
                  height={80}
                  className="max-w-[60px] max-h-[60px] min-w-[60px] min-h-[60px] rounded-full"
                />
              </div>
            </div>

            <span className="flex flex-col gap-2 truncate overflow-hidden">
              <h3
                className="text-xl leading-none font-bold text-black-500-custom"
                onClick={() =>
                  window.open(
                    `/profile/${add2040ToProfileDetailsId(userInfo.userId)}`,
                    '_blank'
                  )
                }
              >
                {userInfo.username}
              </h3>
              <span className="flex items-center font-medium text-sm leading-4 gap-1.5 text-blue-300">
                <TickRounded />
                <span>
                  Member since
                  <span className="text-nav-blue">
                    &nbsp;{moment(userInfo.createdDate).format('YYYY')}
                  </span>
                </span>
              </span>
              <span className="flex items-center font-medium text-sm leading-4 gap-1.5 lg:max-w-56 3xl:max-w-full text-blue-500">
                <MailEmail className="text-nav-blue h-5 w-5 flex-shrink-0" />
                <span className="text-ellipsis whitespace-pre-wrap overflow-hidden">{userInfo.email}</span>
              </span>

              <span className="flex lg:!hidden items-center font-medium text-sm !truncate leading-4 gap-1.5 text-blue-500">
                <GlobeNetwork className="text-nav-blue h-4 min-w-4 ml-0.5" />
                {/* {userInfo.website} */}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate"
                  href={userInfo.website}
                >
                  {userInfo.website}
                </a>
              </span>
            </span>
          </div>

          <div className="flex divide-x xs:w-full lg:!w-max justify-between lg:!space-x-10">
            <div className="flex flex-col lg:!gap-2 lg:!text-right">
              <h3 className="xs:text-h1 lg:!text-4xl font-semibold text-blue-500">
                {campaignInfo.Achieved.toLocaleString()}
              </h3>
              <p className="text-blue-300 font-medium xs:text-h8 lg:!text-base">
                Funds raised of {campaignInfo.Goal.toLocaleString()} goal
              </p>
            </div>
            <div className="flex flex-col lg:!gap-2 pl-7 lg:!pl-10 lg:!text-right">
              <h3 className="xs:text-h1 lg:!text-4xl font-semibold text-blue-500">
                {contributors.length || 0}
              </h3>
              <p className="text-blue-300 font-medium xs:text-h8 lg:!text-base">
                Contributors
              </p>
            </div>
          </div>
        </div>
      </div>
      {!campaignInfo && <CampaignSkeleton />}
    </>
  );
};

export default CampaignStats;

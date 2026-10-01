'use client';

import Image from 'next/image';
import ProfileImage from '@/public/fundraising/Profile2.png';
import FlagIcon from '@/icons/flag';
import Globe from '@/icons/globe';
import GiftHand from '@/icons/gift-hand';
import ContributionIcon from '@/icons/contribution';
import Button from '@/components/ui/button';
import Add from '@/icons/add';
import router, { useRouter } from 'next/navigation';
import { Sponsor, useCampaignDetails } from './context/campaign-context';
import moment from 'moment';
import { convertToLocalTime, getDaysDifference } from '@/utils/date.helpers';

const InfoRow = ({
  icon: Icon,
  text,
  className,
  isLink = false,
}: {
  icon: any;
  text: string;
  className?: string;
  isLink?: boolean;
}) => (
  <span className={`flex gap-2 items-center max-w-full text-ellipsis whitespace-pre-wrap overflow-hidden ${className}`}>
    <Icon className="w-5 h-5 flex-shrink-0" />
    {isLink ? (
      <a
        href={text}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-blue-500 text-ellipsis whitespace-pre-wrap overflow-hidden"
      >
        {text}
      </a>
    ) : (
      <p className="text-sm font-medium text-blue-500 text-ellipsis whitespace-pre-wrap overflow-hidden">{text}</p>
    )}
  </span>
);

interface ISponsorCardProps {
  sponsor: Sponsor;
}

const SponsorCard: React.FC<ISponsorCardProps> = ({ sponsor }) => (
  <div className="flex flex-col gap-5">
    <div className="flex gap-3 items-center truncate">
      <Image
        alt="Sponsor Image"
        src={sponsor.ProfilePicture || ProfileImage.src}
        width={256}
        height={256}
        className="max-w-20 max-h-20 min-w-20 min-h-20 rounded-full object-cover"
      />
      <div className="flex flex-col gap-2 max-w-full text-ellipsis whitespace-pre-wrap overflow-hidden">
        <h3 className="text-xl leading-none font-bold truncate">
          {sponsor.SponsorName}
        </h3>
        <InfoRow icon={FlagIcon} text={sponsor.Slogan} />
        <InfoRow icon={Globe} text={sponsor.WebsiteUrl} isLink={true} />
      </div>
    </div>
    <p className="font-medium text-blue-300 text-h8 leading-150 line-clamp-4 text-ellipsis whitespace-pre-wrap overflow-hidden break-words">
      {sponsor.ShortMessage}
    </p>
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-5">
        <span className="flex gap-2">
          <GiftHand className="w-5 h-5" />
          <p className="text-2xl leading-5 font-semibold text-nav-blue">
            {sponsor.Impact}
          </p>
        </span>
        <span className="flex gap-2">
          <ContributionIcon className="w-5 h-5" />
          <p className="text-sm font-medium text-blue-300">
            Contributing ${sponsor.Impact.replaceAll('X', '')}
            <br />
            for every $1
          </p>
        </span>
      </div>
      <div className="flex flex-col gap-2 items-end">
        <span className="bg-success-50 text-success-500 px-2 py-1 text-h10 font-medium max-w-[85px] flex justify-center items-center rounded">
          Sponsorship
        </span>
        <div className="flex flex-col text-right">
          <p className="text-[40px] font-semibold text-nav-blue leading-[120%]">
            {getDaysDifference(sponsor.Duration) === 0
              ? 'Today'
              : getDaysDifference(sponsor.Duration)}
          </p>
          {getDaysDifference(sponsor.Duration) !== 0 && (
            <p className="text-sm font-medium text-blue-300">
              {getDaysDifference(sponsor.Duration) === 1
                ? 'Day Left'
                : 'Days Left'}
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
);

const Sponsors: React.FC<{ isPublic: boolean }> = ({ isPublic }) => {
  const router = useRouter();
  const { sponsors } = useCampaignDetails();

  return (
    <>
      {sponsors.length === 0 ? (
        <Button
          startIcon={<Add />}
          title="Become a Sponsor"
          className="!m-0 gap-2 max-h-11 min-w-max max-w-max justify-self-end !text-sm !py-3 !px-4"
          onClick={() => router.push('/fundraising/sponsor')}
          disabled={isPublic}
        />
      ) : (
        <div className="shadow-custom overflow-hidden rounded">
          <div className="flex flex-col border border-grey-600 rounded-b border-t-0">
            <div className="bg-lightBlueBg p-4">
              <h2 className="text-xl font-semibold text-blue-500 leading-[100%]">
                Sponsors (Matching Gifts)
              </h2>
            </div>
            <div className="flex flex-col gap-5 p-4 pb-0 lg:!max-h-[677px] sm:overflow-auto">
              {sponsors.map((sponsor, index) => (
                <>
                  <div key={index}>
                    <SponsorCard sponsor={sponsor} />
                  </div>
                  {index < sponsors.length - 1 && <hr />}
                </>
              ))}
            </div>
            <div className="p-4 pt-2">
              <Button
                startIcon={<Add />}
                title="Become a Sponsor"
                className="!m-0 gap-1 max-h-9 !text-sm !py-4"
                onClick={() => router.push('/fundraising/sponsor')}
                disabled={isPublic}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sponsors;

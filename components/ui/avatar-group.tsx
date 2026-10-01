import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Contributor } from '../fundraising/campaign-details/context/campaign-context';

interface AvatarGroupProps {
  contributors: any[];
}

const AvatarGroup = ({ contributors }: AvatarGroupProps) => {
  const displayedContributors = contributors.slice(0, 3);
  const router = useRouter();

  return (
    <div className="flex items-center">
      <div className="flex -space-x-3">
        {displayedContributors.map((contributor) => (
          <div
            key={contributor.UserId}
            className="w-[30px] h-[30px] overflow-hidden rounded-full border-2 border-white cursor-pointer"
            onClick={() => {
              router.push(
                `/profile/${add2040ToProfileDetailsId(contributor.UserId)}`
              );
            }}
          >
            <Image
              src={contributor.ProfilePicture}
              alt={`Contributor ${contributor.Name}`}
              width={30}
              height={30}
              className="object-cover"
            />
          </div>
        ))}
        {contributors.length > 3 ? (
          <div className="flex items-center justify-center w-[30px] h-[30px] text-white bg-nav-blue text-xs font-semibold rounded-full">
            {contributors.length}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default AvatarGroup;

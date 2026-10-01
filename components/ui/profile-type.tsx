import AdvocatesIcon from '@/icons/profile-types/advocate-icon';
import BlackOwnedBusinessIcon from '@/icons/profile-types/black-owned-business-icon';
import ConsultantIcon from '@/icons/profile-types/consultant-icon';
import ExpertsIcon from '@/icons/profile-types/expert-icon';
import InvestorsIcon from '@/icons/profile-types/investor-icon';
import MentorsIcon from '@/icons/profile-types/mentor-icon';
import PartnersIcon from '@/icons/profile-types/PartnersIcon';
import ProfessionalsIcon from '@/icons/profile-types/professional-icon';

export const renderProfileTypeIcon = (
  userProfileType: number,
  layout: 'default' | 'radio' = 'default',
  isSelected?: boolean,
  size?: string
) => {
  const iconClassName = `fill-[#2357C6] text-[#2357C6] ${size}`;

  if (layout === 'radio') {
    const iconClasses = isSelected
      ? 'fill-nav-blue text-nav-blue  w-5 h-5'
      : 'fill-[#828282] text-[#828282] w-5 h-5';

    const buttonClasses = isSelected
      ? 'border border-nav-blue bg-[#F0F7FD] w-10 h-10 flex justify-center mb-2.5 items-center rounded-full'
      : 'border border-[#828282] w-10 h-10 flex justify-center items-center mb-2.5 rounded-full';

    switch (userProfileType) {
      case 1:
        return (
          <>
            <div className={buttonClasses}>
              <ExpertsIcon className={iconClasses} />
            </div>
            Black-Owned Business   
          </>
        );
      case 2:
        return (
          <>
            {' '}
            <div className={buttonClasses}>
              <ConsultantIcon className={iconClasses} />
            </div>
            Consultant
          </>
        );
      case 3:
        return (
          <>
            <div className={buttonClasses}>
              <BlackOwnedBusinessIcon className={iconClasses} />
            </div>
            Expert
          </>
        );
      case 4:
        return (
          <>
            <div className={buttonClasses}>
              <AdvocatesIcon className={iconClasses} />{' '}
            </div>
            Advocate
          </>
        );
      case 5:
        return (
          <>
            <div className={buttonClasses}>
              <PartnersIcon className={iconClasses} />
            </div>{' '}
            Partner
          </>
        );
      case 6:
        return (
          <>
            <div className={buttonClasses}>
              <ProfessionalsIcon className={iconClasses} />
            </div>{' '}
            Professional
          </>
        );
      case 7:
        return (
          <>
            <div className={buttonClasses}>
              <InvestorsIcon className={iconClasses} />
            </div>{' '}
            Investor
          </>
        );
      case 8:
      case 9:
        return (
          <>
            <div className={buttonClasses}>
              <MentorsIcon className={iconClasses} />
            </div>{' '}
            Mentor
          </>
        );
      default:
        return (
          <>
            <div className={buttonClasses}>
              <ProfessionalsIcon className={iconClasses} />
            </div>{' '}
            Professional
          </>
        );
    }
  }

  switch (userProfileType) {
    case 1:
      return (
        <>
          <BlackOwnedBusinessIcon className={iconClassName} /> Business {' '}
        </>
      );
    case 2:
      return (
        <>
          <ConsultantIcon className={iconClassName} /> Consultant
        </>
      );
    case 3:
      return (
        <>
          <ExpertsIcon className={iconClassName} /> Expert
        </>
      );
    case 4:
      return (
        <>
          <AdvocatesIcon className={iconClassName} /> Advocate
        </>
      );
    case 5:
      return (
        <>
          <PartnersIcon className={iconClassName} /> Partner
        </>
      );
    case 6:
      return (
        <>
          <ProfessionalsIcon className={iconClassName} /> Professional
        </>
      );
    case 7:
      return (
        <>
          <InvestorsIcon className={iconClassName} /> Investor
        </>
      );
    case 8:
    case 9:
      return (
        <>
          <MentorsIcon className={iconClassName} /> Mentor
        </>
      );
    default:
      return (
        <>
          <ProfessionalsIcon className={iconClassName} /> Professional{' '}
        </>
      );
  }
};

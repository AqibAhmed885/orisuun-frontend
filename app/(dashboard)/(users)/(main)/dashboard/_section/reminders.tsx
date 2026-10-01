import Button from '@/components/ui/button';
import CreateDiscountIcon from '@/icons/feeds/create-discount';
import CreateTeamIcon from '@/icons/feeds/create-team';
import EditProfileIcon from '@/icons/feeds/edit-profile';
import NoReminders from '@/icons/feeds/no-reminders';
import VerifyNowIcon from '@/icons/feeds/verify-now';
import { DeleteIcon } from '@/icons/chats/textarea-icons';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Reminder {
  id: number;
  key: string;
  title: string;
  description: string;
  buttonText: string;
  icon: JSX.Element;
}

const defaultReminders: Reminder[] = [
  {
    id: 1,
    key: 'EditProfile',
    title: 'Let’s Get to Know You Better!',
    description: 'Complete your profile today',
    buttonText: 'Edit Profile',
    icon: <EditProfileIcon className="w-10 h-10" />,
  },
  {
    id: 2,
    key: 'VerifyNow',
    title: 'Get Verified Today!',
    description: 'Verify now to access all features.',
    buttonText: 'Verify Now',
    icon: <VerifyNowIcon className="w-10 h-10" />,
  },
  {
    id: 3,
    key: 'CreateTeam',
    title: 'Form a Team',
    description: 'Form your team today',
    buttonText: 'Create Team',
    icon: <CreateTeamIcon className="w-10 h-10" />,
  },
  {
    id: 4,
    key: 'CreateDiscount',
    title: 'Create a Discount',
    description: 'Create a discount now',
    buttonText: 'Discount',
    icon: <CreateDiscountIcon className="w-10 h-10" />,
  },
];

const Reminders: React.FC = () => {
  const router = useRouter();
  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));

  const [reminders, setReminders] = useState<Reminder[]>(defaultReminders);

  const handleDelete = (reminderType: string) => {
    const newReminders = reminders.filter(
      (reminder) => reminder.key !== reminderType
    );
    setReminders(newReminders);
  };

  const handleRoute = (reminderType: string) => {
    if (reminderType === 'EditProfile') {
      router.push(
        `/profile/edit-profile/${add2040ToProfileDetailsId(
          currentUser?.UserProfileDetailsId
        )}`
      );
    } else if (reminderType === 'VerifyNow') {
      router.push('/verification');
    } else if (reminderType === 'CreateTeam') {
      router.push('/settings');
    } else if (reminderType === 'CreateDiscount') {
      router.push('discount-portal/create');
    }
  };

  useEffect(() => {
    const remindersOnTheBasisOfuserProfile = reminders.filter(
      (reminder) =>
        (reminder?.id === 1 && !currentUser?.isProfileComplete) ||
        (reminder?.id === 2 && !currentUser?.isVerified) ||
        reminder?.id === 3 ||
        (reminder?.id === 4 &&
          ((currentUser?.UserProfileTypeId === 1 && currentUser?.isVerified) ||
            currentUser?.UserProfileTypeId === 5))
    );
    setReminders(remindersOnTheBasisOfuserProfile);
  }, []);

  return (
    <div
      className={`bg-white shadow-blur rounded-2xl p-4 ${
        reminders.length === 0 && 'pb-7'
      } w-full lg:!max-w-md 3xl:!max-w-full mx-auto`}
    >
      <h2 className="text-lg leading-6 font-semibold text-gray-900">
        Reminders
      </h2>
      <hr className="mt-3" />
      {reminders.length > 0 ? (
        <div>
          {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="flex gap-2 items-start justify-between py-4 last:pb-0 border-b border-gray-200 last:border-none"
              >
                <div className="flex gap-2 items-start">
                  <div>{reminder.icon}</div>
                  <div className="flex items-start flex-col">
                    <h3 className="font-semibold leading-6 text-sm text-blue-500">
                      {reminder.title}
                    </h3>
                    <p className="text-xs leading-[100%] text-blue-300">
                      {reminder.description}
                    </p>
                    <div className="flex items-center">
                      <Button
                        className="text-xs py-1 px-5 !min-w-max h-9 w-24 !leading-5 !mt-4 ml-0"
                        onClick={() => handleRoute(reminder.key as string)}
                        title={reminder.buttonText}
                      />
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleDelete(reminder.key)}
                  startIcon={<DeleteIcon className="w-4 h-4" />}
                  variant="ghost"
                  className="w-max p-0 mt-3"
                />
              </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 pt-3">
          <div className="flex flex-col gap-5">
            <NoReminders />
            <p className="text-h9 2xl:text-scaled-h9 max-w-40 text-center text-black-400 mx-auto">
              All caught up on reminders today{' '}
            </p>
          </div>
          <Button
            title="Browse Profiles"
            className="text-sm h-9 !min-w-36 3xl:!min-w-40 w-max m-0"
            onClick={() =>
              router.push(
                '/profile-search/search-results?searchQuery=&city=&profileType=1'
              )
            }
          />
        </div>
      )}
    </div>
  );
};

export default Reminders;

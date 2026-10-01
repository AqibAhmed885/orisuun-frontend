import MessageOverviewCard from '@/components/cards/message-overview-card';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiEndpoint } from '@/utils/utils';
import Accordion from '@/components/ui/accordian';
import NoChat from '@/icons/feeds/no-chat';
import Button from '@/components/ui/button';
import { AccordianSkeletonList } from '@/components/feed-card-skeleton/accordianSkeleton';
import { useRouter } from 'next/navigation';
import { getActiveChats } from '../../../../../api/dashboard/dashboard'
const RecentChats = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const senderId =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));
  const [chats, setChats] = useState([]);
  const fetchChats = async () => {
    try {
      setLoading(true);
      const result = await getActiveChats(senderId.Id);
      setChats(result);
    } catch (error) {
      setChats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <Accordion
      title="Recent Chats"
      bodyClasses={`text-gray-700 ${loading && '!px-0'}`}
      headerClasses={`${loading && '!px-4'}`}
      className={`${chats.length > 0 && '!pb-4'} ${loading && '!px-0'}`}
    >
      {loading ? (
        <AccordianSkeletonList />
      ) : chats?.length > 0 ? (
        <div className="max-h-64 flex flex-col gap-4 overflow-y-scroll hide-scrollbar">
          {chats?.map((data, index) => (
            <div key={index}>
              <MessageOverviewCard
                image={
                  !!data?.ReceiverProfileImage
                    ? data?.ReceiverProfileImage
                    : 'https://orisuundocumentsdev.blob.core.windows.net/user-profile/defaultuser.png'
                }
                name={data?.FullName}
                message={data?.Message}
                TimeStatus={data?.TimeStatus}
                HubId={data?.HubId}
                chatDetails={data}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 pt-3">
          <div className="flex flex-col gap-5">
            <NoChat className=' 3xl:w-36 3xl:h-36' />
            <p className="text-h9 2xl:text-scaled-h9 max-w-36 text-center text-[#393939] mx-auto">
              Your recent chats will appear here
            </p>
          </div>
          <Button
            title="Let's Get Talking"
            className="text-sm h-9 !min-w-36 3xl:!min-w-40 w-max m-0"
            onClick={() => router.push('/chats')}
          />
        </div>
      )}
    </Accordion>
  );
};

export default RecentChats;

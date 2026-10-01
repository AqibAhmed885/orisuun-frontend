'use client';
import React, { useState, useEffect } from 'react';
import UniversalChatDetail from './components/universal-chat-detail';
import { useSelector } from 'react-redux';
import UniversalMemberList from './components/universalMemberList';


const Universal: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [replyingTo, setReplyingTo] = useState<any | undefined>(undefined);
  const userId = useSelector((state: any) => state.user?.currentUser?.UserId || state.auth?.user?.id || '');

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleSendMessage = async (message: any) => {
    // Implement your message sending logic here
  };

  // const handleSelectChat = (chat: any) => {
  //   setSelectedChat(chat);
  // };

  return (
    <div className="w-full flex flex-row h-[calc(100vh-40px)] lg:h-[100vh] overflow-hidden gap-6 md:p-6  relative">
      {/* Mobile: show only list if no selection */}
      {isMobile ? (
        <>
          {!selectedChat ? (
            <div className="w-full">
              <UniversalMemberList communityId='5c2be789-4a31-494a-910a-52b8e30ad435' />
            </div>
          ) : (
            <div className="w-full">
              <button
                onClick={() => setSelectedChat(null)}
                className="mb-4 px-3 py-1 rounded-md border hover:bg-gray-50"
              >
                Back
              </button>
              <UniversalChatDetail
                selectedPerson={selectedChat}
                onSend={handleSendMessage}
                currentUserId={userId}
                replyingTo={replyingTo}
                onReply={setReplyingTo}
              />
            </div>
          )}
        </>
      ) : (
        // Desktop: show all panes
        <>

          <div className="flex-1 flex flex-col">
            <UniversalChatDetail
              onSend={handleSendMessage}
              currentUserId={userId}
              communityId='5c2be789-4a31-494a-910a-52b8e30ad435'
              replyingTo={replyingTo}
              onReply={setReplyingTo}
            />
          </div>
          <div className="md:block md:w-[40%] lg:w-[24rem] 2k:max-w-[550px]">
            <UniversalMemberList communityId='5c2be789-4a31-494a-910a-52b8e30ad435' />
          </div>

        </>
      )}
    </div>
  );
};

export default Universal;
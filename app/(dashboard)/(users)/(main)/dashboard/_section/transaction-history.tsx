import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';

import escrow from '@/public/images/vector/escrow.svg';
import Tag from '@/components/ui/tag';
import { useSelector } from 'react-redux';
import { RootState } from '@/data/store';
import { escrowTransactionHistoryList } from '@/server-actions/dashboard';
import moment from 'moment';

const TransactionHistory = ({ isTitle = false }) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [data, setData] = useState([]);

  const fetchEscrowTransactionHistory = useCallback(async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const response = await escrowTransactionHistoryList(userData.Id);
      if (response.success) {
        setData(response.data)
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {

    fetchEscrowTransactionHistory();

  }, [fetchEscrowTransactionHistory]);

  return (
    <div className={`${isTitle ? 'w-full ' : ''}shadow-custom-combined border border-[#E3E3E2] rounded-xl  h-[332px] 2xl:h-[calc(332px*var(--scale-factor))] flex flex-col`}>
      {!isTitle && <h6 className="text-h6 2xl:text-scaled-h6 text-blue-500 font-semibold mb-4 pt-4 px-4">
        Escrow Status and Transaction History
      </h6>}

      <div className="flex flex-col flex-grow overflow-hidden pb-4">
        <div className="grid grid-cols-10 bg-omblue-25">
          <div className="col-span-2 p-3 text-blue-500 text-h9 2xl:text-scaled-h10 font-semibold">
            Profile
          </div>
          <div className="col-span-3 p-3 text-blue-500 text-h9 2xl:text-scaled-h10 font-semibold">
            Services
          </div>
          <div className="col-span-2 p-3 text-blue-500 text-h9 2xl:text-scaled-h10 font-semibold">
            Date and Time
          </div>
          <div className="col-span-1 p-3 text-blue-500 text-h9 2xl:text-scaled-h10 font-semibold">
            Amount
          </div>
          <div className="col-span-2 p-3 text-blue-500 text-h9 2xl:text-scaled-h10 font-semibold">
            Status
          </div>
        </div>

        {data && data.length > 0 ? (
          <div className="overflow-y-scroll hide-scrollbar">
            {data.map((data, index) => (
              <div
                key={index}
                className="grid grid-cols-10 border-b border-grey-600"
              >
                <div className="col-span-2 p-3 text-h10 2xl:text-scaled-h10 font-medium flex items-center text-black-500">
                  <Image
                    src={data?.ProfilePicture ||'https://orisuundocumentsdev.blob.core.windows.net/user-profile/defaultuser.png'}
                    alt={data.ProfilePicture}
                    width={36}
                    height={36}
                    className="rounded-full profile-image w-9 h-9 me-2 object-cover"
                  />
                  {data?.ProfileType}
                </div>
                <div className="col-span-3 text-h10 2xl:text-scaled-h10 font-medium flex items-center p-3 text-black-500">
                  {data?.Service}
                </div>
                <div className="col-span-2 p-3 text-h10 2xl:text-scaled-h10 font-medium flex items-center text-black-500">
                  {moment(data?.CreatedDate).format('DD MMM, YYYY hh:mm a')}
                </div>
                <div className="col-span-1 p-3 text-h10 2xl:text-scaled-h10 font-semibold text-olblue-500">
                  ${data?.Amount}
                </div>
                <div className="col-span-2 p-3 text-h10 2xl:text-scaled-h10 font-semibold text-black-500">
                  <Tag text={data?.Status} status={data?.Status == "Paid" ? "fulfilled" : data?.Status == "Funds released" ? 'pending' : 'processing'} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-4">
              <Image
                src={escrow}
                alt="escrow"
                width={32}
                height={32}
                className="mx-auto 2xl:w-scaled-4 2xl:h-scaled-4 xs:w-10 xs:h-10"
              />
              <p className="text-h10 2xl:text-scaled-h10 font-medium text-blue-400 mx-auto">
                No recent transaction found.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
'use client';

import { ToastContainer, Slide } from 'react-toastify';
import LoadingState from './daily-live-room/LoadingState';
import ErrorState from './daily-live-room/ErrorState';
import DailyLiveRoomShell from './daily-live-room/DailyLiveRoomShell';
import useDailyLiveRoom from './daily-live-room/useDailyLiveRoom';
import type { DailyLiveRoomProps } from './daily-live-room/types';

export default function DailyLiveRoom(props: DailyLiveRoomProps) {
  const vm = useDailyLiveRoom(props);

  if (vm.bookingLoading && !vm.bookingError) {
    return (
      <>
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          transition={Slide}
        />
        <LoadingState theme={vm.theme} />
      </>
    );
  }

  if (vm.bookingError) {
    return (
      <>
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          transition={Slide}
        />
        <ErrorState theme={vm.theme} title="We could not open this live room." message={vm.bookingError} />
      </>
    );
  }

  return <DailyLiveRoomShell {...vm} />;
}

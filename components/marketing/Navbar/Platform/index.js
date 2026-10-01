import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Dialog,
  DialogPanel,
} from '@headlessui/react';
import clsx from 'clsx';
import Image from 'next/image';
import MemberType from './MemberType';
import ByFeature from './ByFeature';
import Play from '../../../../public/images/play.png';
import DemoEmbed from '../../DemoEmbed';
import { useState, useEffect, useRef } from 'react';

const Platform = ({ closePopover }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldOpenDialog, setShouldOpenDialog] = useState(false);

  useEffect(() => {
    if (shouldOpenDialog) {
      setIsOpen(true);
    }
  }, [shouldOpenDialog]);

  //  const handleWatchDemoClick = () => {
  //    setShouldOpenDialog(true);
  //  };

  const handleWatchDemoClick = () => {
    setShouldOpenDialog(false);
    setTimeout(() => {
      setShouldOpenDialog(true);
    }, 10);
  };

  const handleClose = () => {
    setIsOpen(false);
    setShouldOpenDialog(false);
  };

  const handleSubmenuClick = () => {
    if (closePopover) {
      closePopover(); 
    }
  };

  const PromoPanel = () => (
    <div className="relative w-full">
      <div className="bg-[url('/icons/mega-manu1.svg')] bg-contain bg-no-repeat bg-top mb-8 rounded-xl w-full aspect-[346/590] min-h-[420px]" />
      <div className="absolute top-10 text-center flex items-center flex-col right-0 left-0 px-4 z-30">
        <h1 className='text-lg font-bold text-white'>Learn more about Orisuun!</h1>
        <p className='text-white w-56 mx-auto'>See our growth platform in action and how it can work for you!</p>

        <button
          onClick={handleWatchDemoClick}
          className=" px-3 py-[10px] mt-3 flex items-center gap-2 z-30 rounded-xl cursor-pointer border border-white"
        >
          <p className="text-sm font-semibold text-white">Watch Demo</p>
          <div className="py-[2px]">
            <Image
              className=""
              src={Play}
              width={16}
              height={16}
              alt="play"
            />
          </div>
        </button>
      </div>
     
    </div>
  );

  return (
    <div
      className={` relative focus:outline-none ${
        isOpen ? ' h-[calc(100vh-100px)] z-50 overflow-hidden ' : ''
      }`}
    >
      <TabGroup defaultIndex={0} className="flex gap-8 focus:outline-none">
        <TabList className="flex flex-col gap-[10px]">
          <Tab className="focus:outline-none">
            {({ hover, selected }) => (
              <div
                className={clsx(
                  'flex items-center justify-between focus:outline-none data-[focus]:outline-white outline-none w-[195px] py-2.5 px-3',
                  selected && 'bg-[#F0F7FD] rounded-lg',
                  hover && 'bg-[#F0F7FD]'
                )}
              >
                <p className="text-blue-strong text-[15px] font-semibold">
                  By member type
                </p>
                {selected && (
                  <Image
                    className=""
                    src="/icons/right.svg"
                    width={22}
                    height={22}
                    alt="dropdown"
                  />
                )}
              </div>
            )}
          </Tab>
          <Tab className="focus:outline-none">
            {({ hover, selected }) => (
              <div
                className={clsx(
                  'flex items-center justify-between w-[195px] py-2.5 px-3',
                  selected && 'bg-[#F0F7FD] rounded-lg',
                  hover && 'bg-[#F0F7FD] rounded-lg'
                )}
              >
                <p className="text-blue-strong font-semibold text-[15px]">
                  By feature & function
                </p>
                {selected && (
                  <Image
                    className=""
                    src="/icons/right.svg"
                    width={22}
                    height={22}
                    alt="dropdown"
                  />
                )}
              </div>
            )}
          </Tab>
        </TabList>
        <TabPanels className="w-full">
          <TabPanel className="w-full grid grid-cols-3 gap-12 relative h-full">
            <div className="col-span-2">
              <MemberType closePopover={closePopover} />
            </div>
            {/* <Image className="rounded-xl h-[calc(100%-20px)]" src="/icons/mega-manu1.svg" width={400} height={400} alt="platform"  /> */}
            <PromoPanel />
          </TabPanel>

          <TabPanel className="w-full grid grid-cols-3 gap-12 relative h-full">
            <div className="col-span-2">
              <ByFeature closePopover={closePopover} />
            </div>
            <PromoPanel />
          </TabPanel>
        </TabPanels>
      </TabGroup>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-[999]"
      >
        <div className="fixed inset-0 flex w-screen bg-[#111] bg-opacity-20 items-center justify-center ">
          <DialogPanel className="space-y-4">
            <div className="w-[925px] 2xl:w-[1200px] 2k:w-[1300px] max-w-[90vw] rounded-xl overflow-hidden">
              <DemoEmbed />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export const DemoVideoDialog = ({ isOpen, handleClose }) => {
  const dialogRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, handleClose]);

  return (
    // isOpen && (
    <div
      open={isOpen}
      onClose={handleClose}
      on
      className="fixed inset-0 flex w-screen h-full backdrop-blur-lg bg-[#111] bg-opacity-60 items-center justify-center z-50"
    >
      <div ref={dialogRef} className="space-y-4 z-50">
        <div className="w-[925px] 2xl:w-[1200px] 2k:w-[1300px] max-w-[90vw] rounded-xl overflow-hidden">
          <DemoEmbed />
        </div>
      </div>
    </div>
    // </div>
    // <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
    //   <div className="fixed inset-0 flex w-screen bg-[#111] bg-opacity-80 items-center justify-center ">
    //     <DialogPanel className="space-y-4">
    //       <div className="w-[925px] 2xl:w-[1200px] 2k:w-[1300px] max-w-[90vw] rounded-xl overflow-hidden">
    //         <DemoEmbed />
    //       </div>
    //     </DialogPanel>
    //   </div>
    // </Dialog>
    // )
  );
};

export default Platform;

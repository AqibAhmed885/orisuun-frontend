"use client";

import {
  Dialog,
  DialogPanel,
} from "@headlessui/react";
import Image from "next/image";
import { Suspense, useState } from 'react';

import { useJoinContext } from './context';
import { PaymentMethod, Profile } from "../../../app/(dashboard)/(auth)/(account)/signup/components/index";

export const JoinModal = () => {
  const { openJoin, setOpenJoin } = useJoinContext();
  const [page, setPage] = useState(0);
  return (
    <>
      <Dialog
        open={openJoin}
        onClose={() => setOpenJoin(false)}
        className="relative z-50 w-full"
      >
        <div className="fixed inset-0 flex w-full items-center justify-center p-4">
          <DialogPanel className="w-full h-full overflow-y-scroll space-y-4 border bg-white py-12">
            <div className="w-full relative">
              <div className="w-full py-8 h-full overflow-y-scroll hide-scrollbar">
                <div className="w-full lg:w-[60%]">
                  <header className="pb-16 w-[85%] md:min-w-[490px] md:max-w-[60%] mx-auto">
                    <Image
                      onClick={() => setOpenJoin(false)}
                      src="/logo.svg"
                      className=" cursor-pointer"
                      width={150}
                      height={55}
                      alt="logo"
                    />
                  </header>
                  <Suspense>
                    <section className="w-[85%] md:min-w-[490px] md:max-w-[60%] mx-auto ">
                      {page === 0 && <Profile setPage={setPage} />}
                      {page === 1 && <PaymentMethod />}
                    </section>
                  </Suspense>
                </div>
              </div>
              <div className="absolute hidden lg:block z-[50] bg-sign-up bg-no-repeat bg-cover bg-center h-full w-[40%] top-0 right-0" />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

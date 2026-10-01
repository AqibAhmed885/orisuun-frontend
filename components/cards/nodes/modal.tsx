import { useCardsNodesSectionsOpen } from '@/components/cards/nodes/sections/context/open';
import clsx from 'clsx';
import { HTMLMotionProps, motion } from 'framer-motion';
import { FC } from 'react';
import Image from 'next/image';
import { useFreezeScrollBar } from '@/components/cards/nodes/use-freeze-scroll';
import { ANIMATION_INITIAL_DURATION } from '@/components/cards/nodes/constants';
import { UsersTags } from '../../../data/marketing/users';
import Link from 'next/link';

type TProps = { onClose?: any; src: string } & HTMLMotionProps<'div'>;
export const CardsNodesModal: FC<TProps> = ({ src, onClose, ...props }) => {
  const open = useCardsNodesSectionsOpen();
  const key = open.key;
  useFreezeScrollBar();
  const { tagTitle, tagDescription, tagRole, tagNote, img_pc, isReverse, link } = UsersTags.find((item) => item.key === key);
  return (
    <motion.div
      className={clsx(
        'z-20 flex items-center justify-center fixed inset-0 bg-white bg-opacity-10 backdrop-blur-lg cursor-pointer',
      )}
      onTap={() => {
        open.update(null);
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: ANIMATION_INITIAL_DURATION / 4, ease: 'linear' }}
      {...props}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          delay: ANIMATION_INITIAL_DURATION / 4,
          duration: ANIMATION_INITIAL_DURATION / 4,
          ease: 'linear',
        }}
      >
        <div
          className="shadow-md rounded-[8px] px-5 bg-white mt-[28px] mb-[16px] "
        >
          <div className={`p-[60px] flex justify-between ${isReverse ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="flex flex-col gap-8 max-w-[600px]">
              <div className="flex flex-col gap-6">
                <h1 className="font-semibold text-3xl leading-[22px] text-blue-strong">
                  {tagTitle}
                </h1>
                <p className="font-medium text-xl text-[#6e6e6e] text-left">
                  {tagDescription}
                </p>
              </div>
              {tagNote.length > 0 && (
                <div className="flex flex-col space-y-5 mt-5">
                  {tagNote.map((note, index) => {
                    return (
                      <div
                        key={index}
                        className="bg-[#F8F8F8]  py-2 px-3 rounded-lg"
                      >
                        <p className="text-[#5C5C5C] text-sm leading-[18.2px] font-medium">
                          {note}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="flex flex-col gap-6">
                <h2 className="text-blue-strong font-semibold text-xl">
                  Role on Orisuun
                </h2>
                <div className="flex flex-col gap-5">
                  {tagRole.map((role, index) => {
                    return (
                      <div
                        key={index}
                        className="flex items-start border-l border-[#6e6e6e] "
                      >
                        <div className="max-h-fit">
                          <p className="text-gray-600 text-xl font-medium pl-5">
                            {role}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <Link href={`/${link}`} className="text-[18px] text-[#2357C6]">Learn More &gt;</Link>
            </div>
            <Image
              src={img_pc}
              width={580}
              height={596}
              alt={`${tagTitle} image`}
              className={`w-[538px] pb-4`}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

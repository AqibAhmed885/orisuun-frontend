'use client';
import Image from 'next/image';
import { USER_KEYS } from '@/components/cards/nodes/sections/constants';
import { resolveOpenSrc } from '@/components/cards/nodes/open';

import { UsersTags } from '../../../../../data/marketing/users';

const WhoUser = () => {
  return (
    <section className="md:px-4 lg:px-[80px] md:relative mt-[184px] ">
      <div className="text-center pb-[80px] hidden md:block">
        <div className="relative">
          {USER_KEYS.map((src, index) => (
            <div
              key={index}
              style={{
                top: String(130 + index * 6) + 'px',
              }}
              className={`sticky h-[859px] 3xl:h-[1024px] flex items-center justify-center small-500:w-[100vw] 2xl:pt-16 image-container`}
            >
              {index === 0 && (
                <>
                  <h3 className="text-blue-strong text-[40px] absolute top-[60px] font-semibold leading-[110%] mb-24">
                    Who&apos;s on Orisuun
                  </h3>
                  <div className="bg-[#F2F7FC] h-[859px] 2xl:h-[1024px] absolute -z-10  top-0  w-[100vw] !overflow-x-hidden  3xl:w-[1600px] 2k:w-[1800px]" />
                </>
              )}
              <Image
                src={resolveOpenSrc(src)}
                alt={`slide-image-${index + 1}`}
                className="w-full small-500:w-[90%] h-auto image hidden md:block"
                width={1280}
                height={580}
              />
            </div>
          ))}
        </div>
      </div>

      {/* mobile */}
      <div className="bg-[#F2F7FC] md:hidden px-5 pb-10">
        <h3 className="text-blue-strong font-semibold text-center text-[24px] leading-[28.8px] pt-10 pb-8">
          Who&apos;s on Orisuun
        </h3>
        {/* Mentor */}
        {/* {UsersTags.map((index, users) => {
          const { tagTitle, tagDescription, tagNote, tagRole, img } = users;
          return (
            <div
              key={index}
              className="shadow-md rounded-[8px] px-5 bg-white mt-[28px] mb-[16px]"
            >
              <div className="pt-7 ">
                <h1 className="font-semibold text-[20px] leading-[22px] text-blue-strong ">
                  {tagTitle}
                </h1>
                <p className="font-medium text-base text-[#6e6e6e] mt-3 text-left ">
                  {tagDescription}
                </p>
                <div className="bg-[#F8F8F8] my-5 py-2 px-3 rounded-lg">
                  <p className="text-[#5C5C5C] text-sm leading-[18.2px] font-medium">
                    {tagNote}
                  </p>
                </div>
                <div className="mt-8">
                  <h2 className="text-blue-strong font-semibold text-base leading-[20.8px] ">
                    Role on Orisuun
                  </h2>

                  <div className="flex gap-3 mt-5">
                    <div className="border-l-[1px] border-[#6E6E6E] max-h-[72px]" />
                    <p className="text-[#6e6e6e] text-base font-medium  pb-5 ">
                      {tagRole}
                    </p>
                  </div>

                  <div className="w-full h-full">
                    <Image
                      src={img}
                      alt="image-four-mobile"
                      layout="responsive"
                      width={248}
                      height={264}
                      objectFit="cover"
                      className="w-full h-full pb-4"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })} */}

        {UsersTags.map((users, index) => {
          const { tagTitle, tagDescription, tagNote, tagRole, img, btnTags } =
            users;
          return (
            <div
              key={index}
              className="shadow-md rounded-[8px] px-5 bg-white mt-[28px] mb-[16px]"
            >
              <div className=" pt-7">
                {btnTags.length > 0 && (
                  <div className=" space-y-2">
                    {btnTags.map((btnTag, btnIndex) => (
                      <button
                        key={btnIndex}
                        className={`block px-3 py-1 rounded-[30px] font-medium text-[14px] leading-[16px] text-left  ${btnIndex === 0
                          ? 'bg-[#F2FCF8] text-[#198754] border border-[#B8DACA]'
                          : btnIndex === 1
                            ? 'bg-[#F2F7FC] text-[#2C57A4] border border-[#ADCFF5]'
                            : 'bg-[#FFF7E2] text-[#A57206] border border-[#FAE9D5]'
                          }`}
                      >
                        {btnTag}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4">
                <h1 className="font-semibold text-[20px] leading-[22px] text-blue-strong">
                  {tagTitle}
                </h1>
                <p className="font-medium text-base text-[#6e6e6e] mt-3 text-left">
                  {tagDescription}
                </p>
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
                <div className="mt-8">
                  <h2 className="text-blue-strong font-semibold text-base leading-[20.8px]">
                    Role on Orisuun
                  </h2>
                  <div className="flex flex-col gap-3 mt-5">
                    {tagRole.map((role, index) => {
                      return (
                        <div
                          key={index}
                          className="flex items-start border-l border-[#6e6e6e] "
                        >
                          <div className="max-h-fit ">
                            <p className="text-gray-600 text-base font-medium  pl-2">
                              {role}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="w-full h-full">
                    <Image
                      src={img}
                      layout="responsive"
                      width={248}
                      height={264}
                      objectFit="cover"
                      alt={`${tagTitle} image`}
                      className={`w-full h-full pb-4 ${index === 5 ? '-mt-16' : ''
                        }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WhoUser;

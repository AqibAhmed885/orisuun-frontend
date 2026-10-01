'use client';
import { useEffect } from 'react';
import { usersTypes } from '../../../../../data/marketing';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { users } from '../../../../../data/marketing/users';
import img from '../../../../../public/userTypes/images/experts.png'
export const UserSection2 = ({ userType }) => {
  useEffect(() => {
    AOS.init({
      duration: 1500,
      once: false, // Override global setting to not animate only once
    });
    AOS.refresh(); // Refresh AOS to apply new settings
  }, []);
  const imgSrc = users.includes(userType)
    ? `public/userTypes/images/${userType}.png`
    : '/images/blank.png';

  return (
    <section className="max-w-[1440px] 3xl:max-w-[1600px] 2k:max-w-[1800px]'} w-full mx-auto md:grid md:grid-cols-2 items-center p-4 py-[60px] lg:px-16 mt-[801px] 2xl:mt-[820px] flex flex-col flex-col-reverse">
      <Image
        src={imgSrc}
        alt="image"
        className="mx-auto lg:mx-0"
        width={515}
        height={564}
      />
      <div className="md:space-y-10 space-y-6 text-center lg:text-start">
        <h3 className="text-blue-strong sm:text-[40px] text-[24px] leading-[44px] font-semibold">
          Orisuun and{' '}
          <span className="capitalize">{userType.replaceAll('-', ' ')}</span>
        </h3>
        {usersTypes.map((item, i) => (
          <div key={i} className="md:space-y-8 space-y-5">
            {item?.userType === userType && (
              <>
                <p
                  className="text-xl font-medium text-blu-ray-300"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  {item?.description1}
                </p>
                <p
                  className="text-xl font-medium text-blu-ray-300"
                  data-aos="fade-up"
                  data-aos-delay="500"
                >
                  {item?.description2}
                </p>
                <p
                  className="text-xl font-medium text-blu-ray-300"
                  data-aos="fade-up"
                  data-aos-delay="700"
                >
                  {item?.description3}
                </p>
                <p
                  className="text-xl font-medium text-blu-ray-300"
                  data-aos="fade-up"
                  data-aos-delay="900"
                >
                  {item?.description4}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

import { usersTypes } from '../../../../../data/marketing';
import HeroBg from '../../../../public/userTypes/hero-background.png';

export const UserHero = ({ userType }) => {
  return (
    <section className="relative ">
      <div
        className="h-[801px] 2xl:h-[820px]  2xl:bg-bottom absolute w-full bg-center bg-cover -top-[100px] flex justify-center items-center"
        style={{ backgroundImage: `url(${HeroBg.src})` }}
      >
        <div className="w-[1097px] h-[300px] relative">
          <div className="absolute inset-0 bg-[#429DCF] opacity-80 blur-custom-blur"></div>
          <div className="relative flex flex-col gap-[32px] text-white  rounded bg-opacity-70">
            <p className="text-center sm:text-[23px] text-[18px] font-semibold leading-150 ">
              You&apos;re in the right place!
            </p>
            <div className="pl-[66px] pr-[65px]">
              {usersTypes.map((item, i) => (
                <div key={i}>
                  {item?.userType === userType && (
                    <>
                      <p className="w-full sm:text-[64px] text-[32px] font-semibold text-center leading-110">
                        {item?.getStarted?.details}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

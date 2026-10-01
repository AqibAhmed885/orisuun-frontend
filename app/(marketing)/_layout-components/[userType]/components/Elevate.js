import { Button } from '../../../../../components/marketing';
import { usersTypes } from '../../../../../data/marketing';
import Link from 'next/link';

export const Elevate = ({ userType }) => {
  return (
    <section className=" p-4 py-16 lg:px-16">
      <div className="bg-userType lg:min-h-[322px] rounded-[20px] py-8 small-500:py-6 small-500:px-4 lg:py-0 small-500:flex small-500:flex-col small-500:justify-between small-500:gap-12">
        <div className="sm:bg-[url('/userTypes/bg/arc2.svg')] rounded-[20px] h-full bg-no-repeat bg-right-bottom ">
          <div className="sm:bg-[url('/userTypes/bg/spike2.svg')] rounded-[20px] h-full bg-no-repeat bg-left flex flex-col lg:flex-row lg:items-center justify-start text-center lg:text-start lg:justify-between sm:p-4  lg:p-16">
            <div className="sm:space-y-4 w-full lg:max-w-[70%] small-500:flex flex-col items-start ">
              <p className="text-white uppercase sm:text-[16px] text-[10px] font-semibold ">
                Get Started
              </p>
              {usersTypes.map((item, i) => (
                <div key={i} className="space-y-4">
                  {item?.userType === userType && (
                    <>
                      <h5 className="text-white sm:text-[40px] text-[23px] sm:leading-[44px] font-semibold small-500:text-left">
                        {item?.getStarted?.heading}
                      </h5>
                      <p className="lg:max-w-[500px] w-full text-white sm:text-[20px] text-[14px] sm:leading-[30px] font-medium small-500:text-left">
                        {item?.getStarted?.details}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="small-500:hidden block mt-[48px] lg:mt-0 ">
              <Button className="bg-white text-blue-strong">
                <Link href="/signup">Start building the future</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="small-500:flex w-full self-end justify-self-end hidden">
          <Button className="bg-white text-blue-strong small-500:flex flex-1">
            <Link href="/signup">Start building the future</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

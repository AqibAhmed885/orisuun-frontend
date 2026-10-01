import { AccessAccord } from '../Accordion';
import Link from 'next/link';

const Access = () => {
  return (
    <section
      className="mt-[120px] md:mt-[100px] bg-[#F2F7FC] pt-[100px] pb-[96px] md:px-20 px-4 mb-[120px] md:mb-[109px]"
      // style={{ boxShadow: '0px 4px 13.9px 0px rgba(0, 0, 0, 0.10)' }}
    >
      <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-[134px] ">
        <div>
          <h3 className="text-blue-strong text-[24px] leading-[28.8px] md:text-[40px] font-semibold md:leading-[110%] max-w-[522px]">
            We want to be as transparent as possible.{' '}
          </h3>
          <p className="mt-6 text-[#5B657B] text-[20px] font-[450px] leading-[150%] max-w-[309px]">
            Here you can find answers to our most frequently asked questions
          </p>
          <p className="mt-6 text-[#5B657B] text-[20px] font-[450px] leading-[150%] max-w-[355px]">
            If you have other questions - please, contact us by email:
            <Link
              href="mailto:hello@orisuun.com"
              className="underline decoration-[#5B657B] underline-offset-[3px] ml-1"
            >
              hello@orisuun.com
            </Link>
          </p>
        </div>
        <div className=" md:w-[624px]">
          <AccessAccord />
        </div>
      </div>
    </section>
  );
};
export default Access;

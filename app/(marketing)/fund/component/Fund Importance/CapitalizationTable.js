import { TableHead } from '../../component/tableHead';
const firstLevel = [
  {
    text: '50% ($0)',
    bg: 'bg-[#B2B3B32B]',
  },
  {
    text: '45% ($0)',
    bg: 'bg-[#B2B3B314]',
  },
  {
    text: '30% ($600K)',
    bg: 'bg-[#B2B3B32B]',
  },
  {
    text: '15% ($1.2M)',
    bg: 'bg-[#B2B3B314]',
  },
  {
    text: '',
    bg: 'bg-[#B2B3B32B]',
  },
];

const secondLevel = [
  {
    text: '',
    bg: 'bg-[#B2B3B32B]',
  },
  {
    text: '10% ($0)',
    bg: 'bg-[#B2B3B314]',
  },
  {
    text: '10% ($200K)',
    bg: 'bg-[#B2B3B32B]',
  },
  {
    text: '5% ($400K)',
    bg: 'bg-[#B2B3B314]',
  },
  {
    text: '',
    bg: 'bg-[#B2B3B32B]',
  },
];

const thirdLevel = [
  {
    text: '',
    bg: 'bg-[#B2B3B32B]',
  },
  {
    text: '',
    bg: 'bg-[#B2B3B314]',
  },
  {
    text: '15% ($300K)',
    bg: 'bg-[#B2B3B32B]',
  },
  {
    text: '6.5% ($520K)',
    bg: 'bg-[#B2B3B314]',
  },
  {
    text: '',
    bg: 'bg-[#B2B3B32B]',
  },
];

const fourthLevel = [
  {
    text: '',
    bg: 'bg-[#B2B3B32B]',
  },
  {
    text: '',
    bg: 'bg-[#B2B3B314]',
  },
  {
    text: '15% ($300K)',
    bg: 'bg-[#B2B3B32B]',
  },
  {
    text: '8.5% ($680K)',
    bg: 'bg-[#B2B3B314]',
  },
  {
    text: '8.5%',
    bg: 'bg-[#B2B3B32B]',
  },
];

const fifthLevel = [
  {
    text: '',
    bg: 'bg-[#B2B3B32B]',
  },
  {
    text: '',
    bg: 'bg-[#B2B3B314]',
  },
  {
    text: '',
    bg: 'bg-[#B2B3B32B]',
  },
  {
    text: '10% ($800K)',
    bg: 'bg-[#B2B3B314]',
  },
  {
    text: '',
    bg: 'bg-[#B2B3B32B]',
  },
];

const sixthLevel = [
  {
    text: '',
    bg: 'bg-[#B2B3B32B]',
  },
  {
    text: '',
    bg: 'bg-[#B2B3B314]',
  },
  {
    text: '',
    bg: 'bg-[#B2B3B32B]',
  },
  {
    text: '15% ($1.2M)',
    bg: 'bg-[#B2B3B314]',
  },
  {
    text: '',
    bg: 'bg-[#B2B3B32B]',
  },
];

const seventhLevel = [
  {
    text: '',
    bg: 'bg-[#B2B3B32B]',
  },
  {
    text: '',
    bg: 'bg-[#B2B3B314]',
  },
  {
    text: '',
    bg: 'bg-[#B2B3B32B]',
  },
  {
    text: '25% ($2M)',
    bg: 'bg-[#B2B3B314]',
  },
  {
    text: '',
    bg: 'bg-[#B2B3B32B]',
  },
];

const lastLevel = [
  {
    text: '',
    bg: 'bg-[#B2B3B32B]',
  },
  {
    text: '',
    bg: 'bg-[#B2B3B314]',
  },
  {
    text: '',
    bg: 'bg-[#B2B3B32B]',
  },
  {
    text: '',
    bg: 'bg-[#B2B3B314]',
  },
  {
    text: '91.5%',
    bg: 'bg-[#B2B3B32B]',
  },
];

export const CapitalizationTable = () => {
  return (
    <div className="h-[610px] flex flex-col md:w-[1037px] small-500:w-[850px] xl:w-full small-500:h-full ">
      {/* Top */}
      <TableHead className={`md:w-[130px]`} />
      {/* bottom */}
      <div className="h-[60px] w-full flex xl:gap-4 small-500:gap-2 small-500:h-[45px] border-b border-#E7E8EB ">
        <div className="md:w-[180px] px-3 py-[21.94px] flex justify-start items-center small-500:w-[120px] small-500:py-[12.5px]">
          <p className="text-[#3B4761] font-semibold leading-[20px] whitespace-nowrap md:text-[16px] small-500:text-[14px]">
            Founder One
          </p>
        </div>
        <div className="w-full grid grid-cols-5 xl:gap-4 md:gap-2">
          {firstLevel.map((item, index) => (
            <div
              key={index}
              className={`h-[60px] xl:w-[204px] flex justify-center items-center ${item.bg} small-500:w-[140px] small-500:h-[45px] md:w-full rounded-tl-xl rounded-tr-xl`}
            >
              <p
                className={`my-[25.6px] mx-[14.63px] text-center text-[#3B4761] text-[14px] font-medium leading-[18.2px] h-[18px]`}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="h-[60px] flex xl:gap-4 small-500:gap-2 small-500:h-[45px] border-b border-#E7E8EB ">
        <div className="md:w-[180px] px-3 py-[21.94px] flex justify-start items-center small-500:w-[120px] small-500:py-[12.5px]">
          <p className="text-[#3B4761] font-semibold leading-[20px] md:text-[16px] small-500:text-[14px]">
            Founder Two
          </p>
        </div>
        <div className="w-full grid grid-cols-5 xl:gap-4 md:gap-2">
          {firstLevel.map((item, index) => (
            <div
              key={index}
              className={`h-[60px] xl:w-[204px] flex justify-center items-center ${item.bg} small-500:w-[140px] small-500:h-[45px] md:w-full`}
            >
              <p
                className={`my-[25.6px] mx-[14.63px] text-center text-[#3B4761] text-[14px] font-medium leading-[18.2px] h-[18px]`}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="h-[60px] flex xl:gap-4 small-500:gap-2 small-500:h-[45px] border-b border-#E7E8EB ">
        <div className="md:w-[180px] px-3 py-[21.94px] flex justify-start items-center small-500:w-[120px] small-500:py-[12.5px]">
          <p className="text-[#3B4761] font-semibold leading-[20px] md:text-[16px] small-500:text-[14px]">
            Cousin
          </p>
        </div>
        <div className="w-full grid grid-cols-5 xl:gap-4 md:gap-2">
          {secondLevel.map((item, index) => (
            <div
              key={index}
              className={`h-[60px] xl:w-[204px] flex justify-center items-center ${item.bg} small-500:w-[140px] small-500:h-[45px] md:w-full`}
            >
              <p
                className={`my-[25.6px] mx-[14.63px] text-center text-[#3B4761] text-[14px] font-medium leading-[18.2px] h-[18px]`}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="h-[60px] flex xl:gap-4 small-500:gap-2 small-500:h-[45px] border-b border-#E7E8EB ">
        <div className="md:w-[180px] px-3 py-[21.94px] flex justify-start items-center small-500:w-[120px] small-500:py-[12.5px]">
          <p className="text-[#3B4761] w-full font-semibold leading-[20px] md:text-[16px] small-500:text-[13px] whitespace-nowrap">
            Angel Investor
          </p>
        </div>
        <div className="w-full grid grid-cols-5 xl:gap-4 md:gap-2">
          {thirdLevel.map((item, index) => (
            <div
              key={index}
              className={`h-[60px] xl:w-[204px] flex justify-center items-center ${item.bg} small-500:w-[140px] small-500:h-[45px] md:w-full`}
            >
              <p
                className={`my-[25.6px] mx-[14.63px] text-center text-[#3B4761] text-[14px] font-medium leading-[18.2px] h-[18px]`}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="h-[60px] flex xl:gap-4 small-500:gap-2 small-500:h-[45px] border-b border-#E7E8EB ">
        <div className="md:w-[180px] px-3 py-[21.94px] flex justify-start items-center small-500:w-[120px] small-500:py-[12.5px]">
          <p className="text-[#3B4761] font-semibold leading-[20px] md:text-[16px] small-500:text-[14px]">
            Employee Options
          </p>
        </div>
        <div className="w-full grid grid-cols-5 xl:gap-4 md:gap-2">
          {fourthLevel.map((item, index) => (
            <div
              key={index}
              className={`h-[60px] xl:w-[204px] flex justify-center items-center ${item.bg} small-500:w-[140px] small-500:h-[45px] md:w-full`}
            >
              <p
                className={`my-[25.6px] mx-[14.63px] text-center text-[#3B4761] text-[14px] font-medium leading-[18.2px] h-[18px]`}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="h-[60px] flex xl:gap-4 small-500:gap-2 small-500:h-[45px] border-b border-#E7E8EB ">
        <div className="md:w-[180px] px-3 py-[21.94px] flex justify-start items-center small-500:w-[120px] small-500:py-[12.5px]">
          <p className="text-[#3B4761] font-semibold leading-[20px] md:text-[16px] small-500:text-[14px]">
            VC One
          </p>
        </div>
        <div className="w-full grid grid-cols-5 xl:gap-4 md:gap-2">
          {fifthLevel.map((item, index) => (
            <div
              key={index}
              className={`h-[60px] xl:w-[204px] flex justify-center items-center ${item.bg} small-500:w-[140px] small-500:h-[45px] md:w-full`}
            >
              <p
                className={`my-[25.6px] mx-[14.63px] text-center text-[#3B4761] text-[14px] font-medium leading-[18.2px] h-[18px]`}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="h-[60px] flex xl:gap-4 small-500:gap-2 small-500:h-[45px] border-b border-#E7E8EB ">
        <div className="md:md:w-[180px] px-3 py-[21.94px] flex justify-start items-center small-500:w-[120px] small-500:py-[12.5px]">
          <p className="text-[#3B4761] font-semibold leading-[20px] md:text-[16px] small-500:text-[14px]">
            VC Two
          </p>
        </div>
        <div className="w-full grid grid-cols-5 xl:gap-4 md:gap-2">
          {sixthLevel.map((item, index) => (
            <div
              key={index}
              className={`h-[60px] xl:w-[204px] flex justify-center items-center ${item.bg} small-500:w-[140px] small-500:h-[45px] md:w-full`}
            >
              <p
                className={`my-[25.6px] mx-[14.63px] text-center text-[#3B4761] text-[14px] font-medium leading-[18.2px] h-[18px]`}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="h-[60px] flex xl:gap-4 small-500:gap-2 small-500:h-[45px] border-b border-#E7E8EB ">
        <div className="md:w-[180px] px-3 py-[21.94px] flex justify-start items-center small-500:w-[120px] small-500:py-[12.5px]">
          <p className="text-[#3B4761] font-semibold leading-[20px] md:text-[16px] small-500:text-[14px]">
            VC Three
          </p>
        </div>
        <div className="w-full grid grid-cols-5 xl:gap-4 md:gap-2">
          {seventhLevel.map((item, index) => (
            <div
              key={index}
              className={`h-[60px] xl:w-[204px] flex justify-center items-center ${item.bg} small-500:w-[140px] small-500:h-[45px] md:w-full`}
            >
              <p
                className={`my-[25.6px] mx-[14.63px] text-center text-[#3B4761] text-[14px] font-medium leading-[18.2px] h-[18px]`}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="h-[60px] flex xl:gap-4 small-500:gap-2 small-500:h-[45px]">
        <div className="md:w-[180px] px-3 py-[21.94px] flex justify-start items-center small-500:w-[120px] small-500:py-[12.5px]">
          <p className="text-[#3B4761] font-semibold leading-[20px] md:text-[16px] small-500:text-[14px]">
            Acquirer
          </p>
        </div>
        <div className="w-full grid grid-cols-5 xl:gap-4 md:gap-2">
          {lastLevel.map((item, index) => (
            <div
              key={index}
              className={`h-[60px] xl:w-[204px] flex justify-center items-center ${item.bg} small-500:w-[140px] small-500:h-[45px] md:w-full rounded-bl-xl rounded-br-xl`}
            >
              <p
                className={`my-[25.6px] mx-[14.63px] text-center text-[#3B4761] text-[14px] font-medium leading-[18.2px] `}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

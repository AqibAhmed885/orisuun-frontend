import { loading, loading1, loading2, loading3, loading4 } from '../loading';
import { TableHead } from '../tableHead';
const firstStageLevel = [
  {
    text: 'Concept',
    bg: 'bg-[#69B3E72B]',
  },
  {
    text: 'Pilot Launched',
    bg: 'bg-[#69B3E714]',
  },
  {
    text: 'Some Traction; Potential to Scale',
    bg: 'bg-[#69B3E72B]',
  },
  {
    text: 'Significant Traction; Actively Scaling',
    bg: 'bg-[#69B3E714]',
  },
  {
    text: 'Established Market Position',
    bg: 'bg-[#69B3E72B]',
  },
];

const secondStageLevel = [
  {
    text: loading1(),
    bg: 'bg-[#69B3E72B]',
  },
  {
    text: loading1(),
    bg: 'bg-[#69B3E714]',
  },
  {
    text: loading1(),
    bg: 'bg-[#69B3E72B]',
  },
  {
    text: loading2(),
    bg: 'bg-[#69B3E714]',
  },
  {
    text: loading3(),
    bg: 'bg-[#69B3E72B]',
  },
];

const thirdStageLevel = [
  {
    text: loading4(),
    bg: 'bg-[#69B3E72B]',
  },
  {
    text: loading4(),
    bg: 'bg-[#69B3E714]',
  },
  {
    text: loading3(),
    bg: 'bg-[#69B3E72B]',
  },
  {
    text: loading(),
    bg: 'bg-[#69B3E714]',
  },
  {
    text: loading1(),
    bg: 'bg-[#69B3E72B]',
  },
];

const fourthStageLevel = [
  {
    text: 'To get a prototype of pilot set up',
    bg: 'bg-[#69B3E72B]',
  },
  {
    text: 'Product development, marketing, and testing ',
    bg: 'bg-[#69B3E714]',
  },
  {
    text: 'Boosting sales, marketing, hiring, testing',
    bg: 'bg-[#69B3E72B]',
  },
  {
    text: 'Scaling',
    bg: 'bg-[#69B3E714]',
  },
  {
    text: 'Acquisition',
    bg: 'bg-[#69B3E72B]',
  },
];

const fifthStageLevel = [
  {
    text: "Dependent on one's own resources",
    bg: 'bg-[#69B3E72B]',
  },
  {
    text: "Dependent on one's network",
    bg: 'bg-[#69B3E714]',
  },
  {
    text: 'Can be a niche marketplace',
    bg: 'bg-[#69B3E72B]',
  },
  {
    text: 'Availability ebbs and flows with market conditions',
    bg: 'bg-[#69B3E714]',
  },
  {
    text: 'Availability ebbs and flows with market conditions',
    bg: 'bg-[#69B3E72B]',
  },
];

const lastStageLevel = [
  {
    text: 'Know-How, Time, and Effort',
    bg: 'bg-[#69B3E72B]',
  },
  {
    text: 'Suggestions, Leads, Introductions',
    bg: 'bg-[#69B3E714]',
  },
  {
    text: 'Expertise, Experience, Network',
    bg: 'bg-[#69B3E72B]',
  },
  {
    text: 'Employees, Infrastructure, Major Connections, Exposure',
    bg: 'bg-[#69B3E714]',
  },
  {
    text: 'Long-Term Management Capabilities',
    bg: 'bg-[#69B3E72B]',
  },
];

export const FundStage = () => {
  return (
    <div className="h-[524px] w-full xl:px-20 md:px-6 small-500:px-4 mb-[150px] small-500:mb-[120px]">
      <div className="h-full flex flex-col gap-4 small-500:gap-[13px]">
        <div className="h-[48px] w-full flex justify-start items-center">
          <h2 className="text-blue-strong text-[32px] small-500:text-[20px] font-semibold leading-150">
            Stage Comparison
          </h2>
        </div>
        <section className="overflow-x-auto hide-scrollbar">
          <div className="w-full h-[460px] flex flex-col md:w-[1200px] small-500:w-[1060px] xl:w-full small-500:h-full">
            <TableHead className={`md:w-[200px]`} />
            {/* bottom */}
            <div className="h-[65px] w-full flex gap-5 border-b border-[#D5E8FA] small-500:gap-2">
              <div className="md:w-[180px] h-full px-3 py-[21.94px] flex justify-start items-center small-500:w-[120px] small-500:py-[12.5px]">
                <p className="text-[#3B4761] text-[16px] font-semibold leading-[20px] small-500:text-[13px]">
                  Business&apos;s Characteristics
                </p>
              </div>
              <div className="w-full grid grid-cols-5 gap-5 small-500:gap-2">
                {firstStageLevel.map((item, index) => (
                  <div
                    key={index}
                    className={`h-[65px] w-[204px] flex items-center ${item.bg} rounded-tl-xl rounded-tr-xl small-500:w-[180px]`}
                  >
                    <div
                      className={`my-[25.6px] mx-[14.63px] w-full flex justify-center items-center small-500:my-0 small-500:mx-0`}
                    >
                      <p
                        className={`text-center text-[#3B4761] text-[14px] font-medium leading-[18.2px] ${index === 2
                          ? `w-[104px] h-[36px]`
                          : index === 3
                            ? `w-[118px] h-[36px]`
                            : 'h-[18px]'
                          }`}
                      >
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-[65px] w-full flex gap-5 border-b border-[#D5E8FA] small-500:gap-2">
              <div className="w-[180px] h-full px-3 py-[21.94px] flex justify-start items-center small-500:w-[120px] small-500:py-[12.5px]">
                <p className="text-[#3B4761] text-[16px] font-semibold leading-[20px] small-500:text-[14px]">
                  Investment Risk
                </p>
              </div>
              <div className="w-full grid grid-cols-5 gap-5 small-500:gap-2">
                {secondStageLevel.map((item, index) => (
                  <div
                    key={index}
                    className={`h-[65px] w-[204px] flex items-center ${item.bg} small-500:w-[180px] `}
                  >
                    <div
                      className={`my-[25.6px] mx-[14.63px] w-full flex justify-center items-center`}
                    >
                      <div
                        className={`text-center text-[#3B4761] text-[14px] font-medium leading-[18.2px] h-[18px] flex justify-center items-center`}
                      >
                        {item.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-[65px] w-full flex gap-5 border-b border-[#D5E8FA] small-500:gap-2">
              <div className="w-[180px]  h-full px-3 py-[21.94px] flex justify-start items-center small-500:w-[120px] small-500:py-[12.5px]">
                <p className="text-[#3B4761] text-[16px] font-semibold leading-[20px] small-500:text-[14px]">
                  Investment Size
                </p>
              </div>
              <div className="w-full grid grid-cols-5 gap-5 small-500:gap-2">
                {thirdStageLevel.map((item, index) => (
                  <div
                    key={index}
                    className={`h-[65px] w-[204px] flex items-center ${item.bg} small-500:w-[180px]`}
                  >
                    <div
                      className={`my-[25.6px] mx-[14.63px] w-full flex justify-center items-center`}
                    >
                      <div
                        className={`text-center text-[#3B4761] text-[14px] font-medium leading-[18.2px] h-[18px] flex justify-center items-center`}
                      >
                        {item.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-[65px] w-full flex gap-5 border-b border-[#D5E8FA] small-500:gap-2">
              <div className="w-[180px] h-full px-3 py-[21.94px] flex justify-start items-center small-500:w-[120px] small-500:py-[12.5px]">
                <p className=" text-[#3B4761] text-[16px] font-semibold leading-[20px] small-500:text-[14px]">
                  Purpose
                </p>
              </div>
              <div className="w-full grid grid-cols-5 gap-5 small-500:gap-2">
                {fourthStageLevel.map((item, index) => (
                  <div
                    key={index}
                    className={`h-[65px] w-[204px] flex items-center ${item.bg} small-500:w-[180px]`}
                  >
                    <div
                      className={`my-[25.6px] mx-[14.63px] w-full flex justify-center items-center`}
                    >
                      <div
                        className={`text-center text-[#3B4761] text-[14px] font-medium leading-[18.2px] flex justify-center items-center ${index === 1 || index === 2
                          ? `w-[169px] h-[36px]`
                          : index === 0
                            ? `w-[162px] h-[36px]`
                            : `h-[18px]`
                          }`}
                      >
                        {item.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-[65px] w-full flex gap-5 border-b border-[#D5E8FA] small-500:gap-2">
              <div className="w-[180px] h-full px-3 py-[21.94px] flex justify-start items-center small-500:w-[120px] small-500:py-[12.5px]">
                <p className="text-[#3B4761] text-[16px] font-semibold leading-[20px] small-500:text-[14px]">
                  Availability
                </p>
              </div>
              <div className="w-full grid grid-cols-5 gap-5 small-500:gap-2">
                {fifthStageLevel.map((item, index) => (
                  <div
                    key={index}
                    className={`h-[65px] w-[204px] flex items-center ${item.bg} small-500:w-[180px]`}
                  >
                    <div
                      className={`my-[25.6px] mx-[14.63px] w-full flex justify-center items-center`}
                    >
                      <div
                        className={`text-center text-[#3B4761] text-[14px] font-medium leading-[18.2px] w-[162px] flex justify-center items-center ${index === 2 ? 'h-[18px]' : 'h-[36px]'
                          }`}
                      >
                        {item.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-[65px] w-full flex gap-5 small-500:h-[80px] small-500:gap-2">
              <div className="w-[180px] h-full px-3 py-[21.94px] flex justify-start items-center small-500:w-[120px] small-500:py-[12.5px]">
                <p className="text-[#3B4761] text-[16px] font-semibold leading-[20px] small-500:text-[14px] ">
                  Other Resources Provided
                </p>
              </div>
              <div className="w-full grid grid-cols-5 gap-5 small-500:gap-2">
                {lastStageLevel.map((item, index) => (
                  <div
                    key={index}
                    className={`h-[65px] w-[204px] flex  items-center ${item.bg} rounded-bl-xl rounded-br-xl small-500:w-[180px] small-500:h-[80px]`}
                  >
                    <div
                      className={`my-[25.6px] mx-[14.63px] w-full flex justify-center items-center`}
                    >
                      <div
                        className={`text-center text-[#3B4761] text-[14px] font-medium leading-[18.2px] w-[162px] flex  justify-center items-center ${index === 3 ? `h-[54px]` : `h-[36px]`
                          }`}
                      >
                        {item.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

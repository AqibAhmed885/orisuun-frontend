import { orderList, unorderedList } from "@/data/marketing/bussinessDiscount";

const HowItWorks: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full lg:w-auto xs:gap-2 md:!gap-[3.75rem] pb-20 pt-20 bg-[#F2F7FC]">
      <h2 className="xs:text-2xl md:!text-4xl text-blue-strong font-semibold">How it Works</h2>
      <div className="flex flex-wrap xs:gap-7 md:!gap-20 p-6">
        <div className="flex flex-col xs:gap-5 md:!gap-8 max-w-[480px]">
          <h4 className="xs:text-xl md:!text-2xl text-blue-strong font-semibold">
            Requirements
          </h4>
          <ol className="list-none flex flex-col xs:gap-5 md:!gap-6 leading-150 md:text-xl">
            {orderList.map((point, index) => (
              <li className="flex items-start gap-2 text-[#6E6E6E]" key={index}>
                <span className="font-semibold">{index + 1}</span>
                <span>{point}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex flex-col xs:gap-5 md:!gap-8 max-w-[480px]">
          <h4 className="xs:text-xl md:!text-2xl text-blue-strong font-semibold">
            Functionality Details
          </h4>
          <ul className="list-none leading-150 flex flex-col xs:gap-5 md:!gap-6 md:text-xl marker:text-[#5B657B]">
            {unorderedList.map((point, index) => (
              <li
                key={index}
                className="flex items-start gap-[5px] text-[#6E6E6E]"
              >
                <span className="font-semibold">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default HowItWorks;

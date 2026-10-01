import { orderList, unorderedList } from "@/data/marketing/discount";

const HowItWorks: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full lg:w-auto gap-[3.75rem] pb-20 pt-20 bg-[#F2F7FC]">
      <h2 className="text-4xl text-blue-strong font-semibold">How it Works</h2>
      <div className="flex flex-wrap gap-20 p-6">
        <div className="flex flex-col gap-8 max-w-[480px]">
          <h4 className="text-2xl text-blue-strong font-semibold">Requirements</h4>
          <ol className="list-decimal flex flex-col gap-6 leading-[150%] text-xl custom-order-list">
            {
              orderList.map((point, index) => (
                <li className="before:text-[#6E6E6E]" key={index}>{point}</li>
              ))
            }
          </ol>
        </div>
        <div className="flex flex-col gap-8 max-w-[480px]">
          <h4 className="text-2xl text-blue-strong font-semibold">Functionality Details</h4>
          <ul className="list-disc leading-[150%] flex flex-col gap-6 text-xl marker:text-[#5B657B]">
            {
              unorderedList.map((point, index) => (
                <li key={index}>{point}</li>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  );
};
export default HowItWorks;
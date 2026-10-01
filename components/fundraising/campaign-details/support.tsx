import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useState, useEffect } from 'react';

interface ISupportPorps {
  handleShowSupport: () => void;
  setAmount: (number) => void;
  amount: number;
  isPublic?: boolean;
}

const Support: React.FC<ISupportPorps> = ({
  handleShowSupport,
  setAmount,
  amount,
  isPublic,
}) => {
  return (
    <div className="shadow-custom overflow-hidden rounded">
      <div className="bg-lightBlueBg p-4">
        <h2 className="text-xl font-semibold text-blue-500 leading-[100%]">
          Support the Campaign
        </h2>
      </div>
      <div className="flex flex-col gap-6 p-4 border border-grey-600 rounded-b border-t-0">
        <p className="text-lg font-medium text-blue-300">
          Make a pledge without a reward
        </p>

        <div className="">
          <label
            htmlFor="pledgeAmount"
            className="block font-semibold text-black-500-custom"
          >
            Pledge amount
          </label>
          <div className="relative mt-2">
            <span className="absolute top-1/2 left-4 transform -translate-y-1/2 text-sm font-medium text-black-900 z-10">
              $
            </span>
            <Input
              type="number"
              id="pledgeAmount"
              className="w-full h-11 border border-black-200 font-medium text-sm pl-6 pr-8 rounded-md focus:outline-none"
              placeholder="2"
              onChange={(e) => {
                if (Number(e.target.value) > 0) {
                  setAmount(Number(e.target.value));
                }
              }}
              disabled={isPublic}
            />
            <span className="absolute top-1/2 right-4 transform -translate-y-1/2 text-sm font-medium text-black-100">
              USD
            </span>
          </div>
        </div>

        <p className=" text-h8 leading-[140%] text-blue-300">
          Give knowing that Orisuun charges the lowest fees (1%) of any
          crowdfunding organization, globally. After the bank processing fees,
          <strong>
            &nbsp;99% of your funds go directly to supporting this business!
          </strong>
        </p>

        <Button
          className="w-full h-9 bg-nav-blue text-white text-sm font-semibold rounded-md hover:bg-omblue-600 transition"
          title="Continue"
          onClick={() => handleShowSupport()}
          disabled={amount > 0 && !isPublic ? false : true}
        />
      </div>
    </div>
  );
};

export default Support;

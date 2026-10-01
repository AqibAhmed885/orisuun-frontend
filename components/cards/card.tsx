import React from 'react';
import Tag from '../ui/tag';

const Card = () => {
  return (
    <div className="border border-grey-600 rounded-md px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <p className="text-h9 2xl:text-scaled-h9 text-black-300 font-medium">
            Proile:
          </p>
          <p className="text-h9 2xl:text-scaled-h9 font-medium text-black-400">
            Irene Mitchell
          </p>
        </div>
        <div>
          <Tag text="Paid" status="fulfilled" />
        </div>
      </div>

      <div className="flex items-center gap-1 mb-3">
        <p className="text-h9 2xl:text-scaled-h9 text-black-300 font-medium">
          Service:
        </p>
        <p className="text-h9 2xl:text-scaled-h9 font-medium text-black-400">
          Contract Review
        </p>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-h9 2xl:text-scaled-h9 font-medium text-black-400">
          05 Jan, 2024 07:39 am
        </p>
        <p className="text-h9 2xl:text-scaled-h9 font-semibold text-olblue-500">
          $1200
        </p>
      </div>
    </div>
  );
};

export default Card;

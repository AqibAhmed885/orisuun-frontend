import React from 'react';
import Tag from './tag';

const Table = () => {
  return (
    <table className="w-full min-w-[700px]">
      <thead>
        <tr className="bg-omblue-25">
          <th className="text-start text-blue-500 text-h8 2xl:text-scaled-h8 font-semibold p-3">
            Profile
          </th>
          <th className="text-start text-blue-500 text-h8 2xl:text-scaled-h8 font-semibold p-3">
            Services
          </th>
          <th className="text-start text-blue-500 text-h8 2xl:text-scaled-h8 font-semibold p-3">
            Date and Time
          </th>
          <th className="text-start text-blue-500 text-h8 2xl:text-scaled-h8 font-semibold p-3">
            Amount
          </th>
          <th className="text-start text-blue-500 text-h8 2xl:text-scaled-h8 font-semibold p-3">
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-grey-600">
          <td className="p-3 text-h9 2xl:text-scaled-h9 font-medium text-black-400">
            Irie Mitchell
          </td>
          <td className="p-3 text-h9 2xl:text-scaled-h9 font-medium text-black-400">
            Contract Review
          </td>
          <td className="p-3 text-h9 2xl:text-scaled-h9 font-medium text-black-400">
            05 Jan, 2024 07:39 am
          </td>
          <td className="p-3 text-h9 2xl:text-scaled-h9 font-semibold text-olblue-500">
            $1200
          </td>
          <td className="p-3 text-h9 2xl:text-scaled-h9 font-medium text-black-400">
            <Tag text="Deposit" status="processing" />
          </td>
        </tr>
        <tr className="border-b border-grey-600">
          <td className="p-3 text-h9 2xl:text-scaled-h9 font-medium text-black-400">
            Irie Mitchell
          </td>
          <td className="p-3 text-h9 2xl:text-scaled-h9 font-medium text-black-400">
            Contract Review
          </td>
          <td className="p-3 text-h9 2xl:text-scaled-h9 font-medium text-black-400">
            05 Jan, 2024 07:39 am
          </td>
          <td className="p-3 text-h9 2xl:text-scaled-h9 font-semibold text-olblue-500">
            $1200
          </td>
          <td className="p-3 text-h9 2xl:text-scaled-h9 font-medium text-black-400">
            <Tag text="Deposit" status="processing" />
          </td>
        </tr>
        <tr className="border-b border-grey-600">
          <td className="p-3 text-h9 2xl:text-scaled-h9 font-medium text-black-400">
            Irie Mitchell
          </td>
          <td className="p-3 text-h9 2xl:text-scaled-h9 font-medium text-black-400">
            Contract Review
          </td>
          <td className="p-3 text-h9 2xl:text-scaled-h9 font-medium text-black-400">
            05 Jan, 2024 07:39 am
          </td>
          <td className="p-3 text-h9 2xl:text-scaled-h9 font-semibold text-olblue-500">
            $1200
          </td>
          <td className="p-3 text-h9 2xl:text-scaled-h9 font-medium text-black-400">
            <Tag text="Deposit" status="processing" />
          </td>
        </tr>
        <tr className="border-b border-grey-600">
          <td className="p-3 text-h9 2xl:text-scaled-h9 font-medium text-black-400">
            Irie Mitchell
          </td>
          <td className="p-3 text-h9 2xl:text-scaled-h9 font-medium text-black-400">
            Contract Review
          </td>
          <td className="p-3 text-h9 2xl:text-scaled-h9 font-medium text-black-400">
            05 Jan, 2024 07:39 am
          </td>
          <td className="p-3 text-h9 2xl:text-scaled-h9 font-semibold text-olblue-500">
            $1200
          </td>
          <td className="p-3 text-h9 2xl:text-scaled-h9 font-medium text-black-400">
            <Tag text="Deposit" status="processing" />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Table;

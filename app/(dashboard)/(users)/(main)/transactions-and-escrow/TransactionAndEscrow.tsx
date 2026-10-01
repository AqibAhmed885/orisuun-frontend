'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import filterIcon from '@/public/images/vector/filter.svg';
import Button from '@/components/ui/button';
import CustomSelect from '@/components/ui/select';
import Input from '@/components/ui/input';
import Pagination from '@/components/ui/pagination';
import { useMobileMediaQuery } from '@/hooks/useMediaQuery';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { getAllContractsbyUser } from '@/server-actions/contractEscrow';
import Card from '@/components/cards/card';
import Tag from '@/components/ui/tag';
import Eye from '@/icons/eye';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import Loader from '@/components/ui/loader';

const TransactionAndEscrow = () => {
  const isMobile = useMobileMediaQuery();
  const [contractList, setContractList] = useState([]);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loader, setLoader] = useState(true);
  const [filteredContracts, setFilteredContracts] = useState([]);

  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));

  const getCurrentUserContracts = async () => {
    try {
      const result = await getAllContractsbyUser({
        ContractCreatorId: currentUser.Id,
      });
      if (result.success) {
        setContractList(result.data);
        setLoader(false);
      } else {
        setLoader(false);
        if (
          result.message &&
          result.message.toLowerCase().includes('this feature is not for')
        ) {
          toast.error(result.message);
        }
      }
    } catch (error) {
      console.error(error, 'Error');
    }
  };

  useEffect(() => {
    if (searchQuery?.trim().length > 0) {
      setFilteredContracts(
        contractList.filter(
          (contract) =>
            contract?.ContractName?.toLowerCase().includes(
              searchQuery.toLowerCase()
            ) ||
            contract?.ContractType?.toLowerCase().includes(
              searchQuery.toLowerCase()
            )
        )
      );
    } else {
      setFilteredContracts(contractList);
    }
  }, [searchQuery, contractList]);

  const handlePageSizeChange = (size) => {
    setPageSize(Number(size));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredContracts.length / pageSize);

  const paginatedContracts = filteredContracts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    if (currentUser) {
      getCurrentUserContracts();
    }
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  if (loader) {
    return <Loader />;
  }
  return (
    <div className="w-full px-6 py-7">
      <div className="flex items-start md:items-center flex-col md:flex-row justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="h-7 w-1 bg-blue-500 rounded-e-md"></div>
          <h6 className="text-h6 2xl:text-scaled-h6 text-blue-500 font-semibold">
            Escrow Status and Transaction History
          </h6>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Link href={'/transactions-and-escrow/contract/new-contract'}>
            <Button title="Start New Contract"></Button>
          </Link>
        </div>
      </div>
      <div className="flex items-start md:items-center justify-between flex-col md:flex-row my-4">
        <div className="text-h9 2xl:text-scaled-h9 font-medium text-black-500 hidden md:flex items-center gap-2 mb-2">
          <p>Shows</p>
          <CustomSelect
            options={[10, 20, 50, 100].map((size) => ({
              value: size.toString(),
              label: `${size}`,
            }))}
            onChange={(option) => handlePageSizeChange(option.value)}
            value={{ label: pageSize.toString(), value: pageSize.toString() }}
            className="w-20"
            placeholder="10"
          />

          <p>entries</p>
        </div>
        <div className="flex gap-2 md:w-auto w-full">
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className="p-2 border border-omblue-100 rounded-md flex md:hidden items-center">
            <Image src={filterIcon} alt="filter icon" />
          </div>
        </div>
        <Button className="mt-4 md:hidden" title="Start New Contract"></Button>
      </div>

      {isMobile ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <Card key={index} />
          ))}
        </div>
      ) : (
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
              <th className="px-2 py-3 text-left text-sm font-semibold text-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedContracts.length > 0 ? (
              paginatedContracts.map((contract, index) => (
                <tr className="border-b border-grey-600" key={index}>
                  <td className="p-3 text-h9 2xl:text-scaled-h9 font-medium text-black-400">
                    {contract?.ContractName}
                  </td>
                  <td className="p-3 text-h9 2xl:text-scaled-h9 font-medium text-black-400">
                    {contract?.ContractType}
                  </td>
                  <td className="p-3 text-h9 2xl:text-scaled-h9 font-medium text-black-400">
                    {moment(contract?.CreatedDate).format(
                      'DD MMM, YYYY hh:mm a'
                    )}
                  </td>
                  <td className="p-3 text-h9 2xl:text-scaled-h9 font-semibold text-olblue-500">
                    {contract?.ContractAmount}
                  </td>
                  <td className="p-3 text-h9 2xl:text-scaled-h9 font-medium text-black-400">
                    <Tag text={contract?.Status} status={contract?.Status} />
                  </td>
                  <td className="px-2 py-3 text-sm text-gray-800 border-t cursor-pointer">
                    <Eye
                      className="w-6 h-6"
                      onClick={() =>
                        router.push(`/transactions-and-escrow/${contract?.Id}`)
                      }
                    />
                  </td>
                </tr>
              ))
            ) : (
              <div className="p-4 text-[14px] 4xl:text-[24px] w-full h-full text-center text-blu-ray-300">
                No contracts found
              </div>
            )}
          </tbody>
        </table>
      )}
      <div className="mt-4 flex justify-end">
        <Pagination
          total={filteredContracts.length}
          show={pageSize}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default TransactionAndEscrow;

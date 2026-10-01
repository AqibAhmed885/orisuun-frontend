'use client';

import { useState } from 'react';

import { Input } from '../../../../../../components/marketing/Input';
import { AccountType } from './AccountType';
import { accountType } from '../../../../../../data/marketing/signupData';

export const BankAccount = ({
  register,
  errors,
  setSelectedAccountType,
  selectedAccountType,
  bankAccountTypes = accountType,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 pb-4">
      <Input
        name="nameOnAccount"
        {...register('nameOnAccount')}
        errors={errors}
        placeHolder="Name on Account"
        containClass=""
        className="text-sm px-4 py-2.5 h-11 placeholder:text-black-100 border-black-100 !leading-5"
      />
      <Input
        name="routingNumber"
        {...register('routingNumber')}
        errors={errors}
        placeHolder="ACH Routing Number"
        containClass=""
        className="text-sm px-4 py-2.5 h-11 placeholder:text-black-100 border-black-100 !leading-5"
      />
      <Input
        name="accountNumber"
        {...register('accountNumber')}
        errors={errors}
        placeHolder="Account Number"
        containClass=""
        className="text-sm px-4 py-2.5 h-11 placeholder:text-black-100 border-black-100 !leading-5"
      />
      <Input
        name="confirmAccountNumber"
        {...register('confirmAccountNumber')}
        errors={errors}
        placeHolder="Confirm Account Number"
        containClass=""
        className="text-sm px-4 py-2.5 h-11 placeholder:text-black-100 border-black-100 !leading-5"
      />
      <div className="space-y-2">
        <p className="text-sm text-[#6E6E6E] font-medium">Account Type</p>
        <AccountType
          accountType={bankAccountTypes}
          selected={selectedAccountType}
          setSelected={setSelectedAccountType}
        />
      </div>
    </div>
  );
};

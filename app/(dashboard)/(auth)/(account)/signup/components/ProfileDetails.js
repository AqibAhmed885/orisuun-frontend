import React, { useState } from 'react';
import { Input } from '../../../../../../components/marketing/Input';

const defaultAmount = ['10', '25', '50', '100', '500', '1000'];

export const ProfileDetails = ({
  register,
  errors,
  includePassword = true,
  includeCity = false,
  includeContribution = false,
  includeSubcriptionKey = false,
  includeFirstName = true,
  includeLastName = true,
  includeEmail = true,
  setSelectedAmount,
  selectedAmount,
}) => {
  const [password, setPassword] = useState('');

  const handleAmountClick = (amount) => {
    setSelectedAmount(amount);
  };

  const [passwordRequirements, setPasswordRequirements] = React.useState({
    uppercase: false,
    number: false,
    specialChar: false,
    minLength: false,
    minLength: password.length >= 8,
  });

  const handlePasswordChange = (password) => {
    setPassword(password);
    setPasswordRequirements({
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      minLength: password.length >= 8,
    });
  };

  return (
    <div className={`grid grid-cols-2 gap-6`}>
      {includeFirstName && (
        <Input
          name="firstName"
          {...register('firstName')}
          placeholder="First Name"
          errors={errors}
          containClass="col-span-1 small-500:col-span-2 !border-[#E4E9F5]"
          className="placeholder:!text-grey-800 placeholder:font-normal border-[#E4E9F5] border-[0.8px] px-4 py-[14px] leading-[130%]"
        />
      )}
      {includeLastName && (
        <Input
          name="lastName"
          {...register('lastName')}
          placeholder="Last Name"
          errors={errors}
          containClass="col-span-1 small-500:col-span-2 !border-[#E4E9F5]"
          className="placeholder:!text-grey-800 placeholder:font-normal border-[#E4E9F5] border-[0.8px] px-4 py-[14px] leading-[130%]"
        />
      )}

      {includeEmail && (
        <Input
          name="email"
          {...register('email')}
          placeholder="Email"
          errors={errors}
          type="email"
          containClass="col-span-2 !border-[#E4E9F5]"
          className="placeholder:!text-grey-800 placeholder:font-normal border-[#E4E9F5] border-[0.8px] px-4 py-[14px] leading-[130%]"
        />
      )}

      {includeSubcriptionKey && (
        <Input
          name="subscriptionKey"
          {...register('subscriptionKey')}
          placeholder="Unique subscription key (from confirmation email)"
          errors={errors}
          containClass="col-span-2 !border-[#E4E9F5]"
          className="placeholder:!text-grey-800 placeholder:font-normal border-[#E4E9F5] border-[0.8px] px-4 py-[14px] leading-[130%]"
        />
      )}
      {includeCity && (
        <Input
          name="city"
          {...register('city')}
          placeholder="City"
          errors={errors}
          containClass="col-span-2 !border-[#E4E9F5]"
          className="placeholder:!text-grey-800 placeholder:font-normal border-[#E4E9F5] border-[0.8px] px-4 py-[14px] leading-[130%]"
        />
      )}
      {includeContribution && (
        <div className="flex flex-col mt-6 w-full col-span-2">
          <div className="flex flex-col sm:gap-10 gap-4">
            <p className="text-sm text-[#6E6E6E] font-medium">
              Contribution amount:
            </p>
            <div className="grid grid-cols-3 gap-4">
              {defaultAmount.map((amount, index) => (
                <div
                  key={index}
                  onClick={() => handleAmountClick(amount)}
                  className={`cursor-pointer border rounded-[54px] py-2 px-5 text-center ${amount === selectedAmount
                    ? 'border-[#2357C6] bg-[#F2F7FC] font-bold text-[#2357C6]'
                    : 'border-[#B2B3B3] text-[#6E6E6E]'
                    }`}
                >
                  <p>{amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {includePassword && (
        <>
          {' '}
          <Input
            name="password"
            {...register('password')}
            errors={errors}
            placeholder="Password"
            type="password"
            containClass="col-span-2 !border-[#E4E9F5]"
            className="placeholder:!text-grey-800 placeholder:font-normal border-[#E4E9F5] border-[0.8px] px-4 py-[14px] leading-[130%]"
            onChange={(e) => handlePasswordChange(e.target.value)}
          />
          {password &&
            !(
              passwordRequirements.minLength &&
              passwordRequirements.uppercase &&
              passwordRequirements.number &&
              passwordRequirements.specialChar
            ) && (
              <div className="flex text-xs text-blue-strong flex-wrap col-span-2 font-medium items-center gap-1">
                The password
                {!passwordRequirements.minLength && (
                  <span className="font-semibold text-blue-strong">
                    must be at least 8 characters
                  </span>
                )}
                {!passwordRequirements.minLength && 'and'}
                {(!passwordRequirements.uppercase ||
                  !passwordRequirements.number ||
                  !passwordRequirements.specialChar) && (
                    <>
                      &nbsp; should contain
                      {!passwordRequirements.uppercase && (
                        <span className="font-semibold text-blue-strong">
                          {' '}
                          Uppercase Letter,
                        </span>
                      )}
                      {!passwordRequirements.number && (
                        <span className="font-semibold text-blue-strong">
                          {' '}
                          Number,
                        </span>
                      )}
                      {!passwordRequirements.specialChar && (
                        <span className="font-semibold text-blue-strong">
                          {' '}
                          Special Character
                        </span>
                      )}
                    </>
                  )}
              </div>
            )}
          <Input
            name="confirmPassword"
            {...register('confirmPassword')}
            errors={errors}
            placeholder="Confirm Password"
            type="password"
            containClass="col-span-2 !border-[#E4E9F5]"
            className="placeholder:!text-grey-800 placeholder:font-normal border-[#E4E9F5] border-[0.8px] px-4 py-[14px] leading-[130%]"
          />
        </>
      )}
    </div>
  );
};

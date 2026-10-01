'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import backgroundSrc from '@/public/images/horizon.png';
import LogoFullBlack from '@/icons/logo-full-black';
import Button from '@/components/ui/button';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '@/components/ui/input';
import { useSearchParams } from 'next/navigation';
import { resetPasswordConfirm } from '../../../../api/auth/auth';
const formSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .refine((value) => /[A-Z]/.test(value), {
        message: 'Password must contain at least one uppercase letter',
      })
      .refine((value) => /[a-zA-Z]/.test(value), {
        message: 'Password must contain at least one letter',
      }),
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .refine((value) => /[A-Z]/.test(value), {
        message: 'Password must contain at least one uppercase letter',
      })
      .refine((value) => /[a-zA-Z]/.test(value), {
        message: 'Password must contain at least one letter',
      }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        message: "Passwords don't match",
        code: z.ZodIssueCode.custom,
      });
    }

  });
const ResetPassword: React.FC = () => {
  const [loader, setLoader] = useState(false);
  const searchParams = useSearchParams();
  const UserId = searchParams.get('UserId');

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async () => {
    setLoader(true);
    try {
      const response = await resetPasswordConfirm(UserId, watch('password'));
      toast.success(response.data.Message);
    } catch (error) {
      toast.error(error?.response?.data?.Message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="relative w-full h-screen">
      <Image
        src={backgroundSrc}
        alt="Background"
        quality={100}
        priority
        fill
        className="object-cover"
      />

      {/* Card Container */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4">
        <div className="relative w-full bg-white rounded-lg shadow-xl p-10">
          {/* Logo */}
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
            <LogoFullBlack />
          </div>

          {/* Card Content */}
          <div>
            <div className="mb-10">
              <h5 className="font-semibold text-xl mb-2">Reset password</h5>
              <p className="text-sm text-gray-600">
                {`Reset your password and login with new password.`}
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Input
                  placeholder="Password"
                  type="password"
                  {...register('password')}
                  error={errors?.password?.message.toString()}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  {...register('confirmPassword')}
                  error={errors?.confirmPassword?.message.toString()}
                />
              </div>

              <Button
                type="submit"
                className="w-full py-2 font-normal"
                title="Reset Password"
                disabled={loader}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

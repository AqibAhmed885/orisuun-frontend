'use client';

import Link from 'next/link';
import { Suspense, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  billingFrequency,
  planType,
} from '../../../../../../data/marketing/signupData';
import { Button } from '../../../../../../components/marketing';
import { PlanType } from '../../../../(auth)/(account)/signup/components/PlanType';
import { BillingFrequency } from '../../../../(auth)/(account)/signup/components/BillingFrequency';
import { ProfileDetails } from '../../../../(auth)/(account)/signup/components/ProfileDetails';
import { profileSchema } from '../../../../../../utils/marketing/schemas';
import { toast } from 'react-toastify';
import { ErrorMessage } from '@hookform/error-message';
import swal from 'sweetalert';
import axios from 'axios';
import { apiEndpoint } from '@/utils/utils';
import { userService } from '@/app/api/dashboard/addUser';

export const ProfileSuperAdmin = ({ setPage }) => {
  const navigate = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');
  const [selectedPlan, setSelectedPlan] = useState(planType[0]);
  const [selectedBilling, setSelectedBilling] = useState(
    plan ? plan : billingFrequency[0]?.type
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availablePlanTypes, setAvailablePlanTypes] = useState(planType);
  const [billings, setBillings] = useState([]);
  const [profilesTypes, setProfileTypes] = useState([]);
  const [selectedOption, setSelectedOption] = useState();

  const handleChange = (event) => {
    setSelectedOption(Number(event.target.value));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(profileSchema),
  });

  useEffect(() => {
    setAvailablePlanTypes(selectedOption == 4 ? [planType[0]] : planType);
  }, [selectedOption]);

  const onSubmit = async (data) => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    setLoading(true);
    setError(null);

    try {
      const billingPlan = billings?.find(plan => plan?.Name === selectedBilling);
      const registerData = {
        ...data,
        userProfileTypeId: selectedOption,
        billingFrequency: selectedBilling,
        billingPlanId: billingPlan?.Id
      };

      const response = await userService.registerUser(registerData, userData?.Token);

      if (response?.Result) {
        toast.success('Registration successful');
        localStorage.setItem('registerUser', JSON.stringify(response.Result));

        const willProceed = await swal({
          title: 'Registration Successful!',
          text: 'You have successfully registered. Click OK to explore dashboard',
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'OK',
          customClass: { confirmButton: 'swal-button--confirm' },
          allowOutsideClick: false,
        });

        if (willProceed) {
          navigate.push('/dashboard');
        }
      }
      setPage(1);
    } catch (error) {
      toast.error(error?.response?.data?.Message || 'Registration failed');
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const resUserProfileType = await axios.get(
          `${apiEndpoint}/Profile/UserProfileTypes`,
          {
            headers: {
              XApiKey:
              'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
              'Content-Type': 'application/json',
            },
          }
        );
        if (resUserProfileType.status == 200) {
          setProfileTypes(resUserProfileType?.data?.Result);
          setSelectedOption(resUserProfileType?.data?.Result[0]?.Id);
        }
      } catch (error) { }
    })();
  }, []);

  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      if (selectedOption && selectedPlan) {
        try {
          const plans = await userService.getSubscriptionPlans(
            selectedOption.toString(),
            selectedPlan
          );
          setBillings(plans);
        } catch (error) {
          console.error('Error fetching subscription plans:', error);
        }
      }
    };
    fetchSubscriptionPlans();
  }, [selectedOption, selectedPlan]);

  return (
    <>
      <Suspense>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 md:space-y-4"
        >
          <div className="space-y-2">
            <p className="text-sm text-[#6E6E6E] font-medium">Profile Type</p>
            <select
              name="profileType"
              id="profileType"
              value={selectedOption ?? ''}
              onChange={handleChange}
              className="w-full bg-transparent py-3 px-4 select-wrapper text-sm font-medium outline-none !border border-[#B2B3B3] rounded-[8px]"
            >
              {profilesTypes?.map(({ UserProfileName, Id }) => (
                <option key={Id} value={Id}>
                  {UserProfileName}
                </option>
              ))}
            </select>
          </div>
          {/* <div className="space-y-2">
            <p className="text-sm text-[#6E6E6E] font-medium">Plan Type</p>
            <PlanType
              selected={selectedPlan}
              setSelected={setSelectedPlan}
              planType={availablePlanTypes}
              profileType={selectedOption}
            />
          </div> */}
          <div className="space-y-2">
            <p className="text-sm text-[#6E6E6E] font-medium">
              Billing Frequency
            </p>
            <BillingFrequency
              selected={selectedBilling}
              setSelected={setSelectedBilling}
              billings={billings}
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-[#6E6E6E] font-medium">
              Profile details
            </p>
            <ProfileDetails register={register} errors={errors} />
          </div>
          <div className="flex gap-2 items-start md:items-center">
            <input
              type="checkbox"
              name="agree"
              id="agree"
              className="mt-2 md:mt-0"
              {...register('agree')}
            />
            <label htmlFor="agree">
              I agree to Orisuun&apos;s{' '}
              <Link href="/terms" className="text-nav-blue">
                Terms
              </Link>
              ,{' '}
              <Link href="/refund" className="text-nav-blue">
                Refund
              </Link>
              , and{' '}
              <Link href="/privacy" className="text-nav-blue">
                Privacy Policy
              </Link>
              .
            </label>
            {errors?.agree?.message && (
              <ErrorMessage
                errors={errors}
                name="agree"
                render={({ message }) => {
                  return (
                    <label className="text-xs text-red-500 -bottom-4 left-0">
                      {message}
                    </label>
                  );
                }}
              />
            )}
          </div>
          <Button className="w-full h-12" disabled={loading}>
            {loading ? 'Submitting...' : 'Proceed to Payment'}
          </Button>
        </form>
      </Suspense>
    </>
  );
};

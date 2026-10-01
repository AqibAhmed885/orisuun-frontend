import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormLayout from '@/components/ui/form-layout';
import Input from '@/components/ui/input';
import Note from '@/components/ui/note';
import CustomSelect from '@/components/ui/select';
import Add from '@/icons/add';
import Bin from '@/icons/upload-icons/bin';
import {
  ProfileSkillsChartsInfoSchema,
  profileSkillsChartsInfoSchema,
} from '@/utils/schema';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/data/store';
import { addChartsDetailsAction } from '@/server-actions/createProfile';
import { updateCurrentUser } from '@/data/slices/user-slice';
import { toast } from 'react-toastify';
import { apiEndpoint, getProfileTypeCategory } from '@/utils/utils';
import { useParams } from 'next/navigation';
import axios from 'axios';

interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  currentUser?: any;
}

const Charts: React.FC<IProps> = ({ step, setStep, currentUser: user }) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    watch,
    reset,
  } = useForm<ProfileSkillsChartsInfoSchema>({
    resolver: zodResolver(profileSkillsChartsInfoSchema),
    defaultValues: {
      services: [{ name: '' }],
      servicesPercentages: [''],
      industryServed: [{ name: '' }],
      industryServedPercentages: [''],
      locations: [{ name: '' }],
      businessChannelPercentages: {
        individuals: '',
        smallBusinesses: '',
        midmarketBusinesses: '',
        enterprise: '',
      },
    },
  });

  const {
    fields: serviceFields,
    append: appendService,
    remove: removeService,
  } = useFieldArray({
    control,
    name: 'services',
  });

  const {
    fields: industryFields,
    append: appendIndustry,
    remove: removeIndustry,
  } = useFieldArray({
    control,
    name: 'industryServed',
  });

  const {
    fields: locationFields,
    append: appendLocation,
    remove: removeLocation,
  } = useFieldArray({
    control,
    name: 'locations',
  });

  const servicesPercentages = watch('servicesPercentages');
  const industryServedPercentages = watch('industryServedPercentages');
  const { id } = useParams();
  const currentUser =
    user ? user : typeof window !== 'undefined' &&
      JSON.parse(localStorage.getItem('userData'));

  const { profileData } = useSelector((state: RootState) => state.user);
  const [industries, setIndustries] = useState([]);
  const dispatch = useDispatch();
  const businessOptions = profileData?.UserProfileTypeId == 7 ? [{ label: "Debt", value: "debt" },
  { label: "Equity", value: "equity" }] : [
    { label: "In-Store", value: "in_store" },
    { label: "Online", value: "online" },
    { label: "Mobile", value: "mobile" },
    { label: "Social Media", value: "social_media" },
    { label: "Phone/Customer Service", value: "phone_customer_service" }
  ];
  const [loader, setLoader] = useState(false);
  const [cityList, setCityList] = useState<
    { id: number; value: string; label: string }[]
  >([]);
  useEffect(() => {
    (async () => {
      ;
      if (profileData.Country || profileData.CountryOfOrigin) {
        try {
          const res = await axios.post(
            `${apiEndpoint}/Profile/GetCityStateList`,
            {
              CountryId: Number(profileData.Country ? profileData.Country : profileData.CountryOfOrigin),
            },
            {
              headers: {
                XApiKey:
                  'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
              },
            }
          );
          if (res.status === 200) {
            const formattedCityList = res.data.Result?.CityData?.map((item) => ({
              // id: item.id,
              value: item.Id.toString(),
              label: item.CityName
              ,
            }));
            setCityList(formattedCityList);
          }
        } catch (error) {
          console.error('Error fetching country list:', error);
        }
      }
    })();
  }, []);
  const onSubmit = async (data: ProfileSkillsChartsInfoSchema) => {
    setLoader(true)
    try {
      if (currentUser) {
        const businessChartData = {
          UserId: currentUser.Id,
          UserProfileDetailId: currentUser?.UserProfileDetailsId,
          UserProfileType: currentUser.UserProfileType,
          serviceModels: data.services.map((service, index) => ({
            ServiceName: service.name,
            ServicePercentage: data.servicesPercentages[index],
          })),
          businessChannelModels: data.industryServed.map((industry, index) => ({
            BusinessValue: industry.name,
            BusinessPercentage: data.industryServedPercentages[index],
          })),
          LocationList: data.locations.map((loc) => loc.name),
          // ClientsBySize: {
          IndividualPercentage: data.businessChannelPercentages.individuals,
          SmallBusinessPercentage:
            data.businessChannelPercentages.smallBusinesses,
          MidmarketBusinessPercentage:
            data.businessChannelPercentages.midmarketBusinesses,
          EnterprisePercentage: data.businessChannelPercentages.enterprise,
          // },
        };
        try {
          const response = await axios.post(
            `${apiEndpoint}/Profile/CreateServicesChartsInformationProfile`,
            businessChartData,
            {
              headers: {
                XApiKey:
                  'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
              },
            }
          );

          if (response.status === 200) {
            dispatch(updateCurrentUser(response.data.Result));
            setTimeout(() => {
              setStep(step + 1);
            }, 200);
            toast.success(response.data.Message);
            setTimeout(() => {
              setLoader(false)
            }, 1000)
          }
          return {
            success: true,
            message: 'Business Details Saved!',
            data: response.data.Result,
          };
        } catch (error) {
          setLoader(false)
          console.error(error);
        }
      }
    } catch (error) {
      setLoader(false)
    }
  };
  useEffect(() => {
    const fetchList = async () => {
      try {
        const resInsdustries = await axios.get(
          `${apiEndpoint}/Search/GetIndustriesList`,
          {
            headers: {
              accept: '*/*',
              XApiKey:
                'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
            },
          }
        );
        if (resInsdustries.status === 200) {
          setIndustries(
            resInsdustries.data.Result.map((data) => ({
              label: data.IndustryName,
              value: data.Id,
            }))
          );
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchList();
  }, []);
  useEffect(() => {
    if (id && profileData) {
      const businessChannelPercentages = {
        individuals: '',
        smallBusinesses: '',
        midmarketBusinesses: '',
        enterprise: '',
      };

      profileData?.ClientBySizes?.forEach((item) => {
        switch (item.BusinessType) {
          case 'Individual':
            businessChannelPercentages.individuals = item.BusinessPercentage;
            break;
          case 'SmallBusiness':
            businessChannelPercentages.smallBusinesses =
              item.BusinessPercentage;
            break;
          case 'MidMarketBusiness':
            businessChannelPercentages.midmarketBusinesses =
              item.BusinessPercentage;
            break;
          case 'Enterprise':
            businessChannelPercentages.enterprise = item.BusinessPercentage;
            break;
          default:
            break;
        }
      });
      const industryServed = [];
      const industryServedPercentages = [];
      const services = [];
      const servicesPercentages = [];

      profileData?.ChannelCategories?.forEach((industry) => {
        // Push the industry names and percentages into their respective arrays
        industryServed.push({ name: industry.BusinessChannelName });
        industryServedPercentages.push(industry.BusinessChannelPercentage);
      });
      profileData?.UserProfileServices?.forEach((service) => {
        // Push the industry names and percentages into their respective arrays
        services.push({ name: service.ServiceName });
        servicesPercentages.push(service.Percentage);
      });
      const LocationList = profileData?.UserProfileLocations?.map((location) => ({
        name: location.LocationName,
      }))

      // Call reset to populate the form with correct data
      reset({
        services: services.length > 0 ? services : [{ name: '' }], // Assuming default structure for services
        servicesPercentages: servicesPercentages || [], // Assuming this should remain unchanged
        industryServed: industryServed.length > 0 ? industryServed : [{ name: '' }], // Populated with industry names
        industryServedPercentages: industryServedPercentages || [''], // Populated with industry percentages
        locations: LocationList?.length > 0 ? LocationList : [{ name: '' }], // Assuming default structure for locations
        businessChannelPercentages: businessChannelPercentages, // Populated with business channel percentages
      });
    }
  }, [id, profileData, reset]);

  const businessChannelFields = [
    { key: 'individuals' as const, label: 'Individuals' },
    {
      key: 'smallBusinesses' as const,
      label: 'Small Businesses (less than $8 million in annual revenue)',
    },
    {
      key: 'midmarketBusinesses' as const,
      label: 'Midmarket Businesses ($8M to $1B annual revenue)',
    },
    {
      key: 'enterprise' as const,
      label: 'Enterprise (more than $1 billion in annual revenue)',
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormLayout
        title="Charts"
        description="Tell us about the makeup of your business"
        position="start"
        nextButtonType="submit"
        disableNext={loader}
        variant="larger-child"
        handleBack={() => setStep(step - 1)}
      >
        <div className="flex flex-col w-full gap-6 mb-10 rounded-lg md:py-6 lg:px-6">
          {/* Services Section */}
          <div className="space-y-3">
            <label className="font-semibold text-h8 2xl:text-scaled-h8 text-black-500">
              {profileData?.UserProfileTypeId == 7 ? "Investment Size" : 'Service or Product Splits'}{' '}
              <span className="text-danger-500">*</span>
            </label>
            <Note text="One service or product is mandatory for your profile" />
            <p className="py-2 font-medium text-h10 2xl:text-scaled-h10 text-grey-800">
              Total percentage for all services or products should be equal to
              100%
            </p>
            {serviceFields.map((field, index) => (
              <div key={field.id} className="space-y-3">
                <div className="flex items-start w-full gap-2">
                  <div className="flex items-start w-full gap-2">
                    <div className="flex-1">
                      <Input
                        {...register(`services.${index}.name`)}
                        placeholder={profileData?.UserProfileTypeId == 7 ? "Investment Size" : "Service/Product Name"}
                        error={errors.services?.[index]?.name?.message}
                      />
                    </div>
                    <Input
                      {...register(`servicesPercentages.${index}`)}
                      placeholder="0"
                      containerClass="max-w-[100px] 2xl:max-w-28"
                      maxLength={3}
                      isPercentage
                      onChange={(e) => {
                        setValue(
                          `servicesPercentages.${index}`,
                          e.target.value
                        );
                        trigger('servicesPercentages');
                      }}
                      error={
                        errors.servicesPercentages?.message ??
                        errors.servicesPercentages?.root?.message
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      removeService(index);
                      setValue(
                        'servicesPercentages',
                        servicesPercentages.filter((_, i) => i !== index)
                      );
                    }}
                    disabled={serviceFields.length < 2}
                    className="p-2 rounded-md text-danger-500 bg-danger-100 disabled:text-danger-200"
                  >
                    <Bin className="w-8 h-8" />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                appendService({ name: '' });
                setValue('servicesPercentages', [...servicesPercentages, '']);
              }}
              className="flex items-center gap-2 px-4 py-3 font-semibold text-white rounded-md btn-secondary text-h9 2xl:text-scaled-h9 ms-1 bg-omblue-500 disabled:bg-omblue-50 disabled:text-omblue-200"
            >
              <Add />
              {profileData?.UserProfileTypeId == 7 ? "Add Investment Size" : 'Add Service/Product'}
            </button>
          </div>

          {/* Business Channel Categories Section */}
          <div className="space-y-3">
            <label className="font-semibold text-h8 2xl:text-scaled-h8 text-black-500">
              {profileData?.UserProfileTypeId == 7 ? "Debt vs. Equity" : "Business Channel Categories"} <span className="text-danger-500">*</span>
            </label>
            <Note text="At least one channel is rquired for your profile." />
            <p className="py-2 font-medium text-h10 2xl:text-scaled-h10 text-grey-800">
              Total percentage for all services or products should be equal to 100%
            </p>
            {industryFields.map((field, index) => (
              <div key={field.id} className="space-y-3">
                <div className="flex items-start w-full gap-2">
                  <div className="flex items-start w-full gap-2">
                    <div className="flex-1">
                      <CustomSelect
                        placeholder={profileData?.UserProfileTypeId == 7 ? 'Select Debt vs. Equity' : 'Select Business Channel'}
                        options={businessOptions}
                        onChange={(selectedOption: any) => {
                          setValue(
                            `industryServed.${index}.name`,
                            selectedOption.label
                          );
                          trigger('industryServed');
                        }}
                        error={errors.industryServed?.[index]?.name?.message}
                        value={
                          businessOptions.find(
                            (industry) =>
                              industry.label ===
                              watch(`industryServed.${index}.name`)
                          ) || null
                        }
                      />
                    </div>
                    <Input
                      {...register(`industryServedPercentages.${index}`)}
                      placeholder="0"
                      containerClass="max-w-[100px] 2xl:max-w-28"
                      maxLength={3}
                      isPercentage
                      error={
                        errors.industryServedPercentages?.message ??
                        errors.industryServedPercentages?.root?.message
                      }
                      onChange={(e) => {
                        setValue(
                          `industryServedPercentages.${index}`,
                          e.target.value
                        );
                        trigger('industryServedPercentages');
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      removeIndustry(index);
                      setValue(
                        'industryServedPercentages',
                        industryServedPercentages.filter((_, i) => i !== index)
                      );
                    }}
                    disabled={industryFields.length < 2}
                    className="p-2 rounded-md text-danger-500 bg-danger-100 disabled:text-danger-200"
                  >
                    <Bin className="w-8 h-8" />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                appendIndustry({ name: '' });
                setValue('industryServedPercentages', [
                  ...industryServedPercentages,
                  '',
                ]);
              }}
              className="flex items-center gap-2 px-4 py-3 font-semibold text-white rounded-md btn-secondary text-h9 2xl:text-scaled-h9 ms-1 bg-omblue-500 disabled:bg-omblue-50 disabled:text-omblue-200"
            >
              <Add />
              {profileData?.UserProfileTypeId == 7 ? "Add Debt vs. Equity" : 'Add Business Categories'}
            </button>
          </div>

          {/* Locations Section */}
          <div className="space-y-3">
            <label className="font-semibold text-h8 2xl:text-scaled-h8 text-black-500">
              {profileData?.UserProfileTypeId == 7 ? "Investment Geographic Regions" : "List of Locations"} <span className="text-danger-500">*</span>
            </label>
            <Note text="One location is mandatory for a profile." />
            {locationFields.map((field, index) => (
              <div key={field.id} className="space-y-3">
                <div className="flex items-start w-full gap-2">
                  <CustomSelect
                    placeholder={profileData?.UserProfileTypeId == 7 ? "Select Investment Geographic Regions" : 'Select Location'}
                    options={cityList}
                    onChange={(selectedOption: any) => {
                      setValue(
                        `locations.${index}.name`,
                        selectedOption.label
                      );
                      trigger('locations');
                    }}
                    className='w-full'
                    error={errors.locations?.[index]?.name?.message}
                    value={
                      cityList.find(
                        (industry) =>
                          industry.label ===
                          watch(`locations.${index}.name`)
                      ) || null
                    }
                  />
                  <button
                    type="button"
                    onClick={() => removeLocation(index)}
                    disabled={locationFields.length < 2}
                    className="p-2 rounded-md text-danger-500 bg-danger-100 disabled:text-danger-200"
                  >
                    <Bin className="w-8 h-8" />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendLocation({ name: '' })}
              className="flex items-center gap-2 px-4 py-3 font-semibold text-white rounded-md btn-secondary text-h9 2xl:text-scaled-h9 ms-1 bg-omblue-500 disabled:bg-omblue-50 disabled:text-omblue-200"
            >
              <Add />
              {profileData?.UserProfileTypeId == 7 ? "Add Investment Geographic Regions" : "Add Location"}
            </button>
          </div>

          {/* Business Channel Percentages Section */}
          <div className="space-y-3">
            <label className="font-semibold text-h8 2xl:text-scaled-h8 text-black-500">
              Clients By Size{' '}
              <span className="text-danger-500">*</span>
            </label>
            <p className="py-2 font-medium text-h10 2xl:text-scaled-h10 text-grey-800">
              Total percentage for all business channels should be equal to 100%
            </p>
            <div className="space-y-2">
              {businessChannelFields.map((field) => (
                <div
                  key={field.key}
                  className="flex items-start justify-between w-full gap-4"
                >
                  <p className="py-3 font-medium text-h9 2xl:text-scaled-h9 text-black-500">
                    {field.label}
                  </p>
                  <Input
                    {...register(`businessChannelPercentages.${field.key}`)}
                    placeholder="0"
                    containerClass="max-w-[100px] 2xl:max-w-28"
                    maxLength={3}
                    isPercentage
                    error={
                      errors.businessChannelPercentages?.message ??
                      errors.businessChannelPercentages?.root?.message
                    }
                    onChange={(e) => {
                      setValue(
                        `businessChannelPercentages.${field.key}`,
                        e.target.value
                      );
                      trigger('businessChannelPercentages');
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </FormLayout>
    </form>
  );
};

export default Charts;

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSelector } from 'react-redux';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import axios from 'axios';

import FormLayout from '@/components/ui/form-layout';
import Note from '@/components/ui/note';
import CustomSelect from '@/components/ui/select';
import ArrowDown from '@/icons/arrow-down';
import Loader from '@/components/ui/loader';
import { getAllIndustries } from '@/server-actions/profile';
import { apiEndpoint, cn } from '@/utils/utils';
import { RootState } from '@/data/store';
import Cookies from 'js-cookie';

const schema = z.object({
  selectedIndustries: z
    .array(z.any())
    .min(1, 'At least one industry must be selected')
    .max(3, 'You can not select more than 3 industries'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  currentUser?: any;
}

const IndustrySelection: React.FC<Props> = ({
  step,
  setStep,
  currentUser: user,
}) => {
  const currentUser = user
    ? user
    : typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));
  const [industryData, setIndustryData] = useState<any>(null);
  const [selectedLevelOne, setSelectedLevelOne] = useState<string | null>(null);
  const [openLevelTwo, setOpenLevelTwo] = useState<number | null>(null);
  const { profileData } = useSelector((state: RootState) => state.user);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { selectedIndustries: [] },
  });
  const [loader, setLoader] = useState(false);

  const router = useRouter();
  const selectedIndustries = watch('selectedIndustries');

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await getAllIndustries();
        if (response.success) {
          setIndustryData(response.data);

          // Find saved industry IDs from profileData
          const savedIndustryList =
            profileData?.UserProfileIndustrySelectionInformation.map(
              (info) => info.IndustryId
            ) || [];

          // Initialize the selected values
          setValue('selectedIndustries', savedIndustryList);
          if (savedIndustryList.length > 0) {
            const selectedLevelOneIndustries =
              response.data.LevelOneIndustries.find((levelOne) =>
                response.data.LevelTwoIndustries.some(
                  (levelTwo) =>
                    response.data.LevelThreeIndustries.some(
                      (levelThree) =>
                        response.data.LevelFourIndustries.some(
                          (levelFour) =>
                            savedIndustryList.includes(levelFour.Id) &&
                            levelFour.ParentId === levelThree.Id
                        ) && levelThree.ParentId === levelTwo.Id
                    ) && levelTwo.ParentId === levelOne.Id
                )
              );

            setSelectedLevelOne(selectedLevelOneIndustries?.Id || null);
            const levelTwoToOpen = response.data.LevelTwoIndustries.filter(
              (levelTwo) =>
                response.data.LevelThreeIndustries.some((levelThree) =>
                  response.data.LevelFourIndustries.some(
                    (levelFour) =>
                      savedIndustryList.includes(levelFour.Id) &&
                      levelFour.ParentId === levelThree.Id &&
                      levelThree.ParentId === levelTwo.Id
                  )
                )
            ).map((levelTwo, index) => index);
            setOpenLevelTwo(
              levelTwoToOpen.length > 0 ? levelTwoToOpen[0] : null
            );
          }
        }
      } catch (error) {
        console.error('Error fetching industries:', error);
        // toast.error('Failed to load industry data. Please try again.');
      }
    };

    if (currentUser) {
      fetchIndustries();
    }
  }, [profileData, setValue]);

  const onSubmit = async () => {
    setLoader(true);
    const isValid = await trigger('selectedIndustries');

    if (isValid) {
      try {
        const selectedIndustryData = {
          UserId: currentUser.Id,
          UserProfileTypeId: currentUser.UserProfileTypeId,
          UserProfileDetailId: currentUser.UserProfileDetailsId,
          IndustryList: selectedIndustries,
        };
        try {
          const result = await axios.post(
            `${apiEndpoint}/Profile/SaveUserSelectionInformation`,
            selectedIndustryData,
            {
              headers: {
                XApiKey:
                  'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
              },
            }
          );

          if (result.status === 200) {

            currentUser.isBasicProfileDetailExist = true;
            currentUser.isProfileComplete = true;
            localStorage.setItem('userData', JSON.stringify(currentUser));
            Cookies.set('userData', JSON.stringify(currentUser));
            // router.push(
            //   `/profile/${add2040ToProfileDetailsId(
            //     currentUser.UserProfileDetailsId
            //   )}`
            // );
            setStep(step + 1);


            toast.success(result.data.Message);
            setTimeout(() => {
              setLoader(false);
            }, 1000);
          }
        } catch (error) {
          setLoader(false);
          console.error('Axios error:', error);
          toast.error(error.response.data.message);
          return {
            success: false,
            message: 'An Error Occured',
          };
        }
      } catch (error) {
        setLoader(false);
        console.error('Error updating industries:', error);
        toast.error('Failed to load industry data. Please try again');
      }
    } else {
      setLoader(false);
    }
  };

  if (!industryData) return <Loader />;

  const levelTwoIndustries = industryData.LevelTwoIndustries?.filter(
    (item: any) => item.ParentId === selectedLevelOne
  );

  const handleIndustryChange = async (levelThreeId: string, value: any) => {
    const updatedSelectedIndustries = value.value
      ? [...selectedIndustries, value.value]
      : selectedIndustries.filter((id) => id !== levelThreeId);
    setValue('selectedIndustries', updatedSelectedIndustries);
    await trigger('selectedIndustries');
  };

  return (
    <FormLayout
      title="Industry Selection"
      position="start"
      handleBack={() => setStep(step - 1)}
      showBack={true}
      handleNext={onSubmit}
      descriptionAlt={
        <Note text="Select at least one industry." status="info" />
      }
      variant="equal"
      disableNext={loader}
    >
      <div className="flex flex-col w-full gap-6 mb-8 rounded-lg md:py-6 lg:px-6">
        <div className={cn('flex items-center border-b border-omblue-100')}>
          {industryData.LevelOneIndustries?.map((levelOne: any) => (
            <button
              key={levelOne.Id}
              type="button"
              onClick={() => setSelectedLevelOne(levelOne.Id)}
              className={cn(
                'text-h9 2xl:text-scaled-h9 w-full text-center p-3 border-b',
                levelOne.Id !== selectedLevelOne
                  ? 'text-black-200 font-medium border-transparent'
                  : 'text-omblue-500 font-semibold border-omblue-400'
              )}
            >
              {levelOne.Name}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {levelTwoIndustries?.map((levelTwo: any, levelTwoIndex: number) => (
            <div key={levelTwoIndex} className="px-4 py-4 bg-olblue-50">
              <div
                className="flex items-center justify-between gap-4 cursor-pointer"
                onClick={() =>
                  setOpenLevelTwo(
                    openLevelTwo === levelTwoIndex ? null : levelTwoIndex
                  )
                }
              >
                <p className="text-h9 2xl:text-scaled-h9">{levelTwo.Name}</p>
                <ArrowDown className="w-5 h-5" />
              </div>
              <div
                className={cn(
                  'transition-all',
                  openLevelTwo === levelTwoIndex
                    ? 'max-h-[500rem] opacity-100 mb-4'
                    : 'hidden max-h-0 opacity-0'
                )}
              >
                {industryData.LevelThreeIndustries.filter(
                  (item: any) => item.ParentId === levelTwo.Id
                ).map((levelThree: any) => (
                  <div
                    className={cn(
                      'space-y-2',
                      openLevelTwo !== levelTwoIndex ? 'pt-0' : 'pt-4'
                    )}
                    key={levelThree.Id}
                  >
                    <label className="font-semibold text-h8 2xl:text-scaled-h8 text-black-500">
                      {levelThree.Name}
                    </label>
                    <Controller
                      name="selectedIndustries"
                      control={control}
                      render={({ field }) => {
                        // Filter options based on levelThree.Id
                        const levelFourOptions =
                          industryData.LevelFourIndustries.filter(
                            (item: any) => item.ParentId === levelThree.Id
                          ).map((levelFour: any) => ({
                            label: levelFour.Name,
                            value: levelFour.Id,
                          }));

                        // Find the currently selected value from the options
                        const selectedOption = levelFourOptions.find((option) =>
                          selectedIndustries.includes(option.value)
                        );

                        return (
                          <CustomSelect
                            options={levelFourOptions}
                            error={errors.selectedIndustries?.message}
                            placeholder="Select Industries"
                            onChange={async (val) => {
                              // Check if the industry is already selected
                              const updatedSelectedIndustries =
                                selectedIndustries.includes(val.value)
                                  ? selectedIndustries.filter(
                                    (id) => id !== val.value
                                  ) // Remove if already selected
                                  : [...selectedIndustries, val.value]; // Add if not selected

                              // Update the selected industries
                              setValue(
                                'selectedIndustries',
                                updatedSelectedIndustries
                              );

                              // Trigger validation after the update
                              await trigger('selectedIndustries');
                            }}
                            value={selectedOption || null} // Set selected value or null if none selected
                          />
                        );
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {selectedIndustries && industryData.LevelFourIndustries && (
          <div className="flex gap-4 flex-wrap">
            {industryData?.LevelFourIndustries?.filter((item: any) =>
              selectedIndustries.includes(item?.Id)
            ).map((item: any) => (
              <p
                key={item?.Id}
                className="text-h9 2xl:text-scaled-h9 bg-omblue-100 p-2 rounded-lg border-2 border-omblue-200 text-omblue-500 font-medium"
              >
                {item?.Name}
                <button
                  type="button"
                  onClick={() => {
                    // Remove the industry ID from the selected list
                    const updatedIndustries = selectedIndustries.filter(
                      (id) => id !== item?.Id
                    );
                    setValue('selectedIndustries', updatedIndustries); // Update react-hook-form state
                    // Optionally trigger validation if needed
                    trigger('selectedIndustries');
                  }}
                  className="ml-2 text-red-600"
                >
                  x
                </button>
              </p>
            ))}
          </div>
        )}

        {errors.selectedIndustries && (
          <span className="text-red-600">
            {errors.selectedIndustries.message}
          </span>
        )}
      </div>
    </FormLayout>

  );
};

export default IndustrySelection;

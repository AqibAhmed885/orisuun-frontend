import Input from '@/components/ui/input';
import React, {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { ContractCreateData } from '@/utils/schema';
import { useFormContext, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal/modal';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import FundContract from '@/app/(dashboard)/(users)/(main)/transactions-and-escrow/components/FundContract';
import { ContractMemberService } from '@/app/api/dashboard/transactions-and-escrow';

interface IUser {
  Id: string;
  Name: string;
  Username: string;
  UserId: string;
}

interface IProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}

const Member: React.FC<IProps> = ({ step, setStep }) => {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;
  const {
    register,
    control,
    formState: { errors },
    getValues,
    setValue,
    trigger,
    watch,
  } = useFormContext<ContractCreateData>();
  const values = getValues();
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const expert =
    values.expert.length > 0
      ? values.expert
      : typeof window !== 'undefined' &&
      JSON.parse(localStorage.getItem('expert'));
  const currentUser =
    typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('userData'));
  const [searchedUsers, setSearchedUsers] = useState<IUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>(expert || []);
  // const stripePromise = loadStripe(
  //   (process.env.NEXT_PUBLIC_STRIPE_ESCROW_PUBLIC_KEY as string)
  // );
  const [showModal, setShowModal] = useState(false);

  const searchQuery = watch('CounterPartyName');
  useEffect(() => {
    register('expert', { required: true });
  }, [register]);
  useEffect(() => {
    searchUsers();
  }, []);
  useEffect(() => {
    typeof window !== 'undefined' && localStorage.removeItem('expert');
  }, []);
  const searchUsers = useCallback(async () => {
    try {
      const response = await ContractMemberService.getAllPremiumUsers(currentUser?.Id);
      setSearchedUsers(response.data.Result);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  }, []);

  const handleSelectUser = (userId: string) => {
    const newUserIds = [...selectedUsers];
    const index = newUserIds.indexOf(userId);

    if (index === -1) {
      newUserIds.push(userId);
      setSelectedUsers(newUserIds);
      setValue('expert', newUserIds);
      trigger('expert');
    }
  };

  const handleRemoveSelectedUser = (userId: string) => {
    const updatedUserIds = selectedUsers.filter((id) => id !== userId);
    setSelectedUsers(updatedUserIds);
    setValue('expert', updatedUserIds);
    trigger('expert');
  };

  const onSubmit = async (Id, data) => {
    setLoader(true);
    const result = selectedUsers?.length > 0 ? selectedUsers?.join(',') : '';
    const requestData = {
      ContractCreatorId: currentUser?.Id,
      ContractName: values.Title,
      ContractDescription: values.Description,
      ContractAmount: values.Budget,
      ExpiryDate: new Date(values.ExpiryDate),
      EscrowContractDocumentsList: values.attachements || [],
      Terms: values?.TermsOfContact || '',
      CounterPartyId: result,
      ProjectDuration: values.Deadline,
      PaymentMethodId: data.TransferGroup,
      PaymentIntentId: data.Id,
    };

    try {
      const response = await ContractMemberService.createContractOffer(requestData);
      if (response.status === 200) {
        toast.success(response.data.Message);
        router.push('/transactions-and-escrow');
      }
    } catch (error) {
      toast.error(error?.response?.data?.Message);
      console.error('Error creating campaign:', error);
    } finally {
      setLoader(false);
      setShowModal(false);
    }
  };

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredUsers([]);
    } else {
      const filtered = searchedUsers.filter((member) =>
        member.Name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setFilteredUsers(filtered);
    }
  }, [searchQuery]);

  return (
    <div className="grid grid-cols-8 gap-5 md:p-6 p-4 lg:min-h-[90vh]">
      <div className="my-4 col-span-8 md:mb-8 lg:col-span-4 md:mx-4">
        <h1 className="mb-6 font-medium text-blue-500 text-h1 md:text-h11 2xl:text-scaled-h11">
          Choose a Member
        </h1>
        <p className="text-h7 2xl:text-scaled-h7 font-medium text-[#58595A]">
          Please select a member. An invitation will be sent to the member once
          you complete this step. They will have the option to accept or reject
          your offer.
        </p>
      </div>
      <div className="flex flex-col my-4 col-span-8 lg:col-span-4 lg:col-start-5 md:mx-4">
        <div className="flex-grow">
          <div className="flex flex-col w-full mb-10 rounded-lg gap-2 md:py-6 lg:px-6">
            <h5 className="text-h5 2xl:text-scaled-h5 font-semibold text-black-500">
              Search members to find other contract party
            </h5>
            <div className="relative">
              <Controller
                name="CounterPartyName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Search by member name or username"
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                    error={errors.CounterPartyName?.message}
                  />
                )}
              />

              {filteredUsers.length > 0 && (
                <ul className="max-h-60 overflow-y-auto list-none top-full left-0 w-full bg-white border border-grey p-3 flex flex-col gap-2 rounded-lg">
                  {filteredUsers.map((user) => (
                    <li
                      key={user.Id}
                      className="flex items-center justify-between w-full"
                    >
                      <span>{user.Name}</span>
                      <Button
                        title="Select"
                        onClick={() => handleSelectUser(user.UserId)}
                        className="min-w-[100px] w-[100px] md:min-w-[100px] md:w-[100px] ml-2 bg-omblue-500 hover:bg-omblue-600 px-2 py-1 rounded-lg text-white"
                      ></Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {searchedUsers.length > 0 ? (
              selectedUsers.length > 0 && (
                <div className="flex gap-4 flex-wrap mt-4">
                  {selectedUsers.map((userId) => {
                    const selectedUser = searchedUsers.find(
                      (user) => user.UserId === userId
                    );
                    return (
                      <div key={userId} className="flex items-center">
                        <p className="text-h9 2xl:text-scaled-h9 bg-omblue-100 p-2 rounded-lg border-2 border-omblue-200 text-omblue-500 font-medium mr-2">
                          {selectedUser?.Name || 'Unknown User'}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleRemoveSelectedUser(userId)}
                          className="text-red-600"
                        >
                          x
                        </button>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="flex flex-col-reverse md:mx-4 md:mt-auto md:ml-auto md:flex-row">
          <Button
            className={
              'text-h9 2xl:text-scaled-h9 text-omblue-500 bg-transparent font-semibold px-4 py-3 me-3 justify-center md:justify-end mb-2'
            }
            title="Back"
            onClick={() => setStep(step - 1)}
          />
          <Button
            className="min-w-full mb-2 btn-secondary text-h9 2xl:text-scaled-h9 ms-1 w-full md:min-w-[170px]  text-white"
            title="Submit"
            type="submit"
            onClick={() => setShowModal(true)}
            disabled={loader}
          >
            {loader ? 'Processing...' : 'Payment & Submit'}
          </Button>
        </div>
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          title="Fund Proposed Contract"
          modalSize="sm"
        >
          <Elements stripe={loadStripe((process.env.NEXT_PUBLIC_STRIPE_ESCROW_PUBLIC_KEY as string))}>
            <FundContract details={values} onSubmit={onSubmit} />
          </Elements>
        </Modal>
      </div>
    </div>
  );
};

export default Member;

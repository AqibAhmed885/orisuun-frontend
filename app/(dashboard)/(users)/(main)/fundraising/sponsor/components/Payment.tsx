import Image from 'next/image';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { BankAccount } from '../../../../../(auth)/(account)/signup/components/BankAcount';
import { bankSchema, cardSchema } from '@/utils/marketing/schemas';
import { toast } from 'react-toastify';
import { bankAccountTypes } from '@/data/marketing';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { CreateTokenBankAccountData } from '@stripe/stripe-js';
import Input from '@/components/ui/input';
import { Button } from '@/components/marketing';

interface ISponsorPayemntMethodPropso {
  setPaymentMethodValue: (string) => void;
  setPayemntMethodType: (string) => void;
}

const SponsorPaymentMethod: React.FC<ISponsorPayemntMethodPropso> = ({
  setPaymentMethodValue,
  setPayemntMethodType,
}) => {
  const stripe = useStripe();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [selectedAccountType, setSelectedAccountType] = useState(bankAccountTypes[0]);
  const [loader, setLoader] = useState(false);
  const [isPaymentMethodAdded, setIsPaymentMethodAdded] = useState(false);
  const elements = useElements();
  const [agreeTermAndConditions, setAgreeTermAndConditions] =
    useState<boolean>(false);
  const {
    register,
    handleSubmit: handleCardSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(cardSchema),
  });
  const {
    register: bankRegister,
    handleSubmit: handleBankSubmit,
    formState: { errors: bankErrors },
  } = useForm({
    resolver: yupResolver(bankSchema),
  });
  const cardSubmit = async (data) => {
    try {
      setLoader(true);
      const cardNumberElement = elements.getElement(CardNumberElement);
      const paymentMethodReq = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement,
        billing_details: {
          name: data.nameOnCard,
        },
      });
      if (paymentMethodReq.error) {
        setPaymentMethodValue('');
        setPayemntMethodType('');
        toast.error('Payment Method Failed!');
        setIsPaymentMethodAdded(false);
      } else {
        setPaymentMethodValue(paymentMethodReq.paymentMethod.id);
        setPayemntMethodType(paymentMethod);
        setIsPaymentMethodAdded(true);
      }
    } catch (error) {
      toast.error('Payment Method Failed!');
      toast.error('Payment Method Failed!', { containerId: 'containerA' });
    } finally {
      setLoader(false);
    }
  };

  const bankSubmit = async (data) => {
    try {
      setLoader(true);
      var bankAccount: CreateTokenBankAccountData = {
        country: 'US',
        currency: 'usd',
        routing_number: data?.routingNumber,
        account_number: data?.accountNumber,
        account_holder_name: data?.nameOnAccount,
        account_holder_type: selectedAccountType,
      };
      const paymentMethodReq = await stripe.createPaymentMethod({
        type: 'us_bank_account',
        us_bank_account: {
          account_holder_type: selectedAccountType.toLowerCase(),
          account_number: data?.accountNumber,
          routing_number: data?.routingNumber,
        },
        billing_details: {
          name: data?.nameOnAccount,
          email: data?.email,
        },
      });
      if (paymentMethodReq.error) {
        setPaymentMethodValue('');
        setPayemntMethodType('');
        toast.error('Payment Method Failed!');
        setIsPaymentMethodAdded(false);
      } else {
        setPaymentMethodValue(paymentMethodReq.paymentMethod.id);
        setPayemntMethodType(paymentMethod);
        setIsPaymentMethodAdded(true);
      }
    } catch (error) {
      toast.error('Payment Method Failed!');
    } finally {
      setLoader(false);
    }
  };

  const handlePayment = (e) => {
    e.preventDefault();
    if (paymentMethod === 'card') {
      handleCardSubmit(cardSubmit)();
    } else if (paymentMethod === 'bank') {
      handleBankSubmit(bankSubmit)();
    }
  };

  return (
    <>
      <form onSubmit={handlePayment} className=" space-y-4">
        {isPaymentMethodAdded ? (
          <span className='text-blue-300 text-xl font-medium'>Payment method has been added, please proceed</span>
        ) : (
          <>
            <div className="space-y-2">
              <p className="text-sm font-medium text-[#6E6E6E]">
                Payment method
              </p>
              <div className="grid grid-cols-3 gap-4 justify-center items-center"></div>
            </div>
            <div className="flex flex-wrap items-center justify-between">
              <div className="space-x-4 md:space-x-4 flex items-center">
                <input
                  type="radio"
                  name="payment"
                  id="card"
                  value="card"
                  defaultChecked={true}
                  className="h-5 w-5 box-border cursor-pointer checked:border-nav-blue appearance-none border checked:!border-[6px] rounded-full border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <label
                  htmlFor="card"
                  className={clsx(
                    'lg:text-lg cursor-pointer text-nav-blue font-semibold'
                  )}
                >
                  Credit Card
                </label>
              </div>
              <div className="flex gap-2 items-center">
                <Image
                  src="/icons/cardGroup.svg"
                  className=""
                  width={148}
                  height={24}
                  alt="card group"
                />
                <Popover className="relative">
                  <PopoverButton className="text-[#6E6E6E] mobile:mt-2 font-medium">
                    +more
                  </PopoverButton>
                  <PopoverPanel
                    anchor="bottom end"
                    className="flex flex-col mt-5"
                  >
                    <Image
                      src="/icons/methodGp.svg"
                      className=""
                      width={246}
                      height={84}
                      alt="card group"
                    />
                  </PopoverPanel>
                </Popover>
              </div>
            </div>
            {paymentMethod === 'card' && (
              <>
                <div className="w-full space-y-4">
                  <Input
                    {...register('nameOnCard')}
                    placeholder="Name on Card"
                    error={errors.nameOnCard?.message}
                    className="text-sm px-4 py-2.5 h-11 placeholder:text-black-100 placeholder:!font-medium border-black-100 !leading-5"
                  />
                  <div className="stripe-input placeholder:text-black-100 placeholder:!font-medium border-black-100 border bg-white focus:border-omblue-500 focus:bg-[#f3f7f9] text-h9 2xl:text-scaled-h9 font-medium px-4 py-3 rounded-md w-full">
                    <CardNumberElement
                      options={{
                        showIcon: false,
                        placeholder: 'Card Number',
                        style: {
                          base: {
                            '::placeholder': {
                              color: 'rgb(178 178 178)',
                              fontSize: '14px',
                              fontWeight: 500,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                  <div className="flex items-center w-full gap-[18px]">
                    <div className="stripe-input placeholder:text-black-100 placeholder:!font-medium border-black-100 border bg-white focus:border-omblue-500 focus:bg-[#f3f7f9] text-h9 2xl:text-scaled-h9 font-medium px-4 py-3 rounded-md w-full">
                      <CardExpiryElement
                        options={{
                          placeholder: 'Expiry',
                          style: {
                            base: {
                              '::placeholder': {
                                color: 'rgb(178 178 178)',
                                fontSize: '14px',
                                fontWeight: 500,
                              },
                            },
                          },
                        }}
                      />
                    </div>
                    <div className="stripe-input placeholder:text-black-100 placeholder:!font-medium border-black-100 border bg-white focus:border-omblue-500 focus:bg-[#f3f7f9] text-h9 2xl:text-scaled-h9 font-medium px-4 py-3 rounded-md w-full">
                      <CardCvcElement
                        options={{
                          style: {
                            base: {
                              '::placeholder': {
                                color: 'rgb(178 178 178)',
                                fontSize: '14px',
                                fontWeight: 500,
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {paymentMethod === 'bank' && (
              <BankAccount
                setSelectedAccountType={setSelectedAccountType}
                selectedAccountType={selectedAccountType}
                register={bankRegister}
                errors={bankErrors}
                bankAccountTypes={bankAccountTypes}
              />
            )}

            {paymentMethod !== '' && (
              <div className="space-y-4">
                <div className="flex gap-2 mobile:items-baseline">
                  <input
                    type="checkbox"
                    name="agree"
                    id="agree"
                    className=" appearance-none checked:bg-contain min-h-4 min-w-4 max-w-4  max-h-4 rounded-sm border border-grey-800 checked:bg-nav-blue checked:border-nav-blue focus:outline-none checked:[background-image:url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAgM0w0LjUgOC41TDIgNiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] "
                    onChange={(e) => {
                      setAgreeTermAndConditions(e.target.checked);
                    }}
                  />
                  <label
                    htmlFor="agree"
                    className=" flex flex-col gap-4 leading-6 text-sm xs:w-52 sm:!w-auto text-blue-300 text-left font-medium"
                  >
                    <span>
                      You are responsible for providing the money to match the
                      donations received by the campaign owner for the period
                      specified in &quot;Duration&quot; above and to the the
                      degree specified in &quot;Impact&quot; above.
                    </span>
                    <span>
                      For any amount entered into the &quot;Minimum
                      Support&quot; field above, those amounts will be deducted
                      from your payment method immediately and held in escrow
                      until the campaign is completed. You will be responsible
                      for the remaining balance when the campaign is completed
                    </span>
                  </label>
                </div>

                <Button
                  className="w-full"
                  onClick={handlePayment}
                  disabled={loader || !agreeTermAndConditions}
                >
                  Add Payment Method
                </Button>

                <div className="flex items-center justify-center gap-2">
                  <Image
                    src="/icons/lock.svg"
                    width={20}
                    height={20}
                    alt="lock"
                    className="w-5 min-h-5"
                  />
                  <p className="text-sm font-medium text-text-gray">
                    Payments are secure and encrypted
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </form>
    </>
  );
};

export default SponsorPaymentMethod;

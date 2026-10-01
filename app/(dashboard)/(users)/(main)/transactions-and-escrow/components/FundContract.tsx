import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import Input from '@/components/ui/input';
import { cardSchema } from '@/utils/marketing/schemas';
import { Button } from '@/components/marketing';
import { contractApi } from '@/app/api/dashboard/transactions-and-escrow';

const FundContract = ({ details, onSubmit }) => {
  const stripe = useStripe();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loader, setLoader] = useState(false);
  const elements = useElements();

  const {
    register,
    handleSubmit: handleCardSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(cardSchema),
  });

  const cardSubmit = async (data) => {
    try {
      setLoader(true);
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!stripe || !elements) {
        return;
      }
      const cardNumberElement = elements.getElement(CardNumberElement);

      const paymentMethodReq = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement,
        billing_details: {
          name: data.nameOnCard,
        },
      });

      if (paymentMethodReq.error) {
        toast.error('Payment Failed!');
        toast.error('Payment Failed!', { containerId: 'containerA' });
        console.error(paymentMethodReq.error.message);
        setLoader(false);
      } else {
        const verifyPayment = await contractApi.fundContractEscrow({
          ContractCreatorId: userData?.Id,
          ContractPartyId: details?.expert?.join(','),
          PaymentMethodId: paymentMethodReq.paymentMethod?.id,
          ContractAmount: details?.Budget,
        });

        if (verifyPayment) {
          onSubmit(paymentMethodReq.paymentMethod?.id, verifyPayment[0]);
        }
      }
    } catch (error) {
      toast.error(error?.response?.Message || 'Payment Failed!', {
        containerId: 'containerA',
      });
      setLoader(false);
    }
  };

  const handlePayment = (e) => {
    e.preventDefault();
    if (paymentMethod === 'card') {
      handleCardSubmit(cardSubmit)();
    }
  };

  return (
    <>
      <form onSubmit={handlePayment} className=" space-y-4">
        {paymentMethod === 'card' && (
          <>
            <div className="w-full space-y-4 my-6">
              <Input
                {...register('nameOnCard')}
                placeholder="Name on card"
                error={errors.nameOnCard?.message}
              />
              <div className="stripe-input border bg-white focus:border-omblue-500 focus:bg-[#f3f7f9] text-h9 2xl:text-scaled-h9 font-medium px-4 py-3 rounded-md w-full">
                <CardNumberElement options={{ showIcon: true }} />
              </div>
              <div className="flex items-center w-full gap-[18px]">
                <div className="stripe-input border bg-white focus:border-omblue-500 focus:bg-[#f3f7f9] text-h9 2xl:text-scaled-h9 font-medium px-4 py-3 rounded-md w-full">
                  <CardExpiryElement />
                </div>
                <div className="stripe-input border bg-white focus:border-omblue-500 focus:bg-[#f3f7f9] text-h9 2xl:text-scaled-h9 font-medium px-4 py-3 rounded-md w-full">
                  <CardCvcElement />
                </div>
              </div>
            </div>
            <Button
              className="w-full"
              onClick={handlePayment}
              disabled={loader}
            >
              I&apos;m ready to build!
            </Button>
          </>
        )}
      </form>
    </>
  );
};

export default FundContract;

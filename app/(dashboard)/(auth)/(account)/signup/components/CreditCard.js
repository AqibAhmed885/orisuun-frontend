import { Input } from '../../../../../../components/marketing/Input';

export const CreditCard = ({ register, errors }) => {
  return (
    <div className="grid grid-cols-2 gap-4 pb-4">
      <Input
        name="nameOnCard"
        {...register('nameOnCard')}
        errors={errors}
        placeHolder="Name on Card"
        containClass="col-span-2"
      />
      <Input
        name="cardNumber"
        {...register('cardNumber')}
        errors={errors}
        placeHolder="Card Number"
        containClass="col-span-2"
      />
      <Input
        name="expiry"
        {...register('expiry')}
        errors={errors}
        placeHolder="Expiry"
      />
      <Input
        name="cvc"
        {...register('cvc')}
        errors={errors}
        placeHolder="CVC"
        type="number"
      />
    </div>
  );
};

import { Input } from '../../../../../components/marketing/Input';

export const InputDetails = ({ register, errors }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Input
        name="firstName"
        {...register('firstName')}
        placeHolder="First Name"
        errors={errors}
      />
      <Input
        name="lastName"
        {...register('lastName')}
        placeHolder="Last Name"
        errors={errors}
      />
      <Input
        name="email"
        {...register('email')}
        placeHolder="Email"
        errors={errors}
        type="email"
        containClass="col-span-2"
      />
    </div>
  );
};

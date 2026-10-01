import React from 'react';
import Input from '@/components/ui/input';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { BusinessOpportunitiesData } from '@/utils/schema';

interface RepresentativeSectionProps {
  register: UseFormRegister<BusinessOpportunitiesData>;
  errors: FieldErrors<BusinessOpportunitiesData>;
}

const RepresentativeSection: React.FC<RepresentativeSectionProps> = ({
  register,
  errors,
}) => (
  <div className="space-y-2">
    <h5 className="text-h5 2xl:text-scaled-h5 font-semibold text-blue-500">
      Business Development Representative
    </h5>
    <p className="text-h9 2xl:text-scaled-h9 text-blue-300 font-medium mb-2">
      Please enter contact details for the opportunity's point of contact
    </p>
    <div className="space-y-2">
      <Input
        placeholder="Representative Name"
        {...register('representativeName')}
        error={errors.representativeName?.message}
      />
      <Input
        placeholder="Job Title"
        {...register('jobTitle')}
        error={errors.jobTitle?.message}
      />
      <Input
        placeholder="Phone (Optional)"
        {...register('phone')}
        error={errors.phone?.message}
      />
      <Input
        placeholder="Email"
        {...register('email')}
        error={errors.email?.message}
      />
    </div>
  </div>
);

export default RepresentativeSection;
import Input from '@/components/ui/input';
import { CampaignSchema } from '@/utils/schema';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const SocialLinks: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CampaignSchema>();

  return (
    <div>
      <div className="flex flex-col w-full mb-10 rounded-lg gap-6">
        <div className="space-y-3">
          <label className="text-xl leading-[130%] text-blue-500 font-semibold">
            Social Media Links
          </label>
          <Input
            placeholder="Youtube Link  e.g. https://youtube.com/companypagename"
            {...register('YoutubeLink')}
            error={errors.YoutubeLink?.message}
            containerClass="md:w-full placeholder:text-black-200 text-sm"
          />
          <Input
            placeholder="Facebook Link  e.g. https://facebook.com/companypagename"
            {...register('FacebookLink')}
            error={errors.FacebookLink?.message}
            containerClass="md:w-full placeholder:text-black-200 text-sm"
          />
          <Input
            placeholder="Linkedin Link  e.g. https://linkedin.com/companypagename"
            {...register('LinkedInLink')}
            error={errors.LinkedInLink?.message}
            containerClass="md:w-full placeholder:text-black-200 text-sm"
          />

          <Input
            placeholder="Bluesky  Link  e.g. https://bluesky.com/companypagename"
            {...register('BlueSkyLink')}
            error={errors.BlueSkyLink?.message}
            containerClass="md:w-full placeholder:text-black-200 text-sm"
          />

          <Input
            placeholder="Instagram Link  e.g. https://instagram.com/companypagename"
            {...register('InstagramLink')}
            error={errors.InstagramLink?.message}
            containerClass="md:w-full placeholder:text-black-200 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default SocialLinks;

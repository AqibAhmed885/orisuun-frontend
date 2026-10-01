'use client';

import Campaign from '@/components/fundraising/campaign-details';
import React from 'react';

interface PageProps {
  params: { id: number };
}

const CampaignDetails = ({ params }: PageProps) => {
  return <Campaign CampaignId={params.id} />;
};

export default CampaignDetails;

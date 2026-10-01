import type { FC } from 'react';
import { NodesSectionsBlackOwned } from '@/components/cards/nodes/sections/black-owned';
import clsx from 'clsx';
import { NodesSectionsExperts } from '@/components/cards/nodes/sections/expert';
import { NodesSectionsConsultants } from '@/components/cards/nodes/sections/consultants';
import { NodesSectionsInvestors } from '@/components/cards/nodes/sections/investor';
import { NodesSectionsPartners } from '@/components/cards/nodes/sections/partner';
import { NodesSectionsProfessionals } from '@/components/cards/nodes/sections/professional';
import { NodesSectionsMentors } from '@/components/cards/nodes/sections/mentor';
import { NODE_WIDTH_05 } from '@/components/cards/nodes/constants';
import { NodesSectionsPeople } from '@/components/cards/nodes/sections/people';
import { USER_KEYS } from '@/components/cards/nodes/sections/constants';
import { CardsNodesOpen } from '@/components/cards/nodes/open';

const W = 1440;
const W_05 = W / 2;

const H = 861 - 208; //653

export const CardsNodes: FC = () => {
  return (
    <div
      className={clsx('relative flex flex-col items-center')}
      style={{ height: H }}
    >
      <div
        className="relative flex flex-row justify-between w-full"
        style={{ width: W }}
      >
        <div
          className="relative flex flex-col gap-[84px]"
          style={{ left: 190 }}
        >
          <NodesSectionsExperts />
          <NodesSectionsConsultants />
        </div>
        <div
          className="relative flex flex-row justify-between mt-[10px]"
          style={{
            width: W_05 - 190 + NODE_WIDTH_05,
            right: 190,
          }}
        >
          <NodesSectionsInvestors />
          <NodesSectionsPartners />
        </div>
      </div>
      <div className="h-[62px]" />
      <div
        className="relative flex flex-row justify-between"
        style={{ width: W - 660 }}
      >
        <NodesSectionsProfessionals />
        <NodesSectionsMentors />
      </div>
      <div>
        <NodesSectionsBlackOwned />
      </div>
      <div className="h-[60px]" />
      <NodesSectionsPeople />
      <div className="h-[60px]" />
      {USER_KEYS.map((key) => (
        <CardsNodesOpen key={key} openKey={key} />
      ))}
    </div>
  );
};

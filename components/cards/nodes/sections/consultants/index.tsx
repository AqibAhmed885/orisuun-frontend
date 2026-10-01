'use client';
import { useEffect, useState } from 'react';
import { CardsNodesFloating } from '@/components/cards/nodes/floating';
import { CardsNodesSectionsConsultantsIcon } from '@/components/cards/nodes/sections/consultants/icon';
import { NodesSectionsConsultantsPath } from '@/components/cards/nodes/sections/consultants/path';
import { DEFAULT_VARIANTS } from '@/components/cards/nodes/constants';
import { setUserType } from '@/data/slices/animation-slice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/data/store';

export const THE_MANAGEMENT_CONSULTANTS = {
  tagTitle: 'The Strategy Consultants',
  tagNote: [],
  btnTags: [
    'Can be verified',
    'Access to Team Forming',
    'Have option to charge',
  ],
  tagDescription:
    'Those accomplished and practicing strategy consultants currently or recently employed at a national-level management consulting firm. Students at select graduate-level business schools also qualify.',
  tagRole: [
    'Research specific business issues and report back with detailed models, plans, and options.',
    'Keep your business ahead of the competition with strategic planning.',
  ],
  img: '/home/images/image-five-mobile.png',
};

export const NodesSectionsConsultants = () => {
  const dispatch = useDispatch();
  const userType = useSelector((state: RootState) => state.animation.userType);

  useEffect(() => {
    const storedUserType = localStorage.getItem('userType');
    if (storedUserType) {
      dispatch(setUserType(storedUserType));
    }
  }, [dispatch]);


  return (
    <CardsNodesFloating
      overlay="consultants"
      Icon={CardsNodesSectionsConsultantsIcon}
      Path={NodesSectionsConsultantsPath}
      pathProps={{
        classValue: 'absolute left-[20px] -top-[110px]',
      }}
      showGradientBorder={userType == 'strategy-consultants'}
      isAnimatedOnCentral={false}
      classValue="top-[-25px]"
      initial="offscreen"
      whileInView="onscreen"
      forceShowPath={userType == 'strategy-consultants'}
      viewport={{ once: true }}
      variants={{
        ...DEFAULT_VARIANTS,
      }}
      dataIndex={4}
    >
      Strategy
      <br />
      Consultants
    </CardsNodesFloating>
  );
};

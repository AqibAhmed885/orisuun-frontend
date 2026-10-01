'useClient'
import { FC, useEffect, useState } from 'react';
import { CardsNodesFloating } from '@/components/cards/nodes/floating';
import { TNodeProps } from '@/components/cards/nodes/types';
import { NODE_BOTTOM_WIDTH } from '@/components/cards/nodes/constants';

type TProps = TNodeProps;


export const CardsNodesBottom: FC<TProps> = ({ children, style, ...props }) => {
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const storedUserType = typeof window !== 'undefined' &&
      (localStorage.getItem('userType'));
    setUserType(storedUserType);
  }, []);
  return (
    <CardsNodesFloating
      cardProps={
        {
          classValue: 'z-0',
        }
      }
      glowProps={{ width: NODE_BOTTOM_WIDTH }}
      showGradientBorder={userType == 'advocates'}
      forceShowPath={
        typeof window !== 'undefined' &&
        localStorage.getItem('userType') === 'advocates'
      }
      style={{ width: NODE_BOTTOM_WIDTH, ...style }}
      dataIndex={0}
      {...props}
    >
      {children}
    </CardsNodesFloating>
  );
};

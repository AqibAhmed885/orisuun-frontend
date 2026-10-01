import type { FC } from 'react';
import { CardsNodesModal } from '@/components/cards/nodes/modal';
import { TUserKey } from '@/components/cards/nodes/sections/constants';
import { useCardsNodesSectionsOpen } from '@/components/cards/nodes/sections/context/open';
import { createPortal } from 'react-dom';
import { AnimatePresence } from 'framer-motion';

export const resolveOpenSrc = (key: TUserKey) =>
  `/home/images/ecosystem/${key}.png`;
type TProps = {
  openKey: TUserKey;
};
export const CardsNodesOpen: FC<TProps> = ({ openKey }) => {
  const open = useCardsNodesSectionsOpen();
  const isOpen = open.key === openKey;
  return (
    <>
      {isOpen
        ? createPortal(
            <CardsNodesModal src={resolveOpenSrc(open.key)} />,
            document.body
          )
        : null}
    </>
  );
};

import React, { useEffect, useState } from 'react';
import { Details } from '../../../(dashboard)/(auth)/(account)/signup/components/Contribution/details';
import { Methods } from '../../../(dashboard)/(auth)/(account)/signup/components/Contribution/methods';
import Modal from '../../../../components/marketing/Payment Modal/Modal';
import { SuccessModal } from '@/app/(dashboard)/(auth)/(account)/signup/components/Contribution/successModal';
const FundBtn = ({
  children,
  className,
  type = 'button',
  defaultContent = 'details',
  isCancelOpen = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(defaultContent); // Set initial state based on prop

  useEffect(() => {
    if (isCancelOpen) {
      setIsModalOpen(true);
      setModalContent('method');  // Optionally set the content to 'method' when isCancelOpen is true
    }
  }, [isCancelOpen]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const renderModalContent = () => {
    switch (modalContent) {
      case 'details':
        return <Details onNext={() => setModalContent('method')} />;
      case 'method':
        return (
          <Methods
            onClose={handleCloseModal}
            onBack={() => setModalContent('details')}
          />
        );
      case 'success':
        return <SuccessModal onClose={handleCloseModal} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center">
      <button onClick={openModal} type={type} className={`z-[3] ${className}`}>
        {children}
      </button>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} className={`z-30`}>
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default FundBtn;

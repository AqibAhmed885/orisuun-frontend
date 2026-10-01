import React from 'react';

interface LeaveGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  communityName?: string | null;
  onConfirm: () => void;
}

const LeaveGroupModal: React.FC<LeaveGroupModalProps> = ({ isOpen, onClose, communityName, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-gray-950/50 backdrop-blur-md " onClick={onClose} />

      <div className="relative w-full max-w-2xl mx-4 sm:mx-0 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-2xl font-bold text-gray-900">Leave this group</h3>
            <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          <p className="mt-4 text-gray-600">You will no longer receive updates from {communityName ?? 'this group'}. Would you still like to leave this group?</p>

          <div className="mt-6 flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 border border-gray-200 rounded-full text-gray-800 font-semibold bg-white"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 py-3 px-6 rounded-full bg-[#2357C6] text-white font-semibold"
            >
              Leave
            </button>
          </div>
        </div>
      </div>
      </div>
  );
};

export default LeaveGroupModal;

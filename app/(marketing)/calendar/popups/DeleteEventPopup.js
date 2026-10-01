import { CloseIcon } from '../../../../public/icons/calendar/Icons.tsx';
import { useState } from 'react';
import { Slide, toast } from 'react-toastify';
import { requestEventDelete } from '../../../api/marketing/eventService.js';
import dynamic from 'next/dynamic';

const ToastContainer = dynamic(
  () => import('react-toastify').then(mod => mod.ToastContainer),
  { ssr: false }
);

const DeleteEventPopup = ({ isOpen, onClose, eventData }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [reason, setReason] = useState('Canceled')

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (!eventData?.id) {
      setError('No event selected for deletion');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await requestEventDelete(eventData.id, reason);
      toast.success("Delete request sent!");
      setTimeout(() => {
        onClose();
      }, 3000);
    }
    catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to delete event", {
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <>
      <ToastContainer
        transition={Slide}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.57)] z-50">
        <div className="bg-white md:p-12 p-5 rounded-[20px] shadow-price5 w-[90%] md:w-[559px]">
          <div className="flex gap-2 justify-between items-start">
            <div className="flex flex-col gap-1 justify-between items-start">
              <h2 className="text-2xl font-semibold text-blue-strong">
                Request Deletion
              </h2>
              <p className="text-blu-ray-300 text-base font-medium">
                Are you sure you want to delete this event?
              </p>
              <label htmlFor="reason-select">Reason:<span className='text-red-500'>*</span></label>
              <select className='md:p-1 border border-black-400 rounded focus:outline-none' value={reason} onChange={(e) => setReason(e.target.value)}>
                <option value="Canceled">Canceled</option>
                <option value="Duplicate">Duplicate Entry</option>
                <option value="Irrelevant">Irrelevant</option>
                <option value="Other">Other</option>
              </select>
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>
            {/* Close Button */}
            <button onClick={onClose} className="">
              <CloseIcon size={30} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-7">
            <button
              className="bg-omblue-500 text-white px-4 py-3 rounded-xl text-lg font-semibold w-full"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              className="bg-[#797B82] text-white px-4 py-3 rounded-xl text-lg font-semibold w-full flex items-center justify-center"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
              ) : null}
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteEventPopup;
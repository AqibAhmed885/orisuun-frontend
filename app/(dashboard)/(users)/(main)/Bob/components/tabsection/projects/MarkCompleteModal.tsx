'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { ProjectItem } from './types';
import axios from 'axios';
import { toast } from 'react-toastify';

const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`;
const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

const MarkCompleteModal = ({
  isOpen,
  onClose,
  project,
  onCompleted,
}: {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectItem;
    onCompleted?: () => void;
}) => {
  const [keepVisible, setKeepVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setKeepVisible(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const userData = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userData') || '{}');
      const userId = userData?.Id;

      if (!userId) {
        toast.error('User not found. Please log in again.');
        return;
      }

      const payload = {
        Id: project.id,
        UserId: userId,
        Status: 'Completed',
        ProjectName: project.title,
      };

      const response = await axios.put(`${apiEndpoint}/Projects/UpdateProject`, payload, {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
          XApiKey: apiKey,
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success('Project marked as completed successfully.');
        onClose();
        onCompleted?.();
      } else {
        toast.error(response?.data?.Message || 'Failed to update project status.');
      }
    } catch (error: any) {
      console.error('❌ Mark complete error:', error);
      toast.error(error?.response?.data?.Message || error?.message || 'Failed to update project status.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-gray-900/35 p-4" onClick={onClose}>
      <div
        className="w-full max-w-[630px] rounded-xl bg-white p-4 sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#11224D] sm:text-3xl">Mark Project as Complete?</h2>
            <p className="mt-2 text-sm text-[#667085] sm:text-base">
              This will mark the project as complete. Members will see a final update.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-[#667085] hover:bg-[#F2F4F7]"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <label className="mb-8 inline-flex cursor-pointer items-center gap-3 text-base font-medium text-[#11224D] sm:text-sm">
          <input
            type="checkbox"
            checked={keepVisible}
            onChange={(event) => setKeepVisible(event.target.checked)}
            className="h-4 w-4 rounded border border-[#CBD5E1] text-[#2357C6] accent-[#2357C6]"
          />
          Keep visible on profile (recommended)
        </label>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={isLoading}
          className={`h-10 w-full rounded-xl text-xl font-semibold text-white transition sm:text-base ${isLoading ? 'cursor-not-allowed bg-[#A8C5F0]' : 'bg-[#2357C6] hover:bg-[#1849A9]'
            }`}
        >
          {isLoading ? 'Updating...' : 'Mark as Complete'}
        </button>
      </div>
    </div>
  );
};

export default MarkCompleteModal;

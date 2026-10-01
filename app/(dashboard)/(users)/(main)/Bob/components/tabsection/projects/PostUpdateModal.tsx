'use client';

import React, { useEffect, useState } from 'react';
import { Upload, X } from 'lucide-react';
import type { ProjectItem } from './types';
import axios from 'axios';
import { toast } from 'react-toastify';

type PostUpdateForm = {
  title: string;
  details: string;
  attachment: File | null;
};

type PostUpdateErrors = Partial<Record<keyof PostUpdateForm, string>>;

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const SUPPORTED_FILE_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`;
const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

const PostUpdateModal = ({
  isOpen,
  onClose,
  project,
  onPosted,
}: {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectItem;
    onPosted?: () => void;
}) => {
  const [form, setForm] = useState<PostUpdateForm>({
    title: '',
    details: '',
    attachment: null,
  });
  const [errors, setErrors] = useState<PostUpdateErrors>({});
  const [isDragging, setIsDragging] = useState(false);
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

  if (!isOpen) return null;

  const validateFile = (file: File | null) => {
    if (!file) return 'Project attachment is required.';
    if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
      return 'Please upload a PDF or image file (PNG, JPG, JPEG, WEBP).';
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return 'File size must be 10MB or less.';
    }

    return '';
  };

  const validate = () => {
    const nextErrors: PostUpdateErrors = {};

    if (!form.title.trim()) {
      nextErrors.title = 'Updated project title is required.';
    } else if (form.title.trim().length < 3) {
      nextErrors.title = 'Updated project title must be at least 3 characters.';
    }

    if (!form.details.trim()) {
      nextErrors.details = 'Project details are required.';
    } else if (form.details.trim().length < 20) {
      nextErrors.details = 'Project details should be at least 20 characters.';
    }

    const fileError = validateFile(form.attachment);
    if (fileError) {
      nextErrors.attachment = fileError;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleAttachmentChange = (file: File | null) => {
    setForm((prev) => ({ ...prev, attachment: file }));
    setErrors((prev) => ({ ...prev, attachment: undefined }));

    const fileError = validateFile(file);
    if (fileError) {
      setErrors((prev) => ({ ...prev, attachment: fileError }));
    }
  };

  const uploadPostAttachment = async (file: File): Promise<string> => {
    const sasTokenResponse = await axios.get(
      `${apiEndpoint}/UserVerification/GenerateUploadFileSasTokenForChatDocuments`,
      {
        headers: {
          XApiKey: apiKey,
        },
      }
    );

    const token = sasTokenResponse?.data?.Result?.token;
    if (!token) {
      throw new Error('Failed to get upload token');
    }

    const fileExtension = file.name.split('.').pop() || 'file';
    const fileName = `${crypto.randomUUID()}.${fileExtension}`;
    const blobUrl = `https://orisuundocumentsdev.blob.core.windows.net/chat-documents/${fileName}?${token}`;

    const uploadResponse = await axios.put(blobUrl, file, {
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': file.type || 'application/octet-stream',
      },
    });

    if (uploadResponse.status !== 201) {
      throw new Error('Failed to upload attachment');
    }

    return blobUrl.split('?')[0];
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const userData = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userData') || '{}');
      const userId = userData?.Id;

      if (!userId) {
        toast.error('User not found. Please log in again.');
        return;
      }

      if (!form.attachment) {
        toast.error('Attachment is required');
        return;
      }

      const attachmentUrl = await uploadPostAttachment(form.attachment);

      const payload = {
        ProjectId: project.id,
        UserId: userId,
        Title: form.title,
        Detail: form.details,
        AttachmentUrl: attachmentUrl,
      };

      const response = await axios.post(`${apiEndpoint}/Projects/CreateProjectPost`, payload, {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
          XApiKey: apiKey,
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success('Project update posted successfully!');
        onClose();
        setForm({ title: '', details: '', attachment: null });
        setErrors({});
        onPosted?.();
      } else {
        toast.error(response.data?.Message || 'Failed to post update');
      }
    } catch (error: any) {
      console.error('❌ Post update error:', error);
      toast.error(error?.response?.data?.Message || error.message || 'Failed to post project update');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/30 p-4" onClick={onClose}>
      <div
        className="w-full max-w-[780px] rounded-xl bg-white p-6 sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#11224D] sm:text-[28px]">Post an Update</h2>
            <p className="mt-2 text-sm text-[#667085] sm:text-[16px]">
              Share progress on "{project.title}" with your community
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-[#667085] hover:bg-[#F2F4F7]"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-base font-semibold text-[#11224D] sm:text-base" htmlFor="updateTitle">
              Updated Project Title
            </label>
            <input
              id="updateTitle"
              type="text"
              value={form.title}
              onChange={(event) => {
                setForm((prev) => ({ ...prev, title: event.target.value }));
                setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="Update Title (e.g Construction Begins)"
              className="h-12 w-full rounded-lg border border-[#D0D5DD] px-4 text-sm text-[#1D2939] outline-none placeholder:text-[#98A2B3] focus:border-[#2357C6]"
            />
            {errors.title ? <p className="mt-1 text-sm text-[#D92D20]">{errors.title}</p> : null}
          </div>

          <div>
            <label className="mb-2 block text-base font-semibold text-[#11224D] sm:text-base" htmlFor="updateDetails">
              Update Project details
            </label>
            <textarea
              id="updateDetails"
              value={form.details}
              onChange={(event) => {
                setForm((prev) => ({ ...prev, details: event.target.value }));
                setErrors((prev) => ({ ...prev, details: undefined }));
              }}
              placeholder="Details (e.g What’s new?, Share progress, Challenges and next step)"
              className="min-h-[110px] w-full rounded-lg border border-[#D0D5DD] px-4 py-3 text-sm text-[#1D2939] outline-none placeholder:text-[#98A2B3] focus:border-[#2357C6]"
            />
            {errors.details ? <p className="mt-1 text-sm text-[#D92D20]">{errors.details}</p> : null}
          </div>

          <div>
            <label className="mb-2 block text-base font-semibold text-[#11224D] sm:text-base" htmlFor="projectAttachment">
              Project Attachment (Image or PDF)
            </label>
            <label
              className={`flex min-h-[140px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-6 transition ${
                isDragging ? 'border-[#2357C6] bg-[#EEF4FF]' : 'border-[#D0D5DD] bg-white'
              }`}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                const file = event.dataTransfer.files?.[0] ?? null;
                handleAttachmentChange(file);
              }}
            >
              <input
                type="file"
                accept="application/pdf,image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={(event) => handleAttachmentChange(event.target.files?.[0] ?? null)}
              />

              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF4FF]">
                <Upload className="h-5 w-5 text-[#2357C6]" />
              </div>
              <p className="text-center text-sm text-[#475467]">
                <span className="font-semibold text-[#2357C6]">Click to upload</span> or drag and drop
              </p>
              <p className="mt-1 text-center text-xs text-[#2357C6]">PDF OR IMAGE (max. 10MB)</p>
              {form.attachment ? <p className="mt-2 text-sm font-medium text-[#1D2939]">{form.attachment.name}</p> : null}
            </label>
            {errors.attachment ? <p className="mt-1 text-sm text-[#D92D20]">{errors.attachment}</p> : null}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`h-12 w-full rounded-lg text-base font-semibold text-white transition sm:text-base ${isLoading ? 'cursor-not-allowed bg-[#A8C5F0]' : 'bg-[#2357C6] hover:bg-[#1849A9]'
              }`}
          >
            {isLoading ? 'Posting Update...' : 'Post Update'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostUpdateModal;

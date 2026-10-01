'use client';

import React, { useEffect, useState } from 'react';
import { Upload, X } from 'lucide-react';
import type { NewProjectErrors, NewProjectForm } from './types';
import { toast } from 'react-toastify';
import axios from 'axios';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const SUPPORTED_FILE_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`;
const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

const NewProjectModal = ({
  isOpen,
  onClose,
  onCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
    onCreated?: () => void;
}) => {
  const [form, setForm] = useState<NewProjectForm>({
    projectName: '',
    projectHeadline: '',
    projectDescription: '',
    attachment: null,
  });
  const [errors, setErrors] = useState<NewProjectErrors>({});
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
    const nextErrors: NewProjectErrors = {};

    if (!form.projectName.trim()) {
      nextErrors.projectName = 'Project name is required.';
    } else if (form.projectName.trim().length < 3) {
      nextErrors.projectName = 'Project name must be at least 3 characters.';
    }

    if (!form.projectHeadline) {
      nextErrors.projectHeadline = 'Project headline is required.';
    }

    if (!form.projectDescription.trim()) {
      nextErrors.projectDescription = 'Project description is required.';
    } else if (form.projectDescription.trim().length < 20) {
      nextErrors.projectDescription = 'Project description should be at least 20 characters.';
    }

    const fileError = validateFile(form.attachment);
    if (fileError) {
      nextErrors.attachment = fileError;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const updateField = (field: keyof NewProjectForm, value: NewProjectForm[keyof NewProjectForm]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleAttachmentChange = (file: File | null) => {
    updateField('attachment', file);

    const fileError = validateFile(file);
    if (fileError) {
      setErrors((prev) => ({ ...prev, attachment: fileError }));
    }
  };

  const uploadProjectAttachment = async (file: File): Promise<string> => {
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
      // Get userId from localStorage
      const userData = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userData') || '{}');
      const userId = userData?.Id;

      if (!userId) {
        toast.error('User not found. Please log in again.');
        setIsLoading(false);
        return;
      }

      if (!form.attachment) {
        toast.error('Attachment is required');
        setIsLoading(false);
        return;
      }

      const attachmentUrl = await uploadProjectAttachment(form.attachment);

      const payload = {
        UserId: userId,
        ProjectName: form.projectName,
        Headline: form.projectHeadline,
        Description: form.projectDescription,
        AttachmentUrl: attachmentUrl,
        Location: 'N/A',
        CountryId: null,
        StateId: null,
        CityId: null,
        StartedDate: new Date().toISOString(),
        Status: 'In Progress',
      };

      const response = await axios.post(`${apiEndpoint}/Projects/CreateProject`, payload, {
        headers: {
          'Content-Type': 'application/json',
          XApiKey: apiKey,
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success('Project created successfully!');
        onClose();
        setForm({
          projectName: '',
          projectHeadline: '',
          projectDescription: '',
          attachment: null,
        });
        setErrors({});

        onCreated?.();
      } else {
        toast.error(response.data?.Message || 'Failed to create project');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while creating the project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/30 p-4" onClick={onClose}>
      <div
        className="w-full max-w-[760px] rounded-xl bg-white p-6 sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-2xl md:text-[28px] font-semibold md:font-bold text-[#11224D]">Start a New Project</h2>
            <p className="mt-2 text-base leading-tight text-[#667085] ">
              Create a new project to share with your community
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
            <label className="mb-2 block font-semibold text-[#11224D] text-[16px]" htmlFor="projectName">
              Project Name
            </label>
            <input
              id="projectName"
              type="text"
              value={form.projectName}
              onChange={(event) => updateField('projectName', event.target.value)}
              placeholder="Project name"
              className="h-12 w-full rounded-lg border border-[#D0D5DD] px-4 text-[16px] text-[#1D2939] outline-none placeholder:text-[#98A2B3] focus:border-[#2357C6]"
            />
            {errors.projectName ? <p className="mt-1 text-sm text-[#D92D20]">{errors.projectName}</p> : null}
          </div>

          <div>
            <label className="mb-2 block  font-semibold text-[#11224D] sm:text-[16px]" htmlFor="projectHeadline">
              Project Headline
            </label>
            <input
              id="projectHeadline"
              type="text"
              value={form.projectHeadline}
              onChange={(event) => updateField('projectHeadline', event.target.value)}
              placeholder="Enter project headline"
              className="h-12 w-full rounded-lg border border-[#D0D5DD] px-4 text-[16px] text-[#1D2939] outline-none placeholder:text-[#98A2B3] focus:border-[#2357C6]"
            />
            {errors.projectHeadline ? <p className="mt-1 text-sm text-[#D92D20]">{errors.projectHeadline}</p> : null}
          </div>

          <div>
            <label
              className="mb-2 block  font-semibold text-[#11224D] sm:text-[16px]"
              htmlFor="projectDescription"
            >
              Project Description
            </label>
            <textarea
              id="projectDescription"
              value={form.projectDescription}
              onChange={(event) => updateField('projectDescription', event.target.value)}
              placeholder="Description (e.g briefly describe this project and what it means to your business)"
              className="min-h-[110px] w-full rounded-lg border border-[#D0D5DD] px-4 py-3 text-[16px] text-[#1D2939] outline-none placeholder:text-[#98A2B3] focus:border-[#2357C6]"
            />
            {errors.projectDescription ? <p className="mt-1 text-sm text-[#D92D20]">{errors.projectDescription}</p> : null}
          </div>

          <div>
            <label className="mb-2 block  font-semibold text-[#11224D] sm:text-[16px]">
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
              {form.attachment ? (
                <p className="mt-2 text-sm font-medium text-[#1D2939]">{form.attachment.name}</p>
              ) : null}
            </label>
            {errors.attachment ? <p className="mt-1 text-sm text-[#D92D20]">{errors.attachment}</p> : null}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`h-12 w-full rounded-lg font-semibold text-white transition text-[16px] ${isLoading
                ? 'cursor-not-allowed bg-[#A8C5F0] text-[#98A2B3]'
                : 'bg-[#2357C6] hover:bg-[#1849A9]'
              }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white"></div>
                Creating Project...
              </div>
            ) : (
              'Create Project'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewProjectModal;

'use client';

import React, { useEffect, useState } from 'react';
import { BriefcaseBusiness, CalendarDays, TrendingUp, X } from 'lucide-react';
import PdfPreviewCard from './PdfPreviewCard';
import ImagePreviewCard from './ImagePreviewCard';
import type { ProjectItem } from './types';
import axios from 'axios';
import { isPdfUrl } from './pdfUrlUtils';

const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`;
const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

type ProjectPost = {
  Id: string;
  Title: string;
  Detail: string;
  AttachmentUrl: string | null;
  CreatedAt: string;
};

type ProjectDetailResponse = {
  Id: string;
  ProjectName: string;
  Description: string;
  Location: string;
  StartedDate: string;
  Status: string;
  CreatedAt: string;
  ProjectPosts: ProjectPost[];
};

const parseApiDate = (value?: string) => {
  if (!value) return null;
  const hasTimezone = /[zZ]|[+\-]\d{2}:?\d{2}$/.test(value);
  const normalized = hasTimezone ? value : `${value}Z`;
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDate = (dateInput?: string) => {
  const date = parseApiDate(dateInput);
  if (!date) return 'N/A';
  return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
};

const formatPostTime = (dateInput?: string) => {
  const date = parseApiDate(dateInput);
  if (!date) return 'Now';

  const now = Date.now();
  const diffMs = Math.max(0, now - date.getTime());
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'Now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatDate(dateInput);
};

const ProjectDetailsModal = ({
  isOpen,
  onClose,
  project,
  onPostUpdate,
  onMarkComplete,
}: {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectItem;
  onPostUpdate: () => void;
  onMarkComplete: () => void;
  }) => {
  console.log('📊 ProjectDetailsModal rendered with project:', project);
  const [detail, setDetail] = useState<ProjectDetailResponse | null>(null);
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
    if (!isOpen || !project?.id) return;

    const fetchProjectDetail = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${apiEndpoint}/Projects/GetProjectById`, {
          params: { id: project.id },
          headers: {
            accept: '*/*',
            XApiKey: apiKey,
          },
        });

        setDetail(response?.data?.Result || null);
      } catch (error) {
        console.error('❌ Fetch project detail error:', error);
        setDetail(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectDetail();
  }, [isOpen, project?.id]);

  const projectTitle = detail?.ProjectName || project.title;
  const projectStatus = detail?.Status || project.status;
  const projectDescription = detail?.Description || project.description;
  const projectLocation = detail?.Location || project.location;
  const projectStarted = detail?.StartedDate ? formatDate(detail.StartedDate) : project.started;
  const projectPosts = Array.isArray(detail?.ProjectPosts)
    ? [...detail.ProjectPosts].sort((a, b) => {
      const aTime = parseApiDate(a.CreatedAt)?.getTime() || 0;
      const bTime = parseApiDate(b.CreatedAt)?.getTime() || 0;
      return bTime - aTime;
    })
    : ([] as ProjectPost[]);
  const updatesCount = projectPosts.length || project.updatesPosted;

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 z-[99998] flex items-center justify-center bg-gray-900/30 p-4" onClick={onClose}>
      <div
        className="w-full max-w-[1080px] max-h-[calc(100vh-2rem)] rounded-2xl bg-white p-5 sm:p-6 overflow-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold text-[#0B1739] sm:text-base">{projectTitle}</h2>
              <span className={`rounded-md ${projectStatus === 'Completed' ? 'bg-[#CAFFE6] text-[#198754]' : 'bg-[#FFE7AB] px-3 py-1 text-xs font-semibold text-[#B7791F]'} sm:text-sm`}>
                {projectStatus}
              </span>
            </div>
            <p className="mt-2 max-w-[980px] text-sm text-[#3D4458] sm:text-base">
              {projectDescription}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#3D4458] sm:text-base">
              <span className="inline-flex items-center gap-2"><BriefcaseBusiness className="h-4 w-4" /> {projectLocation}</span>
              <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Started {projectStarted}</span>
              <span className="inline-flex items-center gap-2"><TrendingUp className="h-4 w-4" /> {updatesCount} updates posted</span>
            </div>
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


        <div className="mb-5 flex flex-col gap-2 border-b border-[#EAECF0] pb-4 sm:flex-row">
          {project.profileDetailId === (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userData') || '{}')?.UserProfileDetailsId) && (
            <>
              <button
                type="button"
                onClick={onMarkComplete}
                className="h-10 min-w-[200px] rounded-lg bg-[#2357C6] px-5 text-sm font-semibold text-white hover:bg-[#1849A9]"
              >
                Mark as Complete
              </button>
              <button
                type="button"
                onClick={onPostUpdate}
                className="h-10 min-w-[200px] rounded-lg border border-[#D0D5DD] bg-white px-5 text-sm font-semibold text-[#344054] hover:bg-[#F9FAFB]"
              >
                Post Update
              </button>
            </>
          )}
        </div>

        <h3 className="mb-3 text-xl font-semibold text-[#0B1739] sm:text-xl">All Updates</h3>

        <div className="space-y-4 max-h-[62vh] overflow-y-auto pr-1">
          {isLoading ? (
            <div className="py-6 text-center text-sm text-[#667085]">Loading project details...</div>
          ) : projectPosts.length > 0 ? (
            projectPosts.map((post) => (
              <article key={post.Id} className="rounded-xl border border-[#D0D5DD] bg-white p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h4 className="text-xl font-semibold text-[#0B1739] sm:text-base">{post.Title || 'Project Update'}</h4>
                  <span className="shrink-0 text-xs text-[#667085] sm:text-sm">{formatPostTime(post.CreatedAt)}</span>
                </div>
                <p className="mb-3 text-sm text-[#3D4458] sm:text-sm">{post.Detail || 'No description provided yet.'}</p>

                {post.AttachmentUrl ? (
                  <div className="rounded-lg border border-[#EAECF0] bg-[#F8FAFC] p-2">
                    {isPdfUrl(post.AttachmentUrl) ? (
                      <PdfPreviewCard pdfUrl={post.AttachmentUrl} />
                    ) : (
                      <ImagePreviewCard img={post.AttachmentUrl} />
                    )}
                  </div>
                ) : null}
              </article>
            ))
          ) : (
            <div className="py-6 text-center text-sm text-[#667085]">No updates posted yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;

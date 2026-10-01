'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import NewProjectModal from './NewProjectModal';
import ProjectCard from './ProjectCard';
import type { ProjectItem } from './types';
import axios from 'axios';
import { toast } from 'react-toastify';
import { isPdfUrl } from './pdfUrlUtils';

const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`;
const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

const parseApiDate = (value?: string) => {
  if (!value) return null;

  // Backend timestamps are often returned without timezone; treat them as UTC.
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

const getLatestAttachmentUrl = (project: any) => {
  const posts = Array.isArray(project?.ProjectPosts) ? project.ProjectPosts : [];

  const latestPostWithAttachment = posts
    .filter((post: any) => post?.AttachmentUrl)
    .sort((a: any, b: any) => {
      const aTime = parseApiDate(a?.CreatedAt)?.getTime() || 0;
      const bTime = parseApiDate(b?.CreatedAt)?.getTime() || 0;
      return bTime - aTime;
    })[0];

  return latestPostWithAttachment?.AttachmentUrl || project?.AttachmentUrl || null;
};

const mapApiProjectToCardItem = (project: any, index: number): ProjectItem => {
  const attachmentUrl = getLatestAttachmentUrl(project);
  const isAttachmentPdf = isPdfUrl(attachmentUrl);
  const rawId = project?.Id ?? project?.ProjectId;
  const normalizedId = String(rawId || `project-${index + 1}`);
  const projectPosts = Array.isArray(project?.ProjectPosts) ? project.ProjectPosts : [];
  const mappedUpdates = projectPosts.map((post: any) => ({
    title: post?.Title || 'Project Update',
    description: post?.Detail || '',
    timeAgo: formatPostTime(post?.CreatedAt),
  }));

  return {
    id: normalizedId,
    title: project?.ProjectName,
    status: project?.Status,
    description: project?.Description,
    location: project?.Location,
    started: formatDate(project?.StartedDate),
    updatesPosted: projectPosts.length,
    pdfUrl: isAttachmentPdf ? attachmentUrl : null,
    imageUrl: !isAttachmentPdf && attachmentUrl ? attachmentUrl : null,
    profileDetailId: String(project?.UserProfileDetailId || ''),
    updates: mappedUpdates.length
      ? mappedUpdates
      : [
        {
          title: 'Posted an update',
          description: project?.Description,
          timeAgo: formatPostTime(project?.CreatedAt),
        },
      ],
  };
};

interface ProjectsSectionProps {
  profileUserId?: string | number;
}

const ProjectsSection = ({ profileUserId }: ProjectsSectionProps) => {
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get current user ID from localStorage
  const currentUserData = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userData') || '{}');
  const currentUserId = currentUserData?.Id;

  const fetchProjects = useCallback(async () => {
    const userData = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userData') || '{}');
    // Use profileUserId if provided (for viewing other users' profiles), otherwise use current user
    const userId = profileUserId || userData?.Id;

    if (!userId) {
      setProjects([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${apiEndpoint}/Projects/GetProjects`,
        {
          PageNumber: 0,
          PageSize: 0,
          UserId: userId,
          Status: null,
          CountryId: null,
          SearchTerm: null,
        },
        {
          headers: {
            accept: '*/*',
            'Content-Type': 'application/json',
            XApiKey: apiKey,
          },
        }
      );

      const result = response?.data?.Result;
      const list = Array.isArray(result)
        ? result
        : Array.isArray(result?.Projects)
          ? result.Projects
          : Array.isArray(result?.Items)
            ? result.Items
            : Array.isArray(result?.Data)
              ? result.Data
              : [];

      setProjects(list.map(mapApiProjectToCardItem));
    } catch (error: any) {
      console.error('❌ Fetch projects error:', error);
      toast.error(error?.response?.data?.Message || 'Failed to load projects');
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="rounded-xl border border-[#EAECF0] bg-white p-2 md:p-4 shadow-sm">
      <NewProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onCreated={fetchProjects}
      />

      <div className="mb-5 flex  gap-3 items-center justify-between">
        <h2 className="text-lg font-semibold text-[#1D2939]">Projects</h2>
        {currentUserId === profileUserId && (
          <button
            type="button"
            onClick={() => setIsCreateProjectOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2357C6] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1849A9]"
          >
            <Plus className="h-5 w-5" strokeWidth={2.5} />
            Start a New Project
          </button>
        )}
      </div>

      <div className="mb-4 flex  gap-2 items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-[#1D2939]">Active Projects</h3>
          <p className="text-base text-[#475467]">Projects currently in progress</p>
        </div>
        <button type="button" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2357C6]">
          View all
          <span aria-hidden="true">&gt;</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-sm text-[#667085]">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="py-8 text-center text-sm text-[#667085]">No projects found.</div>
      ) : (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} onProjectUpdated={fetchProjects} />
              ))}
            </div>
      )}
    </div>
  );
};

export default ProjectsSection;

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { formatPostedLabel } from './feed-card-utils';
import { renderProfileTypeIcon } from '@/components/ui/profile-type';
import Link from 'next/link';
import { add2040ToProfileDetailsId } from '@/utils/profile.helpers';
import PdfPreviewCard from '@/app/(dashboard)/(users)/(main)/Bob/components/tabsection/projects/PdfPreviewCard';
import ImagePreviewCard from '@/app/(dashboard)/(users)/(main)/Bob/components/tabsection/projects/ImagePreviewCard';
import { isPdfUrl } from '@/app/(dashboard)/(users)/(main)/Bob/components/tabsection/projects/pdfUrlUtils';
import ProjectDetailsModal from '@/app/(dashboard)/(users)/(main)/Bob/components/tabsection/projects/ProjectDetailsModal';
import PostUpdateModal from '@/app/(dashboard)/(users)/(main)/Bob/components/tabsection/projects/PostUpdateModal';
import MarkCompleteModal from '@/app/(dashboard)/(users)/(main)/Bob/components/tabsection/projects/MarkCompleteModal';
import type { ProjectItem } from '@/app/(dashboard)/(users)/(main)/Bob/components/tabsection/projects/types';

const isNewProjectFeed = (type?: string) => type === 'NewProjectCreated';

export const ProjectFeedCard = ({ feed }: { feed: any }) => {
    const project = feed?.Project;
    const description = feed.Type === 'NewProjectCreated' ? project?.Description : feed?.ProjectPost?.Detail;
    const attachmentUrl = project?.AttachmentUrl || '';
    const postedAt = feed?.CreateDate || project?.CreatedAt;
    const avatarUrl = feed?.User?.ProfileDetails?.ProfilePicture || '';
    const userName = feed?.User?.Name || project?.UserName || 'Member';
    const cardTitle = isNewProjectFeed(feed?.Type) ? 'New Project' : 'Project Update';
    const profileDetailId = feed?.User?.ProfileDetails?.Id;
    const profileLink = profileDetailId ? `/profile/${add2040ToProfileDetailsId(profileDetailId)}` : '#';

    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isPostUpdateOpen, setIsPostUpdateOpen] = useState(false);
    const [isMarkCompleteOpen, setIsMarkCompleteOpen] = useState(false);

    const rawId = project?.Id ?? project?.ProjectId;
    const normalizedId = String(rawId || '');
    const projectPosts = Array.isArray(project?.ProjectPosts) ? project.ProjectPosts : [];

    const mapApiProjectToCardItem = (proj: any): ProjectItem => {
        const projAttachmentUrl = proj?.AttachmentUrl || '';
        const isAttachmentPdf = isPdfUrl(projAttachmentUrl);
        const mappedUpdates = projectPosts.map((post: any) => ({
            title: post?.Title || 'Project Update',
            description: post?.Detail || '',
            timeAgo: formatPostedLabel(post?.CreatedAt),
        }));

        return {
            id: normalizedId,
            title: proj?.ProjectName || 'Project',
            status: proj?.Status || 'In Progress',
            description: proj?.Description || '',
            location: proj?.Location || '',
            started: proj?.StartedDate ? new Date(proj.StartedDate).toLocaleDateString('en-GB') : 'N/A',
            updatesPosted: projectPosts.length,
            pdfUrl: isAttachmentPdf ? projAttachmentUrl : null,
            imageUrl: !isAttachmentPdf && projAttachmentUrl ? projAttachmentUrl : null,
            profileDetailId: profileDetailId ,
            updates: mappedUpdates.length
                ? mappedUpdates
                : [
                    {
                        title: 'Posted an update',
                        description: proj?.Description || '',
                        timeAgo: formatPostedLabel(proj?.CreatedAt),
                    },
                ],
        };
    };

    const projectCardItem: ProjectItem = mapApiProjectToCardItem(project);

    return (
        <div className="rounded-3xl mb-4  bg-white shadow-blur overflow-hidden p-6">
            <h3 className="mb-4 text-32xl font-bold leading-tight text-[#122245]">
                {cardTitle}
            </h3>

            <Link href={profileLink} className="mb-4 flex items-start gap-3 hover:opacity-80 transition-opacity">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-black flex-shrink-0">
                    {avatarUrl ? (
                        <Image src={avatarUrl} alt={userName} width={48} height={48} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-lg font-bold text-white">
                            {userName.slice(0, 1).toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="truncate text-lg font-semibold text-[#122245]">{userName}</p>
                        {feed?.User?.IsVerified === 1 ? (
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_189_1266)">
                                    <path d="M15.4442 3.54062C15.6342 4.00002 15.9988 4.36517 16.4579 4.55581L18.0678 5.22264C18.5272 5.41294 18.8922 5.77796 19.0825 6.23738C19.2728 6.69681 19.2728 7.21302 19.0825 7.67245L18.4162 9.28115C18.2258 9.74078 18.2255 10.2575 18.4168 10.7169L19.082 12.3251C19.1763 12.5527 19.2249 12.7966 19.2249 13.0429C19.225 13.2893 19.1765 13.5332 19.0822 13.7608C18.9879 13.9883 18.8497 14.1951 18.6755 14.3693C18.5013 14.5434 18.2945 14.6815 18.0669 14.7757L16.4582 15.4421C15.9988 15.632 15.6336 15.9966 15.443 16.4558L14.7762 18.0656C14.5859 18.525 14.2209 18.8901 13.7614 19.0804C13.302 19.2707 12.7858 19.2707 12.3264 19.0804L10.7177 18.414C10.2582 18.2242 9.7422 18.2246 9.28304 18.4151L7.67318 19.081C7.21401 19.2708 6.69825 19.2707 6.2392 19.0805C5.78014 18.8904 5.41533 18.5258 5.2249 18.0668L4.55788 16.4565C4.36793 15.9971 4.00332 15.632 3.54421 15.4413L1.93435 14.7745C1.47513 14.5843 1.11022 14.2195 0.919849 13.7603C0.729477 13.3012 0.729219 12.7852 0.919131 12.3258L1.58548 10.7171C1.77531 10.2577 1.77492 9.74167 1.5844 9.28252L0.91901 7.6715C0.824671 7.44395 0.776094 7.20005 0.776054 6.95372C0.776015 6.70739 0.824513 6.46346 0.91878 6.23588C1.01305 6.00831 1.15123 5.80153 1.32544 5.62738C1.49965 5.45322 1.70647 5.3151 1.93408 5.22091L3.54278 4.55456C4.00178 4.36478 4.36671 4.00063 4.55749 3.54205L5.22432 1.93219C5.41462 1.47277 5.77964 1.10775 6.23906 0.917451C6.69849 0.72715 7.2147 0.72715 7.67413 0.917451L9.28283 1.5838C9.74227 1.77363 10.2583 1.77324 10.7174 1.58272L12.328 0.918485C12.7874 0.72829 13.3034 0.728329 13.7628 0.918593C14.2221 1.10886 14.5871 1.47377 14.7774 1.93307L15.4444 3.54341L15.4442 3.54062Z" fill="url(#paint0_linear_189_1266)" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M13.9166 7.37925C14.0502 7.1694 14.0949 6.91507 14.041 6.67221C13.9871 6.42935 13.8389 6.21785 13.6291 6.08425C13.4192 5.95065 13.1649 5.90588 12.922 5.9598C12.6792 6.01372 12.4677 6.1619 12.3341 6.37175L8.66283 12.1405L6.98283 10.0405C6.82751 9.84623 6.60138 9.72162 6.35418 9.69407C6.10699 9.66653 5.85897 9.73831 5.6647 9.89363C5.47043 10.0489 5.34582 10.2751 5.31827 10.5223C5.29073 10.7695 5.36251 11.0175 5.51783 11.2118L8.01783 14.3368C8.111 14.4534 8.23066 14.546 8.36687 14.6071C8.50308 14.6681 8.65189 14.6957 8.80094 14.6877C8.94998 14.6796 9.09494 14.6361 9.22376 14.5607C9.35258 14.4853 9.46154 14.3802 9.54158 14.2543L13.9166 7.37925Z" fill="white" />
                                </g>
                                <defs>
                                    <linearGradient id="paint0_linear_189_1266" x1="13.7616" y1="0.918114" x2="6.23862" y2="19.0803" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#1594FF" />
                                        <stop offset="1" stopColor="#0BC1A5" />
                                    </linearGradient>
                                    <clipPath id="clip0_189_1266">
                                        <rect width="20" height="20" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        ) : null}
                    </div>
                    <p className="flex gap-1 items-center text-sm text-[#667085]">
                        {renderProfileTypeIcon(
                            Number(feed?.User?.ProfileType),
                            'default',
                            false,
                            'w-3.5 h-3.5 flex-shrink-0'
                        )}
                    </p>
                </div>
            </Link>

            <p className="mb-4 text-base text-[#1F2A44]">
                {description}
            </p>

            <div className="mb-4 overflow-hidden bg-[#F8FAFC]">
                {attachmentUrl ? (
                    isPdfUrl(attachmentUrl) ? (
                        <PdfPreviewCard pdfUrl={attachmentUrl} />
                    ) : (
                        <ImagePreviewCard img={attachmentUrl} />
                    )
                ) : null}
            </div>

            <div className="flex items-center justify-between">
                <button
                    onClick={() => setIsDetailsOpen(true)}
                    className="text-base flex items-center gap-2 font-semibold text-[#2454C4] hover:text-[#1849A9] transition-colors cursor-pointer"
                >
                    Check out the project
                    <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 6.36719C0.447715 6.36719 0 6.8149 0 7.36719C0 7.91947 0.447715 8.36719 1 8.36719V7.36719V6.36719ZM15.7071 8.07429C16.0976 7.68377 16.0976 7.0506 15.7071 6.66008L9.34315 0.29612C8.95262 -0.0944047 8.31946 -0.0944047 7.92893 0.29612C7.53841 0.686644 7.53841 1.31981 7.92893 1.71033L13.5858 7.36719L7.92893 13.024C7.53841 13.4146 7.53841 14.0477 7.92893 14.4383C8.31946 14.8288 8.95262 14.8288 9.34315 14.4383L15.7071 8.07429ZM1 7.36719V8.36719H2.75V7.36719V6.36719H1V7.36719ZM6.25 7.36719V8.36719H9.75V7.36719V6.36719H6.25V7.36719ZM13.25 7.36719V8.36719H15V7.36719V6.36719H13.25V7.36719ZM1 6.36719C0.447715 6.36719 0 6.8149 0 7.36719C0 7.91947 0.447715 8.36719 1 8.36719V7.36719V6.36719ZM15.7071 8.07429C16.0976 7.68377 16.0976 7.0506 15.7071 6.66008L9.34315 0.29612C8.95262 -0.0944047 8.31946 -0.0944047 7.92893 0.29612C7.53841 0.686644 7.53841 1.31981 7.92893 1.71033L13.5858 7.36719L7.92893 13.024C7.53841 13.4146 7.53841 14.0477 7.92893 14.4383C8.31946 14.8288 8.95262 14.8288 9.34315 14.4383L15.7071 8.07429ZM1 7.36719V8.36719H2.75V7.36719V6.36719H1V7.36719ZM6.25 7.36719V8.36719H9.75V7.36719V6.36719H6.25V7.36719ZM13.25 7.36719V8.36719H15V7.36719V6.36719H13.25V7.36719Z" fill="#2357C6" />
                    </svg>
                </button>
            </div>

            <ProjectDetailsModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                project={projectCardItem}
                onPostUpdate={() => {
                    setIsDetailsOpen(false);
                    setIsPostUpdateOpen(true);
                }}
                onMarkComplete={() => {
                    setIsDetailsOpen(false);
                    setIsMarkCompleteOpen(true);
                }}
            />
            <PostUpdateModal
                isOpen={isPostUpdateOpen}
                onClose={() => setIsPostUpdateOpen(false)}
                project={projectCardItem}
                onPosted={() => setIsPostUpdateOpen(false)}
            />
            <MarkCompleteModal
                isOpen={isMarkCompleteOpen}
                onClose={() => setIsMarkCompleteOpen(false)}
                project={projectCardItem}
                onCompleted={() => setIsMarkCompleteOpen(false)}
            />
        </div>
    );
};

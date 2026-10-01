import { useState } from 'react';
import PdfPreviewCard from './PdfPreviewCard';
import ImagePreviewCard from './ImagePreviewCard';
import PostUpdateModal from './PostUpdateModal';
import ProjectDetailsModal from './ProjectDetailsModal';
import MarkCompleteModal from './MarkCompleteModal';
import type { ProjectItem } from './types';

const ProjectCard = ({
  project,
  onProjectUpdated,
}: {
  project: ProjectItem;
  onProjectUpdated?: () => void;
}) => {
  const [isPostUpdateOpen, setIsPostUpdateOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isMarkCompleteOpen, setIsMarkCompleteOpen] = useState(false);

  return (
    <article className="rounded-xl border border-[#E3E3E2] p-4">
      <PostUpdateModal
        isOpen={isPostUpdateOpen}
        onClose={() => setIsPostUpdateOpen(false)}
        project={project}
        onPosted={onProjectUpdated}
      />
      <MarkCompleteModal
        isOpen={isMarkCompleteOpen}
        onClose={() => setIsMarkCompleteOpen(false)}
        project={project}
        onCompleted={onProjectUpdated}
      />
      <ProjectDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        project={project}
        onPostUpdate={() => {
          setIsDetailsOpen(false);
          setIsPostUpdateOpen(true);
        }}
        onMarkComplete={() => {
          setIsDetailsOpen(false);
          setIsMarkCompleteOpen(true);
        }}
      />

      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h4 className="text-lg font-semibold  text-[#0B1739]">{project.title}</h4>
        <span className={`rounded-lg  px-3 py-1 text-base font-semibold  ${project.status === 'Completed' ? 'bg-[#CAFFE6] text-[#198754]' : 'bg-[#FFE7AB] text-[#CE9647]'} `}>
          {project.status}
        </span>
      </div>

      <p className="mb-3 text-sm text-[#3D4458]">{project.description}</p>

      <div className="mb-3 flex flex-wrap items-center gap-4 border-b border-[#EAECF0] pb-3 text-sm text-[#3D4458]">
        <span className="flex gap-2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_917_58169" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
              <rect width="20" height="20" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_917_58169)">
              <path d="M3.58995 17.0833C3.16898 17.0833 2.81266 16.9375 2.521 16.6458C2.22933 16.3542 2.0835 15.9978 2.0835 15.5769V6.92313C2.0835 6.50215 2.22933 6.14583 2.521 5.85417C2.81266 5.5625 3.16898 5.41667 3.58995 5.41667H7.0835V4.00646C7.0835 3.58549 7.22933 3.22917 7.521 2.9375C7.81266 2.64583 8.16898 2.5 8.58995 2.5H11.4104C11.8313 2.5 12.1877 2.64583 12.4793 2.9375C12.771 3.22917 12.9168 3.58549 12.9168 4.00646V5.41667H16.4104C16.8313 5.41667 17.1877 5.5625 17.4793 5.85417C17.771 6.14583 17.9168 6.50215 17.9168 6.92313V15.5769C17.9168 15.9978 17.771 16.3542 17.4793 16.6458C17.1877 16.9375 16.8313 17.0833 16.4104 17.0833H3.58995ZM8.3335 5.41667H11.6668V4.00646C11.6668 3.94229 11.6401 3.88354 11.5866 3.83021C11.5333 3.77674 11.4745 3.75 11.4104 3.75H8.58995C8.52579 3.75 8.46704 3.77674 8.4137 3.83021C8.36023 3.88354 8.3335 3.94229 8.3335 4.00646V5.41667ZM16.6668 12.2917H12.0835V12.9967C12.0835 13.2115 12.0116 13.3908 11.8679 13.5344C11.7243 13.6781 11.545 13.75 11.3302 13.75H8.67016C8.4553 13.75 8.27607 13.6781 8.13245 13.5344C7.9887 13.3908 7.91683 13.2115 7.91683 12.9967V12.2917H3.3335V15.5769C3.3335 15.641 3.36023 15.6998 3.4137 15.7531C3.46704 15.8066 3.52579 15.8333 3.58995 15.8333H16.4104C16.4745 15.8333 16.5333 15.8066 16.5866 15.7531C16.6401 15.6998 16.6668 15.641 16.6668 15.5769V12.2917ZM9.16683 12.5H10.8335V10.8333H9.16683V12.5ZM3.3335 11.0417H7.91683V10.3367C7.91683 10.1218 7.9887 9.94257 8.13245 9.79896C8.27607 9.65521 8.4553 9.58333 8.67016 9.58333H11.3302C11.545 9.58333 11.7243 9.65521 11.8679 9.79896C12.0116 9.94257 12.0835 10.1218 12.0835 10.3367V11.0417H16.6668V6.92313C16.6668 6.85896 16.6401 6.80021 16.5866 6.74687C16.5333 6.6934 16.4745 6.66667 16.4104 6.66667H3.58995C3.52579 6.66667 3.46704 6.6934 3.4137 6.74687C3.36023 6.80021 3.3335 6.85896 3.3335 6.92313V11.0417Z" fill="#3F3F3F" />
            </g>
          </svg>

          {project.location}
        </span>
        <span className="flex gap-2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.66667 1.66406V4.9974M13.3333 1.66406V4.9974M2.5 8.33073H17.5M6.66667 11.6641H6.675M10 11.6641H10.0083M13.3333 11.6641H13.3417M6.66667 14.9974H6.675M10 14.9974H10.0083M13.3333 14.9974H13.3417M4.16667 3.33073H15.8333C16.7538 3.33073 17.5 4.07692 17.5 4.9974V16.6641C17.5 17.5845 16.7538 18.3307 15.8333 18.3307H4.16667C3.24619 18.3307 2.5 17.5845 2.5 16.6641V4.9974C2.5 4.07692 3.24619 3.33073 4.16667 3.33073Z" stroke="#3F3F3F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          Started {project.started}
        </span>
        <span className="flex gap-2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.3332 9.9974H16.2665C15.9023 9.99662 15.5479 10.1152 15.2574 10.3349C14.967 10.5546 14.7565 10.8634 14.6582 11.2141L12.6998 18.1807C12.6872 18.224 12.6609 18.262 12.6248 18.2891C12.5888 18.3161 12.5449 18.3307 12.4998 18.3307C12.4548 18.3307 12.4109 18.3161 12.3748 18.2891C12.3388 18.262 12.3125 18.224 12.2998 18.1807L7.69984 1.81406C7.68722 1.77079 7.6609 1.73278 7.62484 1.70573C7.58878 1.67868 7.54491 1.66406 7.49984 1.66406C7.45476 1.66406 7.4109 1.67868 7.37484 1.70573C7.33878 1.73278 7.31246 1.77079 7.29984 1.81406L5.3415 8.78073C5.24356 9.13002 5.03432 9.43783 4.74556 9.65741C4.45679 9.87699 4.10427 9.99636 3.7415 9.9974H1.6665" stroke="#3F3F3F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          {project.updatesPosted} updates posted
        </span>
      </div>

      <p className="mb-3 text-sm font-semibold text-[#0B1739]">Recent Updates</p>

      <div className="space-y-3 mb-4">
        {project.updates.map((update, index) => (
          <div key={`${project.id}-${index}`} className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#0B1739]">{update.title}</p>
              {update.description ? <p className="text-sm text-[#3D4458]">{update.description}</p> : null}
            </div>
            <p className="shrink-0 text-sm text-[#667085]">{update.timeAgo}</p>
          </div>
        ))}
      </div>

      {project.pdfUrl ? <PdfPreviewCard pdfUrl={project.pdfUrl} /> : <ImagePreviewCard img={project.imageUrl} />}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => setIsDetailsOpen(true)}
          className="w-full rounded-xl bg-[#2357C6] py-3 text-sm font-semibold text-white hover:bg-[#1849A9]"
        >
          View Full Details
        </button>
        <button
          type="button"
          onClick={() => setIsPostUpdateOpen(true)}
          className="w-full rounded-xl border border-[#CBD5E1] bg-white py-3 text-sm font-semibold text-[#334155] hover:bg-[#F8FAFC]"
        >
          Post Update
        </button>
      </div>
    </article>
  );
};

export default ProjectCard;

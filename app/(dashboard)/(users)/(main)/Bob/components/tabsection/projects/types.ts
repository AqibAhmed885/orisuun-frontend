export type ProjectUpdate = {
  title: string;
  description: string;
  timeAgo: string;
};

export type ProjectItem = {
  id: string;
  title: string;
  status: string;
  description: string;
  location: string;
  started: string;
  updatesPosted: number;
  profileDetailId?: string;
  pdfUrl: string | null;
  imageUrl?: string | null;
  updates: ProjectUpdate[];
};

export type ProjectHeadline = string;

export type NewProjectForm = {
  projectName: string;
  projectHeadline: ProjectHeadline;
  projectDescription: string;
  attachment: File | null;
};

export type NewProjectErrors = Partial<Record<keyof NewProjectForm, string>>;

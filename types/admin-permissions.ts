// Admin Permission System Types and Constants

export interface AdminPermission {
  id: string;
  name: string;
  description: string;
  route?: string;
}

export interface AdminRole {
  id: string;
  name: string;
  permissions: string[];
}

export interface AdminUser {
  id?: string;
  roleName?: string;
  username: string;
  password?: string;
  email: string;
  firstName: string;
  lastName: string;
  permissions: string[];
  isActive: boolean;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define all available admin functions/permissions
export const ADMIN_PERMISSIONS: Record<string, AdminPermission> = {
  RESOURCES_MANAGEMENT: {
    id: 'resources_management',
    name: 'Resources Management',
    description: 'Manage resources (edit, sort, soft delete)',
    route: '/resources-management'
  },
  CALENDAR_EVENTS: {
    id: 'calendar_events',
    name: 'Calendar Events Management',
    description: 'Manage calendar events and approvals',
    route: '/calendar-events'
  },
  FUNDRAISING_ADMIN: {
    id: 'fundraising_admin',
    name: 'Fundraising Management',
    description: 'Manage fundraising campaigns',
    route: '/fundraising/view-all-fundraisings'
  },
  OPPORTUNITY_POSTS: {
    id: 'opportunity_posts',
    name: 'Opportunity Posts Management',
    description: 'Manage business development and co-founder posts',
    route: '/opportunity-posts'
  },
  COMMUNITY_CHATS: {
    id: 'community_chats',
    name: 'Community & Chats Management',
    description: 'Manage community approvals and chat moderation',
    route: '/admin-chats'
  },
  BLOG_MANAGEMENT: {
    id: 'blog_management',
    name: 'Blog Management',
    description: 'Manage blog posts and content',
    route: '/admin-blogs'
  },
  USER_PROFILES: {
    id: 'user_profiles',
    name: 'User Profile Management',
    description: 'View and manage user profiles',
    route: '/view-profiles'
  },
  USER_VERIFICATION: {
    id: 'user_verification',
    name: 'User Verification',
    description: 'Verify user accounts and credentials',
    route: '/profile-verification'
  },
  REPORTS_DISPUTES: {
    id: 'reports_disputes',
    name: 'Reports & Disputes',
    description: 'Handle user reports and disputes',
    route: '/reports'
  },
  DISCOUNT_PORTAL: {
    id: 'discount_portal',
    name: 'Discount Portal Management',
    description: 'Manage partner discount programs',
    route: '/discount-portal'
  },
  MARKETING_FEEDBACK: {
    id: 'marketing_feedback',
    name: 'Marketing Feedback',
    description: 'Review marketing feedback submissions',
    route: '/marketing-feedback'
  },
  NEWSLETTER_MANAGEMENT: {
    id: 'newsletter_management',
    name: 'Newsletter Management',
    description: 'Manage newsletter subscribers and campaigns',
    route: '/newsletter-signups'
  },
  ADD_USERS: {
    id: 'add_users',
    name: 'Add Platform Users',
    description: 'Create new platform user accounts',
    route: '/add-user'
  },
  ADMIN_MANAGEMENT: {
    id: 'admin_management',
    name: 'Admin Account Management',
    description: 'Create and manage lower-level admin accounts (superadmin only)',
    route: '/add-user'
  }
};

// Permission groups for easier selection
export const PERMISSION_GROUPS = {
  CONTENT_MANAGEMENT: {
    name: 'Content Management',
    permissions: [
      ADMIN_PERMISSIONS.RESOURCES_MANAGEMENT.id,
      ADMIN_PERMISSIONS.CALENDAR_EVENTS.id,
      ADMIN_PERMISSIONS.BLOG_MANAGEMENT.id,
      ADMIN_PERMISSIONS.NEWSLETTER_MANAGEMENT.id
    ]
  },
  COMMUNITY_MANAGEMENT: {
    name: 'Community Management',
    permissions: [
      ADMIN_PERMISSIONS.COMMUNITY_CHATS.id,
      ADMIN_PERMISSIONS.USER_PROFILES.id,
      ADMIN_PERMISSIONS.REPORTS_DISPUTES.id
    ]
  },
  BUSINESS_MANAGEMENT: {
    name: 'Business Management',
    permissions: [
      ADMIN_PERMISSIONS.FUNDRAISING_ADMIN.id,
      ADMIN_PERMISSIONS.OPPORTUNITY_POSTS.id,
      ADMIN_PERMISSIONS.DISCOUNT_PORTAL.id
    ]
  },
  USER_MANAGEMENT: {
    name: 'User Management',
    permissions: [
      ADMIN_PERMISSIONS.USER_VERIFICATION.id,
      ADMIN_PERMISSIONS.ADD_USERS.id
    ]
  }
};

// Helper function to check if user has permission
export const hasPermission = (userPermissions: string[], requiredPermission: string): boolean => {
  return userPermissions.includes(requiredPermission) || userPermissions.includes(ADMIN_PERMISSIONS.ADMIN_MANAGEMENT.id);
};

// Helper function to get permission details
export const getPermissionById = (permissionId: string): AdminPermission | undefined => {
  return Object.values(ADMIN_PERMISSIONS).find(p => p.id === permissionId);
};

// Helper function to get all permission IDs
export const getAllPermissionIds = (): string[] => {
  return Object.values(ADMIN_PERMISSIONS).map(p => p.id);
};

// Helper to check if route requires specific permission
export const getPermissionForRoute = (route: string): string | undefined => {
  const permission = Object.values(ADMIN_PERMISSIONS).find(p => p.route === route);
  return permission?.id;
};

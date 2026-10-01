// Middleware Permission Helper Functions
import { getPermissionForRoute } from '@/types/admin-permissions';

/**
 * Check if a user has a specific permission
 * @param userPermissions - Array of permission IDs the user has
 * @param requiredPermission - The permission ID to check for
 * @returns boolean
 */
export function hasPermission(
  userPermissions: string[] | undefined,
  requiredPermission: string
): boolean {
  if (!userPermissions || !Array.isArray(userPermissions)) {
    return false;
  }

  // Superadmin with admin_management permission has all permissions
  if (userPermissions.includes('admin_management')) {
    return true;
  }

  return userPermissions.includes(requiredPermission);
}

/**
 * Check if route requires permission and if user has it
 * @param pathname - Current route path
 * @param userData - User data object containing permissions
 * @returns boolean - true if user has access, false otherwise
 */
export function checkRoutePermission(
  pathname: string,
  userData: any
): boolean {
  // Superadmin (UserProfileTypeId === 10) or Custom Admin (UserProfileTypeId === 9)
  if (userData?.UserProfileTypeId === 10 || userData?.UserProfileTypeId === 9) {
    // Check their permissions
    const userPermissions = getUserPermissions(userData);

    // If they have admin_management, they have access to everything
    if (userPermissions.includes('admin_management')) {
      return true;
    }

    const requiredPermission = getPermissionForRoute(pathname);

    if (requiredPermission) {
      return hasPermission(userPermissions, requiredPermission);
    }
    
    // If no specific permission required for route, allow access
    return true;
  }

  // For admin users, check their permissions
  if (userData?.AdminPermissions && Array.isArray(userData.AdminPermissions)) {
    const requiredPermission = getPermissionForRoute(pathname);
    
    if (requiredPermission) {
      return hasPermission(userData.AdminPermissions, requiredPermission);
    }
  }

  // If no specific permission required for route, allow access
  return true;
}

/**
 * Get route-to-permission mapping for admin routes
 */
export const ADMIN_ROUTE_PERMISSIONS: Record<string, string> = {
  '/resources-management': 'resources_management',
  '/calendar-events': 'calendar_events',
  '/fundraising/view-all-fundraisings': 'fundraising_admin',
  '/opportunity-posts': 'opportunity_posts',
  '/admin-chats': 'community_chats',
  '/admin-blogs': 'blog_management',
  '/view-profiles': 'user_profiles',
  '/profile-verification': 'user_verification',
  '/reports': 'reports_disputes',
  '/dispute-page': 'reports_disputes',
  '/discount-portal': 'discount_portal',
  '/marketing-feedback': 'marketing_feedback',
  '/newsletter-signups': 'newsletter_management',
  '/add-user': 'add_users', // Note: Creating admins requires admin_management
  '/admin-accounts': 'admin_management',
};

/**
 * Get first accessible admin route based on user permissions
 * @param userPermissions - Array of permission IDs
 * @returns First accessible route or null
 */
export function getFirstAccessibleRoute(userPermissions: string[]): string | null {
  if (!userPermissions || userPermissions.length === 0) {
    return null;
  }

  // Check if user has admin_management (full access)
  if (userPermissions.includes('admin_management')) {
    return '/resources-management'; // Default for superadmin
  }

  // Find first route based on permissions
  for (const [route, permission] of Object.entries(ADMIN_ROUTE_PERMISSIONS)) {
    if (userPermissions.includes(permission)) {
      return route;
    }
  }

  return null;
}

/**
 * Check if a path matches a route pattern (supporting wildcards)
 * @param pathname - Actual path
 * @param routePattern - Pattern to match (e.g., '/admin-chats/:path*')
 */
export function matchesRoute(pathname: string, routePattern: string): boolean {
  // Direct match
  if (pathname === routePattern) {
    return true;
  }

  // Handle :path* wildcard
  if (routePattern.endsWith('/:path*')) {
    const baseRoute = routePattern.replace('/:path*', '');
    return pathname.startsWith(baseRoute);
  }

  // Handle :id parameter
  if (routePattern.includes(':id')) {
    const pattern = routePattern.replace(':id', '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(pathname);
  }

  return false;
}

/**
 * Get required permission for a given pathname
 * @param pathname - The route path to check
 * @returns Permission ID or undefined if no permission required
 */
export function getRequiredPermissionForPath(pathname: string): string | undefined {
  // Check direct matches first
  if (ADMIN_ROUTE_PERMISSIONS[pathname]) {
    return ADMIN_ROUTE_PERMISSIONS[pathname];
  }

  // Check pattern matches
  for (const [route, permission] of Object.entries(ADMIN_ROUTE_PERMISSIONS)) {
    if (matchesRoute(pathname, route)) {
      return permission;
    }
  }

  // Check using the types helper
  return getPermissionForRoute(pathname);
}

/**
 * Format user permissions from userData object
 * @param userData - User data from cookies/localStorage
 * @returns Array of permission IDs
 */
export function getUserPermissions(userData: any): string[] {
  if (!userData) {
    return [];
  }

  // Check if user is superadmin (has all permissions)
  if (userData.UserProfileTypeId === 10 && !userData.AdminPermissions && !userData.UserPermissions) {
    return ['admin_management']; // Gives access to everything
  }

  // Check for UserPermissions (from API - comes as JSON string)
  if (userData.UserPermissions) {
    try {
      const permissions = typeof userData.UserPermissions === 'string'
        ? JSON.parse(userData.UserPermissions)
        : userData.UserPermissions;
      if (Array.isArray(permissions)) {
        return permissions;
      }
    } catch (e) {
      console.error('Failed to parse UserPermissions:', e);
    }
  }

  // Return admin permissions if they exist (alternative field)
  if (userData.AdminPermissions && Array.isArray(userData.AdminPermissions)) {
    return userData.AdminPermissions;
  }

  return [];
}

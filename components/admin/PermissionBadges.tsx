import React from 'react';
import { ADMIN_PERMISSIONS } from '@/types/admin-permissions';

interface PermissionBadgeProps {
  permissionId: string;
  variant?: 'default' | 'compact';
  showDescription?: boolean;
}

export const PermissionBadge: React.FC<PermissionBadgeProps> = ({
  permissionId,
  variant = 'default',
  showDescription = false,
}) => {
  const permission = Object.values(ADMIN_PERMISSIONS).find(
    (p) => p.id === permissionId
  );

  if (!permission) {
    return null;
  }

  const colorClasses = {
    resources_management: 'bg-blue-100 text-blue-800 border-blue-200',
    calendar_events: 'bg-purple-100 text-purple-800 border-purple-200',
    fundraising_admin: 'bg-green-100 text-green-800 border-green-200',
    opportunity_posts: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    community_chats: 'bg-pink-100 text-pink-800 border-pink-200',
    blog_management: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    user_profiles: 'bg-teal-100 text-teal-800 border-teal-200',
    user_verification: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    reports_disputes: 'bg-red-100 text-red-800 border-red-200',
    discount_portal: 'bg-orange-100 text-orange-800 border-orange-200',
    marketing_feedback: 'bg-lime-100 text-lime-800 border-lime-200',
    newsletter_management: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    add_users: 'bg-violet-100 text-violet-800 border-violet-200',
    admin_management: 'bg-gray-800 text-white border-gray-900',
  };

  const colorClass =
    colorClasses[permissionId as keyof typeof colorClasses] ||
    'bg-gray-100 text-gray-800 border-gray-200';

  if (variant === 'compact') {
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colorClass}`}
        title={showDescription ? permission.description : undefined}
      >
        {permission.name}
      </span>
    );
  }

  return (
    <div
      className={`inline-flex flex-col px-3 py-2 rounded-lg border ${colorClass}`}
    >
      <span className="text-sm font-semibold">{permission.name}</span>
      {showDescription && (
        <span className="text-xs opacity-90 mt-1">
          {permission.description}
        </span>
      )}
    </div>
  );
};

interface PermissionListProps {
  permissions: string[];
  maxDisplay?: number;
  variant?: 'default' | 'compact';
  showDescription?: boolean;
}

export const PermissionList: React.FC<PermissionListProps> = ({
  permissions,
  maxDisplay = 3,
  variant = 'compact',
  showDescription = false,
}) => {
  const displayedPermissions = permissions.slice(0, maxDisplay);
  const remainingCount = permissions.length - maxDisplay;

  return (
    <div className="flex flex-wrap gap-1">
      {displayedPermissions.map((permissionId) => (
        <PermissionBadge
          key={permissionId}
          permissionId={permissionId}
          variant={variant}
          showDescription={showDescription}
        />
      ))}
      {remainingCount > 0 && (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
          +{remainingCount} more
        </span>
      )}
    </div>
  );
};

interface PermissionGroupBadgeProps {
  groupName: string;
  count: number;
}

export const PermissionGroupBadge: React.FC<PermissionGroupBadgeProps> = ({
  groupName,
  count,
}) => {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
      <span className="text-sm font-semibold text-blue-800">{groupName}</span>
      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
        {count}
      </span>
    </div>
  );
};

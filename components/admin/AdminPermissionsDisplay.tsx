'use client';

import React, { useEffect, useState } from 'react';
import { Shield, Check } from 'lucide-react';
import { ADMIN_PERMISSIONS } from '@/types/admin-permissions';
import { getUserPermissions } from '@/utils/middleware-permissions';

export const AdminPermissionsDisplay: React.FC = () => {
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        const permissions = getUserPermissions(user);
        setUserPermissions(permissions);
      }
    }
  }, []);

  if (!currentUser || userPermissions.length === 0) {
    return null;
  }

  const hasFullAccess = userPermissions.includes('admin_management');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Shield className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Your Permissions</h3>
          <p className="text-sm text-gray-500">
            {hasFullAccess ? 'Full Admin Access' : `${userPermissions.length} Permission(s)`}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {hasFullAccess ? (
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-900">Super Admin Access</p>
              <p className="text-xs text-green-700">You have full access to all admin functions</p>
            </div>
          </div>
        ) : (
          <>
            {userPermissions.map((permissionId) => {
              const permission = Object.values(ADMIN_PERMISSIONS).find(
                (p) => p.id === permissionId
              );
              if (!permission) return null;

              return (
                <div
                  key={permissionId}
                  className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <Check className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{permission.name}</p>
                    <p className="text-xs text-gray-600">{permission.description}</p>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {currentUser.roleName && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Role</p>
          <p className="text-sm font-semibold text-gray-900">{currentUser.roleName}</p>
        </div>
      )}
    </div>
  );
};

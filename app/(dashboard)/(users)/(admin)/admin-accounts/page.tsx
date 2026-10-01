'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import swal from 'sweetalert';
import { Edit2, Trash2, Power, Shield, Key } from 'lucide-react';
import { adminService } from '@/app/api/dashboard/admin';
import { AdminUser } from '@/types/admin-permissions';
import { ADMIN_PERMISSIONS } from '@/types/admin-permissions';

export default function AdminAccountsManagement() {
  const [adminAccounts, setAdminAccounts] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [editPermissions, setEditPermissions] = useState<string[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    loadAdminAccounts();
  }, []);

  const loadAdminAccounts = async () => {
    setLoading(true);
    try {
      const accounts = await adminService.getAdminAccounts();
      // Transform backend data to match AdminUser interface
      const transformedAccounts = accounts.map((account: any) => ({
        id: account.UserId,
        username: account.UserName,
        email: account.Email,
        firstName: account.FirstName,
        lastName: account.LastName,
        isActive: account.IsActive,
        permissions: account.UserPermissions || [],
        createdDateTime: account.CreatedDateTime,
        subscriptionStatus: account.SubscriptionStatus,
      }));
      setAdminAccounts(transformedAccounts);
    } catch (error: any) {
      toast.error('Failed to load admin accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (adminId: string, currentStatus: boolean) => {
    try {
      const action = currentStatus ? 'deactivate' : 'activate';
      const willProceed = await swal({
        title: `${action === 'deactivate' ? 'Deactivate' : 'Activate'} Admin Account?`,
        text: `Are you sure you want to ${action} this admin account?`,
        icon: 'warning',
        buttons: ['Cancel', 'Confirm'],
        dangerMode: action === 'deactivate',
      });

      if (willProceed) {
        await adminService.toggleAdminStatus(adminId, !currentStatus);
        toast.success(`Admin account ${action}d successfully`);
        loadAdminAccounts();
      }
    } catch (error: any) {
      toast.error(`Failed to ${currentStatus ? 'deactivate' : 'activate'} admin account`);
    }
  };

  const handleDelete = async (adminId: string, username: string) => {
    try {
      const willDelete = await swal({
        title: 'Delete Admin Account?',
        text: `Are you sure you want to permanently delete the admin account for "${username}"? This action cannot be undone.`,
        icon: 'error',
        buttons: ['Cancel', 'Delete'],
        dangerMode: true,
      });

      if (willDelete) {
        await adminService.deleteAdminAccount(adminId);
        toast.success('Admin account deleted successfully');
        loadAdminAccounts();
      }
    } catch (error: any) {
      toast.error('Failed to delete admin account');
    }
  };

  const handleResetPassword = async (adminId: string, username: string) => {
    try {
      const { value: newPassword } = await swal({
        title: 'Reset Password',
        text: `Enter new password for ${username}:`,
        content: {
          element: 'input',
          attributes: {
            type: 'password',
            placeholder: 'New password',
          },
        },
        buttons: ['Cancel', 'Reset'],
      });

      if (newPassword && newPassword.length >= 8) {
        await adminService.resetAdminPassword(adminId, newPassword);
        toast.success('Password reset successfully');
      } else if (newPassword) {
        toast.error('Password must be at least 8 characters');
      }
    } catch (error: any) {
      toast.error('Failed to reset password');
    }
  };

  const handleEditOpen = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setEditPermissions(admin.permissions || []);
    setEditModalOpen(true);
  };

  const handlePermissionToggle = (permissionId: string) => {
    setEditPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((p) => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSaveEdit = async () => {
    if (!editingAdmin) return;
    setSavingEdit(true);
    try {
      // Call API to update admin permissions
      await adminService.updateAdminPermissions(editingAdmin.id!, editPermissions);
      toast.success('Admin account updated successfully');
      setEditModalOpen(false);
      setEditingAdmin(null);
      loadAdminAccounts();
    } catch (error: any) {
      toast.error('Failed to update admin account');
    } finally {
      setSavingEdit(false);
    }
  };

  const getPermissionNames = (permissionIds: string[]) => {
    return permissionIds
      .map((id) => {
        // Match by ID in ADMIN_PERMISSIONS
        const permission = Object.values(ADMIN_PERMISSIONS).find(
          (p) => p.id === id
        );
        return permission?.name;
      })
      .filter(Boolean);
  };

  const filteredAccounts = adminAccounts.filter(
    (account) =>
      account.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Account Management
        </h1>
        <p className="text-gray-600">
          Manage lower-level admin accounts and their permissions
        </p>
      </div>

      {/* Search and Stats */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by username, email, or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex gap-4">
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <p className="text-sm text-gray-600">Total Admins</p>
            <p className="text-2xl font-bold text-blue-600">{adminAccounts.length}</p>
          </div>
          <div className="bg-green-50 px-4 py-2 rounded-lg">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {adminAccounts.filter((a) => a.isActive).length}
            </p>
          </div>
        </div>
      </div>

      {/* Admin Accounts List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredAccounts.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600">
              {searchQuery
                ? 'No admin accounts found matching your search'
                : 'No admin accounts created yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permissions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {account.firstName?.[0]}
                            {account.lastName?.[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {account.firstName} {account.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{account.username}
                          </div>
                          {account.roleName && (
                            <div className="text-xs text-blue-600 font-medium mt-0.5">
                              {account.roleName}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{account.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {getPermissionNames(account.permissions || [])
                          .slice(0, 2)
                          .map((name, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {name}
                            </span>
                          ))}
                        {(account.permissions?.length || 0) > 2 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                            +{(account.permissions?.length || 0) - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          account.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {account.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditOpen(account)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() =>
                            handleToggleStatus(account.id!, account.isActive)
                          }
                          className={`p-2 rounded-lg transition ${
                            account.isActive
                              ? 'text-orange-600 hover:bg-orange-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={account.isActive ? 'Deactivate' : 'Activate'}
                        >
                          <Power size={18} />
                        </button>
                        <button
                          onClick={() =>
                            handleResetPassword(account.id!, account.username)
                          }
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Reset Password"
                        >
                          <Key size={18} />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(account.id!, account.username)
                          }
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Admin Modal */}
      {editModalOpen && editingAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-50 border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                Edit Admin: {editingAdmin.firstName} {editingAdmin.lastName}
              </h2>
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setEditingAdmin(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Admin Info */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Username</p>
                    <p className="font-medium text-gray-900">{editingAdmin.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{editingAdmin.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">
                      {editingAdmin.firstName} {editingAdmin.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className={`font-medium ${editingAdmin.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {editingAdmin.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Permissions Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign Permissions</h3>
                <div className="space-y-4">
                  {Object.entries(ADMIN_PERMISSIONS).map(([key, permission]) => (
                    <label key={permission.id} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={editPermissions.includes(permission.id)}
                        onChange={() => handlePermissionToggle(permission.id)}
                        className="mt-1 h-4 w-4 text-blue-600 rounded cursor-pointer"
                      />
                      <div className="ml-3 flex-1">
                        <p className="font-medium text-gray-900">{permission.name}</p>
                        <p className="text-sm text-gray-600">{permission.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Selected Permissions: <span className="font-medium text-gray-900">{editPermissions.length}</span></p>
                {editPermissions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {editPermissions.map((permId) => {
                      const perm = Object.values(ADMIN_PERMISSIONS).find((p) => p.id === permId);
                      return (
                        <span key={permId} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {perm?.name}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setEditingAdmin(null);
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                disabled={savingEdit}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={savingEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {savingEdit ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

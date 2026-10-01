'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import swal from 'sweetalert';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/button';
import { 
  ADMIN_PERMISSIONS, 
  PERMISSION_GROUPS, 
  AdminUser 
} from '@/types/admin-permissions';
import { adminService } from '@/app/api/dashboard/admin';

const adminAccountSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  roleName: yup.string().optional(),
  email: yup.string().email('Invalid email').required('Email is required'),
  username: yup
    .string()
    .required('Username is required')
    .min(4, 'Username must be at least 4 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  permissions: yup
    .array()
    .of(yup.string())
    .min(1, 'Please select at least one permission'),
});

interface AdminAccountFormProps {
  onSuccess?: () => void;
}

export const AdminAccountForm: React.FC<AdminAccountFormProps> = ({ onSuccess }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(adminAccountSchema),
    defaultValues: {
      permissions: [],
    },
  });

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  const handlePermissionToggle = (permissionId: string) => {
    const newPermissions = selectedPermissions.includes(permissionId)
      ? selectedPermissions.filter((p) => p !== permissionId)
      : [...selectedPermissions, permissionId];

    setSelectedPermissions(newPermissions);
    setValue('permissions', newPermissions);
  };

  const handleGroupToggle = (groupPermissions: string[]) => {
    const allSelected = groupPermissions.every((p) =>
      selectedPermissions.includes(p)
    );

    let newPermissions: string[];
    if (allSelected) {
      // Deselect all in group
      newPermissions = selectedPermissions.filter(
        (p) => !groupPermissions.includes(p)
      );
    } else {
      // Select all in group
      const uniquePermissions = new Set([
        ...selectedPermissions,
        ...groupPermissions,
      ]);
      newPermissions = Array.from(uniquePermissions);
    }

    setSelectedPermissions(newPermissions);
    setValue('permissions', newPermissions);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const adminData: Partial<AdminUser> = {
        firstName: data.firstName,
        lastName: data.lastName,
        roleName: data.roleName,
        email: data.email,
        username: data.username,
        password: data.password,
        permissions: selectedPermissions,
        isActive: true,
      };

      const response = await adminService.createAdminAccount(adminData);

      if (response?.success) {
        toast.success('Admin account created successfully');
        
        const willProceed = await swal({
          title: 'Admin Account Created!',
          text: `Admin account for ${data.username} has been created with ${selectedPermissions.length} permission(s).`,
          icon: 'success',
          buttons: {
            dashboard: {
              text: 'Go to Dashboard',
              value: 'dashboard',
            },
            createAnother: {
              text: 'Create Another',
              value: 'another',
            },
          },
        });

        if (willProceed === 'dashboard') {
          router.push('/dashboard');
        } else if (willProceed === 'another') {
          reset();
          setSelectedPermissions([]);
        }

        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.Message ||
          error?.message ||
          'Failed to create admin account'
      );
    } finally {
      setLoading(false);
    }
  };

  const isGroupFullySelected = (groupPermissions: string[]) => {
    return groupPermissions.every((p) => selectedPermissions.includes(p));
  };

  const isGroupPartiallySelected = (groupPermissions: string[]) => {
    return (
      groupPermissions.some((p) => selectedPermissions.includes(p)) &&
      !isGroupFullySelected(groupPermissions)
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Admin Account Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="space-y-2">
            <label className="text-sm text-gray-700 font-medium">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('firstName')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter first name"
            />
            {errors.firstName && (
              <p className="text-xs text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label className="text-sm text-gray-700 font-medium">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('lastName')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter last name"
            />
            {errors.lastName && (
              <p className="text-xs text-red-500">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Role Name */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700 font-medium">
            Role Name <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            {...register('roleName')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="e.g., Resources Admin"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700 font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="admin@example.com"
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Username */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700 font-medium">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('username')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="admin_username"
          />
          {errors.username && (
            <p className="text-xs text-red-500">{errors.username.message}</p>
          )}
          <p className="text-xs text-gray-500">
            Must be at least 4 characters. Only letters, numbers, and underscores allowed.
          </p>
        </div>

        {/* Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-700 font-medium">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700 font-medium">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Confirm password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Password must be at least 8 characters with uppercase, lowercase, and numbers.
        </p>
      </div>

      {/* Permissions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Admin Permissions <span className="text-red-500">*</span>
          </h3>
          <span className="text-sm text-gray-600">
            {selectedPermissions.length} selected
          </span>
        </div>
        <p className="text-sm text-gray-600">
          Select the admin functions this account will have access to
        </p>

        {errors.permissions && (
          <p className="text-xs text-red-500">{errors.permissions.message}</p>
        )}

        <div className="space-y-3 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
          {Object.entries(PERMISSION_GROUPS).map(([groupKey, group]) => {
            const groupPermissions = group.permissions;
            const isExpanded = expandedGroups[groupKey] ?? true;
            const isFullySelected = isGroupFullySelected(groupPermissions);
            const isPartiallySelected = isGroupPartiallySelected(groupPermissions);

            return (
              <div key={groupKey} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={isFullySelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isPartiallySelected;
                      }}
                      onChange={() => handleGroupToggle(groupPermissions)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => toggleGroup(groupKey)}
                      className="text-left"
                    >
                      <h4 className="font-semibold text-gray-800 text-sm">
                        {group.name}
                      </h4>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleGroup(groupKey)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      className={`w-5 h-5 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-3 ml-7 space-y-2">
                    {groupPermissions.map((permissionId) => {
                      const permission = Object.values(ADMIN_PERMISSIONS).find(
                        (p) => p.id === permissionId
                      );
                      if (!permission) return null;

                      return (
                        <label
                          key={permission.id}
                          className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(permission.id)}
                            onChange={() => handlePermissionToggle(permission.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-700">
                              {permission.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {permission.description}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button 
          title="Create Admin Account"
          type="submit"
          disabled={loading}
          loading={loading}
          className="w-full h-12"
        />
      </div>
    </form>
  );
};

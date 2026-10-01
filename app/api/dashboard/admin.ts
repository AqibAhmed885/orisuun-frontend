import axios from 'axios';
import { AdminUser } from '@/types/admin-permissions';

const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api`;
const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

// Get token from localStorage
const getAuthToken = (): string => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        return parsed.Token || '';
      } catch (e) {
        console.error('Error parsing userData:', e);
      }
    }
  }
  return '';
};

export const adminService = {
  /**
   * Create a new admin account with specific permissions
   */
  async createAdminAccount(adminData: Partial<AdminUser>) {
    const token = getAuthToken();
    
    try {
      const response = await axios.post(
        `${apiEndpoint}/Admin/CreateAdminAccount`,
        {
          FirstName: adminData.firstName,
          LastName: adminData.lastName,
          Email: adminData.email,
          Username: adminData.username,
          Password: adminData.password,
          Permissions: adminData.permissions,
          IsActive: adminData.isActive ?? true,
        },
        {
          headers: {
            XApiKey: token || apiKey,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Error creating admin account:', error);
      throw error;
    }
  },

  /**
   * Get all admin accounts (superadmin only)
   */
  async getAdminAccounts() {
    const token = getAuthToken();
    
    try {
      const response = await axios.get(
        `${apiEndpoint}/Admin/GetAllAdminUsers`,
        {
          headers: {
            XApiKey: token || apiKey,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return response.data.Result || [];
    } catch (error) {
      console.error('Error fetching admin accounts:', error);
      throw error;
    }
  },

  /**
   * Update admin account permissions
   */
  async updateAdminPermissions(adminId: string, permissions: string[]) {
    const token = getAuthToken();
    
    try {
      const response = await axios.put(
        `${apiEndpoint}/Admin/CreateAdminPermissions`,
        {
          AdminId: adminId,
          Permissions: permissions,
        },
        {
          headers: {
            XApiKey: token || apiKey,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error updating admin permissions:', error);
      throw error;
    }
  },

  /**
   * Deactivate/activate admin account
   */
  async toggleAdminStatus(adminId: string, isActive: boolean) {
    const token = getAuthToken();
    
    try {
      const response = await axios.put(
        `${apiEndpoint}/Admin/ToggleAdminStatus`,
        {
          AdminId: adminId,
          IsActive: isActive,
        },
        {
          headers: {
            XApiKey: token || apiKey,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error toggling admin status:', error);
      throw error;
    }
  },

  /**
   * Delete admin account (superadmin only)
   */
  async deleteAdminAccount(adminId: string) {
    const token = getAuthToken();
    
    try {
      const response = await axios.delete(
        `${apiEndpoint}/Admin/DeleteAdminAccount/${adminId}`,
        {
          headers: {
            XApiKey: token || apiKey,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error deleting admin account:', error);
      throw error;
    }
  },

  /**
   * Get admin account details by ID
   */
  async getAdminAccountById(adminId: string) {
    const token = getAuthToken();
    
    try {
      const response = await axios.get(
        `${apiEndpoint}/Admin/GetAdminAccount/${adminId}`,
        {
          headers: {
            XApiKey: token || apiKey,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return response.data.Result;
    } catch (error) {
      console.error('Error fetching admin account:', error);
      throw error;
    }
  },

  /**
   * Reset admin password (superadmin only)
   */
  async resetAdminPassword(adminId: string, newPassword: string) {
    const token = getAuthToken();
    
    try {
      const response = await axios.put(
        `${apiEndpoint}/Admin/ResetAdminPassword`,
        {
          AdminId: adminId,
          NewPassword: newPassword,
        },
        {
          headers: {
            XApiKey: token || apiKey,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error resetting admin password:', error);
      throw error;
    }
  },

  /**
   * Check if current user has specific permission
   */
  checkPermission(userPermissions: string[], requiredPermission: string): boolean {
    if (!userPermissions || !Array.isArray(userPermissions)) {
      return false;
    }
    
    // Superadmin (with admin_management permission) has all permissions
    if (userPermissions.includes('admin_management')) {
      return true;
    }
    
    return userPermissions.includes(requiredPermission);
  },

  /**
   * Get current user's permissions from localStorage
   */
  getCurrentUserPermissions(): string[] {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          return parsed.AdminPermissions || [];
        } catch (e) {
          console.error('Error parsing user permissions:', e);
        }
      }
    }
    return [];
  },
};

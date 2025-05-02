import axios from 'axios';

// Use environment variable for API URL with fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Types for user profile data
export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  created_at: string;
  last_login: string | null;
  // Additional fields as needed
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

class UserService {
  /**
   * Get the current user's profile
   */
  async getProfile(userId: string): Promise<UserProfile> {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_URL}/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }
  
  /**
   * Update user profile information
   */
  async updateProfile(userId: string, data: UpdateProfileRequest): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      
      // Using PATCH to match the FastAPI endpoint
      const response = await axios.patch(`${API_URL}/api/users/${userId}/profile`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
  
  /**
   * Change user password
   */
  async changePassword(userId: string, data: ChangePasswordRequest): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      
      // Using PATCH to match the FastAPI endpoint
      await axios.patch(`${API_URL}/api/users/${userId}/password`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
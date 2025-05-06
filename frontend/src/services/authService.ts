import axios from 'axios';

// Use environment variable for API URL with fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user_id: string;
  username: string;
  token?: string;
  error?: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

class AuthService {
  /**
   * Log in a user and retrieve their authentication data
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_URL}/api/login`, credentials);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        return { 
          user_id: '', 
          username: '', 
          error: error.response.data.error 
        };
      }
      throw error;
    }
  }

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<{ id: string } | { error: string }> {
    try {
      const response = await axios.post(`${API_URL}/api/users`, data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        return { error: error.response.data.error };
      }
      return { error: 'An error occurred during registration' };
    }
  }

  /**
   * Check if the current token is valid
   */
  async checkAuth(): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      // Optional: Verify token with backend
      // const response = await axios.get(`${API_URL}/api/auth/verify`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // return response.data.valid;
      
      // For now just return true if token exists
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Log out the current user
   */
  async logout(): Promise<void> {
    // If you have a server-side logout endpoint, you could call it here
    // try {
    //   const token = localStorage.getItem('token');
    //   await axios.post(`${API_URL}/api/logout`, {}, {
    //     headers: { Authorization: `Bearer ${token}` }
    //   });
    // } catch (error) {
    //   console.error('Error during logout:', error);
    // }

    // Clear local storage anyway
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  }
}

export const authService = new AuthService();
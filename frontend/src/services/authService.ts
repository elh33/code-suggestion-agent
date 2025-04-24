import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user_id: string;
  username: string;
  error?: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return { error: 'An unexpected error occurred', message: '', user_id: '', username: '' };
    }
  },

  async register(userData: any): Promise<any> {
    try {
      const response = await axios.post(`${API_URL}/users`, userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return { error: 'An unexpected error occurred' };
    }
  }
};
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { authService, LoginCredentials } from '@/services/authService';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  username: string | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check for existing session on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const storedUserId = localStorage.getItem('userId');
      const storedUsername = localStorage.getItem('username');
      const token = localStorage.getItem('token');

      if (storedUserId && storedUsername) {
        // Set default authorization header if token exists
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        setIsAuthenticated(true);
        setUserId(storedUserId);
        setUsername(storedUsername);
      }

      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Set up axios interceptor for handling auth errors
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Unauthorized error - token expired or invalid
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);

      if (response.error) {
        setError(response.error);
        setLoading(false);
        return false;
      }

      // Store auth data
      localStorage.setItem('userId', response.user_id);
      localStorage.setItem('username', response.username);

      // Store token if available
      if (response.token) {
        localStorage.setItem('token', response.token);
        axios.defaults.headers.common['Authorization'] =
          `Bearer ${response.token}`;
      }

      // Update state
      setIsAuthenticated(true);
      setUserId(response.user_id);
      setUsername(response.username);
      setLoading(false);
      return true;
    } catch (err) {
      setError('An unexpected error occurred during login');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    // Remove from local storage
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('token');

    // Remove auth header
    delete axios.defaults.headers.common['Authorization'];

    // Update state
    setIsAuthenticated(false);
    setUserId(null);
    setUsername(null);

    // Redirect to login page
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userId,
        username,
        loading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

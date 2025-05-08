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
  updateUsername: (newUsername: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = () => {
      console.log('Checking authentication status...');
      try {
        // Get auth data from localStorage
        const storedUserId = localStorage.getItem('userId');
        const storedUsername = localStorage.getItem('username');

        // Look for token with different possible names
        const token =
          localStorage.getItem('token') ||
          localStorage.getItem('authToken') ||
          localStorage.getItem('access_token') ||
          localStorage.getItem('jwt');

        console.log('Auth data in localStorage:', {
          hasUserId: !!storedUserId,
          hasUsername: !!storedUsername,
          hasToken: !!token,
        });

        // Modified condition: Allow authentication if userId and username exist
        // This is more resilient if token naming is inconsistent
        if (storedUserId && storedUsername) {
          console.log('Restoring authentication from localStorage');

          // Set default authorization header for API calls if token exists
          if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Ensure token is stored with consistent name
            localStorage.setItem('token', token);
          }

          // Update state to reflect authenticated user
          setIsAuthenticated(true);
          setUserId(storedUserId);
          setUsername(storedUsername);

          console.log('Authentication state restored successfully');
        } else {
          console.log('Missing auth data in localStorage, not authenticated');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setIsAuthenticated(false);
      } finally {
        // Always set loading to false when done checking
        setLoading(false);
        console.log('Auth loading state complete');
      }
    };

    // Delay the auth check slightly to ensure dependencies are ready
    const timer = setTimeout(checkAuthStatus, 100);
    return () => clearTimeout(timer);
  }, []);

  // Function to update username (for profile updates)
  const updateUsername = (newUsername: string) => {
    // Only proceed if the new username is valid
    if (newUsername) {
      // Update React state
      setUsername(newUsername);

      // Also update in localStorage so it persists through page refreshes
      localStorage.setItem('username', newUsername);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      console.log('Login response:', response); // Debug response structure

      if (response.error) {
        setError(response.error);
        setLoading(false);
        return false;
      }

      // Store auth data in localStorage for persistence
      localStorage.setItem('userId', response.user_id);
      localStorage.setItem('username', response.username);

      // Find and store token with more flexible field name checking
      const token = response.token;

      if (token) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('Token stored successfully');
      } else {
        console.warn('No token found in login response');
      }

      // Update state
      setIsAuthenticated(true);
      setUserId(response.user_id);
      setUsername(response.username);
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Login error:', err);
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
    localStorage.removeItem('authToken'); // Remove any alternative token names
    localStorage.removeItem('access_token');
    localStorage.removeItem('jwt');

    // Remove auth header
    delete axios.defaults.headers.common['Authorization'];

    // Update state
    setIsAuthenticated(false);
    setUserId(null);
    setUsername(null);
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
        updateUsername,
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

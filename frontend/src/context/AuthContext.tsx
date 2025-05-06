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

  // Check for existing session on component mount
  // Inside your checkAuthStatus function:

  // Inside the checkAuthStatus function, enhance the auth restoration logic:

  useEffect(() => {
    const checkAuthStatus = () => {
      console.log('Checking authentication status...');
      try {
        // Get auth data from localStorage
        const storedUserId = localStorage.getItem('userId');
        const storedUsername = localStorage.getItem('username');
        const token = localStorage.getItem('token');

        console.log('Auth data in localStorage:', {
          hasUserId: !!storedUserId,
          hasUsername: !!storedUsername,
          hasToken: !!token,
        });

        // If all data exists, restore the session
        if (storedUserId && storedUsername && token) {
          console.log('Restoring authentication from localStorage');

          // Set default authorization header for API calls
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

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

      if (response.error) {
        setError(response.error);
        setLoading(false);
        return false;
      }

      // Store auth data in localStorage for persistence
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

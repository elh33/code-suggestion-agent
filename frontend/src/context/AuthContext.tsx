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

  useEffect(() => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUserId(null);
    setUsername(null);
    setLoading(false);
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
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUserId(null);
    setUsername(null);
    router.push('/');
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

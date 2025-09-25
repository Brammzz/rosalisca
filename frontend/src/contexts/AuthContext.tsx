
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginAPI, LoginCredentials, AuthResponse } from '@/services/authService';

// This interface should match the user data you want to store in the context
interface User {
  _id: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials, options?: { onSuccess?: (data: AuthResponse) => void; onError?: (error: Error) => void; }) => void;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const queryClient = useQueryClient();

  // Check for existing session on app initialization
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const storedUser = localStorage.getItem('admin_user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsInitialLoading(false);
  }, []);

  const { mutate: loginMutation, isPending, error } = useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: loginAPI,
    onSuccess: (data) => {
      const userData: User = { _id: data._id, email: data.email, role: data.role as 'admin' | 'user' };
      setUser(userData);
      localStorage.setItem('admin_user', JSON.stringify(userData));
      localStorage.setItem('admin_token', data.token);
    },
    onError: (err) => {
      console.error('Login failed:', err);
      // Clear any stale data on error
      logout();
    }
  });

  const login = (credentials: LoginCredentials, options?: { onSuccess?: (data: AuthResponse) => void; onError?: (error: Error) => void; }) => {
    loginMutation(credentials, {
        onSuccess: options?.onSuccess,
        onError: options?.onError,
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_token');
    // Invalidate all queries to refetch data for a logged-out state
    queryClient.invalidateQueries();
  };

  const getToken = () => {
    return localStorage.getItem('admin_token');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading: isPending || isInitialLoading,
    isAuthenticated: !!user,
    error: error || null,
    getToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

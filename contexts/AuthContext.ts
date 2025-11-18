
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, User } from '../types';
import backendClient from '../api/backendClient';
import { jwtDecode } from 'jwt-decode'; // You may need to add a polyfill or an alternative for all environments

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  // FIX: Expose setError to allow components to clear the auth error state.
  setError: (error: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          // In a real app, you'd verify this token with a backend endpoint
          // For now, we'll decode and trust it if not expired
          const decoded: { id: string, role: UserRole, name: string, email: string, exp: number } = jwtDecode(token);
          if (decoded.exp * 1000 > Date.now()) {
            setUser({ id: decoded.id, role: decoded.role, name: decoded.name, email: decoded.email });
             backendClient.setAuthToken(token);
          } else {
             localStorage.removeItem('accessToken');
          }
        } catch (e) {
            console.error("Invalid token:", e);
            localStorage.removeItem('accessToken');
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await backendClient.post('/auth/login', { email, password });
      const { accessToken, user: userData } = response.data;
      localStorage.setItem('accessToken', accessToken);
      backendClient.setAuthToken(accessToken);
      setUser(userData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    setError(null);
    try {
        await backendClient.post('/auth/register', { name, email, password, role });
    } catch(err: any) {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
        throw err;
    } finally {
        setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    backendClient.setAuthToken(null);
  };

  const value = { user, isLoading, error, login, register, logout, setError };

  // FIX: Replaced JSX with React.createElement to be compatible with a .ts file extension, resolving JSX parsing errors.
  return React.createElement(AuthContext.Provider, { value: value }, children);
};


export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

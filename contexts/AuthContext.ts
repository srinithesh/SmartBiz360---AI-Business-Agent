
import { createContext, useContext } from 'react';
import { UserRole } from '../types';

export interface AuthContextType {
  user: { name: string; role: UserRole } | null;
  login: (name: string, role: UserRole) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = AuthContext.Provider;

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-surface text-on-surface border-b border-outline/20">
      <div className="flex items-center">
        <button onClick={() => setSidebarOpen(true)} className="text-on-surface-variant focus:outline-none lg:hidden">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div className="flex items-center">
        <div className="flex items-center">
          <span className="text-on-surface mr-4 text-sm hidden sm:block">{user?.name} ({user?.role})</span>
          <Button onClick={logout} variant="outlined" size="sm">
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
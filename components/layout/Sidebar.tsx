import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setActiveView: (view: string) => void;
  activeView: string;
}

// SVG Icons for Navigation
const Icon = ({ path, className }: { path: string, className?: string }) => (
    <svg className={`h-6 w-6 ${className}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d={path} />
    </svg>
);

const navIcons = {
    dashboard: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
    credit: "M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z",
    rentals: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
    compliance: "M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z",
    vehicles: "M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z",
    tally: "M21.99 8c0-.55-.45-1-1-1h-16c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V8zm-10 1H8v2h4v-2zm0 3H8v2h4v-2zm0 3H8v2h4v-2zm4-6h-2v2h2v-2zm0 3h-2v2h2v-2zm0 3h-2v2h2v-2zM12 5V4c0-.55-.45-1-1-1h-2c-.55 0-1 .45-1 1v1H3v2h18V5h-5z",
    security: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z",
    auth_settings: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
};

const navItems = [
    { name: 'Dashboard', view: 'dashboard', roles: [UserRole.Owner, UserRole.Employee, UserRole.Delivery, UserRole.Accountant] },
    { name: 'Credit Manager', view: 'credit', roles: [UserRole.Owner, UserRole.Accountant] },
    { name: 'Rental Manager', view: 'rentals', roles: [UserRole.Owner] },
    { name: 'Compliance Hub', view: 'compliance', roles: [UserRole.Owner, UserRole.Accountant] },
    { name: 'Vehicle Manager', view: 'vehicles', roles: [UserRole.Owner] },
    { name: 'Tally Integration', view: 'tally', roles: [UserRole.Owner, UserRole.Accountant] },
    { name: 'CyberGuardian', view: 'security', roles: [UserRole.Owner] },
    { name: 'Auth Settings', view: 'auth_settings', roles: [UserRole.Owner] }
];

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen, setActiveView, activeView }) => {
  const { user } = useAuth();

  const handleNavClick = (view: string) => {
    setActiveView(view);
    setSidebarOpen(false);
  };

  return (
    <>
      <div className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}></div>
      <div className={`fixed inset-y-0 left-0 z-30 w-72 bg-surface text-on-surface transform transition-transform lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-center py-6">
          <div className="flex items-center">
            <img src="/logo.svg" alt="SmartBiz360 Logo" className="h-10 w-10 text-primary" />
            <span className="text-on-surface text-2xl mx-2 font-semibold">SmartBiz360</span>
          </div>
        </div>
        <nav className="mt-4 px-4">
          {navItems.map((item) => (
            user && item.roles.includes(user.role) && (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`w-full flex items-center gap-4 my-1 py-2 px-4 rounded-full transition-colors ${activeView === item.view ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-variant'}`}
              >
                <Icon path={navIcons[item.view as keyof typeof navIcons]} />
                <span className="font-medium">{item.name}</span>
              </button>
            )
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
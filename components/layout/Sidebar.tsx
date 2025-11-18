import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setActiveView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen, setActiveView }) => {
  const { user } = useAuth();
  const isOwner = user?.role === UserRole.Owner;

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

  const handleNavClick = (view: string) => {
    setActiveView(view);
    setSidebarOpen(false);
  };

  return (
    <>
      <div className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}></div>
      <div className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto bg-gray-900 transform transition-transform lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-center mt-8">
          <div className="flex items-center">
            <img src="/logo.svg" alt="SmartBiz360 Logo" className="h-10 w-10" />
            <span className="text-white text-2xl mx-2 font-semibold">SmartBiz360</span>
          </div>
        </div>
        <nav className="mt-10">
          {navItems.map((item) => (
            user && item.roles.includes(user.role) && (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className="w-full flex items-center mt-4 py-2 px-6 text-gray-300 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100"
              >
                <span className="mx-3">{item.name}</span>
              </button>
            )
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
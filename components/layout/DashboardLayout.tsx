
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import OwnerDashboard from '../dashboards/OwnerDashboard';
import PlaceholderDashboard from '../dashboards/PlaceholderDashboard';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import CreditManager from '../modules/CreditManager';
import RentalManager from '../modules/RentalManager';
import ComplianceHub from '../modules/ComplianceHub';
import VehicleManager from '../modules/VehicleManager';
import TallyIntegration from '../modules/TallyIntegration';
import CyberGuardian from '../modules/CyberGuardian';
import BehavioralAuth from '../modules/BehavioralAuth';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const { user } = useAuth();

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        if (user?.role === UserRole.Owner) return <OwnerDashboard />;
        return <PlaceholderDashboard />;
      case 'credit':
        return <CreditManager />;
      case 'rentals':
        return <RentalManager />;
      case 'compliance':
        return <ComplianceHub />;
      case 'vehicles':
        return <VehicleManager />;
      case 'tally':
          return <TallyIntegration />;
      case 'security':
        return <CyberGuardian />;
      case 'auth_settings':
        return <BehavioralAuth />;
      default:
        if (user?.role === UserRole.Owner) return <OwnerDashboard />;
        return <PlaceholderDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setActiveView={setActiveView} activeView={activeView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

import React from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginScreen from './components/auth/LoginScreen';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return user ? <DashboardLayout /> : <LoginScreen />;
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background text-on-background">
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;
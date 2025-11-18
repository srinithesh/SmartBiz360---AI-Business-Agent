
import React, { useState } from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import { AuthProvider } from './contexts/AuthContext';
import { UserRole } from './types';
import LoginScreen from './components/auth/LoginScreen';

function App() {
  const [user, setUser] = useState<{ name: string; role: UserRole } | null>(null);

  const handleLogin = (name: string, role: UserRole) => {
    setUser({ name, role });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <AuthProvider value={{ user, login: handleLogin, logout: handleLogout }}>
      <div className="min-h-screen bg-background text-on-background">
        {user ? <DashboardLayout /> : <LoginScreen />}
      </div>
    </AuthProvider>
  );
}

export default App;
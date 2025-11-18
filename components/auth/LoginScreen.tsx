import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';

const users = [
  { name: 'Alice (Owner)', role: UserRole.Owner },
  { name: 'Bob (Employee)', role: UserRole.Employee },
  { name: 'Charlie (Delivery)', role: UserRole.Delivery },
  { name: 'Diana (Accountant)', role: UserRole.Accountant },
];

const LoginScreen: React.FC = () => {
  const { login } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <img src="/logo.svg" alt="SmartBiz360 Logo" className="h-20 w-20 mb-4 text-primary" />
          <h1 className="text-2xl font-bold text-on-surface">
            Welcome to SmartBiz360
          </h1>
          <p className="mt-2 text-md text-on-surface-variant">
            Your AI-Powered Business Assistant
          </p>
        </div>
        <div className="space-y-4 mt-8">
          <p className="text-center text-sm font-medium text-on-surface-variant">Select a profile to continue</p>
          {users.map((user) => (
            <Button
              key={user.role}
              onClick={() => login(user.name, user.role)}
              className="w-full"
              variant="outlined"
            >
              Log in as {user.name}
            </Button>
          ))}
        </div>
        <p className="mt-8 text-xs text-center text-on-surface-variant/70">
          This is a simulated login for demonstration purposes.
        </p>
      </Card>
    </div>
  );
};

export default LoginScreen;
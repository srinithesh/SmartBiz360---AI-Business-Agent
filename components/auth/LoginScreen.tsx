import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import Button from '../ui/Button';

const users = [
  { name: 'Alice (Owner)', role: UserRole.Owner },
  { name: 'Bob (Employee)', role: UserRole.Employee },
  { name: 'Charlie (Delivery)', role: UserRole.Delivery },
  { name: 'Diana (Accountant)', role: UserRole.Accountant },
];

const LoginScreen: React.FC = () => {
  const { login } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <img src="/logo.svg" alt="SmartBiz360 Logo" className="h-16 w-16 mb-4" />
          <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white">
            Welcome to SmartBiz360
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Select a user profile to log in
          </p>
        </div>
        <div className="space-y-4">
          {users.map((user) => (
            <Button
              key={user.role}
              onClick={() => login(user.name, user.role)}
              className="w-full"
            >
              Log in as {user.name}
            </Button>
          ))}
        </div>
        <p className="mt-6 text-xs text-center text-gray-500 dark:text-gray-400">
          This is a simulated login for demonstration purposes.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
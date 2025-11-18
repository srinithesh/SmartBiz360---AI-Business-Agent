
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';

const LoginScreen: React.FC = () => {
  // FIX: Destructure setError from useAuth to clear the global auth error when toggling forms.
  const { login, register, isLoading, error, setError } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.Owner);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      if (isRegistering) {
        if (!name) {
            setFormError("Name is required for registration.");
            return;
        }
        await register(name, email, password, role);
        // On successful registration, switch to login view
        setIsRegistering(false);
        alert("Registration successful! Please log in.");
      } else {
        await login(email, password);
      }
    } catch (err) {
      // The error is already set in the AuthContext, but we can catch it
      // if we need to do something specific on this component.
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <img src="/logo.svg" alt="SmartBiz360 Logo" className="h-16 w-16 mb-4 text-primary" />
          <h1 className="text-2xl font-bold text-on-surface">
            {isRegistering ? 'Create Your Account' : 'Welcome Back'}
          </h1>
          <p className="mt-2 text-md text-on-surface-variant">
            {isRegistering ? 'Join the SmartBiz360 platform.' : 'Log in to your dashboard.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
           {isRegistering && (
             <Input 
                id="name"
                label="Full Name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
            />
           )}
          <Input 
            id="email"
            label="Email Address" 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            autoComplete="email"
          />
          <Input 
            id="password"
            label="Password" 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            autoComplete={isRegistering ? "new-password" : "current-password"}
          />
           {isRegistering && (
             <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Select Your Role</label>
                <select value={role} onChange={e => setRole(e.target.value as any)} className="w-full rounded-md p-2 bg-surface-variant/60 dark:bg-surface-variant/30 border border-outline/50">
                    <option value={UserRole.Owner}>Owner</option>
                    <option value={UserRole.Employee}>Employee</option>
                    <option value={UserRole.Delivery}>Delivery Person</option>
                    <option value={UserRole.Accountant}>Accountant</option>
                </select>
             </div>
           )}

          {error && <p className="text-sm text-center text-error font-medium">{error}</p>}
          {formError && <p className="text-sm text-center text-error font-medium">{formError}</p>}
          
          <div className="pt-2">
            <Button type="submit" className="w-full" isLoading={isLoading}>
              {isRegistering ? 'Register' : 'Log In'}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => { setIsRegistering(!isRegistering); setError(null); setFormError(null); }} className="text-sm font-medium text-primary hover:underline">
            {isRegistering ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default LoginScreen;

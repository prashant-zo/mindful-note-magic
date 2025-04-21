
import React, { useState } from 'react';
import AuthForm from './AuthForm';
import { AuthFormData } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { toast } from "@/components/ui/sonner";

const AuthContainer: React.FC = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: AuthFormData) => {
    setIsLoading(true);
    try {
      if (mode === 'login') {
        await login(data);
        toast.success('Welcome back!');
      } else {
        await register(data);
        toast.success('Account created successfully!');
      }
    } catch (error) {
      // Error handling is done in auth service
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AuthForm
        mode={mode}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onToggleMode={toggleMode}
      />
    </div>
  );
};

export default AuthContainer;

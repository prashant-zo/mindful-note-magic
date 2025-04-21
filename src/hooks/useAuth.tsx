
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { AuthFormData, User } from '@/types';
import { authService } from '@/services/auth';

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  login: (data: AuthFormData) => Promise<User | null>;
  register: (data: AuthFormData) => Promise<User | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await authService.getUser();
        setUser(user);
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (data: AuthFormData) => {
    const user = await authService.login(data);
    setUser(user);
    return user;
  };

  const register = async (data: AuthFormData) => {
    const user = await authService.register(data);
    setUser(user);
    return user;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

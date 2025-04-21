
import { AuthFormData, User } from '@/types';
import { toast } from "@/components/ui/sonner";

// This is a mock authentication service
// In a real app, you would use Supabase here
export const authService = {
  currentUser: null as User | null,
  
  login: async (data: AuthFormData): Promise<User | null> => {
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock validation
      if (data.email === 'demo@example.com' && data.password === 'password') {
        const user: User = {
          id: 'user-1',
          email: data.email,
          created_at: new Date().toISOString(),
        };
        
        // Store in localStorage to persist between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        authService.currentUser = user;
        return user;
      }
      
      // For demo purposes, allow any email/password with minimal validation
      if (data.email && data.password.length >= 6) {
        const user: User = {
          id: 'user-1',
          email: data.email,
          created_at: new Date().toISOString(),
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        authService.currentUser = user;
        return user;
      }
      
      throw new Error('Invalid email or password');
    } catch (error: any) {
      toast.error('Login failed', {
        description: error.message
      });
      return null;
    }
  },
  
  register: async (data: AuthFormData): Promise<User | null> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!data.email || data.password.length < 6) {
        throw new Error('Invalid email or password (min 6 characters)');
      }
      
      const user: User = {
        id: 'user-1',
        email: data.email,
        created_at: new Date().toISOString(),
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      authService.currentUser = user;
      return user;
    } catch (error: any) {
      toast.error('Registration failed', {
        description: error.message
      });
      return null;
    }
  },
  
  logout: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    localStorage.removeItem('user');
    authService.currentUser = null;
  },
  
  getUser: async (): Promise<User | null> => {
    // Check localStorage first
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        authService.currentUser = user;
        return user;
      } catch {
        localStorage.removeItem('user');
      }
    }
    
    return null;
  }
};

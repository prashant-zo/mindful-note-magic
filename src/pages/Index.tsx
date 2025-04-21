
import { useAuth } from '@/hooks/useAuth';
import Auth from './Auth';
import Dashboard from './Dashboard';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <Auth />;
};

export default Index;


import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Plus } from 'lucide-react';
import { toast } from "@/components/ui/sonner";
import { ApiKeyDialog } from '@/components/Settings/ApiKeyDialog';

interface AppHeaderProps {
  onNewNote: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onNewNote }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success('You have been logged out');
  };

  return (
    <header className="border-b bg-card mb-6">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            MindNotes
          </h1>
          {user && (
            <span className="text-sm text-muted-foreground ml-4">
              {user.email}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={onNewNote}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Note
          </Button>

          <ApiKeyDialog />

          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex items-center"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;

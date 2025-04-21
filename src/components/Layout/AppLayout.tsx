import React, { ReactNode, useState } from 'react';
import AppHeader from './AppHeader';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ApiKeyDialog } from "@/components/Settings/ApiKeyDialog";
import { Button, Plus } from "@/components/ui/button";

interface AppLayoutProps {
  children: ReactNode;
  onNewNote: () => void;
  showDeleteDialog: boolean;
  noteToDelete: string | null;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  onNewNote,
  showDeleteDialog,
  noteToDelete,
  onCancelDelete,
  onConfirmDelete
}) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <h1 className="text-xl font-semibold">MindNotes</h1>
          <div className="flex items-center gap-2">
            <ApiKeyDialog />
            <Button onClick={onNewNote}>
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 pb-8">
        {children}
      </main>

      <AlertDialog open={showDeleteDialog} onOpenChange={onCancelDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AppLayout;

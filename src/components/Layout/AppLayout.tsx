
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
    <div className="min-h-screen flex flex-col">
      <AppHeader onNewNote={onNewNote} />
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


import React, { useState } from 'react';
import NoteList from '@/components/Notes/NoteList';
import NoteEditor from '@/components/Notes/NoteEditor';
import AppLayout from '@/components/Layout/AppLayout';
import { useNotes } from '@/hooks/useNotes';
import { NoteFormData } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  const {
    notes,
    isLoading,
    createNote,
    updateNote,
    deleteNote,
    isCreating,
    isUpdating,
    isDeleting,
  } = useNotes();

  const handleNewNote = () => {
    setIsEditing(true);
    setEditingNoteId(null);
  };

  const handleEditNote = (id: string) => {
    setIsEditing(true);
    setEditingNoteId(id);
  };

  const handleDeleteNote = (id: string) => {
    setNoteToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (noteToDelete) {
      await deleteNote(noteToDelete);
      setShowDeleteDialog(false);
      setNoteToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setNoteToDelete(null);
  };

  const handleSaveNote = async (data: NoteFormData & { id?: string; summary?: string }) => {
    if (data.id) {
      await updateNote({ id: data.id, data });
    } else {
      await createNote(data);
    }
    setIsEditing(false);
    setEditingNoteId(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingNoteId(null);
  };

  const editingNote = editingNoteId ? notes.find((note) => note.id === editingNoteId) : undefined;

  return (
    <AppLayout
      onNewNote={handleNewNote}
      showDeleteDialog={showDeleteDialog}
      noteToDelete={noteToDelete}
      onCancelDelete={handleCancelDelete}
      onConfirmDelete={handleConfirmDelete}
    >
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[220px] rounded-lg" />
          ))}
        </div>
      ) : isEditing ? (
        <NoteEditor
          note={editingNote}
          onSave={handleSaveNote}
          onCancel={handleCancelEdit}
          isLoading={isCreating || isUpdating}
        />
      ) : (
        <NoteList
          notes={notes}
          onEditNote={handleEditNote}
          onDeleteNote={handleDeleteNote}
        />
      )}
    </AppLayout>
  );
};

export default Dashboard;

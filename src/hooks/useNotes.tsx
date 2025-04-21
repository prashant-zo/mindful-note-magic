
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesService } from '@/services/notes';
import { NoteFormData } from '@/types';
import { toast } from "@/components/ui/sonner";

export const useNotes = () => {
  const queryClient = useQueryClient();

  const notesQuery = useQuery({
    queryKey: ['notes'],
    queryFn: notesService.getNotes,
  });

  const createNoteMutation = useMutation({
    mutationFn: (data: NoteFormData) => notesService.createNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create note', {
        description: error.message
      });
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NoteFormData> }) => 
      notesService.updateNote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note updated successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to update note', {
        description: error.message
      });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => notesService.deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note deleted successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete note', {
        description: error.message
      });
    },
  });

  const summarizeNoteMutation = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const summary = await notesService.summarizeNote(content);
      return { id, summary };
    },
    onSuccess: ({ id, summary }) => {
      updateNoteMutation.mutate({ id, data: { summary } });
    },
  });

  return {
    notes: notesQuery.data || [],
    isLoading: notesQuery.isLoading,
    isError: notesQuery.isError,
    error: notesQuery.error,
    createNote: createNoteMutation.mutate,
    updateNote: updateNoteMutation.mutate,
    deleteNote: deleteNoteMutation.mutate,
    summarizeNote: summarizeNoteMutation.mutate,
    isCreating: createNoteMutation.isPending,
    isUpdating: updateNoteMutation.isPending,
    isDeleting: deleteNoteMutation.isPending,
    isSummarizing: summarizeNoteMutation.isPending,
  };
};


import { Note, NoteColor, NoteFormData } from '@/types';
import { toast } from "@/components/ui/sonner";
import { authService } from './auth';

// Initial mock data for notes
const initialNotes: Note[] = [
  {
    id: '1',
    title: 'Welcome to MindNotes!',
    content: 'This is your first note. You can edit or delete it, or create new notes. Try out the AI summarization feature!',
    summary: 'Welcome note introducing basic app features.',
    color: 'purple',
    user_id: 'user-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Meeting Notes - Project Kickoff',
    content: 'Project kickoff meeting with the team.\n\n**Attendees**: John, Sarah, Mike, Lisa\n\n**Key Points**:\n- Project timeline: 6 weeks\n- Main deliverables: Dashboard, User management, Reporting\n- Weekly sync meetings every Monday at 10am\n- Budget approved for additional resources\n\n**Action Items**:\n- John to set up project repository\n- Sarah to create initial wireframes\n- Mike to prepare technical requirements\n- Lisa to coordinate with the client',
    summary: 'Project kickoff meeting discussing timeline, deliverables, and action items with team members.',
    color: 'blue',
    user_id: 'user-1',
    created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'Ideas for Weekend Trip',
    content: '# Weekend Trip Ideas\n\n## Destinations\n- Mountain cabin\n- Beach resort\n- City exploration\n\n## Activities\n- Hiking\n- Swimming\n- Photography\n- Local cuisine tasting\n\n## Packing List\n- Clothes for 3 days\n- Camera\n- Hiking boots\n- Swimwear\n- Sunscreen\n- First aid kit',
    summary: 'Planning weekend trip with destination options, activities, and packing list.',
    color: 'green',
    user_id: 'user-1',
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

// Get notes from localStorage or use initial mock data
const getStoredNotes = (): Note[] => {
  const storedNotes = localStorage.getItem('notes');
  if (storedNotes) {
    try {
      return JSON.parse(storedNotes) as Note[];
    } catch {
      return [...initialNotes];
    }
  }
  return [...initialNotes];
};

// Helper to persist notes to localStorage
const persistNotes = (notes: Note[]): void => {
  localStorage.setItem('notes', JSON.stringify(notes));
};

// This is a mock notes service
// In a real app, you would use Supabase here
export const notesService = {
  getNotes: async (): Promise<Note[]> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // simulate API delay
    return getStoredNotes().filter(note => {
      // Only return notes belonging to the current user
      return note.user_id === (authService.currentUser?.id || 'user-1');
    });
  },
  
  getNote: async (id: string): Promise<Note | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const note = getStoredNotes().find(note => note.id === id);
    return note || null;
  },
  
  createNote: async (data: NoteFormData): Promise<Note> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: data.title || 'Untitled Note',
      content: data.content || '',
      color: data.color || 'yellow',
      user_id: authService.currentUser?.id || 'user-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const notes = getStoredNotes();
    notes.unshift(newNote); // Add to start of array
    persistNotes(notes);
    
    return newNote;
  },
  
  updateNote: async (id: string, data: Partial<NoteFormData>): Promise<Note> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const notes = getStoredNotes();
    const noteIndex = notes.findIndex(note => note.id === id);
    
    if (noteIndex === -1) {
      throw new Error('Note not found');
    }
    
    const updatedNote = {
      ...notes[noteIndex],
      ...data,
      updated_at: new Date().toISOString(),
    };
    
    notes[noteIndex] = updatedNote;
    persistNotes(notes);
    
    return updatedNote;
  },
  
  deleteNote: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const notes = getStoredNotes();
    const filteredNotes = notes.filter(note => note.id !== id);
    
    if (filteredNotes.length === notes.length) {
      throw new Error('Note not found');
    }
    
    persistNotes(filteredNotes);
  },
  
  summarizeNote: async (content: string): Promise<string> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // simulate API delay
      
      // For demo purposes, create a simple summary
      // In a real app, this would call an AI API like DeepSeek or Groq
      const words = content.split(/\s+/);
      const firstSentenceEnd = content.search(/[.!?]/);
      const firstSentence = firstSentenceEnd > 0 
        ? content.substring(0, firstSentenceEnd + 1) 
        : content.substring(0, 50) + '...';
      
      if (words.length < 10) {
        return firstSentence;
      }
      
      // Extract keywords
      const keywords = words
        .filter(word => word.length > 4)  // Only longer words
        .filter((value, index, self) => self.indexOf(value) === index) // Unique
        .slice(0, 5); // Take first 5
      
      let summary = firstSentence;
      
      if (keywords.length > 0) {
        summary += ` Key topics: ${keywords.join(', ')}.`;
      }
      
      return summary;
    } catch (error) {
      console.error('Error summarizing note:', error);
      return 'Unable to generate summary at this time.';
    }
  },
};

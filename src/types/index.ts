
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  summary?: string;
  color: NoteColor;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export type NoteColor = 'yellow' | 'purple' | 'blue' | 'pink' | 'green';

export interface NoteFormData {
  title: string;
  content: string;
  color: NoteColor;
  summary?: string;
}

export interface AuthFormData {
  email: string;
  password: string;
}

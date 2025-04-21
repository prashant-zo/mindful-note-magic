
import React from 'react';
import { Note } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
  // Format content for preview
  const getContentPreview = (content: string) => {
    // Remove any markdown characters
    const plainText = content
      .replace(/#{1,6}\s?/g, '') // Remove headings
      .replace(/\*\*/g, '') // Remove bold
      .replace(/\*/g, '') // Remove italic
      .replace(/`/g, '') // Remove code
      .replace(/\[|\]\(.*\)/g, '') // Remove links
      .replace(/>/g, ''); // Remove blockquotes

    return plainText.length > 150
      ? plainText.substring(0, 150) + '...'
      : plainText;
  };

  return (
    <Card className={`bg-note-${note.color} hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full`}>
      <CardContent className="p-5 flex-grow">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{note.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {getContentPreview(note.content)}
        </p>
        {note.summary && (
          <div className="text-xs p-2 bg-background/50 rounded-md">
            <p className="font-medium mb-1">AI Summary:</p>
            <p className="line-clamp-2">{note.summary}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="px-5 py-3 bg-background/30 flex justify-between border-t border-background/20">
        <span className="text-xs text-muted-foreground">
          {format(new Date(note.updated_at), 'MMM dd, yyyy')}
        </span>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onEdit(note.id)}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-destructive"
            onClick={() => onDelete(note.id)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;

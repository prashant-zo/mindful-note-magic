
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Note, NoteColor, NoteFormData } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { aiService } from '@/services/ai';
import { toast } from "@/components/ui/sonner";

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  color: z.enum(['yellow', 'purple', 'blue', 'pink', 'green'] as const),
});

interface NoteEditorProps {
  note?: Note;
  onSave: (data: NoteFormData & { id?: string; summary?: string }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onSave,
  onCancel,
  isLoading = false,
}) => {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | undefined>(note?.summary);

  const form = useForm<NoteFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: note?.title || '',
      content: note?.content || '',
      color: note?.color || 'yellow',
    },
  });

  const watchContent = form.watch('content');

  const handleGenerateSummary = async () => {
    const content = form.getValues('content');
    if (!content || content.length < 50) {
      toast.warning('Add more content first', {
        description: 'Your note needs more content to generate a meaningful summary.'
      });
      return;
    }

    setIsSummarizing(true);
    try {
      const generatedSummary = await aiService.summarize(content);
      setSummary(generatedSummary);
      toast.success('Summary generated!');
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Failed to generate summary', {
        description: 'Please try again later.'
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSubmit = async (data: NoteFormData) => {
    try {
      await onSave({
        ...data,
        id: note?.id,
        summary: summary,
      });
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const colorOptions: { value: NoteColor; label: string }[] = [
    { value: 'yellow', label: 'Yellow' },
    { value: 'purple', label: 'Purple' },
    { value: 'blue', label: 'Blue' },
    { value: 'pink', label: 'Pink' },
    { value: 'green', label: 'Green' },
  ];

  return (
    <Card className="w-full shadow-md animate-enter">
      <CardHeader>
        <div className="text-lg font-semibold">
          {note ? 'Edit Note' : 'Create New Note'}
        </div>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Note title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a color" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {colorOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="flex items-center"
                            >
                              <div className="flex items-center">
                                <div
                                  className={`w-4 h-4 rounded-full bg-note-${option.value} mr-2`}
                                ></div>
                                {option.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your note here..."
                      className="min-h-[200px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {summary && (
              <div className="p-3 bg-muted/50 rounded-md">
                <h4 className="text-sm font-medium mb-1">AI Summary:</h4>
                <p className="text-sm text-muted-foreground">{summary}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={handleGenerateSummary}
                disabled={!watchContent || watchContent.length < 50 || isSummarizing}
                className="relative"
              >
                {isSummarizing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Summarizing...
                  </>
                ) : (
                  'Generate AI Summary'
                )}
              </Button>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Note'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default NoteEditor;

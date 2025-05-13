import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useBookmarkContext } from '@/context/BookmarkContext';
import { toast } from 'sonner';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL' }),
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional(),
  tags: z.string(),
  category: z.string().nonempty({ message: 'Category is required' }),
});

const AddBookmarkForm = () => {
  const { addBookmark, state } = useBookmarkContext();
  const [open, setOpen] = useState(false);
  
  // Get unique categories from bookmarks
  const categories = Array.from(new Set(state.bookmarks.map(b => b.category).filter(Boolean)));

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      title: '',
      description: '',
      tags: '',
      category: 'other',
    },
  });
  
  const onSubmit = async (data) => {
    try {
      const newBookmark = {
        url: data.url,
        title: data.title,
        description: data.description || undefined,
        category: data.category,
        tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        source: 'manual',
      };
      
      const result = await addBookmark(newBookmark);
      form.reset();
      setOpen(false);
      
      // Check if this was an update or new bookmark
      if (result.updatedAt && result.createdAt !== result.updatedAt) {
        toast.success('Bookmark updated successfully');
      } else {
        toast.success('Bookmark added successfully');
      }
    } catch (error) {
      toast.error('Failed to save bookmark');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-bookmark-primary hover:bg-bookmark-primary/90">
          <Plus className="h-4 w-4" />
          Add Bookmark
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Bookmark</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Bookmark title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description of the bookmark" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.length === 0 && (
                        <SelectItem value="other">Other</SelectItem>
                      )}
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
                      ))}
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="tag1, tag2, tag3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-bookmark-primary hover:bg-bookmark-primary/90">
                Save Bookmark
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookmarkForm;
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
import { useBookmarkContext } from '../context/BookmarkContext';
import { toast } from 'sonner';
import { Dialog as Modal, DialogContent as ModalContent, DialogHeader as ModalHeader, DialogTitle as ModalTitle } from '@/components/ui/dialog';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL' }),
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional(),
  tags: z.string(),
  category: z.string().nonempty({ message: 'Category is required' }),
});

const AddBookmarkForm = () => {
  const { addBookmark, bookmarks } = useBookmarkContext();
  const [open, setOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  // Use local categories state for instant update
  const [categories, setCategories] = useState(() => Array.from(new Set(bookmarks.map(b => b.category).filter(Boolean))));

  // Update local categories if bookmarks change
  React.useEffect(() => {
    setCategories(Array.from(new Set(bookmarks.map(b => b.category).filter(Boolean))));
  }, [bookmarks]);

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

  // Add new category handler
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    if (!categories.includes(newCategory.trim())) {
      setCategories(prev => [...prev, newCategory.trim()]);
    }
    form.setValue('category', newCategory.trim());
    setNewCategory('');
    setCategoryModalOpen(false);
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
                  <Button type="button" variant="outline" className="mt-2" onClick={() => setCategoryModalOpen(true)}>
                    + New Category
                  </Button>
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

      {/* New Category Modal */}
      <Modal open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
        <ModalContent className="max-w-xs">
          <ModalHeader>
            <ModalTitle>New Category</ModalTitle>
          </ModalHeader>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <Input
              autoFocus
              placeholder="Category name"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setCategoryModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-bookmark-primary hover:bg-bookmark-primary/90">
                Add
              </Button>
            </div>
          </form>
        </ModalContent>
      </Modal>
    </Dialog>
  );
};

export default AddBookmarkForm;
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBookmarkContext } from '../context/BookmarkContext';
import PropTypes from 'prop-types';
import { Bookmark, Tag, Hash, Pencil, Trash2 } from 'lucide-react';
import {
  Dialog as Modal,
  DialogContent as ModalContent,
  DialogHeader as ModalHeader,
  DialogTitle as ModalTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import config from '@/config';

const iconMap = {
  other: <Tag className="h-4 w-4" />,
};

const CategoryFilter = () => {
  const { bookmarks, selectedCategory, setCategory, setSearchQuery } = useBookmarkContext();
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [editCategoryName, setEditCategoryName] = React.useState('');

  // unique categories 
  const categories = Array.from(
    new Set(bookmarks.map(b => b.category).filter(Boolean))
  );
  const getCount = (cat) => bookmarks.filter(b => b.category === cat).length;

  // edit
  const handleEditCategory = async (e) => {
    e.preventDefault();
    if (!editCategoryName.trim() || editCategoryName === selectedCategory) 
      return;
    try {
      const res = await fetch(`${config.apiBaseUrl}/bookmarks/update-category`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldCategory: selectedCategory, newCategory: editCategoryName.trim() })
      });
      if (!res.ok) throw new Error('Failed to update category');
      const data = await res.json();
      setCategory(data.bookmarks);
      setEditModalOpen(false);
      setEditCategoryName('');
    } catch (error) {
      alert('Failed to update category');
    }
  };

  // delet category 
  const handleDeleteCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${config.apiBaseUrl}/bookmarks/delete-category`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: selectedCategory })
      });
      if (!res.ok) throw new Error('Failed to delete category');
      const data = await res.json();
      setCategory(data.bookmarks);
      setDeleteModalOpen(false);
    } catch (error) {
      alert('Failed to delete category');
    }
  };

  return (
    <div className="flex flex-col space-y-1 w-full">
      <Button
        key="all"
        variant={selectedCategory === 'all' ? 'default' : 'ghost'}
        className={`justify-start ${selectedCategory === 'all' ? 'bg-bookmark-primary hover:bg-bookmark-primary/90' : ''}`}
        onClick={() => setCategory('all')}
      >
        <div className="flex items-center">
          <Bookmark className="h-4 w-4" />
          <span className="ml-2">All Bookmarks</span>
        </div>
      </Button>
      {/* dynamic categories */}
      {categories.map((cat) => (
        <div key={cat} className="flex items-center group">
          <Button
            variant={selectedCategory === cat ? 'default' : 'ghost'}
            className={`flex-1 justify-start ${selectedCategory === cat ? 'bg-bookmark-primary hover:bg-bookmark-primary/90' : ''}`}
            onClick={() => setCategory(cat)}
          >
            <div className="flex items-center">
              {iconMap[cat] || <Tag className="h-4 w-4" />}
              <span className="ml-2">{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
              <Badge variant="secondary" className="ml-auto">{getCount(cat)}</Badge>
            </div>
          </Button>
          {/* Edit/Delete icons */}
          <button
            className="ml-1 p-1 text-gray-400 hover:text-blue-600 invisible group-hover:visible"
            title="Edit"
            onClick={() => { setEditCategoryName(cat); setEditModalOpen(true); }}
          >
            <Pencil size={16} />
          </button>
          <button
            className="ml-1 p-1 text-gray-400 hover:text-red-600 invisible group-hover:visible"
            title="Delete"
            onClick={() => { setDeleteModalOpen(true); }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      {/* Edit Category Modal */}
      <Modal open={editModalOpen} onOpenChange={setEditModalOpen}>
        <ModalContent className="max-w-xs">
          <ModalHeader>
            <ModalTitle>Edit Category</ModalTitle>
          </ModalHeader>
          <form onSubmit={handleEditCategory} className="space-y-4">
            <Input
              autoFocus
              placeholder="Category name"
              value={editCategoryName}
              onChange={e => setEditCategoryName(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-bookmark-primary hover:bg-bookmark-primary/90">
                Save
              </Button>
            </div>
          </form>
        </ModalContent>
      </Modal>
      {/* Delete Category Modal */}
      <Modal open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <ModalContent className="max-w-xs">
          <ModalHeader>
            <ModalTitle>Delete Category</ModalTitle>
          </ModalHeader>
          <div className="mb-4">Are you sure you want to delete the category <b>{selectedCategory}</b>? All bookmarks in this category will be moved to <b>Other</b>.</div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button type="button" className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteCategory}>
              Delete
            </Button>
          </div>
        </ModalContent>
      </Modal>
      <div className="pt-4">
        <div className="text-sm font-medium mb-2 flex items-center">
          <Hash className="h-4 w-4 mr-2" />
          Popular Tags
        </div>
        <div className="flex flex-wrap gap-2">
          {getTopTags(bookmarks).map((tag) => (
            <TagBadge key={tag.name} tag={tag} />
          ))}
        </div>
      </div>
    </div>
  );
};

const TagBadge = ({ tag }) => {
  const { setSearchQuery } = useBookmarkContext();
  const handleClick = () => setSearchQuery(tag.name);
  const isActive = setSearchQuery.toLowerCase() === tag.name.toLowerCase();
  return (
    <Button 
      variant="outline" 
      size="sm"
      className={`h-7 px-2 ${isActive ? 'bg-bookmark-light text-bookmark-primary border-bookmark-primary' : 'hover:bg-bookmark-light hover:text-bookmark-primary'}`}
      onClick={handleClick}
    >
      {tag.name}
      <span className="ml-1 text-xs opacity-70">({tag.count})</span>
    </Button>
  );
};
TagBadge.propTypes = { tag: PropTypes.shape({ name: PropTypes.string.isRequired, count: PropTypes.number.isRequired }).isRequired };

// Helper function to get the top tags
const getTopTags = (bookmarks) => {
  const tags = {};
  bookmarks.forEach(bookmark => {
    bookmark.tags?.forEach(tag => {
      if (tags[tag]) tags[tag]++;
      else tags[tag] = 1;
    });
  });
  return Object.entries(tags)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
};

export default CategoryFilter;
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBookmarkContext } from '@/context/BookmarkContext';
import PropTypes from 'prop-types';
import { Bookmark, Tag, Hash } from 'lucide-react';

const iconMap = {
  other: <Tag className="h-4 w-4" />,
};

const CategoryFilter = () => {
  const { state, setCategory } = useBookmarkContext();

  // Get unique categories from bookmarks
  const categories = Array.from(
    new Set(state.bookmarks.map(b => b.category).filter(Boolean))
  );

  // Count bookmarks per category
  const getCount = (cat) => state.bookmarks.filter(b => b.category === cat).length;

  return (
    <div className="flex flex-col space-y-1 w-full">
      {/* All Bookmarks */}
      <Button
        key="all"
        variant={state.selectedCategory === 'all' ? 'default' : 'ghost'}
        className={`justify-start ${state.selectedCategory === 'all' ? 'bg-bookmark-primary hover:bg-bookmark-primary/90' : ''}`}
        onClick={() => setCategory('all')}
      >
        <div className="flex items-center">
          <Bookmark className="h-4 w-4" />
          <span className="ml-2">All Bookmarks</span>
        </div>
      </Button>
      {/* Dynamic categories */}
      {categories.map((cat) => (
        <Button
          key={cat}
          variant={state.selectedCategory === cat ? 'default' : 'ghost'}
          className={`justify-start ${state.selectedCategory === cat ? 'bg-bookmark-primary hover:bg-bookmark-primary/90' : ''}`}
          onClick={() => setCategory(cat)}
        >
          <div className="flex items-center">
            {iconMap[cat] || <Tag className="h-4 w-4" />}
            <span className="ml-2">{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
            <Badge variant="secondary" className="ml-auto">{getCount(cat)}</Badge>
          </div>
        </Button>
      ))}
      <div className="pt-4">
        <div className="text-sm font-medium mb-2 flex items-center">
          <Hash className="h-4 w-4 mr-2" />
          Popular Tags
        </div>
        <div className="flex flex-wrap gap-2">
          {getTopTags(state.bookmarks).map((tag) => (
            <TagBadge key={tag.name} tag={tag} />
          ))}
        </div>
      </div>
    </div>
  );
};

const TagBadge = ({ tag }) => {
  const { state, setSearchQuery } = useBookmarkContext();
  const handleClick = () => setSearchQuery(tag.name);
  const isActive = state.searchQuery.toLowerCase() === tag.name.toLowerCase();
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
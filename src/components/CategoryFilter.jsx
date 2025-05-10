import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBookmarkContext } from '@/context/BookmarkContext';
import PropTypes from 'prop-types';
import { 
  Bookmark, 
  Briefcase, 
  User, 
  FlaskConical,
  Film, 
  Code, 
  Paintbrush, 
  Tag,
  Hash 
} from 'lucide-react';

const categories = [
  { id: 'all', label: 'All Bookmarks', icon: <Bookmark className="h-4 w-4" /> },
  { id: 'work', label: 'Work', icon: <Briefcase className="h-4 w-4" /> },
  { id: 'personal', label: 'Personal', icon: <User className="h-4 w-4" /> },
  { id: 'research', label: 'Research', icon: <FlaskConical className="h-4 w-4" /> },
  { id: 'entertainment', label: 'Entertainment', icon: <Film className="h-4 w-4" /> },
  { id: 'development', label: 'Development', icon: <Code className="h-4 w-4" /> },
  { id: 'design', label: 'Design', icon: <Paintbrush className="h-4 w-4" /> },
  { id: 'other', label: 'Other', icon: <Tag className="h-4 w-4" /> },
];

const CategoryFilter = () => {
  const { state, setCategory } = useBookmarkContext();
  
  return (
    <div className="flex flex-col space-y-1 w-full">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={state.selectedCategory === category.id ? "default" : "ghost"}
          className={`justify-start ${
            state.selectedCategory === category.id
              ? 'bg-bookmark-primary hover:bg-bookmark-primary/90'
              : ''
          }`}
          onClick={() => setCategory(category.id)}
        >
          <div className="flex items-center">
            {category.icon}
            <span className="ml-2">{category.label}</span>
            {category.id !== 'all' && (
              <Badge variant="secondary" className="ml-auto">
                {state.bookmarks.filter(b => b.category === category.id).length}
              </Badge>
            )}
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
  
  const handleClick = () => {
    setSearchQuery(tag.name);
  };
  
  const isActive = state.searchQuery.toLowerCase() === tag.name.toLowerCase();
  
  return (
    <Button 
      variant="outline" 
      size="sm"
      className={`h-7 px-2 ${
        isActive 
          ? 'bg-bookmark-light text-bookmark-primary border-bookmark-primary' 
          : 'hover:bg-bookmark-light hover:text-bookmark-primary'
      }`}
      onClick={handleClick}
    >
      {tag.name}
      <span className="ml-1 text-xs opacity-70">({tag.count})</span>
    </Button>
  );
};

TagBadge.propTypes = {
  tag: PropTypes.shape({
    name: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired
  }).isRequired
};

// Helper function to get the top tags
const getTopTags = (bookmarks) => {
  const tags = {};
  
  bookmarks.forEach(bookmark => {
    bookmark.tags?.forEach(tag => {
      if (tags[tag]) {
        tags[tag]++;
      } else {
        tags[tag] = 1;
      }
    });
  });
  
  return Object.entries(tags)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
};

export default CategoryFilter;
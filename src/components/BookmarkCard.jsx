import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, ExternalLink, Clock } from 'lucide-react';
import { useBookmarkContext } from '@/context/BookmarkContext';
import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';

const BookmarkCard = ({ bookmark }) => {
  const { removeBookmark } = useBookmarkContext();
  const [isHovering, setIsHovering] = useState(false);
  
  const formattedDate = bookmark.createdAt ? 
    formatDistanceToNow(new Date(bookmark.createdAt), { addSuffix: true }) : 
    'Unknown date';
  
  const handleRemoveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeBookmark(bookmark.id);
  };
  
  const handleCardClick = () => {
    if (bookmark.url) {
      window.open(bookmark.url, '_blank');
    }
  };
  
  return (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer border-opacity-50 hover:border-bookmark-primary"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative">
        {bookmark.thumbnail ? (
          <div 
            className="h-40 w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${bookmark.thumbnail})` }}
          />
        ) : (
          <div className="h-40 w-full bg-gradient-to-r from-bookmark-primary to-bookmark-secondary flex items-center justify-center">
            <span className="text-white font-bold text-xl">
              {bookmark.title ? bookmark.title.substring(0, 1).toUpperCase() : '?'}
            </span>
          </div>
        )}
        
        {isHovering && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-md">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white hover:text-red-400 p-1 h-auto"
              onClick={handleRemoveClick}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      <CardContent className="pt-4">
        <div className="flex items-center gap-2 mb-2">
          {bookmark.favicon && (
            <img 
              src={bookmark.favicon} 
              alt="Site icon" 
              className="w-4 h-4 rounded-sm"
              onError={(e) => {
                e.target.style.display = 'none';
              }} 
            />
          )}
          <h3 className="font-medium line-clamp-2">{bookmark.title || 'Untitled Bookmark'}</h3>
        </div>
        
        {bookmark.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-2">{bookmark.description}</p>
        )}
        
        <div className="flex flex-wrap gap-1 mt-2">
          <Badge variant="outline" className="bg-bookmark-light text-bookmark-primary">
            {bookmark.category || 'uncategorized'}
          </Badge>
          
          {bookmark.tags?.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="bg-gray-100">
              {tag}
            </Badge>
          ))}
          
          {bookmark.tags?.length > 2 && (
            <Badge variant="outline" className="bg-gray-100">
              +{bookmark.tags.length - 2}
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{formattedDate}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <span className="italic">{bookmark.source || 'unknown'}</span>
          <ExternalLink className="h-3 w-3" />
        </div>
      </CardFooter>
    </Card>
  );
};

// PropTypes for runtime type checking
BookmarkCard.propTypes = {
  bookmark: PropTypes.shape({
    id: PropTypes.string.isRequired,
    url: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    thumbnail: PropTypes.string,
    favicon: PropTypes.string,
    category: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    source: PropTypes.string,
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
  }).isRequired
};

export default BookmarkCard;
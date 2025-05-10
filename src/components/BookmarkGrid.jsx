import React from 'react';
import { useBookmarkContext } from '@/context/BookmarkContext';
import BookmarkCard from '@/components/BookmarkCard';
import { BookmarkIcon } from 'lucide-react'; // Renamed import to BookmarkIcon to avoid conflict
import PropTypes from 'prop-types';

const BookmarkGrid = () => {
  const { state } = useBookmarkContext();
  
  if (state.isLoading) {
    return <LoadingState />;
  }
  
  if (state.filteredBookmarks.length === 0) {
    return <EmptyState searchQuery={state.searchQuery} category={state.selectedCategory} />;
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {state.filteredBookmarks.map((bookmark) => (
        <BookmarkCard key={bookmark.id} bookmark={bookmark} />
      ))}
    </div>
  );
};

const LoadingState = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <div
          key={index}
          className="rounded-md border border-gray-200 overflow-hidden animate-pulse"
        >
          <div className="h-40 bg-gray-200" />
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
            <div className="h-3 bg-gray-200 rounded mb-2 w-full" />
            <div className="h-3 bg-gray-200 rounded mb-4 w-2/3" />
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded w-16" />
              <div className="h-6 bg-gray-200 rounded w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const EmptyState = ({ searchQuery, category }) => {
  const message = searchQuery
    ? `No bookmarks found for "${searchQuery}"`
    : `No bookmarks in the ${category} category`;
  
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-gray-100 rounded-full p-4 mb-4">
        <BookmarkIcon size={48} className="text-gray-400" /> {/* Changed to BookmarkIcon */}
      </div>
      <h3 className="text-lg font-medium mb-2">{message}</h3>
      <p className="text-gray-500">
        {searchQuery
          ? "Try a different search term or category"
          : "Add some bookmarks to see them here"}
      </p>
    </div>
  );
};

// Add PropTypes for runtime type checking
EmptyState.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired
};

export default BookmarkGrid;
import React from 'react';
import { useBookmarkContext } from '../context/BookmarkContext';
import BookmarkCard from './BookmarkCard';
import { Loader2 } from 'lucide-react';
import PropTypes from 'prop-types';

const BookmarkGrid = () => {
  const { bookmarks, filteredBookmarks, isLoading, selectedCategory, searchQuery } = useBookmarkContext();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!bookmarks || bookmarks.length === 0) {
    return <EmptyState searchQuery={''} category={selectedCategory || 'all'} />;
  }

  if (filteredBookmarks.length === 0) {
    return <EmptyState searchQuery={searchQuery} category={selectedCategory || 'all'} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredBookmarks.map((bookmark) => (
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
      <h3 className="text-lg font-medium mb-2">{message}</h3>
      <p className="text-gray-500 mb-4">
        {searchQuery
          ? "Try a different search term or category"
          : "Add some bookmarks to see them here."}
      </p>
      {/* First-time user import prompt */}
      {!searchQuery && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md text-center">
          <p className="mb-2 text-blue-700 font-medium">
            First time here? Import all your existing Chrome bookmarks!
          </p>
          <p className="mb-2 text-blue-600 text-sm">
            1. Click the Bookmark Hub extension icon in Chrome.<br />
            2. Click <b>"Import All Bookmarks"</b> in the settings.<br />
            3. Your bookmarks will be synced and categorized automatically.
          </p>
        </div>
      )}
    </div>
  );
};

// Add PropTypes for runtime type checking
EmptyState.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired
};

export default BookmarkGrid;
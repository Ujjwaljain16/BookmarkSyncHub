import React from 'react';
import { useBookmarkContext } from '../context/BookmarkContext';
import { Search } from 'lucide-react';

const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useBookmarkContext();

  return (
    <form
      className="flex items-center gap-2 w-full"
      onSubmit={e => e.preventDefault()}
      role="search"
    >
      <input
        type="search"
        className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring"
        placeholder="Search bookmarks..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark flex items-center justify-center"
        aria-label="Search"
      >
        <Search className="h-5 w-5" />
      </button>
    </form>
  );
};

export default SearchBar;
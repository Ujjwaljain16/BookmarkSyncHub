import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useBookmarkContext } from '@/context/BookmarkContext';

const SearchBar = () => {
  const { state, setSearchQuery } = useBookmarkContext();
  const [inputValue, setInputValue] = useState(state.searchQuery);
  
  useEffect(() => {
    setInputValue(state.searchQuery);
  }, [state.searchQuery]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(inputValue);
  };
  
  const clearSearch = () => {
    setInputValue('');
    setSearchQuery('');
  };
  
  return (
    <form onSubmit={handleSearch} className="relative flex w-full items-center">
      <Input
        type="search"
        placeholder="Search bookmarks..."
        className="pr-10 focus-visible:ring-bookmark-primary"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      {inputValue ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-10 h-full px-2 py-0"
          onClick={clearSearch}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear</span>
        </Button>
      ) : null}
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="absolute right-0 h-full px-3 py-0"
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  );
};

export default SearchBar;
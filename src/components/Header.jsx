import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import AddBookmarkForm from '../components/AddBookmarkForm';
import { Bookmark, Settings } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useBookmarkContext } from '../context/BookmarkContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { bookmarks, filteredBookmarks, isLoading, selectedCategory, searchQuery } = useBookmarkContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (user && location.pathname !== '/hub') {
      navigate('/hub');
    } else {
      navigate('/');
    }
  };
  
  return (
    <header className="py-4 border-b">
      <div className="container mx-auto flex flex-col gap-4 px-4 md:px-0">
        <div className="flex items-center justify-between">
          <a href="#" onClick={handleLogoClick} className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-bookmark-primary to-bookmark-secondary p-1.5 rounded">
              <Bookmark className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Bookmark Hub</h1>
          </a>
          
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon">
              <a href="/settings">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </a>
            </Button>
            <AddBookmarkForm />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:max-w-md">
            <SearchBar />
          </div>
          
          <div className="text-sm text-muted-foreground">
            {isLoading ? (
              <span className="animate-pulse-gentle">Loading bookmarks...</span>
            ) : (
              <span>
                {filteredBookmarks.length} bookmark{filteredBookmarks.length !== 1 ? 's' : ''}
                {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                {searchQuery && ` matching "${searchQuery}"`}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

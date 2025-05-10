import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'sonner';

const API_URL = 'http://localhost:3000/api/bookmarks';

// Initial state
const initialState = {
  bookmarks: [],
  filteredBookmarks: [],
  selectedCategory: 'all',
  searchQuery: '',
  isLoading: true,
};

const filterBookmarks = (bookmarks, category, searchQuery) => {
  return bookmarks
    .filter((bookmark) => {
      if (category !== 'all' && bookmark.category !== category) {
        return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          bookmark.title.toLowerCase().includes(query) ||
          bookmark.description?.toLowerCase().includes(query) ||
          bookmark.url.toLowerCase().includes(query) ||
          bookmark.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

const bookmarkReducer = (state, action) => {
  switch (action.type) {
    case 'SET_BOOKMARKS':
      return {
        ...state,
        bookmarks: action.payload,
        filteredBookmarks: filterBookmarks(action.payload, state.selectedCategory, state.searchQuery),
      };
    case 'ADD_BOOKMARK': {
      const updatedBookmarks = [...state.bookmarks, action.payload];
      return {
        ...state,
        bookmarks: updatedBookmarks,
        filteredBookmarks: filterBookmarks(updatedBookmarks, state.selectedCategory, state.searchQuery),
      };
    }
    case 'REMOVE_BOOKMARK': {
      const filtered = state.bookmarks.filter((b) => b.id !== action.payload);
      return {
        ...state,
        bookmarks: filtered,
        filteredBookmarks: filterBookmarks(filtered, state.selectedCategory, state.searchQuery),
      };
    }
    case 'SET_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload,
        filteredBookmarks: filterBookmarks(state.bookmarks, action.payload, state.searchQuery),
      };
    case 'SET_SEARCH':
      return {
        ...state,
        searchQuery: action.payload,
        filteredBookmarks: filterBookmarks(state.bookmarks, state.selectedCategory, action.payload),
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

const BookmarkContext = createContext(null);

export const useBookmarkContext = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarkContext must be used within a BookmarkProvider');
  }
  return context;
};

export const BookmarkProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookmarkReducer, initialState);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        const res = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // No credentials needed unless you're using authentication
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        
        const bookmarks = await res.json();
        dispatch({ type: 'SET_BOOKMARKS', payload: bookmarks });
      } catch (error) {
        console.error('Failed to load bookmarks:', error);
        toast.error(`Failed to load bookmarks: ${error.message}`);
        
        // If API is unavailable, load mock data
        if (error.message.includes('Failed to fetch')) {
          console.log('Loading mock bookmarks instead');
          dispatch({ type: 'SET_BOOKMARKS', payload: mockBookmarks });
        }
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    
    loadBookmarks();
  }, []);

  const addBookmark = async (data) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      
      const result = await res.json();
      dispatch({ type: 'ADD_BOOKMARK', payload: result.bookmark });
      toast.success('Bookmark added successfully');
    } catch (error) {
      console.error('Failed to add bookmark:', error);
      toast.error(`Failed to add bookmark: ${error.message}`);
    }
  };

  const removeBookmark = async (id) => {
    try {
      // Optimistic update
      dispatch({ type: 'REMOVE_BOOKMARK', payload: id });
      
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      
      toast.success('Bookmark removed');
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
      toast.error(`Failed to remove bookmark: ${error.message}`);
      
      // Revert optimistic update on error
      try {
        const res = await fetch(API_URL);
        if (res.ok) {
          const bookmarks = await res.json();
          dispatch({ type: 'SET_BOOKMARKS', payload: bookmarks });
        }
      } catch (fetchError) {
        console.error('Failed to revert bookmark removal:', fetchError);
      }
    }
  };

  const setCategory = (category) => {
    dispatch({ type: 'SET_CATEGORY', payload: category });
  };

  const setSearchQuery = (query) => {
    dispatch({ type: 'SET_SEARCH', payload: query });
  };

  return (
    <BookmarkContext.Provider
      value={{ state, dispatch, addBookmark, removeBookmark, setCategory, setSearchQuery }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

// Mock bookmarks for initial load
const mockBookmarks = [
  {
    id: '1',
    url: 'https://react.dev',
    title: 'React Documentation',
    description: 'The official React documentation for learning React',
    favicon: 'https://react.dev/favicon.ico',
    thumbnail: 'https://react.dev/images/og-home.png',
    category: 'development',
    tags: ['react', 'javascript', 'frontend'],
    createdAt: '2025-05-05T10:30:00Z',
    lastVisited: '2025-05-06T15:45:00Z',
    source: 'extension',
  },
  // rest of the mock bookmarks remain the same
  {
    id: '2',
    url: 'https://tailwindcss.com',
    title: 'Tailwind CSS - A utility-first CSS framework',
    description: 'Rapidly build modern websites without ever leaving your HTML',
    favicon: 'https://tailwindcss.com/favicon.ico',
    thumbnail: 'https://tailwindcss.com/img/social-card.jpg',
    category: 'design',
    tags: ['css', 'design', 'frontend'],
    createdAt: '2025-05-04T08:20:00Z',
    lastVisited: '2025-05-06T11:15:00Z',
    source: 'extension',
  },
  {
    id: '3',
    url: 'https://github.com',
    title: 'GitHub: Where the world builds software',
    description: 'GitHub is where over 100 million developers shape the future of software',
    favicon: 'https://github.com/favicon.ico',
    thumbnail: 'https://github.githubassets.com/images/modules/site/social-cards/campaign-social.png',
    category: 'development',
    tags: ['code', 'git', 'collaboration'],
    createdAt: '2025-05-03T14:15:00Z',
    lastVisited: '2025-05-07T09:30:00Z',
    source: 'extension',
  },
  {
    id: '4',
    url: 'https://medium.com/article-about-ai',
    title: 'The Future of AI in 2025',
    description: 'An in-depth analysis of where artificial intelligence is heading',
    favicon: 'https://medium.com/favicon.ico',
    thumbnail: 'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg',
    category: 'research',
    tags: ['ai', 'technology', 'future'],
    createdAt: '2025-05-02T19:45:00Z',
    lastVisited: '2025-05-05T20:10:00Z',
    source: 'manual',
  },
  {
    id: '5',
    url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Must-Watch Development Tutorial',
    description: 'Essential techniques every developer should know',
    favicon: 'https://youtube.com/favicon.ico',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    category: 'entertainment',
    tags: ['tutorial', 'video'],
    createdAt: '2025-05-01T11:30:00Z',
    lastVisited: '2025-05-04T18:20:00Z',
    source: 'extension',
  },
];
import { fetchBookmarks } from './bookmarkService';

// Get all unique categories from existing bookmarks
export const getCategories = async () => {
  const bookmarks = await fetchBookmarks();
  const categories = new Set(bookmarks.map(b => b.category).filter(Boolean));
  return Array.from(categories);
};

// Add a new category
export const addCategory = async (categoryName) => {
  const categories = await getCategories();
  if (!categories.includes(categoryName)) {
    categories.push(categoryName);
    // Store categories in localStorage
    localStorage.setItem('categories', JSON.stringify(categories));
  }
  return categories;
};

// Get category suggestions based on bookmark content
export const suggestCategory = async (bookmark) => {
  try {
    const response = await fetch('http://localhost:3000/api/bookmarks/ai-categorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookmark)
    });
    
    if (!response.ok) {
      throw new Error('Failed to get category suggestions');
    }
    
    const suggestions = await response.json();
    return suggestions;
  } catch (error) {
    console.error('Error getting category suggestions:', error);
    return null;
  }
}; 
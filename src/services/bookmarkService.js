// src/services/bookmarkService.js

// Mock delay to simulate network request
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchBookmarks = async () => {
  await delay(1000);
  const bookmarks = localStorage.getItem('bookmarks');
  return bookmarks ? JSON.parse(bookmarks) : [];
};

export const addBookmark = async (bookmark) => {
  await delay(500);

  const newBookmark = {
    ...bookmark,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  const existingBookmarks = await fetchBookmarks();
  const updatedBookmarks = [...existingBookmarks, newBookmark];
  localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));

  return newBookmark;
};

export const removeBookmark = async (id) => {
  await delay(500);

  const bookmarks = await fetchBookmarks();
  const updatedBookmarks = bookmarks.filter((bookmark) => bookmark.id !== id);
  localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
};

const enrichBookmarkMetadata = async (bookmark) => {
  await delay(500);

  return {
    ...bookmark,
    description: bookmark.description || `Description for ${bookmark.title}`,
    favicon: bookmark.favicon || `https://www.google.com/s2/favicons?domain=${bookmark.url}`,
    thumbnail: `https://image.thum.io/get/width/500/crop/600/noanimate/${bookmark.url}`,
    category: bookmark.category || 'other',
    tags: bookmark.tags || [],
  };
};

export const processBookmarkFromExtension = async (bookmarkData) => {
  const enhancedData = await enrichBookmarkMetadata(bookmarkData);
  return addBookmark({
    ...enhancedData,
    source: 'extension',
  });
};

export const mockReceiveFromExtension = async (data) => {
  console.log('Received bookmark from extension:', data);
  return processBookmarkFromExtension(data);
};

import React, { useState, useEffect } from 'react';
import { fetchBookmarks, addBookmark, removeBookmark } from './bookmarkService.js';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

// API endpoint for receiving bookmarks from extension
export const receiveFromExtension = async (bookmarkData) => {
  try {
    // Validate required fields
    if (!bookmarkData.url || !bookmarkData.title) {
      throw new Error('URL and title are required');
    }

    // Enrich bookmark data with additional metadata
    const enrichedData = {
      ...bookmarkData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      lastVisited: new Date().toISOString(),
      category: bookmarkData.category || 'other',
      tags: bookmarkData.tags || [],
      source: 'extension'
    };

    // Add the bookmark to storage
    const newBookmark = await addBookmark(enrichedData);
    
    // Show success notification
    toast.success('Bookmark saved successfully');
    
    return newBookmark;
  } catch (error) {
    console.error('Error processing bookmark from extension:', error);
    toast.error('Failed to save bookmark');
    throw error;
  }
};

// For development/testing purposes
export const mockReceiveFromExtension = async (data) => {
  console.log('Received bookmark from extension:', data);
  return receiveFromExtension(data);
};

const BookmarkManager = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bookmarks on component mount
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const fetchedBookmarks = await fetchBookmarks();
        setBookmarks(fetchedBookmarks);
      } catch (err) {
        setError('Failed to load bookmarks');
        console.error(err);
        toast.error('Failed to load bookmarks');
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, []);

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((bookmark) => (
            <Card key={bookmark.id}>
              <CardHeader>
                <CardTitle className="line-clamp-1">{bookmark.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 line-clamp-2">{bookmark.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(bookmark.url, '_blank')}
                  >
                    Visit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBookmark(bookmark.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkManager;

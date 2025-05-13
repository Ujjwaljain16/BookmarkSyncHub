const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'chrome-extension://*'
    ];
    
    // Check if the origin is allowed
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.endsWith('*')) {
        return origin.startsWith(allowedOrigin.slice(0, -1));
      }
      return origin === allowedOrigin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  credentials: true
}));

// Apply JSON middleware globally
app.use(bodyParser.json({ type: '*/*' }));

// In-memory storage for bookmarks
let bookmarks = [];

// Helper function to normalize URL for comparison
const normalizeUrlForComparison = (url) => {
  try {
    const urlObj = new URL(url);
    // Only normalize scheme and host to lowercase, preserve path case
    const normalizedUrl = new URL(url);
    normalizedUrl.protocol = normalizedUrl.protocol.toLowerCase();
    normalizedUrl.host = normalizedUrl.host.toLowerCase();
    // Remove fragment
    normalizedUrl.hash = '';
    // Remove trailing slash
    const path = normalizedUrl.pathname.replace(/\/$/, '');
    normalizedUrl.pathname = path;
    return normalizedUrl.toString();
  } catch (e) {
    console.error('Error normalizing URL for comparison:', url, e);
    return url;
  }
};

// Helper function to check for duplicate bookmarks
const findDuplicateBookmark = (url) => {
  const normalizedUrl = normalizeUrlForComparison(url);
  return bookmarks.find(bookmark => normalizeUrlForComparison(bookmark.url) === normalizedUrl);
};

// Helper function to find bookmark by Chrome ID
const findBookmarkByChromeId = (chromeId) => {
  return bookmarks.find(bookmark => bookmark.chromeBookmarkId === chromeId);
};

// GET all bookmarks
app.get('/api/bookmarks', (req, res) => {
  console.log('GET /api/bookmarks - Current bookmarks:', bookmarks);
  res.json(bookmarks);
});

// POST new bookmark
app.post('/api/bookmarks', (req, res) => {
  try {
    console.log('POST /api/bookmarks - Received bookmark:', req.body);
    
    if (!req.body.url) {
      return res.status(400).json({ 
        error: 'Invalid bookmark',
        message: 'URL is required'
      });
    }

    // Normalize the URL before storing
    const normalizedUrl = normalizeUrlForComparison(req.body.url);
    console.log('Normalized URL for storage:', normalizedUrl);
    
    // Check for existing bookmark
    const existingBookmark = findDuplicateBookmark(normalizedUrl);
    if (existingBookmark) {
      console.log('Found existing bookmark:', existingBookmark);
      
      // Update existing bookmark with new data
      const updatedBookmark = {
        ...existingBookmark,
        ...req.body,
        url: normalizedUrl,
        updatedAt: new Date().toISOString(),
        lastVisited: new Date().toISOString()
      };
      
      // Update the bookmark in the array
      const index = bookmarks.findIndex(b => b.id === existingBookmark.id);
      bookmarks[index] = updatedBookmark;
      
      console.log('Updated existing bookmark:', updatedBookmark);
      return res.status(200).json({ 
        bookmark: updatedBookmark,
        message: 'Bookmark updated successfully',
        wasDuplicate: true
      });
    }
    
    // Create new bookmark
    const newBookmark = {
      id: uuidv4(),
      ...req.body,
      url: normalizedUrl,
      createdAt: new Date().toISOString(),
      lastVisited: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('Adding new bookmark:', newBookmark);
    bookmarks.push(newBookmark);
    
    res.status(201).json({ 
      bookmark: newBookmark,
      message: 'Bookmark created successfully',
      wasDuplicate: false
    });
  } catch (error) {
    console.error('Error processing bookmark:', error);
    res.status(500).json({ 
      error: 'Failed to process bookmark',
      message: error.message
    });
  }
});

// DELETE bookmark by URL (using query parameter)
app.delete('/api/bookmarks', (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: 'URL query parameter is required'
      });
    }

    const decodedUrl = decodeURIComponent(url);
    console.log('Delete request received for URL:', decodedUrl);
    
    // Normalize the target URL
    const targetUrl = normalizeUrlForComparison(decodedUrl);
    console.log('Normalized target URL:', targetUrl);
    
    // Find the bookmark to delete
    const bookmarkIndex = bookmarks.findIndex(bookmark => {
      const bookmarkUrl = normalizeUrlForComparison(bookmark.url);
      return bookmarkUrl === targetUrl;
    });
    
    if (bookmarkIndex === -1) {
      console.log('Bookmark not found:', {
        targetUrl,
        decodedUrl,
        originalUrl: url
      });
      return res.status(404).json({ 
        error: 'Bookmark not found',
        message: 'No bookmark found with the specified URL'
      });
    }
    
    // Remove the bookmark
    const deletedBookmark = bookmarks.splice(bookmarkIndex, 1)[0];
    
    console.log('Successfully deleted bookmark:', {
      deletedBookmark,
      remainingBookmarks: bookmarks.length
    });
    
    res.status(200).json({ 
      message: 'Bookmark deleted successfully',
      bookmark: deletedBookmark,
      remainingCount: bookmarks.length
    });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    res.status(500).json({ 
      error: 'Failed to delete bookmark',
      message: error.message
    });
  }
});

// Bulk import bookmarks
app.post('/api/bookmarks/import', (req, res) => {
  try {
    // Validate request body
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: 'Request body must be an array of bookmarks' });
    }

    let updatedCount = 0;
    let newCount = 0;
    let skippedCount = 0;

    // Process each bookmark
    const processedBookmarks = req.body.map(bookmark => {
      if (!bookmark.url) {
        skippedCount++;
        return null;
      }

      const normalizedUrl = normalizeUrlForComparison(bookmark.url);
      const existingBookmark = findDuplicateBookmark(normalizedUrl);

      if (existingBookmark) {
        // Update existing bookmark
        const updatedBookmark = {
          ...existingBookmark,
          ...bookmark,
          url: normalizedUrl,
          updatedAt: new Date().toISOString(),
          lastVisited: new Date().toISOString()
        };
        
        const index = bookmarks.findIndex(b => b.id === existingBookmark.id);
        bookmarks[index] = updatedBookmark;
        updatedCount++;
        return updatedBookmark;
      }

      // Create new bookmark
      const newBookmark = {
        id: uuidv4(),
        ...bookmark,
        url: normalizedUrl,
        createdAt: new Date().toISOString(),
        lastVisited: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      bookmarks.push(newBookmark);
      newCount++;
      return newBookmark;
    }).filter(Boolean); // Remove null entries

    res.status(201).json({ 
      message: 'Bookmarks imported successfully',
      imported: processedBookmarks.length,
      updated: updatedCount,
      new: newCount,
      skipped: skippedCount
    });
  } catch (error) {
    console.error('Error importing bookmarks:', error);
    res.status(500).json({ 
      error: 'Failed to import bookmarks',
      message: error.message 
    });
  }
});

// AI enrichment endpoint (mocked for now)
app.post('/api/bookmarks/ai-enrich', (req, res) => {
  const { url, title } = req.body;
  
  // Mock AI enrichment
  const enriched = {
    tags: ['ai', 'technology', 'future'],
    category: 'research',
    summary: `AI-generated summary for ${title}`
  };
  
  res.json(enriched);
});

// Check for duplicate bookmark
app.post('/api/bookmarks/check-duplicate', (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: 'URL is required'
      });
    }

    const normalizedUrl = normalizeUrlForComparison(url);
    const existingBookmark = findDuplicateBookmark(normalizedUrl);

    res.json({
      isDuplicate: !!existingBookmark,
      existingBookmark: existingBookmark || null
    });
  } catch (error) {
    console.error('Error checking for duplicate:', error);
    res.status(500).json({ 
      error: 'Failed to check for duplicate',
      message: error.message
    });
  }
});

// Find bookmark by Chrome ID
app.get('/api/bookmarks/find-by-chrome-id/:chromeId', (req, res) => {
  try {
    const { chromeId } = req.params;
    const bookmark = findBookmarkByChromeId(chromeId);
    
    if (!bookmark) {
      return res.status(404).json({
        error: 'Bookmark not found',
        message: 'No bookmark found with the specified Chrome ID'
      });
    }
    
    res.json({ bookmark });
  } catch (error) {
    console.error('Error finding bookmark by Chrome ID:', error);
    res.status(500).json({
      error: 'Failed to find bookmark',
      message: error.message
    });
  }
});

// Update bookmark by ID
app.put('/api/bookmarks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const bookmarkIndex = bookmarks.findIndex(b => b.id === id);
    
    if (bookmarkIndex === -1) {
      return res.status(404).json({
        error: 'Bookmark not found',
        message: 'No bookmark found with the specified ID'
      });
    }
    
    const updatedBookmark = {
      ...bookmarks[bookmarkIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    bookmarks[bookmarkIndex] = updatedBookmark;
    
    res.json({
      bookmark: updatedBookmark,
      message: 'Bookmark updated successfully'
    });
  } catch (error) {
    console.error('Error updating bookmark:', error);
    res.status(500).json({
      error: 'Failed to update bookmark',
      message: error.message
    });
  }
});

// Delete bookmark by ID
app.delete('/api/bookmarks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const bookmarkIndex = bookmarks.findIndex(b => b.id === id);
    
    if (bookmarkIndex === -1) {
      return res.status(404).json({
        error: 'Bookmark not found',
        message: 'No bookmark found with the specified ID'
      });
    }
    
    const deletedBookmark = bookmarks.splice(bookmarkIndex, 1)[0];
    
    res.json({
      message: 'Bookmark deleted successfully',
      bookmark: deletedBookmark
    });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    res.status(500).json({
      error: 'Failed to delete bookmark',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'chrome-extension://*'],
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// In-memory storage for bookmarks
let bookmarks = [];

// GET all bookmarks
app.get('/api/bookmarks', (req, res) => {
  res.json(bookmarks);
});

// POST new bookmark
app.post('/api/bookmarks', (req, res) => {
  const bookmark = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
    lastVisited: new Date().toISOString()
  };
  bookmarks.push(bookmark);
  res.status(201).json({ bookmark });
});

// DELETE bookmark
app.delete('/api/bookmarks/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = bookmarks.length;
  bookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
  
  if (bookmarks.length === initialLength) {
    return res.status(404).json({ error: 'Bookmark not found' });
  }
  
  res.status(200).json({ message: 'Bookmark deleted successfully' });
});

// Bulk import bookmarks
app.post('/api/bookmarks/import', (req, res) => {
  const importedBookmarks = req.body.map(bookmark => ({
    id: uuidv4(),
    ...bookmark,
    createdAt: new Date().toISOString(),
    lastVisited: new Date().toISOString()
  }));
  
  bookmarks.push(...importedBookmarks);
  res.status(201).json({ bookmarks: importedBookmarks });
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 
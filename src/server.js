import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const __dirname = dirname(fileURLToPath(import.meta.url));
const bookmarks = [];

async function startServer() {
  const app = express();

  // Fixed CORS configuration
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (
        origin === 'http://localhost:5173' ||
        origin === 'http://localhost:3000' ||
        origin.startsWith('chrome-extension://')
      ) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Important if you'll be using cookies/sessions
  }));

  // Apply JSON middleware globally for all POST/PUT requests
  app.use(express.json());

  // API routes
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.post('/api/bookmarks', async (req, res) => {
    try {
      const bookmarkData = req.body;
      if (!bookmarkData.url || !bookmarkData.title) {
        return res.status(400).json({ error: 'URL and title are required' });
      }

      const newBookmark = {
        ...bookmarkData,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        lastVisited: new Date().toISOString(),
        category: bookmarkData.category || 'other',
        tags: bookmarkData.tags || [],
        source: 'extension'
      };

      bookmarks.push(newBookmark);

      res.status(200).json({ success: true, bookmark: newBookmark });
    } catch (error) {
      console.error('Error processing bookmark:', error);
      res.status(500).json({ error: 'Failed to process bookmark' });
    }
  });

  app.get('/api/bookmarks', (req, res) => {
    res.status(200).json(bookmarks);
  });

  // Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      root: process.cwd(),
      server: { middlewareMode: true },
      appType: 'custom'
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(join(__dirname, '../dist')));
    app.use('*', (req, res) => {
      res.sendFile(join(__dirname, '../dist', 'index.html'));
    });
  }

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
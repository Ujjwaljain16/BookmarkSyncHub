import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
import natural from 'natural';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, 'bookmarks.json');

const app = express();
const port = (typeof process !== 'undefined' && process.env.PORT) || 3000;

// Initialize natural language processing tools
const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'chrome-extension://*'],
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Helper function to read bookmarks from file
async function readBookmarks() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is empty, return empty array
    if (error.code === 'ENOENT') {
      await fs.writeFile(DATA_FILE, '[]', 'utf8');
      return [];
    }
    throw error;
  }
}

// Helper function to write bookmarks to file
async function writeBookmarks(bookmarks) {
  await fs.writeFile(DATA_FILE, JSON.stringify(bookmarks, null, 2), 'utf8');
}

// Helper function to normalize URL
function normalizeUrl(url) {
  try {
    const urlObj = new URL(url);
    // Remove trailing slashes, normalize protocol, and convert to lowercase
    return urlObj.toString().replace(/\/$/, '').toLowerCase();
  } catch (e) {
    console.error('Error normalizing URL:', url, e);
    return url.toLowerCase();
  }
}

// AI-powered bookmark analysis
async function analyzeBookmark(bookmark) {
  const { title = '', url = '', description = '' } = bookmark;
  const text = `${title} ${description}`.toLowerCase();

  try {
    // 1. Category Classification using Zero-shot Classification
    const categoryResponse = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
      {
        inputs: text,
        parameters: {
          candidate_labels: [
            'development', 'design', 'research', 'entertainment', 
            'work', 'education', 'news', 'technology', 'other'
          ]
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // 2. Topic Extraction using Text Generation
    const topicResponse = await axios.post(
      'https://api-inference.huggingface.co/models/gpt2',
      {
        inputs: `Extract key topics from: ${text}`,
        parameters: {
          max_length: 50,
          num_return_sequences: 1
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // 3. Sentiment Analysis
    const sentimentResponse = await axios.post(
      'https://api-inference.huggingface.co/models/finiteautomata/bertweet-base-sentiment-analysis',
      {
        inputs: text
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Process category results
    const { labels, scores } = categoryResponse.data;
    const bestCategory = labels[scores.indexOf(Math.max(...scores))];

    // Process topic results
    const topics = tokenizer.tokenize(topicResponse.data[0].generated_text)
      .filter(word => word.length > 3)
      .slice(0, 5);

    // Process sentiment
    const sentiment = sentimentResponse.data[0][0].label;

    // Generate summary using TF-IDF
    tfidf.addDocument(text);
    const summaryTerms = tfidf.listTerms(0)
      .slice(0, 3)
      .map(item => item.term);
    
    const summary = `${title}. ${description}`.substring(0, 200);

    return {
      category: bestCategory,
      tags: topics,
      sentiment,
      summary,
      confidence: {
        category: Math.max(...scores),
        sentiment: sentimentResponse.data[0][0].score
      }
    };
  } catch (error) {
    console.error('AI analysis error:', error);
    // Fallback to basic analysis if AI fails
    return {
      category: 'other',
      tags: tokenizer.tokenize(text).slice(0, 5),
      sentiment: 'neutral',
      summary: description || title,
      confidence: {
        category: 0,
        sentiment: 0
      }
    };
  }
}

// AI enrichment endpoint
app.post('/api/bookmarks/ai-enrich', async (req, res) => {
  try {
    const enriched = await analyzeBookmark(req.body);
    res.json(enriched);
  } catch (error) {
    console.error('AI enrichment error:', error);
    res.status(500).json({ error: 'Failed to enrich bookmark' });
  }
});

// GET all bookmarks
app.get('/api/bookmarks', async (req, res) => {
  try {
    const bookmarks = await readBookmarks();
    res.json(bookmarks);
  } catch (error) {
    console.error('Error reading bookmarks:', error);
    res.status(500).json({ error: 'Failed to read bookmarks' });
  }
});

// GET bookmark by URL
app.get('/api/bookmarks/url', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    const bookmarks = await readBookmarks();
    const normalizedUrl = normalizeUrl(url);
    const bookmark = bookmarks.find(b => normalizeUrl(b.url) === normalizedUrl);

    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    res.json(bookmark);
  } catch (error) {
    console.error('Error finding bookmark:', error);
    res.status(500).json({ error: 'Failed to find bookmark' });
  }
});

// POST new bookmark
app.post('/api/bookmarks', async (req, res) => {
  try {
    const bookmarks = await readBookmarks();
    
    // Check for duplicates by URL
    const normalizedUrl = normalizeUrl(req.body.url);
    const existingBookmarkIndex = bookmarks.findIndex(
      b => normalizeUrl(b.url) === normalizedUrl
    );
    
    if (existingBookmarkIndex !== -1) {
      // Update existing bookmark
      const updatedBookmark = {
        ...bookmarks[existingBookmarkIndex],
        ...req.body,
        url: req.body.url, // Keep original URL capitalization
        lastVisited: new Date().toISOString(),
        visitCount: (bookmarks[existingBookmarkIndex].visitCount || 0) + 1
      };
      
      bookmarks[existingBookmarkIndex] = updatedBookmark;
      await writeBookmarks(bookmarks);
      
      res.status(200).json({ 
        bookmark: updatedBookmark,
        wasDuplicate: true 
      });
    } else {
      // Add new bookmark
      const bookmark = {
        id: uuidv4(),
        ...req.body,
        createdAt: new Date().toISOString(),
        lastVisited: new Date().toISOString(),
        visitCount: 1
      };
      
      bookmarks.push(bookmark);
      await writeBookmarks(bookmarks);
      
      res.status(201).json({ 
        bookmark,
        wasDuplicate: false 
      });
    }
  } catch (error) {
    console.error('Error adding bookmark:', error);
    res.status(500).json({ error: 'Failed to add bookmark' });
  }
});

// DELETE all bookmarks
app.delete('/api/bookmarks/all', async (req, res) => {
  try {
    await writeBookmarks([]);
    res.status(200).json({ message: 'All bookmarks deleted successfully' });
  } catch (error) {
    console.error('Error deleting all bookmarks:', error);
    res.status(500).json({ error: 'Failed to delete all bookmarks' });
  }
});

// DELETE bookmark by ID
app.delete('/api/bookmarks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bookmarks = await readBookmarks();
    const initialLength = bookmarks.length;
    const filteredBookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
    
    if (filteredBookmarks.length === initialLength) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    
    await writeBookmarks(filteredBookmarks);
    res.status(200).json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    res.status(500).json({ error: 'Failed to delete bookmark' });
  }
});

// DELETE bookmark by URL (additional endpoint)
app.delete('/api/bookmarks/url/:encodedUrl', async (req, res) => {
  try {
    const encodedUrl = req.params.encodedUrl;
    const url = decodeURIComponent(encodedUrl);
    const normalizedUrl = normalizeUrl(url);
    
    const bookmarks = await readBookmarks();
    const initialLength = bookmarks.length;
    
    const filteredBookmarks = bookmarks.filter(
      bookmark => normalizeUrl(bookmark.url) !== normalizedUrl
    );
    
    if (filteredBookmarks.length === initialLength) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    
    await writeBookmarks(filteredBookmarks);
    res.status(200).json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    console.error('Error deleting bookmark by URL:', error);
    res.status(500).json({ error: 'Failed to delete bookmark' });
  }
});

// Bulk import bookmarks
app.post('/api/bookmarks/import', async (req, res) => {
  try {
    const existingBookmarks = await readBookmarks();
    const importedBookmarks = [];
    const updatedBookmarks = [];
    const skippedBookmarks = [];
    
    // Process each bookmark in the request
    for (const bookmarkData of req.body) {
      if (!bookmarkData.url) {
        skippedBookmarks.push({
          ...bookmarkData,
          reason: 'Missing URL'
        });
        continue;
      }
      const normalizedUrl = normalizeUrl(bookmarkData.url);
      
      // Check for duplicates
      const existingIndex = existingBookmarks.findIndex(
        b => normalizeUrl(b.url) === normalizedUrl
      );
      
      if (existingIndex !== -1) {
        // Update existing bookmark
        const existingTimestamp = new Date(existingBookmarks[existingIndex].lastModified || 
          existingBookmarks[existingIndex].lastVisited || 
          existingBookmarks[existingIndex].createdAt).getTime();

        const importTimestamp = new Date(bookmarkData.lastModified || 
          bookmarkData.lastVisited || 
          new Date().toISOString()).getTime();
        if (existingTimestamp >= importTimestamp && 
          existingBookmarks[existingIndex].tags?.length && 
          existingBookmarks[existingIndex].description) {
          skippedBookmarks.push({
            url: bookmarkData.url,
            title: bookmarkData.title,
            reason: 'Existing bookmark has newer data'
          });
          continue;
        }

        const updatedBookmark = {
          ...existingBookmarks[existingIndex],
          title: bookmarkData.title || existingBookmarks[existingIndex].title,
          description: bookmarkData.description || existingBookmarks[existingIndex].description,
          lastVisited: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          visitCount: (existingBookmarks[existingIndex].visitCount || 0) + 1,
          // Merge tags without duplicates
          tags: Array.from(new Set([
            ...(existingBookmarks[existingIndex].tags || []),
            ...(bookmarkData.tags || [])
          ])),
          // Keep existing category if it's more specific than 'other'
          category: existingBookmarks[existingIndex].category !== 'other' ? 
            existingBookmarks[existingIndex].category : (bookmarkData.category || 'other'),
          // Use whichever favicon is not null, preferring the new one
          favicon: bookmarkData.favicon || existingBookmarks[existingIndex].favicon
        };
        
        existingBookmarks[existingIndex] = updatedBookmark;
        updatedBookmarks.push(updatedBookmark);
      } else {
        // Create new bookmark
        const newBookmark = {
          id: uuidv4(),
          ...bookmarkData,
          createdAt: new Date().toISOString(),
          lastVisited: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          visitCount: 1,
          tags: bookmarkData.tags || [],
          category: bookmarkData.category || 'other'
        };
        
        existingBookmarks.push(newBookmark);
        importedBookmarks.push(newBookmark);
      }
    }
    
    // Save the updated bookmarks
    await writeBookmarks(existingBookmarks);
    
    res.status(201).json({ 
      added: importedBookmarks.length,
      updated: updatedBookmarks.length,
      skipped: skippedBookmarks.length,
      total: existingBookmarks.length,
      details: {
        added: importedBookmarks,
        updated: updatedBookmarks,
        skipped: skippedBookmarks
      }
    });
  } catch (error) {
    console.error('Error importing bookmarks:', error);
    res.status(500).json({ error: 'Failed to import bookmarks' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
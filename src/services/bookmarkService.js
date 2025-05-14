import fetch from 'node-fetch';
import { load as parseHTML } from 'cheerio';
import { suggestCategory } from './categoryService';

const delay = ms => new Promise(res => setTimeout(res, ms));
export const fetchBookmarks = async () => {
  await delay(1000);
  const data = localStorage.getItem('bookmarks');
  return data ? JSON.parse(data) : [];
};

export const addBookmark = async (bookmark) => {
  await delay(500);
  const all = await fetchBookmarks();

  const dup = all.find(b => b.url === bookmark.url);
  if (dup) {
    const updated = { ...dup, ...bookmark, updatedAt: new Date().toISOString() };
    const without = all.map(b => (b.id === dup.id ? updated : b));
    localStorage.setItem('bookmarks', JSON.stringify(without));
    return updated;
  }

  const newB = {
    ...bookmark,
    id:        crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  all.push(newB);
  localStorage.setItem('bookmarks', JSON.stringify(all));
  return newB;
};

export const removeBookmark = async (id) => {
  await delay(500);
  const all = await fetchBookmarks();
  const filtered = all.filter(b => b.id !== id);
  localStorage.setItem('bookmarks', JSON.stringify(filtered));
};


// favicon
async function fetchBestFavicon(url) {
  try {
    const resp = await fetch(url);
    const html = await resp.text();
    const $    = parseHTML(html);
    const icons = $('link[rel~="icon"], link[rel="shortcut icon"]')
      .map((_, el) => {
        const href  = $(el).attr('href');
        const sizes = $(el).attr('sizes') || 'unknown';  // e.g. "16x16"
        const area  = sizes !== 'unknown'
          ? sizes.split('x').reduce((a,b)=>a*(parseInt(b,10)||0),1)
          : 0;
        return href ? { href, sizes, area } : null;
      })
      .get()
      .filter(Boolean)
      .sort((a,b) => b.area - a.area);

    if (icons.length) {
      const best     = icons[0];
      const resolved = new URL(best.href, url).toString();
      console.log('[FAVICON] Selected:', resolved, 'Declared sizes:', best.sizes);
      return resolved;
    }
  } catch (e) {
    console.warn('[FAVICON] Scrape failed for', url, e);
  }

  const fallback = `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(url)}&sz=256`;
  console.log('[FAVICON] Falling back to Google API:', fallback);
  return fallback;
}

async function fetchOgImage(url) {
  try {
    const resp = await fetch(url);
    const html = await resp.text();
    const $    = parseHTML(html);
    const og   = $('meta[property="og:image"]').attr('content');
    if (og) {
      const resolved = new URL(og, url).toString();
      console.log('[OG IMAGE] Found OG image:', resolved);
      return resolved;
    }
  } catch (e) {
    console.warn('[OG IMAGE] Fetch failed for', url, e);
  }
  console.log('[OG IMAGE] No OG image for', url);
  return null;
}

//metadata

async function enrichBookmarkMetadata(bookmark) {
  await delay(200);  

  console.log('[METADATA] Processing URL:', bookmark.url);

//favicon
  const favicon  = await fetchBestFavicon(bookmark.url);
//og img
  let thumbnail  = await fetchOgImage(bookmark.url);

//wordpress
  if (!thumbnail) {
    thumbnail = `https://s.wordpress.com/mshots/v1/${encodeURIComponent(bookmark.url)}?w=1000`;
    console.log('[THUMBNAIL] Falling back to MShots:', thumbnail);
  }

  console.log('[METADATA] Final assets →', { favicon, thumbnail });

  return {
    ...bookmark,
    favicon,
    thumbnail,
    description: bookmark.description || '',
    category:    bookmark.category    || 'other',
    tags:        bookmark.tags        || [],
  };
}



export const processBookmarkFromExtension = async ({ title, url, description = '', category = 'other' }) => {
  try {
    // If category is 'other', get AI suggestions
    let finalCategory = category;
    let suggestedTags = [];
    
    if (category === 'other') {
      const suggestions = await suggestCategory({ title, url, description });
      if (suggestions) {
        finalCategory = suggestions.suggestedCategory;
        suggestedTags = suggestions.suggestedTags;
      }
    }

    let bookmarkData = {
      url,
      title,
      description,
      category: finalCategory,
      tags: suggestedTags,
      source: 'extension',
      createdAt: new Date().toISOString()
    };

    // Enrich bookmark metadata
    bookmarkData = await enrichBookmarkMetadata(bookmarkData);

    // Save the bookmark
    const saved = await addBookmark(bookmarkData);
    return saved;
  } catch (error) {
    console.error('Error processing bookmark:', error);
    throw error;
  }
};

const config = {
  authBaseUrl: process.env.NODE_ENV === 'production'
    ? 'https://authservice-gee2.onrender.com/api'
    : 'http://localhost:3000/api',
  bookmarkBaseUrl: process.env.NODE_ENV === 'production'
    ? 'https://bookmarkhub.onrender.com/api'  // Same domain as frontend
    : 'http://localhost:3001/api'
};

export default config; 

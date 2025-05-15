const config = {
  authBaseUrl: process.env.NODE_ENV === 'production'
    ? 'https://authservice-gee2.onrender.com/api'
    : 'http://localhost:3000/api',
  bookmarkBaseUrl: process.env.NODE_ENV === 'production'
    ? 'https://bookmarkservice-gee2.onrender.com/api'  // Update this with your actual bookmark service URL
    : 'http://localhost:3001/api'  // Assuming bookmark service runs on port 3001 locally
};

export default config; 
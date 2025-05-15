const config = {
  apiBaseUrl: process.env.NODE_ENV === 'production'
    ? 'https://authservice-gee2.onrender.com/api'
    : 'http://localhost:3000/api'
};

export default config; 
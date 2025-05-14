const config = {
  apiBaseUrl: process.env.NODE_ENV === 'production'
    ? 'https://bookmarkhub.onrender.com/api'
    : 'http://localhost:3000/api'
};

export default config; 
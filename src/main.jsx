import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BookmarkProvider } from './context/BookmarkContext'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BookmarkProvider>
        <App />
      </BookmarkProvider>
    </AuthProvider>
  </StrictMode>,
)

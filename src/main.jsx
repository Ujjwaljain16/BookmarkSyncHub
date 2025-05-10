import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BookmarkProvider } from './context/BookmarkContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BookmarkProvider>
      <App />
    </BookmarkProvider>
  </StrictMode>,
)

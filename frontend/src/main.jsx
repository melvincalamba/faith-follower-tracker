import React    from 'react'
import ReactDOM from 'react-dom/client'
import App      from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { Toaster }      from 'react-hot-toast'   // ← BAGO
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          success: { duration: 3000 },
          error:   { duration: 4000 },
          style: {
            fontSize: '14px',
            borderRadius: '8px',
          }
        }}
      />
      <App />
    </AuthProvider>
  </React.StrictMode>
)
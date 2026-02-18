import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import '@youversion/platform-react-ui/dist/tailwind.css'
import './index.css'

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

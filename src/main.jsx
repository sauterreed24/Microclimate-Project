import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

/* StrictMode disabled: double-mounting breaks some map SDKs and doubles work on low-end devices (e.g. Surface). */
createRoot(document.getElementById('root')).render(<App />)

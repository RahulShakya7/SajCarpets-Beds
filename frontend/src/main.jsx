import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log("Main.jsx executing");
const root = document.getElementById('root');
console.log("Root element:", root);

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

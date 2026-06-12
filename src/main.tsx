import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element. Make sure index.html has a <div id="root"></div> element.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import CanvaImageUploader from './utils/CanvaImageUploader';

// Check if we're in image uploader mode
const urlParams = new URLSearchParams(window.location.search);
const isImageUploader = urlParams.get('imageUploader') === 'true';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    {isImageUploader ? <CanvaImageUploader /> : <App />}
  </React.StrictMode>
); 
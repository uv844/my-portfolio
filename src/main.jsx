// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import Portfolio from './components/portfolio'; // <-- path to your file
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Portfolio />
  </React.StrictMode>
);

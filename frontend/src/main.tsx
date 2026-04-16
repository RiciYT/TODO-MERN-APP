import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { Toaster } from '@/components/ui/sonner';
import './index.css';

document.documentElement.classList.add('dark');
document.body.classList.add('theme');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster richColors position='top-right' />
  </React.StrictMode>
);

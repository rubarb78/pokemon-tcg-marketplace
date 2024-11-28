import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './hooks/AuthProvider'
import './styles/fonts.css'
import './index.css'

const rootElement = document.getElementById('root');

console.log('Initializing app...');
console.log('Root element:', rootElement);

if (!rootElement) {
  console.error('Root element not found!');
  throw new Error('Failed to find the root element');
}

const root = ReactDOM.createRoot(rootElement);
console.log('Root created successfully');

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
console.log('App rendered');

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Your main App component
import './index.css';     // Your global styles

// No more Clerk imports or keys are needed here.

// The root of your application simply renders the App component.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
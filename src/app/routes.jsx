import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App.jsx';

/**
 * Routes configuration
 */
const RoutesConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      {/* Add more routes here as needed */}
      <Route path="*" element={<App />} />
    </Routes>
  );
};

export default RoutesConfig;
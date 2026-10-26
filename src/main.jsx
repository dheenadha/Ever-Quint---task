import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext.jsx';
import RoutesConfig from './app/routes.jsx';
import './styles/global.css';

/**
 * Main application entry point
 */
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <TaskProvider>
        <RoutesConfig />
      </TaskProvider>
    </BrowserRouter>
  </React.StrictMode>
);
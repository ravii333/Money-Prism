import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navbar />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

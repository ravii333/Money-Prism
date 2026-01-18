import React, { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import ProductDetail from "./pages/ProductDetail";
import AlertsDashboard from "./pages/AlertsDashboard";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

const ProtectedRoute = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  return userInfo ? children : <Navigate to="/login" replace />;
};

function AppLayout({ user, handleLogout }) {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar user={user} handleLogout={handleLogout} />
      <main className="flex-grow bg-gray-50"><Outlet /></main>
      <Footer />
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) setUser(JSON.parse(storedUserInfo));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    window.location.href = '/';
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout user={user} handleLogout={handleLogout} />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/search", element: <SearchResults /> },
        { path: "/product/:id", element: <ProductDetail user={user} /> },
        { path: "/alerts", element: <ProtectedRoute><AlertsDashboard /></ProtectedRoute> },
      ],
    },
    { path: "/login", element: <Login setUser={setUser} /> },
    { path: "/register", element: <Register /> },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
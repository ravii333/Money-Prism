import React, { useState, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useNavigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import ProductDetail from "./pages/ProductDetail";
import AlertsDashboard from "./pages/AlertsDashboard";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

const Profile = () => (
  <div className="text-center p-20 text-3xl">User Profile Page</div>
);
const Wishlist = () => (
  <div className="text-center p-20 text-3xl">Wishlist Page</div>
);
const Cart = () => (
  <div className="text-center p-20 text-3xl">Shopping Cart Page</div>
);


function AppLayout({ user, handleLogout }) {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar user={user} handleLogout={handleLogout} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout user={user} handleLogout={handleLogout} />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/search", element: <SearchResults /> },
        { path: "/product/:id", element: <ProductDetail /> },
        { path: "/alerts", element: <AlertsDashboard /> },
        { path: "/profile", element: <Profile /> },
        { path: "/wishlist", element: <Wishlist /> },
        { path: "cart", element: <Cart /> },
      ],
    },
    {
      path: "/login",
      element: <Login setUser={setUser} />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

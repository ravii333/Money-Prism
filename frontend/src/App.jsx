import { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import SearchResults from './pages/SearchResults';
import Alerts from './pages/Alerts';
import PartPrediction from './pages/PartPrediction';

function AppLayout({ user, setUser }) {
  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <main className="pt-16  min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <AppLayout user={user} setUser={setUser} />,
      children: [
        { path: '/', element: <Home /> },
        { path: '/search', element: <SearchResults /> },
        { path: '/alerts', element: <Alerts /> },
        { path: '/predict', element: <PartPrediction /> },
      ],
    },
    { path: '/login', element: <Login setUser={setUser} /> },
    { path: '/register', element: <Register setUser={setUser} /> },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

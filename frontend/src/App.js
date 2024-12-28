import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminSidebar from './components/admin/AdminSidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import AddRecipe from './components/AddRecipe';
import EditRecipe from './components/EditRecipe';
import MyRecipes from './pages/MyRecipes';
import RecipeDetail from './pages/RecipeDetail';
import CreatorRecipes from './pages/CreatorRecipes';
import './App.css';

// Wrapper component to handle navigation logic
function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      checkAdminStatus();
      fetchUserProfile();
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      setIsSidebarOpen(true);
    }
  }, [isAdmin]);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/admin-check`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setIsAdmin(data.isAdmin);
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setUser(data);
      setIsAdmin(data.isAdmin);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Removed handleLogin function

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const checkTokenExpiration = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      if (decodedToken.exp * 1000 < Date.now()) {
        handleLogout();
      }
    }
  }, [handleLogout]);

  const handleInactivity = useCallback(() => {
    let inactivityTimer;
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        handleLogout();
      }, 30 * 60 * 1000); // 30 minutes
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);

    resetTimer();

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      clearTimeout(inactivityTimer);
    };
  }, [handleLogout]);

  useEffect(() => {
    checkTokenExpiration();
    const cleanup = handleInactivity();
    return cleanup;
  }, [checkTokenExpiration, handleInactivity]);

  return (
    <div className={`app ${isAdmin ? 'admin' : ''} ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Header 
        isLoggedIn={isLoggedIn} 
        isAdmin={isAdmin} 
        onLogout={handleLogout} 
        toggleSidebar={toggleSidebar}
      />
      {isLoggedIn && user && !isAdmin && (
        <Sidebar 
          isOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} 
          user={user} 
          onLogout={handleLogout}
        />
      )}
      {isAdmin && <AdminSidebar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/profile"
            element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/*"
            element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />}
          />
          <Route 
            path="/login" 
            element={
              isLoggedIn ? (
                <Navigate to="/" />
              ) : (
                <Login 
                  onLogin={(userData) => {
                    setIsLoggedIn(true);
                    setUser(userData);
                    setIsAdmin(userData.isAdmin);
                    if (userData.isAdmin) {
                      setIsSidebarOpen(true);
                    }
                    localStorage.setItem('token', userData.token);
                  }} 
                />
              )
            } 
          />
          <Route 
            path="/register" 
            element={isLoggedIn ? <Navigate to="/" /> : <Register />} 
          />
          <Route
            path="/create-recipe"
            element={isLoggedIn ? <AddRecipe /> : <Navigate to="/login" />}
          />
          <Route
            path="/edit-recipe/:id"
            element={isLoggedIn ? <EditRecipe /> : <Navigate to="/login" />}
          />
          <Route
            path="/my-recipes"
            element={isLoggedIn ? <MyRecipes /> : <Navigate to="/login" />}
          />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/creator/:creatorId" element={<CreatorRecipes />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

// Root component
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
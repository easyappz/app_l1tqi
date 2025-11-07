import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

// Pages will be created in next steps
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CreateListingPage from './pages/CreateListingPage';
import EditListingPage from './pages/EditListingPage';
import ListingDetailPage from './pages/ListingDetailPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminListingsPage from './pages/AdminListingsPage';

function App() {
  useEffect(() => {
    // Register routes for debugging
    const routes = [
      '/',
      '/login',
      '/register',
      '/profile',
      '/listings/create',
      '/listings/:id',
      '/listings/:id/edit',
      '/admin',
      '/admin/listings',
    ];
    
    if (window.handleRoutes) {
      window.handleRoutes(routes);
    }
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="app" data-easytag="id47-react/src/App.js">
            <Navbar />
            <main className="app-main" data-easytag="id48-react/src/App.js">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/listings/create"
                  element={
                    <ProtectedRoute>
                      <CreateListingPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/listings/:id" element={<ListingDetailPage />} />
                <Route
                  path="/listings/:id/edit"
                  element={
                    <ProtectedRoute>
                      <EditListingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/listings"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminListingsPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

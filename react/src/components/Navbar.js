import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="navbar" data-easytag="id22-react/src/components/Navbar.js">
      <div className="navbar-container" data-easytag="id23-react/src/components/Navbar.js">
        <Link to="/" className="navbar-logo" data-easytag="id24-react/src/components/Navbar.js">
          <span className="navbar-logo-icon" data-easytag="id25-react/src/components/Navbar.js">📋</span>
          <span className="navbar-logo-text" data-easytag="id26-react/src/components/Navbar.js">ClassifiedsBoard</span>
        </Link>

        <form className="navbar-search" onSubmit={handleSearch} data-easytag="id27-react/src/components/Navbar.js">
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-easytag="id28-react/src/components/Navbar.js"
          />
          <button type="submit" className="navbar-search-button" data-easytag="id29-react/src/components/Navbar.js">
            🔍
          </button>
        </form>

        <div className="navbar-actions" data-easytag="id30-react/src/components/Navbar.js">
          {isAuthenticated ? (
            <>
              <Link to="/listings/create" className="navbar-btn navbar-btn-primary" data-easytag="id31-react/src/components/Navbar.js">
                + Post Ad
              </Link>
              <div className="navbar-user-menu" data-easytag="id32-react/src/components/Navbar.js">
                <button
                  className="navbar-user-button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  data-easytag="id33-react/src/components/Navbar.js"
                >
                  <div className="navbar-user-avatar" data-easytag="id34-react/src/components/Navbar.js">
                    {user?.profile_photo ? (
                      <img src={user.profile_photo} alt={user.username} data-easytag="id35-react/src/components/Navbar.js" />
                    ) : (
                      <span data-easytag="id36-react/src/components/Navbar.js">{user?.username?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <span className="navbar-username" data-easytag="id37-react/src/components/Navbar.js">{user?.username}</span>
                </button>
                {showUserMenu && (
                  <div className="navbar-dropdown" data-easytag="id38-react/src/components/Navbar.js">
                    <Link
                      to="/profile"
                      className="navbar-dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                      data-easytag="id39-react/src/components/Navbar.js"
                    >
                      My Profile
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="navbar-dropdown-item"
                        onClick={() => setShowUserMenu(false)}
                        data-easytag="id40-react/src/components/Navbar.js"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      className="navbar-dropdown-item navbar-dropdown-logout"
                      onClick={handleLogout}
                      data-easytag="id41-react/src/components/Navbar.js"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-btn navbar-btn-outline" data-easytag="id42-react/src/components/Navbar.js">
                Login
              </Link>
              <Link to="/register" className="navbar-btn navbar-btn-primary" data-easytag="id43-react/src/components/Navbar.js">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

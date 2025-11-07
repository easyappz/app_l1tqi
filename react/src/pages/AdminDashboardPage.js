import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAdminStats } from '../api/admin';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/', { replace: true });
      return;
    }
    fetchStats();
  }, [isAdmin, navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setError('Failed to load statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard" data-easytag="id1-react/src/pages/AdminDashboardPage.js">
        <div className="loading" data-easytag="id2-react/src/pages/AdminDashboardPage.js">Loading statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard" data-easytag="id3-react/src/pages/AdminDashboardPage.js">
        <div className="error" data-easytag="id4-react/src/pages/AdminDashboardPage.js">
          {error}
          <button onClick={fetchStats} data-easytag="id5-react/src/pages/AdminDashboardPage.js">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard" data-easytag="id6-react/src/pages/AdminDashboardPage.js">
      <div className="admin-container" data-easytag="id7-react/src/pages/AdminDashboardPage.js">
        <header className="admin-header" data-easytag="id8-react/src/pages/AdminDashboardPage.js">
          <h1 data-easytag="id9-react/src/pages/AdminDashboardPage.js">Admin Dashboard</h1>
          <button
            className="btn-primary"
            onClick={() => navigate('/admin/listings')}
            data-easytag="id10-react/src/pages/AdminDashboardPage.js"
          >
            Manage Listings
          </button>
        </header>

        <div className="stats-grid" data-easytag="id11-react/src/pages/AdminDashboardPage.js">
          <div className="stat-card stat-users" data-easytag="id12-react/src/pages/AdminDashboardPage.js">
            <div className="stat-icon" data-easytag="id13-react/src/pages/AdminDashboardPage.js">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className="stat-content" data-easytag="id14-react/src/pages/AdminDashboardPage.js">
              <h3 data-easytag="id15-react/src/pages/AdminDashboardPage.js">Total Users</h3>
              <p className="stat-number" data-easytag="id16-react/src/pages/AdminDashboardPage.js">
                {stats?.total_users || 0}
              </p>
            </div>
          </div>

          <div className="stat-card stat-listings" data-easytag="id17-react/src/pages/AdminDashboardPage.js">
            <div className="stat-icon" data-easytag="id18-react/src/pages/AdminDashboardPage.js">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="9" x2="15" y2="9"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
            </div>
            <div className="stat-content" data-easytag="id19-react/src/pages/AdminDashboardPage.js">
              <h3 data-easytag="id20-react/src/pages/AdminDashboardPage.js">Total Listings</h3>
              <p className="stat-number" data-easytag="id21-react/src/pages/AdminDashboardPage.js">
                {stats?.total_listings || 0}
              </p>
              <div className="stat-details" data-easytag="id22-react/src/pages/AdminDashboardPage.js">
                <span className="badge badge-success" data-easytag="id23-react/src/pages/AdminDashboardPage.js">
                  Active: {stats?.active_listings || 0}
                </span>
                <span className="badge badge-secondary" data-easytag="id24-react/src/pages/AdminDashboardPage.js">
                  Inactive: {stats?.inactive_listings || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="stat-card stat-activity" data-easytag="id25-react/src/pages/AdminDashboardPage.js">
            <div className="stat-icon" data-easytag="id26-react/src/pages/AdminDashboardPage.js">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <div className="stat-content" data-easytag="id27-react/src/pages/AdminDashboardPage.js">
              <h3 data-easytag="id28-react/src/pages/AdminDashboardPage.js">User Activity</h3>
              <p className="stat-number" data-easytag="id29-react/src/pages/AdminDashboardPage.js">
                {stats?.active_users || 0}
              </p>
              <p className="stat-label" data-easytag="id30-react/src/pages/AdminDashboardPage.js">
                Active users with listings
              </p>
            </div>
          </div>

          <div className="stat-card stat-recent" data-easytag="id31-react/src/pages/AdminDashboardPage.js">
            <div className="stat-icon" data-easytag="id32-react/src/pages/AdminDashboardPage.js">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div className="stat-content" data-easytag="id33-react/src/pages/AdminDashboardPage.js">
              <h3 data-easytag="id34-react/src/pages/AdminDashboardPage.js">Recent Activity</h3>
              <p className="stat-number" data-easytag="id35-react/src/pages/AdminDashboardPage.js">
                {stats?.listings_last_7_days || 0}
              </p>
              <p className="stat-label" data-easytag="id36-react/src/pages/AdminDashboardPage.js">
                Listings in last 7 days
              </p>
            </div>
          </div>
        </div>

        {stats?.user_activity && stats.user_activity.length > 0 && (
          <div className="top-users-section" data-easytag="id37-react/src/pages/AdminDashboardPage.js">
            <h2 data-easytag="id38-react/src/pages/AdminDashboardPage.js">Top Active Users</h2>
            <div className="top-users-grid" data-easytag="id39-react/src/pages/AdminDashboardPage.js">
              {stats.user_activity.map((user, index) => (
                <div key={user.id} className="top-user-card" data-easytag="id40-react/src/pages/AdminDashboardPage.js">
                  <span className="user-rank" data-easytag="id41-react/src/pages/AdminDashboardPage.js">
                    #{index + 1}
                  </span>
                  <span className="user-name" data-easytag="id42-react/src/pages/AdminDashboardPage.js">
                    {user.username}
                  </span>
                  <span className="user-listings" data-easytag="id43-react/src/pages/AdminDashboardPage.js">
                    {user.listings_count} listings
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;

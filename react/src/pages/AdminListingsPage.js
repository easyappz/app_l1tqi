import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAdminListings, deleteAdminListing, getAdminUsers, blockUser } from '../api/admin';
import './AdminListingsPage.css';

const AdminListingsPage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('listings');
  const [listings, setListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('-created_at');
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, title: '' });
  const [blockModal, setBlockModal] = useState({ show: false, user: null });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/', { replace: true });
      return;
    }
    if (activeTab === 'listings') {
      fetchListings();
    } else {
      fetchUsers();
    }
  }, [isAdmin, navigate, activeTab, sortBy]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminListings({ ordering: sortBy, search: searchTerm });
      setListings(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Failed to fetch listings:', err);
      setError('Failed to load listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminUsers({ search: searchTerm });
      setUsers(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (activeTab === 'listings') {
      fetchListings();
    } else {
      fetchUsers();
    }
  };

  const handleDeleteClick = (listing) => {
    setDeleteModal({ show: true, id: listing.id, title: listing.title });
  };

  const confirmDelete = async () => {
    try {
      await deleteAdminListing(deleteModal.id);
      setListings(listings.filter(l => l.id !== deleteModal.id));
      setDeleteModal({ show: false, id: null, title: '' });
    } catch (err) {
      console.error('Failed to delete listing:', err);
      alert('Failed to delete listing. Please try again.');
    }
  };

  const handleBlockClick = (user) => {
    setBlockModal({ show: true, user });
  };

  const confirmBlock = async () => {
    try {
      const newBlockStatus = !blockModal.user.is_blocked;
      await blockUser(blockModal.user.id, newBlockStatus);
      setUsers(users.map(u => 
        u.id === blockModal.user.id ? { ...u, is_blocked: newBlockStatus } : u
      ));
      setBlockModal({ show: false, user: null });
    } catch (err) {
      console.error('Failed to block/unblock user:', err);
      alert('Failed to update user status. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="admin-listings-page" data-easytag="id44-react/src/pages/AdminListingsPage.js">
      <div className="admin-listings-container" data-easytag="id45-react/src/pages/AdminListingsPage.js">
        <header className="admin-listings-header" data-easytag="id46-react/src/pages/AdminListingsPage.js">
          <div data-easytag="id47-react/src/pages/AdminListingsPage.js">
            <button
              className="btn-back"
              onClick={() => navigate('/admin')}
              data-easytag="id48-react/src/pages/AdminListingsPage.js"
            >
              ← Back to Dashboard
            </button>
            <h1 data-easytag="id49-react/src/pages/AdminListingsPage.js">Admin Moderation</h1>
          </div>
        </header>

        <div className="tabs" data-easytag="id50-react/src/pages/AdminListingsPage.js">
          <button
            className={`tab ${activeTab === 'listings' ? 'active' : ''}`}
            onClick={() => setActiveTab('listings')}
            data-easytag="id51-react/src/pages/AdminListingsPage.js"
          >
            Listings
          </button>
          <button
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
            data-easytag="id52-react/src/pages/AdminListingsPage.js"
          >
            Users
          </button>
        </div>

        <div className="controls" data-easytag="id53-react/src/pages/AdminListingsPage.js">
          <div className="search-box" data-easytag="id54-react/src/pages/AdminListingsPage.js">
            <input
              type="text"
              placeholder={activeTab === 'listings' ? 'Search listings...' : 'Search users...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              data-easytag="id55-react/src/pages/AdminListingsPage.js"
            />
            <button onClick={handleSearch} data-easytag="id56-react/src/pages/AdminListingsPage.js">
              Search
            </button>
          </div>

          {activeTab === 'listings' && (
            <div className="sort-box" data-easytag="id57-react/src/pages/AdminListingsPage.js">
              <label data-easytag="id58-react/src/pages/AdminListingsPage.js">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                data-easytag="id59-react/src/pages/AdminListingsPage.js"
              >
                <option value="-created_at">Newest First</option>
                <option value="created_at">Oldest First</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="author__username">Author (A-Z)</option>
                <option value="status">Status</option>
              </select>
            </div>
          )}
        </div>

        {loading ? (
          <div className="loading" data-easytag="id60-react/src/pages/AdminListingsPage.js">
            Loading {activeTab}...
          </div>
        ) : error ? (
          <div className="error" data-easytag="id61-react/src/pages/AdminListingsPage.js">
            {error}
            <button onClick={activeTab === 'listings' ? fetchListings : fetchUsers} data-easytag="id62-react/src/pages/AdminListingsPage.js">
              Retry
            </button>
          </div>
        ) : activeTab === 'listings' ? (
          <div className="listings-table-container" data-easytag="id63-react/src/pages/AdminListingsPage.js">
            {listings.length === 0 ? (
              <div className="no-data" data-easytag="id64-react/src/pages/AdminListingsPage.js">
                No listings found.
              </div>
            ) : (
              <table className="listings-table" data-easytag="id65-react/src/pages/AdminListingsPage.js">
                <thead data-easytag="id66-react/src/pages/AdminListingsPage.js">
                  <tr data-easytag="id67-react/src/pages/AdminListingsPage.js">
                    <th data-easytag="id68-react/src/pages/AdminListingsPage.js">Image</th>
                    <th data-easytag="id69-react/src/pages/AdminListingsPage.js">Title</th>
                    <th data-easytag="id70-react/src/pages/AdminListingsPage.js">Author</th>
                    <th data-easytag="id71-react/src/pages/AdminListingsPage.js">Price</th>
                    <th data-easytag="id72-react/src/pages/AdminListingsPage.js">Status</th>
                    <th data-easytag="id73-react/src/pages/AdminListingsPage.js">Created</th>
                    <th data-easytag="id74-react/src/pages/AdminListingsPage.js">Actions</th>
                  </tr>
                </thead>
                <tbody data-easytag="id75-react/src/pages/AdminListingsPage.js">
                  {listings.map(listing => (
                    <tr key={listing.id} data-easytag="id76-react/src/pages/AdminListingsPage.js">
                      <td data-easytag="id77-react/src/pages/AdminListingsPage.js">
                        <div className="listing-thumbnail" data-easytag="id78-react/src/pages/AdminListingsPage.js">
                          {listing.first_image ? (
                            <img src={listing.first_image} alt={listing.title} data-easytag="id79-react/src/pages/AdminListingsPage.js" />
                          ) : (
                            <div className="no-image" data-easytag="id80-react/src/pages/AdminListingsPage.js">No Image</div>
                          )}
                        </div>
                      </td>
                      <td data-easytag="id81-react/src/pages/AdminListingsPage.js">
                        <strong data-easytag="id82-react/src/pages/AdminListingsPage.js">{listing.title}</strong>
                      </td>
                      <td data-easytag="id83-react/src/pages/AdminListingsPage.js">{listing.author_username}</td>
                      <td data-easytag="id84-react/src/pages/AdminListingsPage.js">${listing.price}</td>
                      <td data-easytag="id85-react/src/pages/AdminListingsPage.js">
                        <span className={`status-badge status-${listing.status}`} data-easytag="id86-react/src/pages/AdminListingsPage.js">
                          {listing.status}
                        </span>
                      </td>
                      <td data-easytag="id87-react/src/pages/AdminListingsPage.js">{formatDate(listing.created_at)}</td>
                      <td data-easytag="id88-react/src/pages/AdminListingsPage.js">
                        <div className="action-buttons" data-easytag="id89-react/src/pages/AdminListingsPage.js">
                          <button
                            className="btn-view"
                            onClick={() => navigate(`/listings/${listing.id}`)}
                            data-easytag="id90-react/src/pages/AdminListingsPage.js"
                          >
                            View
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDeleteClick(listing)}
                            data-easytag="id91-react/src/pages/AdminListingsPage.js"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="users-table-container" data-easytag="id92-react/src/pages/AdminListingsPage.js">
            {users.length === 0 ? (
              <div className="no-data" data-easytag="id93-react/src/pages/AdminListingsPage.js">
                No users found.
              </div>
            ) : (
              <table className="users-table" data-easytag="id94-react/src/pages/AdminListingsPage.js">
                <thead data-easytag="id95-react/src/pages/AdminListingsPage.js">
                  <tr data-easytag="id96-react/src/pages/AdminListingsPage.js">
                    <th data-easytag="id97-react/src/pages/AdminListingsPage.js">Username</th>
                    <th data-easytag="id98-react/src/pages/AdminListingsPage.js">Email</th>
                    <th data-easytag="id99-react/src/pages/AdminListingsPage.js">Phone</th>
                    <th data-easytag="id100-react/src/pages/AdminListingsPage.js">Status</th>
                    <th data-easytag="id101-react/src/pages/AdminListingsPage.js">Actions</th>
                  </tr>
                </thead>
                <tbody data-easytag="id102-react/src/pages/AdminListingsPage.js">
                  {users.map(user => (
                    <tr key={user.id} className={user.is_blocked ? 'blocked-user' : ''} data-easytag="id103-react/src/pages/AdminListingsPage.js">
                      <td data-easytag="id104-react/src/pages/AdminListingsPage.js">
                        <strong data-easytag="id105-react/src/pages/AdminListingsPage.js">{user.username}</strong>
                        {user.is_staff && <span className="admin-badge" data-easytag="id106-react/src/pages/AdminListingsPage.js">Admin</span>}
                      </td>
                      <td data-easytag="id107-react/src/pages/AdminListingsPage.js">{user.email}</td>
                      <td data-easytag="id108-react/src/pages/AdminListingsPage.js">{user.phone || 'N/A'}</td>
                      <td data-easytag="id109-react/src/pages/AdminListingsPage.js">
                        {user.is_blocked ? (
                          <span className="status-badge status-blocked" data-easytag="id110-react/src/pages/AdminListingsPage.js">Blocked</span>
                        ) : (
                          <span className="status-badge status-active" data-easytag="id111-react/src/pages/AdminListingsPage.js">Active</span>
                        )}
                      </td>
                      <td data-easytag="id112-react/src/pages/AdminListingsPage.js">
                        {!user.is_staff && (
                          <button
                            className={user.is_blocked ? 'btn-unblock' : 'btn-block'}
                            onClick={() => handleBlockClick(user)}
                            data-easytag="id113-react/src/pages/AdminListingsPage.js"
                          >
                            {user.is_blocked ? 'Unblock' : 'Block'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {deleteModal.show && (
        <div className="modal-overlay" onClick={() => setDeleteModal({ show: false, id: null, title: '' })} data-easytag="id114-react/src/pages/AdminListingsPage.js">
          <div className="modal" onClick={(e) => e.stopPropagation()} data-easytag="id115-react/src/pages/AdminListingsPage.js">
            <h2 data-easytag="id116-react/src/pages/AdminListingsPage.js">Confirm Delete</h2>
            <p data-easytag="id117-react/src/pages/AdminListingsPage.js">
              Are you sure you want to delete the listing "<strong data-easytag="id118-react/src/pages/AdminListingsPage.js">{deleteModal.title}</strong>"?
            </p>
            <p className="warning" data-easytag="id119-react/src/pages/AdminListingsPage.js">This action cannot be undone.</p>
            <div className="modal-actions" data-easytag="id120-react/src/pages/AdminListingsPage.js">
              <button
                className="btn-cancel"
                onClick={() => setDeleteModal({ show: false, id: null, title: '' })}
                data-easytag="id121-react/src/pages/AdminListingsPage.js"
              >
                Cancel
              </button>
              <button className="btn-confirm-delete" onClick={confirmDelete} data-easytag="id122-react/src/pages/AdminListingsPage.js">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {blockModal.show && blockModal.user && (
        <div className="modal-overlay" onClick={() => setBlockModal({ show: false, user: null })} data-easytag="id123-react/src/pages/AdminListingsPage.js">
          <div className="modal" onClick={(e) => e.stopPropagation()} data-easytag="id124-react/src/pages/AdminListingsPage.js">
            <h2 data-easytag="id125-react/src/pages/AdminListingsPage.js">
              {blockModal.user.is_blocked ? 'Unblock User' : 'Block User'}
            </h2>
            <p data-easytag="id126-react/src/pages/AdminListingsPage.js">
              Are you sure you want to {blockModal.user.is_blocked ? 'unblock' : 'block'} user "<strong data-easytag="id127-react/src/pages/AdminListingsPage.js">{blockModal.user.username}</strong>"?
            </p>
            {!blockModal.user.is_blocked && (
              <p className="warning" data-easytag="id128-react/src/pages/AdminListingsPage.js">
                Blocked users will not be able to create or edit listings.
              </p>
            )}
            <div className="modal-actions" data-easytag="id129-react/src/pages/AdminListingsPage.js">
              <button
                className="btn-cancel"
                onClick={() => setBlockModal({ show: false, user: null })}
                data-easytag="id130-react/src/pages/AdminListingsPage.js"
              >
                Cancel
              </button>
              <button
                className={blockModal.user.is_blocked ? 'btn-confirm-unblock' : 'btn-confirm-block'}
                onClick={confirmBlock}
                data-easytag="id131-react/src/pages/AdminListingsPage.js"
              >
                {blockModal.user.is_blocked ? 'Unblock' : 'Block'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminListingsPage;

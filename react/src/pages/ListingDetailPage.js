import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListingById, deleteListing } from '../api/listings';
import { useAuth } from '../contexts/AuthContext';
import ImageSlider from '../components/ImageSlider';
import ConfirmModal from '../components/ConfirmModal';
import './ListingDetailPage.css';

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getListingById(id);
        setListing(data);
      } catch (err) {
        console.error('Error fetching listing:', err);
        if (err.response?.status === 404) {
          setError('Listing not found');
        } else {
          setError('Failed to load listing. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteListing(id);
      navigate('/profile');
    } catch (err) {
      console.error('Error deleting listing:', err);
      alert('Failed to delete listing. Please try again.');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleEdit = () => {
    navigate(`/listings/${id}/edit`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatPhone = (phone) => {
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phone;
  };

  if (loading) {
    return (
      <div className="listing-detail-loading" data-easytag="id125-react/src/pages/ListingDetailPage.js">
        <div className="loading-spinner" data-easytag="id126-react/src/pages/ListingDetailPage.js"></div>
        <p data-easytag="id127-react/src/pages/ListingDetailPage.js">Loading listing...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="listing-detail-error" data-easytag="id128-react/src/pages/ListingDetailPage.js">
        <div className="error-content" data-easytag="id129-react/src/pages/ListingDetailPage.js">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" data-easytag="id130-react/src/pages/ListingDetailPage.js">
            <circle cx="32" cy="32" r="30" stroke="#dc3545" strokeWidth="4" />
            <path d="M32 20V36" stroke="#dc3545" strokeWidth="4" strokeLinecap="round" />
            <circle cx="32" cy="44" r="2" fill="#dc3545" />
          </svg>
          <h2 data-easytag="id131-react/src/pages/ListingDetailPage.js">{error}</h2>
          <button
            className="back-button"
            onClick={() => navigate('/')}
            data-easytag="id132-react/src/pages/ListingDetailPage.js"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!listing) {
    return null;
  }

  const isOwner = user && listing.author && user.id === listing.author.id;

  return (
    <div className="listing-detail-page" data-easytag="id133-react/src/pages/ListingDetailPage.js">
      <div className="listing-detail-container" data-easytag="id134-react/src/pages/ListingDetailPage.js">
        <button
          className="back-button-link"
          onClick={() => navigate(-1)}
          data-easytag="id135-react/src/pages/ListingDetailPage.js"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" data-easytag="id136-react/src/pages/ListingDetailPage.js">
            <path d="M12 16L6 10L12 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>

        <div className="listing-detail-content" data-easytag="id137-react/src/pages/ListingDetailPage.js">
          <div className="listing-detail-left" data-easytag="id138-react/src/pages/ListingDetailPage.js">
            <ImageSlider images={listing.images} />
          </div>

          <div className="listing-detail-right" data-easytag="id139-react/src/pages/ListingDetailPage.js">
            <div className="listing-header" data-easytag="id140-react/src/pages/ListingDetailPage.js">
              <h1 className="listing-title" data-easytag="id141-react/src/pages/ListingDetailPage.js">{listing.title}</h1>
              <div className="listing-price" data-easytag="id142-react/src/pages/ListingDetailPage.js">
                {formatPrice(listing.price)}
              </div>
            </div>

            <div className="listing-meta" data-easytag="id143-react/src/pages/ListingDetailPage.js">
              {listing.category && (
                <span className="listing-category" data-easytag="id144-react/src/pages/ListingDetailPage.js">
                  {listing.category.name}
                </span>
              )}
              <span className="listing-date" data-easytag="id145-react/src/pages/ListingDetailPage.js">
                Posted on {formatDate(listing.created_at)}
              </span>
            </div>

            <div className="listing-description" data-easytag="id146-react/src/pages/ListingDetailPage.js">
              <h2 data-easytag="id147-react/src/pages/ListingDetailPage.js">Description</h2>
              <p data-easytag="id148-react/src/pages/ListingDetailPage.js">
                {listing.description.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < listing.description.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
            </div>

            <div className="author-section" data-easytag="id149-react/src/pages/ListingDetailPage.js">
              <h2 data-easytag="id150-react/src/pages/ListingDetailPage.js">Seller Information</h2>
              <div className="author-card" data-easytag="id151-react/src/pages/ListingDetailPage.js">
                <div className="author-avatar" data-easytag="id152-react/src/pages/ListingDetailPage.js">
                  {listing.author.profile_photo ? (
                    <img
                      src={listing.author.profile_photo}
                      alt={listing.author.username}
                      data-easytag="id153-react/src/pages/ListingDetailPage.js"
                    />
                  ) : (
                    <div className="avatar-placeholder" data-easytag="id154-react/src/pages/ListingDetailPage.js">
                      {listing.author.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="author-info" data-easytag="id155-react/src/pages/ListingDetailPage.js">
                  <h3 data-easytag="id156-react/src/pages/ListingDetailPage.js">{listing.author.username}</h3>
                  {listing.phone && (
                    <a
                      href={`tel:${listing.phone}`}
                      className="author-phone"
                      data-easytag="id157-react/src/pages/ListingDetailPage.js"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" data-easytag="id158-react/src/pages/ListingDetailPage.js">
                        <path
                          d="M2 3C2 2.44772 2.44772 2 3 2H5.15287C5.64171 2 6.0589 2.35341 6.13927 2.8356L6.87858 7.27147C6.95075 7.70451 6.73206 8.13397 6.3394 8.3303L4.79126 9.10437C5.90756 11.8783 8.12168 14.0924 10.8956 15.2087L11.6697 13.6606C11.866 13.2679 12.2955 13.0492 12.7285 13.1214L17.1644 13.8607C17.6466 13.9411 18 14.3583 18 14.8471V17C18 17.5523 17.5523 18 17 18H15C7.8203 18 2 12.1797 2 5V3Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {formatPhone(listing.phone)}
                    </a>
                  )}
                </div>
              </div>
              {listing.phone && (
                <a
                  href={`tel:${listing.phone}`}
                  className="contact-button"
                  data-easytag="id159-react/src/pages/ListingDetailPage.js"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" data-easytag="id160-react/src/pages/ListingDetailPage.js">
                    <path
                      d="M2 3C2 2.44772 2.44772 2 3 2H5.15287C5.64171 2 6.0589 2.35341 6.13927 2.8356L6.87858 7.27147C6.95075 7.70451 6.73206 8.13397 6.3394 8.3303L4.79126 9.10437C5.90756 11.8783 8.12168 14.0924 10.8956 15.2087L11.6697 13.6606C11.866 13.2679 12.2955 13.0492 12.7285 13.1214L17.1644 13.8607C17.6466 13.9411 18 14.3583 18 14.8471V17C18 17.5523 17.5523 18 17 18H15C7.8203 18 2 12.1797 2 5V3Z"
                      fill="currentColor"
                    />
                  </svg>
                  Contact Seller
                </a>
              )}
            </div>

            {isOwner && (
              <div className="listing-actions" data-easytag="id161-react/src/pages/ListingDetailPage.js">
                <button
                  className="action-button edit-button"
                  onClick={handleEdit}
                  data-easytag="id162-react/src/pages/ListingDetailPage.js"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" data-easytag="id163-react/src/pages/ListingDetailPage.js">
                    <path
                      d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z"
                      fill="currentColor"
                    />
                    <path
                      d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z"
                      fill="currentColor"
                    />
                  </svg>
                  Edit
                </button>
                <button
                  className="action-button delete-button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  data-easytag="id164-react/src/pages/ListingDetailPage.js"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" data-easytag="id165-react/src/pages/ListingDetailPage.js">
                    <path
                      d="M6 2L6 3H3V5H4V16C4 17.1046 4.89543 18 6 18H14C15.1046 18 16 17.1046 16 16V5H17V3H14V2H6Z"
                      fill="currentColor"
                    />
                    <path d="M8 7H10V15H8V7Z" fill="white" />
                    <path d="M12 7H10V15H12V7Z" fill="white" />
                  </svg>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Listing"
        message="Are you sure you want to delete this listing? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmText={isDeleting ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
};

export default ListingDetailPage;

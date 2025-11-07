import React from 'react';
import './ListingCard.css';

const ListingCard = ({ listing, onClick }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  return (
    <div className="listing-card" onClick={onClick} data-easytag="id28-react/src/components/ListingCard.js">
      <div className="listing-card-image" data-easytag="id29-react/src/components/ListingCard.js">
        {listing.first_image ? (
          <img src={listing.first_image} alt={listing.title} data-easytag="id30-react/src/components/ListingCard.js" />
        ) : (
          <div className="listing-card-no-image" data-easytag="id31-react/src/components/ListingCard.js">
            <span data-easytag="id32-react/src/components/ListingCard.js">📷</span>
            <p data-easytag="id33-react/src/components/ListingCard.js">No image</p>
          </div>
        )}
      </div>
      
      <div className="listing-card-content" data-easytag="id34-react/src/components/ListingCard.js">
        <div className="listing-card-header" data-easytag="id35-react/src/components/ListingCard.js">
          <h3 className="listing-card-title" data-easytag="id36-react/src/components/ListingCard.js">
            {listing.title}
          </h3>
          {listing.category_name && (
            <span className="listing-card-category" data-easytag="id37-react/src/components/ListingCard.js">
              {listing.category_name}
            </span>
          )}
        </div>
        
        <p className="listing-card-description" data-easytag="id38-react/src/components/ListingCard.js">
          {listing.description.length > 100
            ? `${listing.description.substring(0, 100)}...`
            : listing.description}
        </p>
        
        <div className="listing-card-footer" data-easytag="id39-react/src/components/ListingCard.js">
          <span className="listing-card-price" data-easytag="id40-react/src/components/ListingCard.js">
            {formatPrice(listing.price)}
          </span>
          <span className="listing-card-date" data-easytag="id41-react/src/components/ListingCard.js">
            {formatDate(listing.created_at)}
          </span>
        </div>
        
        {listing.author_username && (
          <div className="listing-card-author" data-easytag="id42-react/src/components/ListingCard.js">
            <span data-easytag="id43-react/src/components/ListingCard.js">👤 {listing.author_username}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingCard;

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchListings } from '../api/listings';
import { fetchCategories } from '../api/categories';
import ListingCard from '../components/ListingCard';
import FilterSidebar from '../components/FilterSidebar';
import SortingDropdown from '../components/SortingDropdown';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Filter and sorting state
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
  });
  const [ordering, setOrdering] = useState(searchParams.get('ordering') || '-created_at');

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Update filters when URL search params change
  useEffect(() => {
    const newSearch = searchParams.get('search') || '';
    if (newSearch !== filters.search) {
      setFilters(prev => ({ ...prev, search: newSearch }));
    }
  }, [searchParams]);

  // Fetch listings when filters or ordering change
  const loadListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        ...filters,
        ordering,
      };
      
      // Remove empty values
      Object.keys(params).forEach(key => {
        if (!params[key]) {
          delete params[key];
        }
      });
      
      const data = await fetchListings(params);
      setListings(data);
    } catch (err) {
      console.error('Failed to fetch listings:', err);
      setError('Failed to load listings. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [filters, ordering]);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setShowMobileFilters(false);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      min_price: '',
      max_price: '',
    });
    setShowMobileFilters(false);
  };

  const handleSortChange = (newOrdering) => {
    setOrdering(newOrdering);
  };

  const handleListingClick = (listingId) => {
    navigate(`/listings/${listingId}`);
  };

  return (
    <div className="home-page" data-easytag="id1-react/src/pages/HomePage.js">
      <div className="home-container" data-easytag="id2-react/src/pages/HomePage.js">
        {/* Mobile filter toggle */}
        <div className="mobile-filter-toggle" data-easytag="id3-react/src/pages/HomePage.js">
          <button
            className="filter-toggle-btn"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            data-easytag="id4-react/src/pages/HomePage.js"
          >
            <span data-easytag="id5-react/src/pages/HomePage.js">🔍 Filters & Sort</span>
          </button>
        </div>

        <div className="home-content" data-easytag="id6-react/src/pages/HomePage.js">
          {/* Filter Sidebar */}
          <FilterSidebar
            categories={categories}
            filters={filters}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
            showMobile={showMobileFilters}
            onCloseMobile={() => setShowMobileFilters(false)}
          />

          {/* Main Content */}
          <div className="home-main" data-easytag="id7-react/src/pages/HomePage.js">
            {/* Header with sorting */}
            <div className="home-header" data-easytag="id8-react/src/pages/HomePage.js">
              <h1 className="home-title" data-easytag="id9-react/src/pages/HomePage.js">
                {filters.search ? `Search results for "${filters.search}"` : 'All Listings'}
              </h1>
              <SortingDropdown ordering={ordering} onSortChange={handleSortChange} />
            </div>

            {/* Active filters display */}
            {(filters.category || filters.min_price || filters.max_price) && (
              <div className="active-filters" data-easytag="id10-react/src/pages/HomePage.js">
                <span className="active-filters-label" data-easytag="id11-react/src/pages/HomePage.js">Active filters:</span>
                {filters.category && (
                  <span className="active-filter-tag" data-easytag="id12-react/src/pages/HomePage.js">
                    Category: {categories.find(c => c.id === parseInt(filters.category))?.name || filters.category}
                  </span>
                )}
                {filters.min_price && (
                  <span className="active-filter-tag" data-easytag="id13-react/src/pages/HomePage.js">
                    Min: ${filters.min_price}
                  </span>
                )}
                {filters.max_price && (
                  <span className="active-filter-tag" data-easytag="id14-react/src/pages/HomePage.js">
                    Max: ${filters.max_price}
                  </span>
                )}
                <button
                  className="clear-filters-link"
                  onClick={handleClearFilters}
                  data-easytag="id15-react/src/pages/HomePage.js"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="loading-container" data-easytag="id16-react/src/pages/HomePage.js">
                <div className="spinner" data-easytag="id17-react/src/pages/HomePage.js"></div>
                <p data-easytag="id18-react/src/pages/HomePage.js">Loading listings...</p>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="error-container" data-easytag="id19-react/src/pages/HomePage.js">
                <p className="error-message" data-easytag="id20-react/src/pages/HomePage.js">{error}</p>
                <button
                  className="retry-btn"
                  onClick={loadListings}
                  data-easytag="id21-react/src/pages/HomePage.js"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Listings grid */}
            {!loading && !error && (
              <>
                {listings.length === 0 ? (
                  <div className="no-listings" data-easytag="id22-react/src/pages/HomePage.js">
                    <div className="no-listings-icon" data-easytag="id23-react/src/pages/HomePage.js">📭</div>
                    <h2 data-easytag="id24-react/src/pages/HomePage.js">No listings found</h2>
                    <p data-easytag="id25-react/src/pages/HomePage.js">
                      {filters.search || filters.category || filters.min_price || filters.max_price
                        ? 'Try adjusting your filters or search query'
                        : 'Be the first to post a listing!'}
                    </p>
                    {(filters.search || filters.category || filters.min_price || filters.max_price) && (
                      <button
                        className="clear-filters-btn"
                        onClick={handleClearFilters}
                        data-easytag="id26-react/src/pages/HomePage.js"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="listings-grid" data-easytag="id27-react/src/pages/HomePage.js">
                    {listings.map((listing) => (
                      <ListingCard
                        key={listing.id}
                        listing={listing}
                        onClick={() => handleListingClick(listing.id)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

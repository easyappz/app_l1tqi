import React, { useState, useEffect } from 'react';
import './FilterSidebar.css';

const FilterSidebar = ({
  categories,
  filters,
  onApplyFilters,
  onClearFilters,
  showMobile,
  onCloseMobile,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  const handleClear = () => {
    const clearedFilters = {
      search: '',
      category: '',
      min_price: '',
      max_price: '',
    };
    setLocalFilters(clearedFilters);
    onClearFilters();
  };

  const hasActiveFilters = localFilters.category || localFilters.min_price || localFilters.max_price;

  return (
    <>
      {showMobile && (
        <div className="filter-overlay" onClick={onCloseMobile} data-easytag="id44-react/src/components/FilterSidebar.js"></div>
      )}
      <aside
        className={`filter-sidebar ${showMobile ? 'filter-sidebar-mobile-open' : ''}`}
        data-easytag="id45-react/src/components/FilterSidebar.js"
      >
        <div className="filter-sidebar-header" data-easytag="id46-react/src/components/FilterSidebar.js">
          <h2 data-easytag="id47-react/src/components/FilterSidebar.js">Filters</h2>
          {showMobile && (
            <button
              className="filter-close-btn"
              onClick={onCloseMobile}
              data-easytag="id48-react/src/components/FilterSidebar.js"
            >
              ✕
            </button>
          )}
        </div>

        <div className="filter-section" data-easytag="id49-react/src/components/FilterSidebar.js">
          <label className="filter-label" data-easytag="id50-react/src/components/FilterSidebar.js">
            Category
          </label>
          <select
            className="filter-select"
            value={localFilters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            data-easytag="id51-react/src/components/FilterSidebar.js"
          >
            <option value="" data-easytag="id52-react/src/components/FilterSidebar.js">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id} data-easytag="id53-react/src/components/FilterSidebar.js">
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-section" data-easytag="id54-react/src/components/FilterSidebar.js">
          <label className="filter-label" data-easytag="id55-react/src/components/FilterSidebar.js">
            Price Range
          </label>
          <div className="price-inputs" data-easytag="id56-react/src/components/FilterSidebar.js">
            <input
              type="number"
              className="filter-input"
              placeholder="Min"
              value={localFilters.min_price}
              onChange={(e) => handleFilterChange('min_price', e.target.value)}
              min="0"
              data-easytag="id57-react/src/components/FilterSidebar.js"
            />
            <span className="price-separator" data-easytag="id58-react/src/components/FilterSidebar.js">-</span>
            <input
              type="number"
              className="filter-input"
              placeholder="Max"
              value={localFilters.max_price}
              onChange={(e) => handleFilterChange('max_price', e.target.value)}
              min="0"
              data-easytag="id59-react/src/components/FilterSidebar.js"
            />
          </div>
        </div>

        <div className="filter-actions" data-easytag="id60-react/src/components/FilterSidebar.js">
          <button
            className="filter-btn filter-btn-apply"
            onClick={handleApply}
            data-easytag="id61-react/src/components/FilterSidebar.js"
          >
            Apply Filters
          </button>
          {hasActiveFilters && (
            <button
              className="filter-btn filter-btn-clear"
              onClick={handleClear}
              data-easytag="id62-react/src/components/FilterSidebar.js"
            >
              Clear Filters
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;

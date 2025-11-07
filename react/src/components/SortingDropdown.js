import React from 'react';
import './SortingDropdown.css';

const SortingDropdown = ({ ordering, onSortChange }) => {
  const sortOptions = [
    { value: '-created_at', label: 'Newest First' },
    { value: 'created_at', label: 'Oldest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
  ];

  return (
    <div className="sorting-dropdown" data-easytag="id63-react/src/components/SortingDropdown.js">
      <label className="sorting-label" data-easytag="id64-react/src/components/SortingDropdown.js">
        Sort by:
      </label>
      <select
        className="sorting-select"
        value={ordering}
        onChange={(e) => onSortChange(e.target.value)}
        data-easytag="id65-react/src/components/SortingDropdown.js"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value} data-easytag="id66-react/src/components/SortingDropdown.js">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortingDropdown;

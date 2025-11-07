import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getCategories, getListingById, updateListing } from '../api/listings';
import ImageUpload from '../components/ImageUpload';
import './CreateListingPage.css';

const EditListingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchingListing, setFetchingListing] = useState(true);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchListing();
  }, [id]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchListing = async () => {
    try {
      const listing = await getListingById(id);
      
      // Check ownership
      if (listing.author.id !== user?.id && !user?.is_staff) {
        alert('You do not have permission to edit this listing');
        navigate('/');
        return;
      }

      setFormData({
        title: listing.title,
        description: listing.description,
        price: listing.price,
        category: listing.category?.id || '',
        phone: listing.phone,
      });

      // Set existing images
      setImages(listing.images || []);
    } catch (error) {
      console.error('Failed to fetch listing:', error);
      alert('Failed to load listing');
      navigate('/');
    } finally {
      setFetchingListing(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setHasUnsavedChanges(true);
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (parseFloat(formData.price) < 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (images.length === 0) {
      newErrors.images = 'At least one image is required';
    } else if (images.length > 5) {
      newErrors.images = 'Maximum 5 images allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('price', formData.price);
      submitData.append('category', formData.category);
      submitData.append('phone', formData.phone.trim());
      
      // Only add new images (File objects)
      images.forEach((image) => {
        if (image instanceof File) {
          submitData.append('images_data', image);
        }
      });

      // If all images are new, add them; otherwise keep existing
      const hasNewImages = images.some(img => img instanceof File);
      if (!hasNewImages && images.length > 0) {
        // No new images, but we need to preserve existing ones
        // The backend should handle this case
      }

      const response = await updateListing(id, submitData);
      setHasUnsavedChanges(false);
      navigate(`/listings/${response.id}`);
    } catch (error) {
      console.error('Failed to update listing:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        alert('Failed to update listing. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchingListing) {
    return (
      <div className="create-listing-page" data-easytag="id45-react/src/pages/EditListingPage.js">
        <div className="create-listing-container" data-easytag="id46-react/src/pages/EditListingPage.js">
          <p data-easytag="id47-react/src/pages/EditListingPage.js">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-listing-page" data-easytag="id48-react/src/pages/EditListingPage.js">
      <div className="create-listing-container" data-easytag="id49-react/src/pages/EditListingPage.js">
        <h1 data-easytag="id50-react/src/pages/EditListingPage.js">Edit Listing</h1>
        
        <form onSubmit={handleSubmit} className="listing-form" data-easytag="id51-react/src/pages/EditListingPage.js">
          <div className="form-group" data-easytag="id52-react/src/pages/EditListingPage.js">
            <label htmlFor="title" data-easytag="id53-react/src/pages/EditListingPage.js">
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter listing title"
              maxLength={200}
              className={errors.title ? 'error' : ''}
              data-easytag="id54-react/src/pages/EditListingPage.js"
            />
            {errors.title && <span className="error-message" data-easytag="id55-react/src/pages/EditListingPage.js">{errors.title}</span>}
            <span className="char-count" data-easytag="id56-react/src/pages/EditListingPage.js">{formData.title.length}/200</span>
          </div>

          <div className="form-group" data-easytag="id57-react/src/pages/EditListingPage.js">
            <label htmlFor="description" data-easytag="id58-react/src/pages/EditListingPage.js">
              Description <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your item in detail"
              rows={8}
              className={errors.description ? 'error' : ''}
              data-easytag="id59-react/src/pages/EditListingPage.js"
            />
            {errors.description && <span className="error-message" data-easytag="id60-react/src/pages/EditListingPage.js">{errors.description}</span>}
          </div>

          <div className="form-row" data-easytag="id61-react/src/pages/EditListingPage.js">
            <div className="form-group" data-easytag="id62-react/src/pages/EditListingPage.js">
              <label htmlFor="price" data-easytag="id63-react/src/pages/EditListingPage.js">
                Price <span className="required">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className={errors.price ? 'error' : ''}
                data-easytag="id64-react/src/pages/EditListingPage.js"
              />
              {errors.price && <span className="error-message" data-easytag="id65-react/src/pages/EditListingPage.js">{errors.price}</span>}
            </div>

            <div className="form-group" data-easytag="id66-react/src/pages/EditListingPage.js">
              <label htmlFor="category" data-easytag="id67-react/src/pages/EditListingPage.js">
                Category <span className="required">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? 'error' : ''}
                data-easytag="id68-react/src/pages/EditListingPage.js"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && <span className="error-message" data-easytag="id69-react/src/pages/EditListingPage.js">{errors.category}</span>}
            </div>
          </div>

          <div className="form-group" data-easytag="id70-react/src/pages/EditListingPage.js">
            <label htmlFor="phone" data-easytag="id71-react/src/pages/EditListingPage.js">
              Phone <span className="required">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className={errors.phone ? 'error' : ''}
              data-easytag="id72-react/src/pages/EditListingPage.js"
            />
            {errors.phone && <span className="error-message" data-easytag="id73-react/src/pages/EditListingPage.js">{errors.phone}</span>}
          </div>

          <div className="form-group" data-easytag="id74-react/src/pages/EditListingPage.js">
            <ImageUpload images={images} setImages={setImages} maxImages={5} />
            {errors.images && <span className="error-message" data-easytag="id75-react/src/pages/EditListingPage.js">{errors.images}</span>}
          </div>

          <div className="form-actions" data-easytag="id76-react/src/pages/EditListingPage.js">
            <button
              type="button"
              onClick={() => navigate(`/listings/${id}`)}
              className="btn-cancel"
              data-easytag="id77-react/src/pages/EditListingPage.js"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-submit"
              data-easytag="id78-react/src/pages/EditListingPage.js"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListingPage;

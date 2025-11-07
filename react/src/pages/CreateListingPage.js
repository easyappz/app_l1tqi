import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getCategories, createListing } from '../api/listings';
import ImageUpload from '../components/ImageUpload';
import './CreateListingPage.css';

const CreateListingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    phone: user?.phone || '',
  });
  const [errors, setErrors] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (user?.phone && !formData.phone) {
      setFormData(prev => ({ ...prev, phone: user.phone }));
    }
  }, [user]);

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
      
      images.forEach((image) => {
        submitData.append('images_data', image);
      });

      const response = await createListing(submitData);
      setHasUnsavedChanges(false);
      navigate(`/listings/${response.id}`);
    } catch (error) {
      console.error('Failed to create listing:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        alert('Failed to create listing. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-listing-page" data-easytag="id14-react/src/pages/CreateListingPage.js">
      <div className="create-listing-container" data-easytag="id15-react/src/pages/CreateListingPage.js">
        <h1 data-easytag="id16-react/src/pages/CreateListingPage.js">Create New Listing</h1>
        
        <form onSubmit={handleSubmit} className="listing-form" data-easytag="id17-react/src/pages/CreateListingPage.js">
          <div className="form-group" data-easytag="id18-react/src/pages/CreateListingPage.js">
            <label htmlFor="title" data-easytag="id19-react/src/pages/CreateListingPage.js">
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
              data-easytag="id20-react/src/pages/CreateListingPage.js"
            />
            {errors.title && <span className="error-message" data-easytag="id21-react/src/pages/CreateListingPage.js">{errors.title}</span>}
            <span className="char-count" data-easytag="id22-react/src/pages/CreateListingPage.js">{formData.title.length}/200</span>
          </div>

          <div className="form-group" data-easytag="id23-react/src/pages/CreateListingPage.js">
            <label htmlFor="description" data-easytag="id24-react/src/pages/CreateListingPage.js">
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
              data-easytag="id25-react/src/pages/CreateListingPage.js"
            />
            {errors.description && <span className="error-message" data-easytag="id26-react/src/pages/CreateListingPage.js">{errors.description}</span>}
          </div>

          <div className="form-row" data-easytag="id27-react/src/pages/CreateListingPage.js">
            <div className="form-group" data-easytag="id28-react/src/pages/CreateListingPage.js">
              <label htmlFor="price" data-easytag="id29-react/src/pages/CreateListingPage.js">
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
                data-easytag="id30-react/src/pages/CreateListingPage.js"
              />
              {errors.price && <span className="error-message" data-easytag="id31-react/src/pages/CreateListingPage.js">{errors.price}</span>}
            </div>

            <div className="form-group" data-easytag="id32-react/src/pages/CreateListingPage.js">
              <label htmlFor="category" data-easytag="id33-react/src/pages/CreateListingPage.js">
                Category <span className="required">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? 'error' : ''}
                data-easytag="id34-react/src/pages/CreateListingPage.js"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && <span className="error-message" data-easytag="id35-react/src/pages/CreateListingPage.js">{errors.category}</span>}
            </div>
          </div>

          <div className="form-group" data-easytag="id36-react/src/pages/CreateListingPage.js">
            <label htmlFor="phone" data-easytag="id37-react/src/pages/CreateListingPage.js">
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
              data-easytag="id38-react/src/pages/CreateListingPage.js"
            />
            {errors.phone && <span className="error-message" data-easytag="id39-react/src/pages/CreateListingPage.js">{errors.phone}</span>}
          </div>

          <div className="form-group" data-easytag="id40-react/src/pages/CreateListingPage.js">
            <ImageUpload images={images} setImages={setImages} maxImages={5} />
            {errors.images && <span className="error-message" data-easytag="id41-react/src/pages/CreateListingPage.js">{errors.images}</span>}
          </div>

          <div className="form-actions" data-easytag="id42-react/src/pages/CreateListingPage.js">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-cancel"
              data-easytag="id43-react/src/pages/CreateListingPage.js"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-submit"
              data-easytag="id44-react/src/pages/CreateListingPage.js"
            >
              {loading ? 'Publishing...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListingPage;

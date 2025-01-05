import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Post from '../types';

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<Post | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const response = await fetch(`http://localhost:3000/posts/${id}/admin`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }
      const data = await response.json();
      setFormData(data);
    } catch (error) {
      setErrorMessage((error as Error).message);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => (prevData ? { ...prevData, [id]: value } : null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`http://localhost:3000/posts/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      navigate('/posts/admin'); // Redirect to all posts page
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Edit Post</h1>

      {errorMessage && <p className="text-center text-red-500">{errorMessage}</p>}
      {formData && (
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg"
              required
            />
          </div>

          {/* Content */}
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Content
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg"
              rows={5}
              required
            />
          </div>

          {/* Tags */}
          <div className="mb-4">
            <label htmlFor="tags" className="block text-sm font-medium mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              value={formData.tags.join(', ')}
              onChange={(e) =>
                setFormData((prevData) =>
                  prevData ? { ...prevData, tags: e.target.value.split(',').map((tag) => tag.trim()) } : null
                )
              }
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg"
            />
          </div>

          {/* Image */}
          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium mb-1">
              Image URL
            </label>
            <input
              type="text"
              id="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg"
            />
          </div>

          {/* Type */}
          <div className="mb-4">
            <label htmlFor="type" className="block text-sm font-medium mb-1">
              Type
            </label>
            <input
              type="text"
              id="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg"
              required
            />
          </div>

          {/* Visibility */}
          <div className="mb-4">
            <label htmlFor="visibility" className="block text-sm font-medium mb-1">
              Visibility
            </label>
            <select
              id="visibility"
              value={formData.visibility}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Post'}
          </button>
        </form>
      )}
    </div>
  );
};

export default EditPost;

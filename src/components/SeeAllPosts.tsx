import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Post from '../types';

const SeeAllPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch all posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/posts/admin', {
        method: 'GET',
        credentials: 'include', // Ensures cookies are sent with the request
      });
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3000/api/posts/search/admin?q=${encodeURIComponent(searchQuery)}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to search posts');
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: number) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      setPosts(posts?.filter((post) => post.id !== postId)); // Remove deleted post from state
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleEdit = (postId: number) => {
    navigate(`/edit-post/${postId}`);
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">All Posts</h1>

      <form onSubmit={handleSearch} className="mb-6">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 mb-4 bg-gray-600 text-white rounded-lg"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 gap-6">
        {posts?.map((post) => (
          <div key={post.id} className="bg-gray-700 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
            <p className="text-sm text-gray-400 mb-2">Date: {post.date}</p>
            <p className="mb-4">{post.content}</p>
            <p className="mb-4">
              <strong>Tags:</strong> {post.tags.join(', ')}
            </p>
            <p className="mb-4">
              <strong>Type:</strong> {post.type}
            </p>
            <p className="mb-4">
              <strong>Visibility:</strong> {post.visibility}
            </p>
            <button
              onClick={() => handleEdit(post.id)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-yellow-600"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(post.id)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeeAllPosts;

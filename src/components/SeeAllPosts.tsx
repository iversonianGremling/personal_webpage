import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Post from '../types';
import { apiUrl } from '../assets/env-var';
import { useAuth } from './AuthContext';

interface SeeAllPostsProps {
  admin?: boolean;
}

const SeeAllPosts: React.FC<SeeAllPostsProps> = ({ admin = false }) => {
  const [posts, setPosts] = useState<Post[]>();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { isAdmin } = useAuth();

  // Fetch all posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    console.log(`Admin: ${admin}`);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        isAdmin ? apiUrl + '/posts/admin' : apiUrl + '/posts/',
        {
          method: 'GET',
          credentials: 'include', // Ensures cookies are sent with the request
        },
      );
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
        isAdmin
          ? apiUrl + `/posts/search/admin?q=${encodeURIComponent(searchQuery)}`
          : apiUrl + `/posts/search?q=${encodeURIComponent(searchQuery)}`,
        {
          method: 'GET',
          credentials: 'include',
        },
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
      const response = await fetch(apiUrl + `/posts/${postId}`, {
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
      <h1 className="text-4xl font-bold mb-6 text-center">All my blood (click on titles to navigate to my blood)</h1>
      <button
        className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4 mb-4"
        onClick={() => navigate(-1)}
      >
        I need to go back
      </button>

      <form onSubmit={handleSearch} className="mb-6">
        <input
          type="text"
          placeholder="Search blood..."
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
        {posts?.reverse().map((post) => (
          <div key={post.id} className="bg-gray-700 p-6 rounded-lg shadow-lg">

            <Link key={post.id} to={`/posts/${isAdmin ? '/admin' : ''}${post.id}`}>
              <h2 className="text-2xl font-bold mb-2 hover:text-red-600">{post.title}</h2>
            </Link>
            <p className="text-sm text-gray-400 mb-2">Date: {post.date}</p>
            {admin &&
            <>
              <button
                onClick={() => handleEdit(post.id)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-yellow-600"
              >
                Edit Blood
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Delete Blood
              </button>
            </>
            }
            <p
              className="mb-4 line-clamp-5"
              dangerouslySetInnerHTML={{ __html: post.content }}
            ></p>
            <p className="mb-4">
              <strong>Tags:</strong> {post.tags.join(', ')}
            </p>
            <p className="mb-4">
              <strong>Type:</strong> {post.type}
            </p>
            {admin && (
              <p className="mb-4">
                <strong>Visibility:</strong> {post.visibility}
              </p>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default SeeAllPosts;

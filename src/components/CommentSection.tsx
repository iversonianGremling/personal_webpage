import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Trash } from 'lucide-react';
import { apiUrl } from '../assets/env-var';

const CommentSection = ({ postId }: { postId: number }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAdmin } = useAuth();

  const fetchComments = async () => {
    try {
      const response = await fetch(`${apiUrl}/comments/post/${postId}`);
      const data = await response.json();
      setComments(data);
      setLoading(false);
    } catch (err) {
      setError('Error loading comments');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const response = await fetch(apiUrl + '/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          postId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      const newComment = await response.json();
      setComments([newComment, ...comments]);
      setContent('');
    } catch (err) {
      setError('Failed to post comment. You may have been banned or there was a server error.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!isAdmin) return;

    try {
      const response = await fetch(`${apiUrl}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        // Include credentials to ensure the auth cookie is sent
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      // Update the comments list by removing the deleted comment
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (err) {
      setError('Failed to delete comment. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) return <div className="p-4 text-center">Loading comments...</div>;

  return (
    <div className="mt-8 bg-black p-6 rounded-lg w-full">
      <h3 className="text-xl font-bold mb-6 te">Comments</h3>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          className="w-full p-3 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          rows={3}
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <button
          type="submit"
          className="mt-2 bg-violet-600 text-white py-2 px-4 rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={!content.trim()}
        >
          Post Comment
        </button>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-300 italic">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white p-4 rounded-md shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="text-gray-500 text-sm">
                  <span>Anonymous • {formatDate(comment.createdAt)}</span>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                    title="Delete comment"
                  >
                    <Trash size={16} />
                  </button>
                )}
              </div>
              <p className="text-gray-800">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;

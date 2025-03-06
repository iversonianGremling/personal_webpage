import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiUrl } from '../assets/env-var';

const AdminCommentDashboard = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!isAdmin) return;

    const fetchAllComments = async () => {
      try {
        const response = await fetch(apiUrl + '/comments/admin');
        console.log('Response status:', response.status);
        const text = await response.text();
        console.log('Raw response:', text);

        try {
          const data = JSON.parse(text);
          console.log('Parsed data:', data);
          setComments(Array.isArray(data) ? data : []);
        } catch (parseErr) {
          console.error('JSON parse error:', parseErr);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading comments:', err);
        setError('Error loading comments');
        setLoading(false);
      }
    };

    fetchAllComments();
  }, [isAdmin]);

  const handleBanComment = async (id) => {
    try {
      await fetch(`${apiUrl}/comments/${id}/ban`, {
        method: 'POST',
      });

      setComments(comments.map(comment =>
        comment.id === id
          ? { ...comment, isBanned: true }
          : comment
      ));
    } catch (error) {
      console.error('Error banning comment:', error);
    }
  };

  const handleBanIp = async (ipAddress) => {
    try {
      await fetch(apiUrl + '/comments/ban-ip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ipAddress }),
      });

      // Mark all comments from this IP as banned in the UI
      setComments(comments.map(comment =>
        comment.ipAddress === ipAddress
          ? { ...comment, isBanned: true }
          : comment
      ));
    } catch (error) {
      console.error('Error banning IP:', error);
    }
  };

  if (!isAdmin) {
    return null; // Don't render anything if not admin
  }

  if (loading) return <div className="p-4">Loading comments dashboard...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  // Group comments by post
  const commentsByPost = {};
  if (comments && comments.length > 0) {
    comments.forEach(comment => {
      if (!commentsByPost[comment.post.id]) {
        commentsByPost[comment.post.id] = {
          post: comment.post,
          comments: []
        };
      }
      commentsByPost[comment.post.id].comments.push(comment);
    });
  }
  else {
    console.error('No comments found');
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Comment Moderation Dashboard</h2>

      {Object.keys(commentsByPost).length === 0 ? (
        <p>No comments to moderate.</p>
      ) : (
        Object.values(commentsByPost).map(({ post, comments }) => (
          <div key={post.id} className="mb-10">
            <div className="border-l-4 border-blue-500 pl-4 mb-4">
              <h3 className="text-xl font-bold">{post.title}</h3>
              <a href={`/post/${post.id}`} className="text-blue-600 hover:underline text-sm">
                View Post
              </a>
            </div>

            <div className="space-y-4 ml-4">
              {comments.map(comment => (
                <div
                  key={comment.id}
                  className={`bg-gray-50 p-4 rounded border-l-4 ${
                    comment.isBanned
                      ? 'border-red-500 opacity-50'
                      : 'border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-800 mb-2">{comment.content}</p>
                      <div className="text-xs text-gray-500">
                        <span>IP: {comment.ipAddress}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(comment.createdAt).toLocaleString()}</span>
                        {comment.isBanned && (
                          <>
                            <span className="mx-2">•</span>
                            <span className="text-red-500 font-medium">BANNED</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {!comment.isBanned && (
                        <button
                          onClick={() => handleBanComment(comment.id)}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs hover:bg-red-200"
                        >
                          Ban Comment
                        </button>
                      )}
                      <button
                        onClick={() => handleBanIp(comment.ipAddress)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                      >
                        Ban IP
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminCommentDashboard;

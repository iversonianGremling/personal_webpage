import React, { useState, useEffect } from 'react';
import { apiUrl } from '../assets/env-var';

const LikeButton = ({ postId, initialLikes }: { postId: number; initialLikes?: number }) => {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // Check if user has already liked this post
    const hasLiked = localStorage.getItem(`liked_post_${postId}`);
    if (hasLiked) {
      setLiked(true);
    }
  }, [postId]);

  const handleLike = async () => {
    if (liked) return;

    try {
      const response = await fetch(apiUrl + `/posts/${postId}/like`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to like post');
      }

      const data = await response.json();
      setLikes(data.likes);
      setLiked(true);
      localStorage.setItem(`liked_post_${postId}`, 'true');
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <div className="flex flex-row gap-4 mt-2">
      <button
        onClick={handleLike}
        disabled={liked}
        className={`flex items-center space-x-2 ${
          liked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
        }`}
        aria-label={liked ? 'Post liked' : 'Like post'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill={liked ? 'currentColor' : 'none'}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={liked ? '0' : '2'}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
          />
        </svg>
        <span>{likes}</span>
      </button>
      <div className='flex flex-row'>
        <p className='text-white'>
          {'←   careful, some things can\'t be '}
        </p>
        <p className='text-red-600 ml-1'> undone</p>
      </div>
    </div>
  );
};

export default LikeButton;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiUrl } from '../assets/env-var';
import Post from '../types';

interface PostNavigationProps {
  currentPostId: number;
  isAdmin: boolean;
  zenMode: boolean;
}

const PostNavigation: React.FC<PostNavigationProps> = ({
  currentPostId,
  isAdmin,
  zenMode
}) => {
  const [previousPost, setPreviousPost] = useState<Post | null>(null);
  const [nextPost, setNextPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const emptyPost: Post = {
    id: 0,
    title: '',
    content: '',
    tags: [],
    image: '',
    date: '',
    type: '',
    visibility: '',
    createdAt: '',
    updatedAt: '',
    views: 0,
    comments: [],
    likes: 0
  };

  // Track window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchAdjacentPosts = async () => {
      try {
        // Fetch all posts to find the previous and next ones
        const response = await fetch(
          isAdmin ? `${apiUrl}/posts/admin/` : `${apiUrl}/posts/`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        if (!response.ok) throw new Error('Failed to fetch posts');

        const posts = await response.json();

        // Sort posts by ID to ensure correct ordering
        const sortedPosts = posts.sort((a: Post, b: Post) => a.id - b.id);

        // Find the index of the current post
        const currentIndex = sortedPosts.findIndex((post: Post) => post.id === currentPostId);

        if (currentIndex > 0) {
          setPreviousPost(sortedPosts[currentIndex - 1]);
        } else {
          setPreviousPost(emptyPost);
        }

        if (currentIndex < sortedPosts.length - 1) {
          setNextPost(sortedPosts[currentIndex + 1]);
        } else {
          setNextPost(emptyPost);
        }
      } catch (error) {
        console.error('Error fetching adjacent posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdjacentPosts();
  }, [currentPostId, isAdmin]);

  if (isLoading) return <div className="my-8 animate-pulse h-10 bg-gray-700 rounded"></div>;

  if (!previousPost && !nextPost) return null;

  // Calculate how to display the title based on screen width
  const getTitleDisplay = (title: string) => {
    if (windowWidth < 400) {
      // On very small screens, just show the arrow
      return '';
    } else if (windowWidth < 640) {
      // On small screens, truncate to very short
      return title.length > 10 ? title.substring(0, 10) + '...' : title;
    } else if (windowWidth < 768) {
      // On medium screens, truncate more aggressively
      return title.length > 20 ? title.substring(0, 20) + '...' : title;
    } else {
      // On larger screens, allow longer titles but still truncate if needed
      return title.length > 40 ? title.substring(0, 40) + '...' : title;
    }
  };

  return (
    <nav className={`my-8 py-4 border-t border-b ${zenMode ? 'border-gray-800' : 'border-violet-800'}`}>
      <div className="flex justify-between items-center w-full">
        {previousPost && previousPost.id !== 0 ? (
          <Link
            to={`/posts/${previousPost.id}`}
            className={`flex items-center ${zenMode ? 'text-white hover:text-gray-300' : 'text-violet-300 hover:text-white'} transition-colors ml-4`}
            title={previousPost.title} // Show full title on hover
          >
            <span className="text-2xl mr-2">←</span>
            <span className={windowWidth < 400 ? 'sr-only' : 'max-w-xs'}>
              {getTitleDisplay(previousPost.title)}
            </span>
          </Link>
        ) : (
          <div className="ml-4"></div> // Empty div with margin to maintain layout
        )}

        {nextPost && nextPost.id !== 0 ? (
          <Link
            to={`/posts/${nextPost.id}`}
            className={`flex items-center ${zenMode ? 'text-white hover:text-gray-300' : 'text-violet-300 hover:text-white'} transition-colors mr-4`}
            title={nextPost.title} // Show full title on hover
          >
            <span className={windowWidth < 400 ? 'sr-only' : 'max-w-xs'}>
              {getTitleDisplay(nextPost.title)}
            </span>
            <span className="text-2xl ml-2">→</span>
          </Link>
        ): (
          <div className="mr-4"></div> // Empty div with margin to maintain layout
        )}
      </div>
    </nav>
  );
};

export default PostNavigation;

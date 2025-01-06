import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Post from '../types';
import NavBar from './NavBar';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState('default');
  const navigate = useNavigate();

  const loadTheme = (newTheme: string) => {
    // Remove any existing theme link tag
    const existingLink = document.getElementById('theme-stylesheet');
    if (existingLink) {
      existingLink.remove();
    }

    // Create a new link element for the new theme
    const link = document.createElement('link');
    link.id = 'theme-stylesheet';
    link.rel = 'stylesheet';
    link.href = `/styles/${newTheme}.css`; // Assumes styles are in the /styles folder
    document.head.appendChild(link);

    setTheme(newTheme); // Update theme state
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3000/posts/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const data: Post = await response.json();
        setPost(data);

        // Extract @style- tag and load corresponding theme
        const styleTag = data.tags.find((tag) => tag.startsWith('@style-'));
        if (styleTag) {
          const styleType = styleTag.replace('@style-', ''); // Remove '@style-' prefix
          loadTheme(styleType);
        } else {
          loadTheme('default'); // Fallback theme
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    window.addEventListener('popstate', () => {
      const path = window.location.pathname;
      console.log('Navigated to:', path);
      loadTheme('default');
    });

    return () => {
      window.removeEventListener('popstate', () => {});
    };
  }, []);

  if (isLoading) {
    return <div>Loading post...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="">
      {/* Top bar */}
      <NavBar />
      {/* Post content */}
      <div className="">
        <h1 className="">{post.title}</h1>
        <div className="">Date: {post.date}</div>

        {post.tags.includes('@style-markdown') ? (
        // Render Markdown if the @style-markdown tag is present
          <ReactMarkdown rehypePlugins={[rehypeSanitize]} className="prose prose-invert">
            {post.content}
          </ReactMarkdown>
        ) : (
        // Render plain HTML content if @style-markdown is not present
          <div className="">{post.content}</div>
        )}

        {post.image && <img src={post.image} alt="image" className="" />}

        <div className="mt-4">
          <button
            onClick={() => {
              navigate(-1);
              loadTheme('default'); // Reset theme on go back
            }}
          >
          Go Back
          </button>
        </div>
      </div>
    </div>
  );

};

export default PostDetail;

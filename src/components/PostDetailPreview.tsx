import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Post from '../types';
import DOMPurify from 'dompurify';

interface PostDetailProps {
  variant?: 'programming' | 'thoughts' | 'gaming' | 'pink' | 'article';
  title: string;
  content: string;
  tags: string[] | any; // Make tags type more flexible for debugging
  image: string;
  date: string;
  type: string;
  visibility: string;
  showtags?: boolean;
}

const PostDetailPreview: React.FC<PostDetailProps> = ({ variant, title, content, tags, image, date, type, visibility, showtags = false}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Debug incoming tags
  console.log("Incoming tags:", tags);
  console.log("Type of tags:", typeof tags);
  console.log("Is array:", Array.isArray(tags));
  
  // Force tags to be an array no matter what
  const safeTags = Array.isArray(tags) ? tags : [];
  
  const [post, setPost] = useState<Post | null>({
    id: 0,
    title: title || '',
    content: content || '',
    tags: [], // Always start with empty array
    image: image || '',
    date: date || Date.now().toString(),
    type: type || 'blog',
    visibility: visibility || 'public',
    createdAt: Date.now().toString(),
    updatedAt: Date.now().toString(),
    views: 0,
    comments: [],
    likes: 0
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 720);

  // Only update tags after debugging
  useEffect(() => {
    console.log("useEffect running with tags:", tags);
    console.log("Type of tags in useEffect:", typeof tags);
    console.log("Is array in useEffect:", Array.isArray(tags));
    
    const safeUpdatedTags = Array.isArray(tags) ? [...tags] : [];
    
    console.log("Safe tags created:", safeUpdatedTags);
    
    setPost(prevPost => {
      const updatedPost = {
        ...prevPost,
        title: title || '',
        content: content || '',
        tags: safeUpdatedTags,
        image: image || '',
        date: date || Date.now().toString(),
        type: type || 'blog',
        visibility: visibility || 'public',
      };
      
      console.log("Updated post:", updatedPost);
      return updatedPost;
    });
  }, [title, content, tags, image, type, visibility]);

  const createMarkup = (html: string) => {
    return {
      __html: DOMPurify.sanitize(html || '', {
        ADD_TAGS: ['iframe'],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
      }),
    };
  };

  if (isLoading) return <div className="animate-pulse space-y-4 p-6 bg-gray-800 text-white">Loading...</div>;
  if (error) return <div className="text-red-500 p-6">Error: {error}</div>;
  if (!post) return <div className="p-6">Post not found</div>;

  // Debug post state
  console.log("Current post:", post);
  console.log("post.tags:", post.tags);
  console.log("Type of post.tags:", typeof post.tags);
  console.log("Is post.tags array:", Array.isArray(post.tags));

  // Render tags safely
  const renderTags = () => {
    if (!showtags) return null;
    if (!post.tags) return null;
    if (!Array.isArray(post.tags)) return null;
    if (post.tags.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag, index) => (
          <span key={index} className="px-3 py-1 bg-violet-950 text-white text-sm">
            #{tag}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="">
      <div className="flex flex-row">
        <button
          className={`bg-violet-950 text-white ${isMobile ? 'm-2' : 'm-6'} p-6 hover:bg-red-600 transition-colors duration-300`}
        >
          Back
        </button>
        <h1
          className={`${isMobile ? 'text-4xl mr-4' : 'text-6xl'} font-bold mb-2 text-center content-center text-white`}
        >
          {post.title}
        </h1>
      </div>

      <article className="bg-violet-950 text-white px-6 mx-6 pb-6">
        <header className="mb-8 pt-2">
          {/* Safe tag rendering using separate function */}
          {renderTags()}
          
          <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
            <time>{new Date(parseInt(post.date)).toLocaleDateString()}</time>
          </div>

          {post.image && (
            <img
              src={post.image}
              alt="Featured"
              className="my-6 w-full h-64 object-cover rounded-lg"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
        </header>

        <section
          className="tiptap-content prose prose-invert max-w-none"
          dangerouslySetInnerHTML={createMarkup(post.content)}
        />
      </article>
    </div>
  );
};

export default PostDetailPreview;

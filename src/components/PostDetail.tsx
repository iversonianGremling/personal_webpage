import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Post from '../types';
import DOMPurify from 'dompurify';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3000/posts/${id}`);
        if (!response.ok) throw new Error('Post not found');
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const createMarkup = (html: string) => {
    return {
      __html: DOMPurify.sanitize(html, {
        ADD_TAGS: ['iframe'], // Allow iframes if needed
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']
      })
    };
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (isLoading) return (
    <div className="animate-pulse space-y-4 p-6 bg-gray-800 text-white">
      <div className="h-8 bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-700 rounded w-1/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
      </div>
    </div>
  );

  if (error) return <div className="text-red-500 p-6">Error: {error}</div>;
  if (!post) return <div className="p-6">Post not found</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
      >
        ← Back
      </button>

      <article className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
            <time>{formatDate(post.date)}</time>
            <span>•</span>
            <span className="capitalize">{post.type}</span>
            <span>•</span>
            <span className="text-blue-400">Visibility: {post.visibility}</span>
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

        {post.tags?.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm hover:bg-blue-500/30 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </div>
  );
};

export default PostDetail;

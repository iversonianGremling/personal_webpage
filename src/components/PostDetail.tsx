import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Post from '../types';
import DOMPurify from 'dompurify';
import NavBar from './NavBar';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/posts/${Number(id)}`);
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
    <div className="">
      <NavBar/>
      <div className='flex flex-row'>
        <button
          onClick={() => navigate(-1)}
          className="bg-violet-950 text-white m-6 p-6 hover:bg-red-600 transition-colors duration-300"
        >Back</button>
        <h1 className="text-6xl font-bold mb-2 text-center content-center text-white">{post.title}</h1>
      </div>

      <article className="bg-violet-950 text-white px-6 mx-6 pb-6">
        <header className="mb-8 pt-2">
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Link
                  key={index}
                  to={`/tag/${tag}`}
                  className="px-3 py-1 bg-violet-950 text-white text-sm hover:bg-red-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent parent link navigation
                    e.nativeEvent.stopImmediatePropagation(); // For React event bubbling
                  }}
                >
                #{tag}
                </Link>
              ))}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
            <time>{formatDate(post.date)}</time>
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

export default PostDetail;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Post from '../types';
import DOMPurify from 'dompurify';

interface PostDetailProps {
  variant?: 'programming' | 'thoughts' | 'gaming' | 'pink' | 'article';
  title: string;
  content: string;
  tags: string[];
  image: string;
  date: string;
  type: string;
  visibility: string;
}

// interface Post {
//   id: number; /////////
//   title: string;
//   content: string;
//   tags: string[];
//   image: string;
//   date: string;
//   type: string;
//   visibility: string;
//   createdAt: string; /////////
//   updatedAt: string; ////////
// }

const PostDetailPreview: React.FC<PostDetailProps> = ({ variant, title, content, tags, image, date, type, visibility }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>({
    id: 0,
    title: title,
    content: content,
    tags: tags,
    image: image,
    date: date,
    type: type,
    visibility: visibility,
    createdAt: Date.now().toString(),
    updatedAt: Date.now().toString(),
    views: 0,
    comments: [],
    likes: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 720);

  useEffect(() => {
    setPost((prevPost) => ({
      ...prevPost,
      title: title,
      content: content,
      tags: tags,
      image: image,
      date: Date.now().toString(),
      type: type,
      visibility: visibility,
    }));
    // Perform any side effect here
  }, [title, content, tags]);

  const createMarkup = (html: string) => {
    return {
      __html: DOMPurify.sanitize(html, {
        ADD_TAGS: ['iframe'], // Allow iframes if needed
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
      }),
    };
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (isLoading)
    return (
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
    <div className="" >
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
          className="tiptap-content prose prose-invert max-w-none "
          dangerouslySetInnerHTML={createMarkup(post.content)}
        />
      </article>
    </div>
  );
};

export default PostDetailPreview;

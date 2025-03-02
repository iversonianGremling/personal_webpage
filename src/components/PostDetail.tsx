import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Post from '../types';
import DOMPurify from 'dompurify';
import NavBar from './NavBar';
import Programming from './routes/Programming/Programming';
import { apiUrl } from '../assets/env-var';

interface PostDetailProps {
  variant?: 'programming' | 'thoughts' | 'gaming' | 'pink' | 'article';
}
interface HeadingItem {
  id: string;
  text: string;
  level: number;
  children: HeadingItem[];
}
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

function QualityBadge({ tags }: { tags: string[] }) {
  // Find quality tag if exists
  const qualityTag = tags.find(tag => /^q[1-5]$/.test(tag));

  if (!qualityTag) return null;

  // Extract number from qualityTag
  const rating = parseInt(qualityTag.substring(1));

  const qualitySymbols = ['Ω','∀','א','∞','⧜'];
  const qualityText = ['Masterpiece', 'Indispensable', 'Medium defining', 'Cult classic', 'Worth experiencing'];

  // Adjust index for array access (convert 1-5 to 0-4)
  const index = 5 - rating - 1;

  return (
    <div className="quality-badge">
      <span className="symbol">{qualitySymbols[index]}</span>
      <span className="text">{`- ${qualityText[index]}`}</span>
    </div>
  );
}

const TableOfContents: React.FC<{ post: Post }> = ({ post }) => {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);

  useEffect(() => {
    // Wait for content to be rendered
    setTimeout(() => {
      // Get all headings from the content
      const contentEl = document.querySelector('.tiptap-content');
      if (!contentEl) return;

      const headingEls = contentEl.querySelectorAll('h1, h2, h3, h4, h5, h6');

      // Process headings into hierarchical structure
      const headingItems: HeadingItem[] = [];
      let currentH1: HeadingItem | null = null;
      let currentH2: HeadingItem | null = null;
      let currentH3: HeadingItem | null = null;
      let currentH4: HeadingItem | null = null;
      let currentH5: HeadingItem | null = null;

      headingEls.forEach((el) => {
        // Generate ID if not present
        if (!el.id) {
          el.id = el.textContent!.toLowerCase().replace(/\s+/g, '-');
        }

        const item: HeadingItem = {
          id: el.id,
          text: el.textContent || '',
          level: parseInt(el.tagName.substring(1)),
          children: []
        };

        // Add to appropriate level in hierarchy
        switch (item.level) {
          case 1:
            currentH1 = item;
            currentH2 = null;
            currentH3 = null;
            currentH4 = null;
            currentH5 = null;
            headingItems.push(item);
            break;
          case 2:
            currentH2 = item;
            currentH3 = null;
            currentH4 = null;
            currentH5 = null;
            if (currentH1) currentH1.children.push(item);
            else headingItems.push(item);
            break;
          case 3:
            currentH3 = item;
            currentH4 = null;
            currentH5 = null;
            if (currentH2) currentH2.children.push(item);
            else if (currentH1) currentH1.children.push(item);
            else headingItems.push(item);
            break;
          case 4:
            currentH4 = item;
            currentH5 = null;
            if (currentH3) currentH3.children.push(item);
            else if (currentH2) currentH2.children.push(item);
            else if (currentH1) currentH1.children.push(item);
            else headingItems.push(item);
            break;
          case 5:
            currentH5 = item;
            if (currentH4) currentH4.children.push(item);
            else if (currentH3) currentH3.children.push(item);
            else if (currentH2) currentH2.children.push(item);
            else if (currentH1) currentH1.children.push(item);
            else headingItems.push(item);
            break;
          case 6:
            if (currentH5) currentH5.children.push(item);
            else if (currentH4) currentH4.children.push(item);
            else if (currentH3) currentH3.children.push(item);
            else if (currentH2) currentH2.children.push(item);
            else if (currentH1) currentH1.children.push(item);
            else headingItems.push(item);
            break;
        }
      });

      setHeadings(headingItems);
    }, 100);
  }, [post.content]);

  const RenderHeadings = ({ items }: { items: HeadingItem[] }) => (
    <ul className="pl-4 py-1">
      {items.map((item) => (
        <li key={item.id} className="py-1">
          <a
            href={`#${item.id}`}
            className="text-violet-300 hover:text-white hover:underline transition-colors"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(item.id)?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }}
          >
            {item.text}
          </a>
          {item.children.length > 0 && <RenderHeadings items={item.children} />}
        </li>
      ))}
    </ul>
  );

  if (headings.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-2">Table of Contents</h3>
      <RenderHeadings items={headings} />
    </div>
  );
};


const PostContent: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <>
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
    </>
  );
};

const RecommendationContent: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <div className={'flex justify-center flex-col'}>
      <header className="mb-8 pt-2">

        <QualityBadge tags={post.tags} />
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              !((tag === 'recommendation') || (tag.match(/q[1-5]/))) ? (
                (
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
                )
              ) : ''
            ))
            }
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
        className="tiptap-content prose prose-invert max-w-none text-center flex content-center items-center"
        dangerouslySetInnerHTML={createMarkup(post.content)}
      />
    </div>
  );
};

const ThoughtContent: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <>
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
        className="tiptap-content prose prose-invert max-w-none text-center"
        dangerouslySetInnerHTML={createMarkup(post.content)}
      />
    </>
  );
};

const PostDetail: React.FC<PostDetailProps> = ({ variant }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 720);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 720);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  useEffect(() => {
    console.log('History length: ', window.history.length);
    const fetchPost = async () => {
      try {
        const response = await fetch(apiUrl + `/posts/${Number(id)}`);
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
    <div className="">
      {variant !== 'programming' && <NavBar />}
      <div className="flex flex-row">
        <button
          onClick={() => window.history.length > 2 ? navigate(-1) : navigate('/')}
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
      <TableOfContents post={post} />
      <article className="bg-violet-950 text-white px-6 mx-6 pb-6">
        {(() => {
          switch(post.type) {
            case 'blog':
              return <PostContent post={post} />;
            case 'recommendation':
              return <RecommendationContent post={post} />;
            case 'thought':
              return <ThoughtContent post={post} />;
            default:
              return <PostContent post={post} />;
          }
        })()}
      </article>
    </div>
  );
};

export default PostDetail;

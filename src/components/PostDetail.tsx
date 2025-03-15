import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Post from '../types';
import DOMPurify from 'dompurify';
import NavBar from './NavBar';
import { apiUrl } from '../assets/env-var';
import ShareButton from './ShareButton';
import PatreonButton from './PatreonButton';
import { PostMetrics } from './ViewCounter';
import LikeButton from './LikeButton';
import CommentSection from './CommentSection';

interface PostDetailProps {
  variant?: 'programming' | 'thoughts' | 'gaming' | 'pink' | 'article';
  admin: boolean
}
interface HeadingItem {
  id: string;
  text: string;
  level: number;
  children: HeadingItem[];
}

interface PostWithSimilarity extends Post {
  similarTags: number;
}

const createMarkup = (html: string) => {
  return {
    __html: DOMPurify.sanitize(html, {
      ADD_TAGS: ['iframe'], // Allow iframes if needed
      ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
    }),
  };
};

const formatDate = (dateString: string, language: string) => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return 'Invalid date';
  }
};

function QualityBadge({ tags }: { tags: string[] }) {
  // Find quality tag if exists
  const qualityTag = tags.find(tag => /^q[1-5]$/.test(tag));

  if (!qualityTag) return null;

  // Extract number from qualityTag
  const rating = parseInt(qualityTag.substring(1)) - 1;

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

const TableOfContents: React.FC<{ post: Post, isMobile: boolean, zenMode: boolean }> = ({ post, isMobile, zenMode }) => {
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

  const RenderHeadings = ({
    items,
    zenMode,
    depth = 0
  }: {
  items: HeadingItem[],
  zenMode?: boolean,
  depth?: number
}) => {
  // Define prefixes based on depth
    const getPrefixByDepth = (depth: number): string => {
      switch (depth) {
        case 0:
          return '● '; // Bullet for top level
        case 1:
          return '○ '; // Circle for second level
        case 2:
          return '► '; // Triangle for third level
        case 3:
          return '▷ '; // Open triangle for fourth level
        default:
          return '- '; // Default for deeper levels
      }
    };

    return (
      <ul className="pl-4 py-1">
        {items.map((item) => (
          <li key={item.id} className="py-1">
            <a
              href="#"  // Use a placeholder href
              className={`${zenMode ? 'text-white bg-black' : 'text-violet-600 '}hover:underline transition-colors `}
              onClick={(e) => {
                e.preventDefault();  // Prevent default anchor behavior

                const element = document.getElementById(item.id);
                if (element) {
                  const navbarHeight = 100;
                  const elementPosition = element.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

                  window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                  });
                }
              }}
            >
              <div className={` ${zenMode ? 'text-white bg-black' : 'text-white bg-violet-600'} p-2 rounded-lg`}>
                {getPrefixByDepth(depth) + item.text}
              </div>
            </a>
            {item.children.length > 0 &&
            <RenderHeadings
              items={item.children}
              zenMode={zenMode}
              depth={depth + 1}
            />
            }
          </li>
        ))}
      </ul>
    );
  };

  if (headings.length === 0) return null;

  return (
    <div className={`mb-6 mr-4 bg-black  ${zenMode ? '' : 'border border-white'} p-4 pl-6 min-w-60 h-auto`}>
      <div className={`${zenMode ? 'text-white' : 'text-violet-500'} text-violet-500 text-xl`}>Table of Contents (clickable)</div>
      <div className="overflow-y-scroll max-h-64">
        <RenderHeadings items={headings} zenMode={zenMode}/>
      </div>
    </div>
  );
};

const SimilarPosts: React.FC<{ post: Post, zenMode: boolean, isAdmin: boolean }> = ({ post, zenMode, isAdmin }) => {
  const [posts, setPosts] = useState<PostWithSimilarity[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(isAdmin ? `${apiUrl}/posts/admin/` : `${apiUrl}/posts/`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();

        // Filter out current post and calculate tag similarity
        const postsWithSimilarity = data
          .filter((p: Post) => p.id !== post.id)
          .map((p: Post) => {
            // Count matching tags
            const commonTags = p.tags.filter(tag => post.tags.includes(tag));
            return {
              ...p,
              similarTags: commonTags.length
            };
          })
          // Only keep posts with at least 2 common tags
          .filter((p: PostWithSimilarity) => p.similarTags >= 2)
          // Sort by similarity score (posts with 3+ tags first)
          .sort((a: PostWithSimilarity, b: PostWithSimilarity) => b.similarTags - a.similarTags);

        setPosts(postsWithSimilarity);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [post]);

  return (
    <div className={`mb-6 mr-4 bg-black  ${zenMode ? '' : 'border border-white'} p-4 pl-6 min-w-56 h-auto`}>
      <div className={`${zenMode ? 'text-white' : 'text-violet-500'} text-violet-500 text-xl`}>Similar Posts</div>
      {posts.length > 0 ? (
        <ul className="pl-4 py-1">
          {posts.map((p) => (
            <li key={p.id} className="py-1">
              <Link
                to={`/posts/${p.id}`}
                className="text-violet-300 hover:text-white hover:underline transition-colors"
              >
                {'- ' + p.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No similar posts found.</p>
      )}
    </div>
  );
};

const PostContent: React.FC<{ post: Post, isMobile: boolean, zenMode: boolean }> = ({ post, isMobile, zenMode }) => {
  const { i18n } = useTranslation();
  return (
    <>
      <header className="mb-8 pt-2">
        <div className='flex justify-between'>
          <div>
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Link
                    key={index}
                    to={`/tag/${tag}`}
                    className={`px-3 py-1 ${zenMode ? 'bg-black' : 'bg-violet-950'} text-white text-sm hover:bg-red-600 transition-colors`}
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
              <time>{formatDate(post.date, i18n.language)}</time>
            </div>
          </div>
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
        className="tiptap-content prose prose-invert max-w-none justify-center"
        dangerouslySetInnerHTML={createMarkup(post.content)}
      />
    </>
  );
};

const RecommendationContent: React.FC<{ post: Post, zenMode: boolean }> = ({ post, zenMode }) => {
  const { i18n } = useTranslation();
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
                    className={`px-3 py-1 ${zenMode ? 'bg-black' : 'bg-violet-950'} text-white text-sm hover:bg-red-600 transition-colors`}
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
          <time>{formatDate(post.date, i18n.language)}</time>
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

const ThoughtContent: React.FC<{ post: Post, zenMode: boolean }> = ({ post, zenMode }) => {
  const { i18n } = useTranslation();
  return (
    <>
      <header className="mb-8 pt-2">
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <Link
                key={index}
                to={`/tag/${tag}`}
                className={`px-3 py-1 ${zenMode ? 'bg-black' : 'bg-violet-950'}text-white text-sm hover:bg-red-600 transition-colors`}
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
          <time>{formatDate(post.date, i18n.language)}</time>
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

const PostDetail: React.FC<PostDetailProps> = ({ variant, admin }) => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 720);
  const [zenMode, setZenMode] = useState(false);

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
        const response = await fetch(
          admin ? `${apiUrl}/posts/admin/${id}` : `${apiUrl}/posts/${id}`
          , {
            method: 'GET',
            credentials: 'include',
          });
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

  const handleDelete = async (postId: number) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const response = await fetch(apiUrl + `/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleEdit = (postId: number) => {
    navigate(`/edit-post/${postId}`);
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
    <div className="">
      {variant !== 'programming' && <NavBar />}
      <div className="flex flex-row">
        <button
          onClick={() => window.history.length > 2 ? navigate(-1) : navigate('/')}
          className={`${zenMode ? 'bg-black' : 'bg-violet-950'} text-white m-6 p-6 hover:bg-red-600 transition-colors duration-300`}
        >
          {t('general.back')}
        </button>
        <div className='flex flex-row w-full justify-between'>
          <h1
            className={`${isMobile ? 'text-4xl mr-4' : 'text-6xl'} font-bold mb-2 text-center content-center text-white`}
          >
            {post.title}
          </h1>
          {admin &&
          <div className='mt-12' style={{ marginRight: '22rem'}}>
            <button
              onClick={() => handleEdit(post.id)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-yellow-600"
            >
                Edit Blood
            </button>
            <button
              onClick={() => handleDelete(post.id)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
                Delete Blood
            </button>
          </div>
          }
        </div>

      </div>
      {isMobile && <div className='flex flex-col top-24 self-start mx-7 mb-5'>

        <button className={`bg-black text-white p-6 mr-4 hover:bg-red-600 transition-colors duration-300 ${zenMode ? '' : 'border border-white'} mb-4`} onClick={() => setZenMode(!zenMode)}>Zen Mode (click for eye friendly colors)</button>
        <TableOfContents post={post} isMobile={isMobile} zenMode={zenMode} />
        <SimilarPosts post={post} zenMode={zenMode} isAdmin={admin} />
        <div className ='flex flex-row justify-center gap-4'>
          <ShareButton post={post} />
          <PatreonButton
            username="velavelucci"
            showSupportsCount={true}
            animated={true}
            size="md"
            variant="primary"
          />
        </div>

      </div>
      }
      <div className='flex flex-row'>
        <article className={`${zenMode ? 'bg-black' : 'bg-violet-950'} text-white px-6 mx-6 pb-6`}>
          {(() => {
            switch(post.type) {
              case 'blog':
                return <PostContent post={post} isMobile={isMobile} zenMode={zenMode} />;
              case 'recommendation':
                return <RecommendationContent post={post} zenMode={zenMode} />;
              case 'thought':
                return <ThoughtContent post={post} zenMode={zenMode} />;
              default:
                return <PostContent post={post} isMobile={isMobile} zenMode={zenMode} />;
            }
          })()}
          {isMobile || zenMode &&
            <div className='flex flex-col sticky top-24 self-start ml-2'>
              <div className='flex flex-row justify-center gap-4'>
                <ShareButton className='' post={post} />
                <PatreonButton
                  username="velavelucci"
                  showSupportsCount={true}
                  animated={true}
                  size="md"
                  variant="primary"
                  label="Support"
                />
              </div>
            </div>
          }
          <PostMetrics post={post} />
          <LikeButton postId={post.id} initialLikes={post.likes} />
          <CommentSection postId={post.id} />
        </article>
        {!isMobile && <div className='flex flex-col sticky top-24 self-start ml-2'>
          <button className={`bg-black text-white p-6 mr-4 hover:bg-red-600 transition-colors duration-300 ${zenMode ? '' : 'border border-white'} mb-4`} onClick={() => setZenMode(!zenMode)}>Zen Mode (click for eye friendly colors)</button>
          <TableOfContents post={post} isMobile={isMobile} zenMode={zenMode} />
          <SimilarPosts post={post} zenMode={zenMode} isAdmin={admin} />
          <div className='flex flex-row justify-center gap-4'>
            {!zenMode ?
              (<>
                <ShareButton className='' post={post} />
                <PatreonButton
                  username="velavelucci"
                  showSupportsCount={true}
                  animated={true}
                  size="md"
                  variant="primary"
                  label="Support"
                />
              </>
              ) : <div className='text-white'>
                Share and patreon buttons are at the bottom of the post
              </div>
            }
          </div>
        </div>
        }
      </div>
    </div>
  );
};

export default PostDetail;

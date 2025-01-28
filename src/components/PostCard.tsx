import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sanitizeHTML } from '../utils/contentUtils';
import clsx from 'clsx';

type PostCardVariant =
  | 'default' | 'latest' | 'pink' | 'fiction'
  | 'nonFiction' | 'poetry' | 'gaming'
  | 'minimal' | 'programming' | 'magazine'
  | 'philosophy';

interface Props {
  id: number;
  title: string;
  content: string;
  tags: string[];
  date: string;
  type: string;
  variant?: PostCardVariant;
  basePath?: string;
  index?: number;
  className?: string;
  image?: string;
}

const PostCard: React.FC<Props> = ({
  id,
  title,
  content,
  tags,
  date,
  type,
  variant = 'default',
  basePath = '/posts',
  index,
  className,
  image,
}) => {
  const navigate = useNavigate();

  // Date formatting utilities
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).format(date);
    } catch {
      return 'Invalid date';
    }
  };

  // Content sanitization
  const sanitizedContent = sanitizeHTML(content);

  // Style calculations
  const magazineStyle = variant === 'magazine' ? {
    backgroundColor: index! % 2 === 0 ? '#d0d0d0' : '#c0c0c0',
    transform: `rotate(${Math.random() * 8 - 4}deg)`,
    width: `${70 + (index || 0) * 5}%`,
    border: '4px solid black',
    padding: '20px',
    boxShadow: '8px 8px 0px rgba(0, 0, 0, 0.8)',
    display: 'flex',
  } : {
    display: 'flex',
    gap: '1rem',
  };

  // Container classes
  const containerClasses = clsx(
    'transition-all duration-300',
    {
      // Variant-specific classes
      'default': 'bg-violet-950 text-white hover:bg-yellow-300 py-6 pr-72 mb-3 hover:text-black cursor-pointer',
      'latest': 'bg-opacity-80 hover:bg-opacity-90 bg-violet-950 rounded-lg p-4 mb-4 hover:scale-[1.02]',
      'pink': 'bg-pink-500/70 border-3 border-pink-500 hover:border-pink-600 shadow-[4px_4px_10px_rgba(255,20,147,0.8)] hover:shadow-pink-600/50 p-6 rounded-lg',
      'fiction': 'bg-transparent text-white hover:bg-white/10 p-4 rounded-lg',
      'nonFiction': 'bg-amber-50 text-stone-800 p-6 rounded-lg shadow-lg',
      'poetry': 'bg-indigo-900/80 text-purple-100 p-6 italic text-center',
      'gaming': 'hover:text-red-500 list-item',
      'minimal': 'bg-transparent p-0',
      'programming': 'text-blue-600 hover:underline',
      'magazine': 'article-box relative z-10 hover:z-20',
      'philosophy': ''
    }[variant],
    className
  );

  // Title classes
  const titleClasses = clsx({
    'default': 'text-3xl font-semibold mb-2',
    'latest': 'text-2xl font-bold',
    'pink': 'text-2xl font-bold text-shadow-[2px_2px_#ff00ff]',
    'fiction': 'text-xl',
    'nonFiction': 'text-2xl font-bold mb-4 border-b-2 border-amber-300',
    'poetry': 'text-3xl font-light mb-6',
    'gaming': '',
    'minimal': 'text-3xl font-semibold text-white',
    'programming': '',
    'magazine': 'text-4xl font-black mb-4 uppercase',
    'philosophy': 'text-3xl font-semibold'
  }[variant]);

  // Content classes
  const contentClasses = clsx({
    'default': 'text-md line-clamp-3 prose prose-invert max-w-none',
    'latest': 'text-sm line-clamp-2',
    'pink': 'text-gray-300',
    'fiction': '',
    'nonFiction': 'text-stone-600 leading-relaxed',
    'poetry': 'text-xl leading-loose',
    'gaming': '',
    'minimal': 'text-gray-400',
    'programming': '',
    'magazine': 'text-lg leading-tight mb-4',
    'philosophy': ''
  }[variant]);

  // Metadata classes
  const metaClasses = clsx({
    'default': 'text-sm opacity-80',
    'latest': 'text-xs',
    'pink': '',
    'fiction': 'text-xs',
    'nonFiction': 'text-sm opacity-75',
    'poetry': 'text-sm opacity-75 font-mono',
    'gaming': '',
    'minimal': '',
    'programming': '',
    'magazine': 'text-sm font-mono opacity-75',
    'philosophy': ''
  }[variant]);

  // Render content based on variant
  const renderContent = () => {
    if (variant === 'poetry') {
      return (
        <Link to={`${basePath}/${id}`} >
          <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        </Link>
      );
    }
    else  (
      <Link to={`${basePath}/${id}`}>
        <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      </Link>
    );
  };

  // Render navigation element
  const renderNavigationWrapper = (children: React.ReactNode) => {
    if (variant === 'gaming') {
      return (
        <li style={{ cursor: 'pointer' }}>
          <Link
            to={`${basePath}/${id}`}
            className="block"
            style={{ color: '#00ff00' }}>
            {children}
          </Link>
        </li>
      );
    }

    if (variant === 'programming') {
      return (
        <Link
          to={`${basePath}/${id}`}
          className="block"
          style={{ fontFamily: 'VT323' }}
        >
          {children}
        </Link>
      );
    }

    if (variant === 'pink') {
      return (
        <Link
          to={`${basePath}/${id}`}
          className="block"
          style={{ fontFamily: 'VT323' }}
        >
          {children}
        </Link>
      );
    }

    return children;
  };

  const onClickArticle = (e) => {
    if (!(e.target as HTMLElement).closest('a[href^="/tag/"]')) {
      navigate(`${basePath}/${id}`);
    }
    return variant === 'default' ? () => navigate(`${basePath}/${id}`) : undefined;
  };

  return renderNavigationWrapper(
    <Link to={`${basePath}/${id}`}>
      <article
        onClick={onClickArticle}
        className={containerClasses}
        style={{...magazineStyle}}
        data-index={index}
      >
        {/* Date section for default variant */}
        {variant === 'default' && (
          <div className="date-section flex flex-col ml-6 my-4 text-center">
            <span className="text-6xl">{formatDate(date).split(' ')[0]}</span>
            <span className="text-xl">{formatDate(date).split(' ')[1]}</span>
            <span className="text-xl">{formatDate(date).split(' ')[2]}</span>
          </div>
        )}

        <div className="content-section flex-1">
          {/* Title with variant-specific decorations */}
          <h2 className={titleClasses} style={{textAlign: 'left'}}>
            {variant === 'pink' ? `✨ ${title} ✨` : title}
          </h2>

          {/* Tags display */}
          {tags.length > 0 && (
            <div className={clsx('tags flex flex-wrap gap-2', {
              'mt-3 mb-4': variant === 'default',
              'mb-2': variant === 'latest',
              'mb-1': variant === 'fiction',
            })}>
              {tags.map((tag, i) => (
                <Link key={i} to={`/tag/${tag}`}>
                  <span
                    key={i}
                    className={clsx('rounded-full px-3 py-1 border-2', {
                      'border-black bg-white/10 hover:bg-red-600': variant === 'default',
                      'border-white/30 bg-white/5 hover:bg-white/20': variant === 'latest',
                      'border-white/20': variant === 'fiction',
                      'border-0 rounded-none': variant === 'philosophy'
                    })}
                  >
                    {tag}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* Main content */}
          <div className={contentClasses} style={{textAlign: 'left'}} dangerouslySetInnerHTML={{ __html: sanitizeHTML(content) }}/>

          {/* Metadata footer */}

          <div className={metaClasses} style={{textAlign: 'left'}}>
            {variant === 'latest' ? (
              <>
                <span>{formatDate(date)}</span> |
                <span>{type}</span> |
                <span>{tags.join(', ')}</span>
              </>
            ) : (
              <>
                <span>{formatDate(date)}</span>
                {variant !== 'fiction' && <span> | {type}</span>}
                {tags.length > 0 && <span> | {tags.join(', ')}</span>}
              </>
            )}
          </div>

        </div>
      </article>
    </Link>
  );
};

export default PostCard;

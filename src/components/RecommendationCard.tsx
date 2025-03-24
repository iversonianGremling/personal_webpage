import React, { useEffect, useState, useRef } from 'react';
import Post from '../types';
import { apiUrl } from '../assets/env-var';

// Updated RecommendationCard component
interface RecommendationCardProps {
  post: Post;
  quality: number;
  tagCounts: Record<string, number>;
  onTagClick: (tag: string) => void;
  onShowSimilar: (postId: string) => void;
};

const qualitySymbols = ['Ω', '∀', 'א', '∞', '⧜', '✓'];

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  post,
  quality,
  tagCounts,
  onTagClick,
  onShowSimilar
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [wasClicked, setWasClicked] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [fontSize, setFontSize] = useState('1rem');
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if device is mobile or tablet
  useEffect(() => {
    const checkDevice = () => {
      setIsMobileOrTablet(window.innerWidth <= 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  // Helper function to check if a URL is external
  const isExternalUrl = (url: string): boolean => {
    if (!url) return false;

    try {
      // Check if the URL is absolute (has protocol)
      if (!/^https?:\/\//i.test(url)) return false;

      // Get the current domain
      const currentDomain = window.location.hostname;

      // Create a URL object to extract the hostname
      const urlObj = new URL(url);

      // Check if the URL's hostname is different from the current domain
      return urlObj.hostname !== currentDomain;
    } catch (error) {
      console.error('Error checking if URL is external:', error);
      return false;
    }
  };

  // Function to proxy external image URLs
  const getProxiedImageUrl = (url: string): string => {
    if (!url) return '';

    if (isExternalUrl(url)) {
      // Encode the URL to be used as a query parameter
      const encodedUrl = encodeURIComponent(url);
      return `${apiUrl}/proxy/image?url=${encodedUrl}`;
    }

    return url;
  };

  // Extract the first image, description, and link from the post content
  function extractContentElements() {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(post.content, 'text/html');

    const firstImage = htmlDoc.querySelector('img');
    const rawImageSrc = firstImage ? firstImage.src : '';

    // Proxy the image URL if it's external
    const imageSrc = getProxiedImageUrl(rawImageSrc);

    // Get the first paragraph as description
    const paragraphs = htmlDoc.querySelectorAll('p');
    let description = '';
    if (paragraphs.length > 0) {
      description = paragraphs[0].textContent || '';
    }

    // Get the first link
    const firstLink = htmlDoc.querySelector('a');
    const linkUrl = firstLink ? firstLink.href : '';
    const linkText = firstLink ? firstLink.textContent || 'Read More' : '';

    return { imageSrc, description, linkUrl, linkText };
  }

  // Extract content elements after defining the required functions
  const { imageSrc, description, linkUrl, linkText } = extractContentElements();

  // Dynamically adjust font size based on container and text
  useEffect(() => {
    if (!descriptionRef.current || !containerRef.current || !isHovered) return;

    // Function to check if text fits within container
    const adjustFontSize = () => {
      const container = containerRef.current;
      const paragraph = descriptionRef.current;
      
      if (!container || !paragraph) return;
      
      // Get container dimensions, accounting for padding and the button if present
      const containerHeight = container.clientHeight;
      const buttonHeight = linkUrl ? 48 : 0; // Approximate height of button + margin
      const availableHeight = containerHeight - buttonHeight - 40; // 40px for padding
      
      // Set a fixed size for better readability - START with at least 1rem
      let testSize = 1;
      const minSize = 0.9; // Higher minimum font size
      const decrementAmount = 0.05; // How much to reduce each step
      
      // Set initial font size
      paragraph.style.fontSize = `${testSize}rem`;
      
      // Only reduce font size if absolutely necessary
      if (paragraph.scrollHeight > availableHeight) {
        // Reduce font size until content fits or we reach minimum size
        while (
          paragraph.scrollHeight > availableHeight && 
          testSize > minSize
        ) {
          testSize -= decrementAmount;
          paragraph.style.fontSize = `${testSize}rem`;
        }
      }
      
      // Store the final size
      setFontSize(`${testSize}rem`);
    };
    
    // Adjust font size initially and on window resize
    adjustFontSize();
    const handleResize = () => adjustFontSize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isHovered, linkUrl, description]);

  // Get description style with the dynamically calculated font size
  const getDescriptionStyle = (): React.CSSProperties => {
    return {
      margin: '0',
      textAlign: 'center',
      color: '#000',
      fontWeight: 'bold',
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 8,
      maxHeight: '250px',
      fontSize: fontSize || '1rem', // Ensure a reasonable default
      lineHeight: '1.5', // Improved line height for readability
      transition: 'font-size 0.2s ease'
    };
  };

  // Sort the tags by usage count (highest first)
  const sortedTags = [...post.tags]
    .filter(tag => !tag.match(/^q[0-5]$/)) // Remove quality tags
    .sort((a, b) => (tagCounts[b] || 0) - (tagCounts[a] || 0));

  // Handle card clicks for mobile/tablet
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent propagation for tag elements and the show similar button
    if ((e.target as HTMLElement).closest('.tag-item') ||
        (e.target as HTMLElement).closest('.show-similar-btn')) {
      return;
    }
    // Prevent handling if clicking on the link
    if ((e.target as HTMLElement).closest('a')) {
      return;
    }
    if (isMobileOrTablet) {
      if (!wasClicked) {
        // First click - show hover effect
        setWasClicked(true);
        setIsHovered(true);
      } else if (!showTags) {
        // Second click - show tags
        setShowTags(true);
      } else {
        // Third click - reset
        setWasClicked(false);
        setIsHovered(false);
        setShowTags(false);
      }
    } else {
      // For desktop, toggle tags view
      setShowTags(!showTags);
    }
  };

  // Reset clicked state when mouse leaves
  const handleMouseLeave = () => {
    if (!showTags) {
      setIsHovered(false);
      setWasClicked(false);
    }
  };

  return (
    <div
      className="recommendation-card karrik-regular-text"
      onClick={handleCardClick}
      style={{
        position: 'relative',
        height: '100%',
        width: '100%'
      }}
    >
      <div
        className="image-container"
        onMouseEnter={() => !isMobileOrTablet && setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'relative',
          overflow: 'hidden',
          aspectRatio: '1/1',
          width: '100%',
          height: '100%',
          transition: 'transform 0.3s ease',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)'
        }}
      >
        <h2
          className="title bold text-3xl text-black"
          style={{
            display: 'flex',
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            padding: '1rem',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            textTransform: 'uppercase',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            margin: '0',
            zIndex: 2,
            transition: 'opacity 0.3s ease',
            opacity: (isHovered && !showTags) ? 0 : 1
          }}
        >
          { post.title + ' ' + qualitySymbols[5 - quality]}
        </h2>
        <img
          src={imageSrc}
          alt={post.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'filter 0.3s ease',
            filter: isHovered ? 'brightness(0.7)' : 'brightness(1)'
          }}
        />

        {/* Description and link overlay (visible on hover) */}
        {!showTags && (
          <div
            ref={containerRef}
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              background: isHovered ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
              pointerEvents: isHovered ? 'auto' : 'none',
              zIndex: 3,
              overflowY: 'auto',
              boxSizing: 'border-box'
            }}
          >
            <p
              ref={descriptionRef}
              className="description"
              style={getDescriptionStyle()}
            >
              {description}
            </p>
            {/* Optional link button */}
            {linkUrl && (
              <a
                href={linkUrl}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isMobileOrTablet && !wasClicked) {
                    e.preventDefault();
                  }
                }}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#000',
                  color: '#fff',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  border: '2px solid #000',
                  display: 'inline-block',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff';
                  e.currentTarget.style.color = '#000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#000';
                  e.currentTarget.style.color = '#fff';
                }}
              >
                {linkText}
              </a>
            )}
          </div>
        )}
        {/* Tags overlay (visible when showTags is true) */}
        {showTags && (
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              display: 'flex',
              margin: '2',
              flexDirection: 'column',
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.95)',
              zIndex: 4,
              overflow: 'auto'
            }}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold">TAGS</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTags(false);
                }}
                className="text-lg font-bold"
              >
                ×
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {sortedTags.map((tag) => ( tag !== 'recommendation' &&
                <div
                  key={tag}
                  className="tag-item px-2 py-1 border-2 border-black bg-white text-black hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTagClick(tag);
                  }}
                >
                  {formatTagName(tag)} {tagCounts[tag] ? `(${tagCounts[tag]})` : ''}
                </div>
              ))}
            </div>
            <button
              className="show-similar-btn mt-auto px-3 py-2 border-2 border-black bg-black text-white hover:bg-gray-800"
              onClick={(e) => {
                e.stopPropagation();
                onShowSimilar(post.id.toString());
              }}
            >
              Similar Recommendations
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Add this function at the bottom of your file before the export
const formatTagName = (tag: string) => {
  if (tag.startsWith('author:') || tag.startsWith('country:') || tag.startsWith('year:')) {
    return tag.split(':')[1].trim();
  }
  return tag;
};

export default RecommendationCard;

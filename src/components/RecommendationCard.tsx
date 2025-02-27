import React, { useState, useEffect } from 'react';
import Post from '../types';
import '../assets/styles/recommendation-card.css';

interface RecommendationCardProps {
  post: Post;
  quality: number;
}

const qualitySymbols = ['Ω','∀','א','∞','⧜'];
const RecommendationCard: React.FC<RecommendationCardProps> = ({ post, quality }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [wasClicked, setWasClicked] = useState(false);

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

  // Extract the first image, description, and link from the post content
  const extractContentElements = () => {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(post.content, 'text/html');

    const firstImage = htmlDoc.querySelector('img');
    const imageSrc = firstImage ? firstImage.src : '';

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
  };

  // Add this function in your component
  const getDescriptionStyle = () => {
  // Define the style with React.CSSProperties type
    const style: React.CSSProperties = {
      margin: '0',
      textAlign: 'center', // 'center' is a valid value for textAlign
      color: '#000',
      fontWeight: 'bold',
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
    };

    // Conditionally set fontSize
    if (description.length > 200) {
      style.fontSize = '0.75rem';
    } else if (description.length > 150) {
      style.fontSize = '0.825rem';
    } else if (description.length > 100) {
      style.fontSize = '1rem';
    } else {
      style.fontSize = '1.2rem';
    }

    return style;
  };

  const { imageSrc, description, linkUrl, linkText } = extractContentElements();

  // Handle card clicks for mobile/tablet
  const handleCardClick = () => {
    if (isMobileOrTablet) {
      if (!wasClicked) {
        // First click - show hover effect
        setWasClicked(true);
        setIsHovered(true);
      } else {
        // Second click - navigate to link if exists, otherwise toggle back
        if (linkUrl) {
          window.location.href = linkUrl;
        } else {
          // If no link, toggle back to non-hover state
          setWasClicked(false);
          setIsHovered(false);
        }
      }
    }
  };

  // Reset clicked state when mouse leaves
  const handleMouseLeave = () => {
    setIsHovered(false);
    setWasClicked(false);
  };

  return (
    <div
      className="recommendation-card karrik-regular-text"
      onClick={handleCardClick}
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
            textTransform: 'uppercase',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            margin: '0',
            zIndex: 2,
            transition: 'opacity 0.3s ease',
            opacity: isHovered ? 0 : 1
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
        <div
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
            background: isHovered ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: isHovered ? 'auto' : 'none',
            zIndex: 3
          }}
        >
          <p
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
                if (isMobileOrTablet && !wasClicked) {
                  e.preventDefault();
                  e.stopPropagation();
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
      </div>
    </div>
  );
};

export default RecommendationCard;

import React, { useState } from 'react';
import {
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaReddit,
  FaWhatsapp,
  FaTelegram,
  FaEnvelope,
  FaShare,
  FaLink
} from 'react-icons/fa';

interface ShareButtonProps {
  post: {
    id: number;
    title: string;
    summary?: string;
    slug?: string;
  };
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ post, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Get the current URL or construct it from post data
  const currentUrl = typeof window !== 'undefined'
    ? window.location.href
    : `${post.slug || post.id}`;

  const title = encodeURIComponent(post.title);
  const url = encodeURIComponent(currentUrl);
  const summary = encodeURIComponent(post.summary || '');

  const shareLinks = [
    {
      name: 'X (Twitter)',
      icon: <FaTwitter />,
      url: `https://twitter.com/intent/tweet?text=${title}&url=${url}`
    },
    {
      name: 'Facebook',
      icon: <FaFacebook />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${url}`
    },
    {
      name: 'LinkedIn',
      icon: <FaLinkedin />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    },
    {
      name: 'Reddit',
      icon: <FaReddit />,
      url: `https://www.reddit.com/submit?url=${url}&title=${title}`
    },
    {
      name: 'WhatsApp',
      icon: <FaWhatsapp />,
      url: `https://api.whatsapp.com/send?text=${title}%20${url}`
    },
    {
      name: 'Telegram',
      icon: <FaTelegram />,
      url: `https://t.me/share/url?url=${url}&text=${title}`
    },
    {
      name: 'Email',
      icon: <FaEnvelope />,
      url: `mailto:?subject=${title}&body=${summary}%0A%0A${url}`
    },
    {
      name: 'Copy Link',
      icon: <FaLink />,
      url: '#',
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(currentUrl);
        alert('Link copied to clipboard!');
      }
    }
  ];

  const handleShare = async () => {
    // Use Web Share API if available (mobile devices)
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.summary,
          url: currentUrl
        });
        return;
      } catch (err) {
        console.error(`Error sharing: ${err}`);
        // Fallback to dropdown if share is canceled or fails
      }
    }

    // Toggle dropdown if Web Share API not available or failed
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleShare}
        className="flex items-center gap-2 bg-violet-800 hover:bg-violet-700 text-white rounded-full px-4 py-2 transition-colors duration-300"
        aria-label="Share post"
      >
        <FaShare className="text-sm" />
        <span className="text-sm">Share</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-violet-900 rounded-lg shadow-lg z-50 w-48 overflow-hidden">
          {shareLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              onClick={link.onClick || ((e) => { e.preventDefault(); if (!link.onClick) window.open(link.url, '_blank', 'noopener,noreferrer'); })}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 hover:bg-violet-800 text-white transition-colors"
            >
              <span className="text-lg">{link.icon}</span>
              <span className="text-sm">{link.name}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShareButton;

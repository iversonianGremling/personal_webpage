import React, { useState } from 'react';
import { Share2, Link as LinkIcon, Twitter, Facebook } from 'lucide-react';

interface ShareButtonProps {
  post: {
    title: string;
    id: string | number;
  };
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ post, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate the current URL for sharing
  const currentUrl = `${window.location.origin}/post/${post.id}`;

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: <LinkIcon size={18} />,
      action: () => {
        navigator.clipboard.writeText(currentUrl)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          })
          .catch(err => console.error('Failed to copy: ', err));
      }
    },
    {
      name: 'Twitter',
      icon: <Twitter size={18} />,
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(currentUrl)}`, '_blank');
      }
    },
    {
      name: 'Facebook',
      icon: <Facebook size={18} />,
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
      }
    }
  ];

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-violet-800 text-white hover:bg-violet-700 transition-colors rounded"
        aria-label="Share this post"
      >
        <Share2 size={18} />
        <span>Share</span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {shareOptions.map((option, index) => (
              <button
                key={index}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-white hover:bg-violet-700 transition-colors"
                onClick={() => {
                  option.action();
                  setIsOpen(false);
                }}
                role="menuitem"
              >
                {option.icon}
                <span>{option.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {copied && (
        <div className="fixed bottom-6 right-6 bg-violet-900 text-white px-4 py-2 rounded shadow-lg">
          Link copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default ShareButton;

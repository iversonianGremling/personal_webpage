import React, { useState, useEffect } from 'react';
import { FaPatreon } from 'react-icons/fa';

interface PatreonButtonProps {
  username: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'outline' | 'ghost';
  showSupportsCount?: boolean;
  animated?: boolean;
  label?: string;
}

const PatreonButton: React.FC<PatreonButtonProps> = ({
  username,
  className = '',
  size = 'md',
  variant = 'primary',
  showSupportsCount = false,
  animated = true,
  label = 'Support on Patreon'
}) => {
  const [supporterCount, setSupporterCount] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const patreonUrl = `https://www.patreon.com/${username}`;

  useEffect(() => {
    // Only fetch supporter count if showSupportsCount is true
    if (showSupportsCount) {
      // This is a mock fetch - in a real implementation you would use Patreon's API
      // or a server endpoint that provides this data
      const fetchSupporterCount = async () => {
        try {
          // Replace with actual API call to your backend or Patreon API
          // const response = await fetch(`/api/patreon-stats/${username}`);
          // const data = await response.json();
          // setSupporterCount(data.supporterCount);

          // Mock data for demonstration
          setTimeout(() => {
            setSupporterCount(Math.floor(Math.random() * 500) + 50);
          }, 500);
        } catch (error) {
          console.error('Failed to fetch Patreon supporter count:', error);
        }
      };

      fetchSupporterCount();
    }
  }, [username, showSupportsCount]);

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: 'bg-rgb(255,66,77) hover:bg-[#FF424D] text-white shadow-md',
    outline: 'bg-transparent border-2 border-[#FF424D] text-[#FF424D] hover:bg-[#FF424D] hover:text-white',
    ghost: 'bg-transparent text-[#FF424D] hover:bg-[#FF424D]/10'
  };

  const animationClasses = animated
    ? 'transform transition-transform duration-300 hover:scale-105'
    : '';

  return (
    <div className="inline-flex flex-col items-center">
      <a
        href={patreonUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`
          inline-flex items-center gap-2 font-medium rounded-md transition-colors duration-300 p-5 mr-4
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${animationClasses}
          ${className}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={label}
      >
        <FaPatreon
          className={`
            ${size === 'lg' ? 'text-xl' : size === 'sm' ? 'text-sm' : 'text-base'}
            ${isHovered && animated ? 'animate-pulse' : ''}
          `}
        />
        <span>{label}</span>
      </a>
    </div>
  );
};

export default PatreonButton;

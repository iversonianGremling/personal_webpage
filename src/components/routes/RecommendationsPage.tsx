import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Post from '../../types';
import PostCard from '../PostCard';
import NavBar from '../NavBar';
import { apiUrl } from '../../assets/env-var';
import '../../assets/styles/recommendations.css';
import RecommendationCard from '../RecommendationCard';

const RecommendationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [recommendationsQ5, setRecommendationsQ5] = useState<Post[]>([]);
  const [recommendationsQ4, setRecommendationsQ4] = useState<Post[]>([]);
  const [recommendationsQ3, setRecommendationsQ3] = useState<Post[]>([]);
  const [recommendationsQ2, setRecommendationsQ2] = useState<Post[]>([]);
  const [recommendationsQ1, setRecommendationsQ1] = useState<Post[]>([]);
  const [recommendationsQ0, setRecommendationsQ0] = useState<Post[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagCounts, setTagCounts] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);

  // The pre-defined sections/categories (renamed to Medium)
  const mediums = [
    'Music',
    'Movies',
    'Books',
    'Games',
    'Anime',
    'Manga',
    'TV Shows',
    'Comics',
    'Art',
    'Science',
    'Philosophy',
    'Politics',
    'Economics',
    'Feminism',
    'LGBTQ+',
    'Religion',
    'Psychology',
    'Physics',
    'Mathematics',
    'Engineering',
  ];

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(apiUrl + '/posts/tag/recommendation');
      const data = await response.json();
      setPosts(data);
      
      // Filter by quality rating
      setRecommendationsQ5(data.filter((post) => post.tags.includes('q5')));
      setRecommendationsQ4(data.filter((post) => post.tags.includes('q4')));
      setRecommendationsQ3(data.filter((post) => post.tags.includes('q3')));
      setRecommendationsQ2(data.filter((post) => post.tags.includes('q2')));
      setRecommendationsQ1(data.filter((post) => post.tags.includes('q1')));
      setRecommendationsQ0(data.filter((post) => post.tags.includes('q0')));
      
      // Calculate tag counts
      const counts: Record<string, number> = {};
      data.forEach(post => {
        post.tags.forEach(tag => {
          // Skip quality tags (q0-q5)
          if (!tag.match(/^q[0-5]$/)) {
            counts[tag] = (counts[tag] || 0) + 1;
          }
        });
      });
      setTagCounts(counts);
      
      // Set initially filtered posts to all posts
      setFilteredPosts(data);
    };
    fetchPosts();
  }, []);

  // Filter posts based on selected tags and search term
  useEffect(() => {
    let filtered = posts;
    
    // Filter by tags if any are selected
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post => 
        selectedTags.some(tag => 
          post.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
        )
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(term) || 
        post.content.toLowerCase().includes(term) || 
        post.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    setFilteredPosts(filtered);
  }, [posts, selectedTags, searchTerm]);

  // Update tag suggestions based on search term
  useEffect(() => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      
      // Get all tags that include the search term
      const matchingTags = Object.keys(tagCounts)
        .filter(tag => tag.toLowerCase().includes(term) && !selectedTags.includes(tag))
        .slice(0, 5);  // Limit to 5 suggestions
        
      setTagSuggestions(matchingTags);
    } else {
      setTagSuggestions([]);
    }
  }, [searchTerm, tagCounts, selectedTags]);

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Format tag name for display (remove prefixes)
  const formatTagName = (tag: string) => {
    if (tag.startsWith('author:') || tag.startsWith('country:') || tag.startsWith('year:')) {
      return tag.split(':')[1].trim();
    }
    return tag;
  };

  // Filter by quality level
  const filterPostsByQuality = (posts: Post[], qualityTag: string) => {
    return filteredPosts.filter(post => post.tags.includes(qualityTag));
  };

  // Get top 20 most used tags (excluding specified prefixes and mediums)
  const getTopTags = () => {
    const excludedPrefixes = ['author:', 'country:', 'year:'];
    const excludedTags = ['recommendation', ...mediums.map(m => m.toLowerCase())];
    
    return Object.entries(tagCounts)
      .filter(([tag]) => 
        !excludedTags.includes(tag.toLowerCase()) && 
        !tag.match(/^q[0-5]$/) && 
        !excludedPrefixes.some(prefix => tag.startsWith(prefix))
      )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
  };

  return (
    <>
      <NavBar />
      <div className='bg-white text-black p-8 karrik-regular-text'>
        {/* Search bar */}
        <div className="mb-6 relative">
          <h3 className="karrik-regular-text text-xl mb-2 text-left">SEARCH:</h3>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search titles, content, or tags..."
            className="w-full p-2 border-2 border-black karrik-regular-text"
          />
          
          {/* Tag suggestions */}
          {tagSuggestions.length > 0 && (
            <div className="absolute z-10 w-full bg-white border-2 border-black border-t-0 mt-0">
              {tagSuggestions.map(tag => (
                <div 
                  key={tag}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    toggleTag(tag);
                    setSearchTerm('');
                    setTagSuggestions([]);
                  }}
                >
                  {formatTagName(tag)}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Selected tags */}
        {selectedTags.length > 0 && (
          <div className="mb-6">
            <h3 className="karrik-regular-text text-xl mb-2 text-left">SELECTED TAGS:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map(tag => (
                <div 
                  key={tag} 
                  className="px-3 py-1 border-2 border-black bg-black text-white flex items-center"
                >
                  {formatTagName(tag)}
                  <button 
                    onClick={() => toggleTag(tag)}
                    className="ml-2 text-white font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button 
                onClick={() => setSelectedTags([])}
                className="px-3 py-1 border-2 border-black bg-white text-black hover:bg-gray-100"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
        
        {/* Medium categories (renamed from "Filter by Category") */}
        <div className="mb-8">
          <h3 className="karrik-regular-text text-xl mb-2 text-left">FILTER BY MEDIUM:</h3>
          <div className='flex flex-wrap gap-2'>
            {mediums.map((medium) => (
              <button
                key={medium}
                className={`karrik-regular-text text-lg px-3 py-1 border-2 border-black ${
                  selectedTags.includes(medium.toLowerCase()) 
                    ? 'bg-black text-white' 
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
                onClick={() => toggleTag(medium.toLowerCase())}
              >
                {medium} {tagCounts[medium.toLowerCase()] ? `(${tagCounts[medium.toLowerCase()]})` : '(0)'}
              </button>
            ))}
          </div>
        </div>
        
        {/* Top 20 tags (renamed from "Other Tags") */}
        <div className="mb-8">
          <h3 className="karrik-regular-text text-xl mb-2 text-left">TAGS:</h3>
          <div className='flex flex-wrap gap-2'>
            {getTopTags().map(([tag, count]) => (
              <button
                key={tag}
                className={`karrik-regular-text text-lg px-3 py-1 border-2 border-black ${
                  selectedTags.includes(tag) 
                    ? 'bg-black text-white' 
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
                onClick={() => toggleTag(tag)}
              >
                {formatTagName(tag)} ({count})
              </button>
            ))}
          </div>
        </div>
        
        {/* Q5 Recommendations */}
        <RecommendationSection 
          posts={filterPostsByQuality(filteredPosts, 'q5')}
          text='Ω A masterpiece, one of the best experiences crafted by humanity' 
          quality={5}
        />
        
        {/* Q4 Recommendations */}
        <RecommendationSection 
          posts={filterPostsByQuality(filteredPosts, 'q4')}
          text='∀ The best of its medium, worth checking out whether you are familiarized with said medium or not' 
          quality={4}
        />
        
        {/* Q3 Recommendations */}
        <RecommendationSection 
          posts={filterPostsByQuality(filteredPosts, 'q3')}
          text='א Redefined its medium in some form or another, a golden standard that opened new frontiers and is a point of reference for other works' 
          quality={3}
        />
        
        {/* Q2 Recommendations */}
        <RecommendationSection 
          posts={filterPostsByQuality(filteredPosts, 'q2')}
          text='∞ It incorporates enough difference, innovation or quality to advance its medium, something that must be experienced if you enjoy works of similar nature' 
          quality={2}
        />
        
        {/* Q1 Recommendations */}
        <RecommendationSection 
          posts={filterPostsByQuality(filteredPosts, 'q1')}
          text='⧜ A solid work worth experiencing, perfected some part of its medium' 
          quality={1}
        />
        
        {/* Q0 Recommendations */}
        <RecommendationSection 
          posts={filterPostsByQuality(filteredPosts, 'q0')}
          text='✓ Worth checking out' 
          quality={0}
        />
      </div>
    </>
  );
};

// Separate Recommendation Section component
const RecommendationSection: React.FC<{ 
  posts: Post[], 
  text: string, 
  quality: number
}> = ({ posts, text, quality }) => {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

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

  if (posts.length === 0) {
    return null; // Don't render section if no matching posts
  }

  return (
    <div className="mb-12">
      <div className='karrik-regular-text text-2xl text-left mb-4'>{text.toUpperCase()}</div>
      <div className={`flex flex-nowrap w-full gap-4 ${isMobileOrTablet ? 'flex-col overflow-scroll-y' : 'flex-row overflow-scroll-x'}`}>
        {posts.map((post) => (
          <RecommendationCard key={post.id} post={post} quality={quality}/>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsPage;

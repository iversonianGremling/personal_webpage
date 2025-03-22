import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Post from '../../types';
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
  const [similarPostId, setSimilarPostId] = useState<string | null>(null);
  const [similarPosts, setSimilarPosts] = useState<Post[]>([]);
  const [showingSimilar, setShowingSimilar] = useState<boolean>(false);
  // The pre-defined sections/categories (renamed to Medium)
  const mediums = [
    'Music',
    'Movie',
    'Book',
    'Game',
    'Anime',
    'Manga',
    'Series',
    'Comic',
    'Art',
    'Paper',
    'Essay',
    'Website',
    'Account',
    'Software',
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
    // Reset showing similar posts when filters change
    if (showingSimilar) {
      setShowingSimilar(false);
      setSimilarPostId(null);
    }
  }, [posts, selectedTags, searchTerm]);
  // Filter similar posts when similarPostId changes
  useEffect(() => {
    if (similarPostId) {
      findSimilarPosts(similarPostId);
    }
  }, [similarPostId]);
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
    // Reset similar view when changing tags
    setShowingSimilar(false);
  };
  // Find similar posts based on shared tags
  const findSimilarPosts = (postId: string) => {
    const sourcePost = posts.find(post => post.id.toString() === postId);
    if (!sourcePost) return;
    // Get all tags of the source post except quality tags
    const sourceTags = sourcePost.tags.filter(tag => !tag.match(/^q[0-5]$/));
    // Calculate similarity scores for all other posts
    const postScores = posts
      .filter(post => post.id.toString() !== postId) // Exclude the source post
      .map(post => {
        const postTags = post.tags.filter(tag => !tag.match(/^q[0-5]$/));
        const sharedTags = postTags.filter(tag => sourceTags.includes(tag));
        // Calculate similarity score (percentage of source post tags that are shared)
        const similarityScore = sourceTags.length > 0
          ? sharedTags.length / sourceTags.length
          : 0;
        return {
          post,
          score: similarityScore,
          sharedTagCount: sharedTags.length
        };
      })
      .filter(item => item.sharedTagCount > 0) // Must have at least one shared tag
      .sort((a, b) => b.score - a.score); // Sort by similarity score descending
    const similar = postScores.slice(0, 10).map(item => item.post); // Take top 10
    setSimilarPosts(similar);
    setShowingSimilar(true);
  };
  // Handle showing similar recommendations
  const handleShowSimilar = (postId: string) => {
    setSimilarPostId(postId);
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
        {/* Similar recommendations section */}
        {showingSimilar && similarPosts.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="karrik-regular-text text-2xl">SIMILAR RECOMMENDATIONS</h3>
              <button
                onClick={() => {
                  setShowingSimilar(false);
                  setSimilarPostId(null);
                }}
                className="px-3 py-1 border-2 border-black bg-white text-black hover:bg-gray-100"
              >
                Close Similar View
              </button>
            </div>
            <div className="flex flex-wrap gap-4">
              {similarPosts.map((post) => {
                // Determine quality rating
                let quality = 0;
                for (let q = 5; q >= 0; q--) {
                  if (post.tags.includes(`q${q}`)) {
                    quality = q;
                    break;
                  }
                }
                return (
                  <div key={post.id} className="w-full md:w-1/3 lg:w-1/4 xl:w-1/5">
                    <RecommendationCard
                      post={post}
                      quality={quality}
                      tagCounts={tagCounts}
                      onTagClick={toggleTag}
                      onShowSimilar={handleShowSimilar}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* Search bar */}
        {!showingSimilar && (
          <>
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
              tagCounts={tagCounts}
              onTagClick={toggleTag}
              onShowSimilar={handleShowSimilar}
            />
            {/* Q4 Recommendations */}
            <RecommendationSection
              posts={filterPostsByQuality(filteredPosts, 'q4')}
              text='∀ The best of its medium, worth checking out whether you are familiarized with said medium or not'
              quality={4}
              tagCounts={tagCounts}
              onTagClick={toggleTag}
              onShowSimilar={handleShowSimilar}
            />
            {/* Q3 Recommendations */}
            <RecommendationSection
              posts={filterPostsByQuality(filteredPosts, 'q3')}
              text='א Redefined its medium in some form or another, a golden standard that opened new frontiers and is a point of reference for other works'
              quality={3}
              tagCounts={tagCounts}
              onTagClick={toggleTag}
              onShowSimilar={handleShowSimilar}
            />
            {/* Q2 Recommendations */}
            <RecommendationSection
              posts={filterPostsByQuality(filteredPosts, 'q2')}
              text='∞ It incorporates enough difference, innovation or quality to advance its medium, something that must be experienced if you enjoy works of similar nature'
              quality={2}
              tagCounts={tagCounts}
              onTagClick={toggleTag}
              onShowSimilar={handleShowSimilar}
            />
            {/* Q1 Recommendations */}
            <RecommendationSection
              posts={filterPostsByQuality(filteredPosts, 'q1')}
              text='⧜ A solid work worth experiencing, perfected some part of its medium'
              quality={1}
              tagCounts={tagCounts}
              onTagClick={toggleTag}
              onShowSimilar={handleShowSimilar}
            />
            {/* Q0 Recommendations */}
            <RecommendationSection
              posts={filterPostsByQuality(filteredPosts, 'q0')}
              text='✓ Worth checking out'
              quality={0}
              tagCounts={tagCounts}
              onTagClick={toggleTag}
              onShowSimilar={handleShowSimilar}
            />
          </>
        )}
      </div>
    </>
  );
};

// Separate Recommendation Section component
const RecommendationSection: React.FC<{
  posts: Post[],
  text: string,
  quality: number,
  tagCounts: Record<string, number>,
  onTagClick: (tag: string) => void,
  onShowSimilar: (postId: string) => void
}> = ({ posts, text, quality, tagCounts, onTagClick, onShowSimilar }) => {
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
          <RecommendationCard
            key={post.id}
            post={post}
            quality={quality}
            tagCounts={tagCounts}
            onTagClick={onTagClick}
            onShowSimilar={onShowSimilar}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendationsPage;

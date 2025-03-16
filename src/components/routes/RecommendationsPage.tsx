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
  const [newTag, setNewTag] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  // List of countries
  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 
    'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 
    'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 
    'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 
    'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 
    'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 
    'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 
    'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 
    'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 
    'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 
    'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea, North', 'Korea, South', 'Kosovo', 
    'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 
    'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 
    'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 
    'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 
    'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia', 'Norway', 'Oman', 
    'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 
    'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 
    'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 
    'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 
    'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 
    'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 
    'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 
    'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 
    'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
  ];

  // The pre-defined sections/categories
  const sections = [
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

  // Filter posts based on selected tags, search term, and country
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
    
    // Filter by country if selected
    if (selectedCountry) {
      filtered = filtered.filter(post => 
        post.tags.some(tag => tag.toLowerCase() === selectedCountry.toLowerCase())
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
  }, [posts, selectedTags, searchTerm, selectedCountry]);

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Add a new custom tag
  const addNewTag = () => {
    if (newTag && !selectedTags.includes(newTag)) {
      setSelectedTags([...selectedTags, newTag]);
      setNewTag('');
    }
  };

  // Filter by quality level
  const filterPostsByQuality = (posts: Post[], qualityTag: string) => {
    return filteredPosts.filter(post => post.tags.includes(qualityTag));
  };

  return (
    <>
      <NavBar />
      <div className='bg-white text-black p-8 karrik-regular-text'>
        {/* Search bar */}
        <div className="mb-6">
          <h3 className="karrik-regular-text text-xl mb-2 text-left">SEARCH:</h3>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search titles, content, or tags..."
            className="w-full p-2 border-2 border-black karrik-regular-text"
          />
        </div>
        
        {/* Country filter */}
        <div className="mb-6">
          <h3 className="karrik-regular-text text-xl mb-2 text-left">FILTER BY COUNTRY:</h3>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full p-2 border-2 border-black karrik-regular-text"
          >
            <option value="">All Countries</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
        
        {/* Custom tag input */}
        <div className="mb-6">
          <h3 className="karrik-regular-text text-xl mb-2 text-left">ADD CUSTOM TAG:</h3>
          <div className="flex">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Enter a new tag..."
              className="flex-grow p-2 border-2 border-black border-r-0 karrik-regular-text"
              onKeyPress={(e) => e.key === 'Enter' && addNewTag()}
            />
            <button
              onClick={addNewTag}
              className="px-4 py-2 border-2 border-black bg-black text-white hover:bg-gray-800"
            >
              Add
            </button>
          </div>
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
                  {tag}
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
        
        {/* Tag categories */}
        <div className="mb-8">
          <h3 className="karrik-regular-text text-xl mb-2 text-left">FILTER BY CATEGORY:</h3>
          <div className='flex flex-wrap gap-2'>
            {sections.map((section) => (
              <button
                key={section}
                className={`karrik-regular-text text-lg px-3 py-1 border-2 border-black ${
                  selectedTags.includes(section.toLowerCase()) 
                    ? 'bg-black text-white' 
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
                onClick={() => toggleTag(section.toLowerCase())}
              >
                {section} {tagCounts[section.toLowerCase()] ? `(${tagCounts[section.toLowerCase()]})` : '(0)'}
              </button>
            ))}
          </div>
        </div>
        
        {/* All other tags */}
        <div className="mb-8">
          <h3 className="karrik-regular-text text-xl mb-2 text-left">OTHER TAGS:</h3>
          <div className='flex flex-wrap gap-2'>
            {Object.keys(tagCounts)
              .filter(tag => !sections.map(s => s.toLowerCase()).includes(tag.toLowerCase()) && !tag.match(/^q[0-5]$/))
              .sort()
              .map((tag) => (
                tag !== 'recommendation' &&
                <button
                  key={tag}
                  className={`karrik-regular-text text-lg px-3 py-1 border-2 border-black ${
                    selectedTags.includes(tag) 
                      ? 'bg-black text-white' 
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag} ({tagCounts[tag]})
                </button>
              ))
            }
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
      <div className={`flex flex-nowrap w-full gap-4 ${isMobileOrTablet ? 'flex-col' : 'flex-row'}`}>
        {posts.map((post) => (
          <RecommendationCard key={post.id} post={post} quality={quality}/>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsPage;
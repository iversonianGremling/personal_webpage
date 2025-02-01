import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../assets/env-var';

interface Post {
  id: number;
  title: string;
  content: string;
  tags: string[];
  date: string;
  type: string;
  visibility: string;
}

interface SearchParams {
  q?: string;
  tags?: string[];
  limit?: number;
}

type CategorizedSuggestions = {
  full: Post[];
  title: Post[];
  content: Post[];
  tags: Post[];
  other: Post[];
};

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CategorizedSuggestions>({
    full: [],
    title: [],
    content: [],
    tags: [],
    other: []
  });
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const parseSearchInput = (input: string): SearchParams => {
    const tags: string[] = [];
    const terms: string[] = [];

    input.split(/\s+/).forEach(token => {
      if (token.startsWith('tag:')) {
        tags.push(token.slice(4));
      } else {
        terms.push(token);
      }
    });

    return {
      q: terms.join(' '),
      tags: tags.length > 0 ? tags : undefined
    };
  };

  const debounce = <T extends unknown[]>(func: (...args: T) => void, delay: number) => {
    let timeoutId: number;
    return (...args: T) => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => func(...args), delay);
    };
  };

  const fetchSuggestions = async (searchQuery: string) => {
    if (!searchQuery) {
      setSuggestions({ full: [], title: [], content: [], tags: [], other: [] });
      return;
    }

    const parsed = parseSearchInput(searchQuery);
    const lowerQuery = parsed.q.toLowerCase();

    try {
      const response = await axios.get<Post[]>(apiUrl + 'posts/search', {
        params: {
          q: parsed.q,
          tags: parsed.tags,
          limit: 12,
        },
      });

      const allResults = response.data;

      // Categorize results
      const categorized: CategorizedSuggestions = {
        full: [],
        title: [],
        content: [],
        tags: [],
        other: []
      };

      allResults.forEach(post => {
        const hasTitle = post.title.toLowerCase().includes(lowerQuery);
        const hasContent = post.content.toLowerCase().includes(lowerQuery);
        const hasTag = post.tags.some(t => t.toLowerCase().includes(lowerQuery));

        if (hasTitle && hasContent) {
          categorized.full.push(post);
        } else if (hasTitle) {
          categorized.title.push(post);
        } else if (hasContent) {
          categorized.content.push(post);
        } else if (hasTag) {
          categorized.tags.push(post);
        } else {
          categorized.other.push(post);
        }
      });

      // Limit each category to 3 results
      setSuggestions({
        full: categorized.full.slice(0, 3),
        title: categorized.title.slice(0, 3),
        content: categorized.content.slice(0, 3),
        tags: categorized.tags.slice(0, 3),
        other: categorized.other.slice(0, 3)
      });

    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions({ full: [], title: [], content: [], tags: [], other: [] });
    }
  };

  const debouncedFetch = debounce(fetchSuggestions, 300);

  useEffect(() => {
    debouncedFetch(query);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current &&
          event.target instanceof Node &&
          !searchRef.current.contains(event.target)) {
        setIsFocused(false);
        setSuggestions({ full: [], title: [], content: [], tags: [], other: [] });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = [
    { type: 'full', label: 'Full Matches' },
    { type: 'title', label: 'Title Matches' },
    { type: 'content', label: 'Content Matches' },
    { type: 'tags', label: 'Tag Matches' },
    { type: 'other', label: 'Other Matches' }
  ] as const;

  return (
    <div className="search-container" ref={searchRef}>
      <input
        type="text"
        placeholder="Search posts by title, content, tags..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        style = {{
          width: '100%',
          marginRight: '0.7rem'
        }}
      />
      {isFocused && query && suggestions.full.length > 0 ? (
        <div className="suggestions-dropdown">
          {categories.map(({ type, label }) => {
            const categoryPosts = suggestions[type];
            if (categoryPosts.length === 0) return null;

            return (
              <div key={type} className="category-group">
                <div className="category-header">{label}</div>
                {categoryPosts.map(post => (
                  <Link
                    key={post.id}
                    to={`/posts/${post.id}`}
                    className="suggestion-item"
                    onClick={() => {
                      setQuery('');
                      setSuggestions({ full: [], title: [], content: [], tags: [], other: [] });
                    }}
                  >
                    <div className="match-type">{label}</div>
                    <div className="suggestion-title">{post.title}</div>
                    <div className="suggestion-tags">
                      {post.tags?.join(', ')}
                    </div>
                    <div className="suggestion-date">
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </Link>
                ))}
              </div>
            );
          })}
        </div>
      ): ''}
    </div>
  );
};

export default SearchBar;

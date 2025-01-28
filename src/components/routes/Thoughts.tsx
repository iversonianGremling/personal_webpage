import React, { useEffect, useState, useCallback } from 'react';
import NavBar from '../NavBar';
import Post from '../../types';
import { useDebounce } from 'use-debounce';

const ThoughtsPage: React.FC = () => {
  const [thoughts, setThoughts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounce(searchQuery, 500);

  const fetchThoughts = useCallback(async (query = '') => {
    try {
      const url = new URL('http://localhost:3000/api/posts/tag/thoughts/search');
      if (query) {
        url.searchParams.append('search', query);
      }

      const response = await fetch(url.toString());
      const data = await response.json();
      setThoughts(data);
    } catch (error) {
      console.error('Error fetching thoughts:', error);
    }
  }, []);

  useEffect(() => {
    fetchThoughts(debouncedSearch);
  }, [debouncedSearch, fetchThoughts]);

  // Create default thought if empty
  const displayedPosts = [...thoughts];
  if (displayedPosts.length === 0 && !debouncedSearch) {
    displayedPosts.push({
      id: 0,
      title: 'brain sooooooth rn',
      content: '⠀⠀⠀⠀⠀⠀⠀⠀⠀',
      tags: ['void'],
      date: new Date().toISOString(),
      type: 'thought',
    });
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-zinc-900 p-8 relative overflow-hidden">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <input
            type="text"
            placeholder="🔍 Search neural debris..."
            className="w-full px-6 py-4 rounded-full bg-black/30 backdrop-blur-lg border-2 border-white/10 focus:border-purple-500/50 transition-all text-white placeholder-white/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayedPosts.map((thought, index) => (
            <div
              key={thought.id}
              className="relative group transform transition-transform hover:scale-[1.02]"
              style={{
                rotate: `${Math.sin(index) * 5}deg`,
              }}
            >
              {/* Tweet body */}
              <div className="p-8 rounded-xl backdrop-blur-lg border-2 h-full"
                style={{
                  background: `linear-gradient(
                    145deg,
                    hsl(${index * 50 % 360}, 70%, 15%) 0%,
                    hsl(${index * 50 % 360}, 70%, 5%) 100%
                  )`,
                  borderColor: `hsl(${index * 50 % 360}, 70%, 40%)`,
                  fontFamily: index % 2 === 0
                    ? '"Comic Neue", cursive'
                    : '"Shadows Into Light", cursive'
                }}
              >
                {/* Thought content */}
                <div className="text-2xl leading-relaxed space-y-4">
                  {thought.content === '⠀⠀⠀⠀⠀⠀⠀⠀⠀' ? (
                    <div className="text-4xl animate-pulse text-center">
                      🧠🌫️⋯ {thought.title} ⋯🌌🫧
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2 text-3xl">
                        {['✨','🌪️','🌀','❔'][index % 4]} {thought.title}
                      </div>
                      <div className="opacity-80 font-light">
                        {thought.content}
                      </div>
                    </>
                  )}
                </div>

                {/* Metadata footer */}
                <div className="mt-6 flex justify-between items-center opacity-50 text-sm">
                  <div>
                    {new Date(thought.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="flex gap-4">
                    <button className="hover:opacity-100 transition-opacity">
                      ♻️ {Math.floor(Math.random() * 99)}
                    </button>
                    <button className="hover:opacity-100 transition-opacity">
                      💭 {Math.floor(Math.random() * 99)}
                    </button>
                  </div>
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-40
                transition-opacity blur-2xl"
              style={{
                background: `radial-gradient(
                    circle at center,
                    hsl(${index * 50 % 360}, 100%, 50%) 0%,
                    transparent 70%
                  )`
              }}
              />
            </div>
          ))}
        </div>

        {/* Empty state for search */}
        {thoughts.length === 0 && debouncedSearch && (
          <div className="text-center text-white/50 mt-20 text-xl">
            No neural patterns match "{debouncedSearch}"
          </div>
        )}
      </div>
    </>
  );
};

export default ThoughtsPage;

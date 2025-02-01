import React, { useEffect, useState, useCallback, useRef } from 'react';
import NavBar from '../NavBar';
import Post from '../../types';
import { useDebounce } from 'use-debounce';
import { apiUrl } from '../../assets/env-var';

const ThoughtsPage: React.FC = () => {
  const [thoughts, setThoughts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fetchThoughts = useCallback(async (query = '') => {
    try {
      const url = new URL(apiUrl + 'posts/tag/thoughts/search');
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const squares = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 30 + 10,
      speed: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.3 + 0.1,
    }));

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      squares.forEach((square) => {
        square.x += (mouseX - canvas.width / 2) * square.speed * 0.002;
        square.y += (mouseY - canvas.height / 2) * square.speed * 0.002;
        ctx.fillStyle = `rgba(255, 255, 255, ${square.opacity})`;
        ctx.fillRect(square.x, square.y, square.size, square.size);
      });
      requestAnimationFrame(update);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    update();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const displayedPosts = [...thoughts];
  if (displayedPosts.length === 0 && !debouncedSearch) {
    console.error('No posts found');
  }

  return (
    <>
      <NavBar />

      <div className="relative z-10 min-h-screen bg-slate-200 pt-4">
        <canvas
          ref={canvasRef}
          className="fixed top-0 left-0 w-full h-full pointer-events-none z-10"
        ></canvas>
        <input
          type="text"
          placeholder="Where's my head at?..."
          className="mb-4 w-full text-2xl"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {displayedPosts.map((thought, index) => (
            <div
              key={thought.id}
              className="relative group transform transition-transform hover:scale-[1.02] ease-linear duration-500"
              style={{ rotate: `${Math.sin(index) * 5}deg`, width: `${100 + Math.sin(index) * 5}%` }}
            >
              <div className="p-8 backdrop-blur-lg border-2 h-full" style={{ background: 'white', borderColor: 'white', fontFamily: index % 2 === 0 ? '"Comic Neue", cursive' : '"Shadows Into Light", cursive' }}>
                <div className="text-2xl leading-relaxed space-y-4 text-black">
                  {thought.content === '⠀⠀⠀⠀⠀⠀⠀⠀⠀' ? (
                    <div className="text-4xl animate-pulse text-center">🧠🌫️⋯ {thought.title} ⋯🌌🫧</div>
                  ) : (
                    <>
                      <div className="opacity-80 font-light" dangerouslySetInnerHTML={{ __html: thought.content }}></div>
                    </>
                  )}
                </div>
                <div className="mt-6 flex justify-between items-center opacity-50 text-sm">
                  <div>{new Date(thought.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {thoughts.length === 0 && debouncedSearch && (
          <div className="text-center text-white/50 mt-20 text-xl">No neural patterns match "{debouncedSearch}"</div>
        )}
      </div>
    </>
  );
};

export default ThoughtsPage;

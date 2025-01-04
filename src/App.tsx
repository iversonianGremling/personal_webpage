import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import NavBar from './components/NavBar';
import PostContainer from './components/PostContainer';
import Login from './login';
import Post from './types';
import PostDetail from './components/PostDetail';
// Other imports...

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState('artsy');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Load CSS based on the current route path
    window.addEventListener('popstate', () => {
      const path = window.location.pathname;
      console.log(path);
      loadRouteCSS(theme);
    });

  }, [location]);


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3000/posts/');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data: Post[] = await response.json();
        setPosts(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return <div className="text-white text-center mt-20">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-20">Error: {error}</div>;
  }


  function loadRouteCSS(route: string) {
    const existingLink = document.getElementById('route-stylesheet') as HTMLLinkElement;

    // Remove existing stylesheet if present
    if (existingLink) {
      existingLink.parentNode?.removeChild(existingLink);
    }

    const routeToCSSMap: { [key: string]: string } = {
      '/': 'artsy.css',
      '/retro': 'retro.css',
      '/elegant': 'elegant.css',
    };

    const cssFile = routeToCSSMap[route] || 'artsy';

    // Create a new link element for the current route's CSS
    const link = document.createElement('link');
    link.id = 'route-stylesheet';
    link.rel = 'stylesheet';
    link.href = `/${cssFile}`; // Assumes CSS files are named after the routes in public folder
    document.head.appendChild(link);
  }

  return (
    <div className="App min-h-screen bg-black bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: 'url(\'/path-to-your-image.jpg\')' }}>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/" element={
          <>
            <Sidebar />
            <button
              onClick={() => navigate('/auth/login')}
              style={{ position: 'absolute', top: '80px', left: '0', width: '10px', height: '10px', background: 'transparent', border: 'none' }}
            ></button>
            <NavBar />
            <div className="left-14">
              <div className="title text-7xl text-red-600 font-serif mt-6 transition-colors hover:text-white ml-80">LAST POSTS</div>
              <div className="flex flex-col justify-center items-center text-center ">
                <PostContainer posts={posts} className="post-container" />
              </div>
            </div>
          </>
        } />
        {/* Add other routes as needed */}
        <Route path="/posts/:id" element={<PostDetail />} />
      </Routes>
    </div>
  );
}

export default App;

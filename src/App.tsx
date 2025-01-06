import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useAuth } from './components/AuthContext';
import About from './components/About';
import NavBar from './components/NavBar';
import PostContainer from './components/PostContainer';
import Login from './login';
import Post from './types';
import PostDetail from './components/PostDetail';
import SaladFingersText from './components/SaladFingers';
import CreatePost from './components/CreatePost';
import SeeAllPosts from './components/SeeAllPosts';
import EditPost from './components/EditPost';
import MovingTitle from './components/MovingTitle';
import CircleObjects from './components/CircleObjects';

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState('artsy');
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

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

  useEffect(() => {

  });

  function loadRouteCSS(route: string) {
    const existingLink = document.getElementById('route-stylesheet') as HTMLLinkElement;

    if (existingLink) {
      existingLink.parentNode?.removeChild(existingLink);
    }

    const routeToCSSMap: { [key: string]: string } = {
      '/': 'artsy.css',
      '/retro': 'retro.css',
      '/elegant': 'elegant.css',
    };

    const cssFile = routeToCSSMap[route] || 'artsy';
    const link = document.createElement('link');
    link.id = 'route-stylesheet';
    link.rel = 'stylesheet';
    link.href = `/${cssFile}`;
    document.head.appendChild(link);
  }

  return (
    <div
      className="App min-h-screen bg-black bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: 'url(\'/path-to-your-image.jpg\')' }}
    >
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route
          path="/"
          element={
            <>
              <NavBar />
              <div className="flex flex-row flex-grow justify-between">
                <div className="left-14 relative w-1/2">
                  <MovingTitle />
                  <PostContainer posts={posts} className="post-container" />
                </div>
                {isAdmin && (
                  <div className="fixed bottom-10 right-10 space-y-4">
                    <button
                      onClick={() => navigate('/create-post')}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 w-full"
                    >
                    Create Post
                    </button>
                    <button
                      onClick={() => navigate('/posts/admin')}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-600 w-full"
                    >
                    See All Posts
                    </button>
                  </div>
                )}
                <About/>
              </div>

              <SaladFingersText />
            </>
          }
        />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/posts/admin" element={<SeeAllPosts />} />
        <Route path="/edit-post/:id" element={<EditPost />} />
      </Routes>
    </div>
  );
}

export default App;

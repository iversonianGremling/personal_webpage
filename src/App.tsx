import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useAuth } from './components/AuthContext';
import About from './components/About';
import NavBar from './components/NavBar';
import PostContainer from './components/PostContainer';
import Login from './login';
import Post from './types';
import PostDetail from './components/PostDetail';
import CreatePost from './components/CreatePost';
import SeeAllPosts from './components/SeeAllPosts';
import EditPost from './components/EditPost';
import MovingTitle from './components/MovingTitle';
import Categories from './components/Categories';
import ScrollToPosts from './components/ScrollToPosts';
import Background from './components/Background';
import Writings from './components/routes/Writings/Writings';
import Programming from './components/routes/Programming/Programming';
import Music from './components/routes/Music';
import GamingPage from './components/routes/Gaming';
import PhilosophyBlog from './components/routes/Philosophy';
import IntersectionalityPage from './components/routes/Intersectionality';
import ArticlesPage from './components/routes/Articles';
import Poetry from './components/routes/Writings/Poetry';
import Fiction from './components/routes/Writings/Fiction';
import NonFiction from './components/routes/Writings/NonFiction';
import SearchBar from './components/SearchBar';
import { MyName } from './components/MyName';
import { TagDetail } from './components/TagDetail';
import AboutThisPage from './components/AboutThisPage';
import Thoughts from './components/routes/Thoughts';
import AboutPage from './components/routes/AboutPage';
import { apiUrl } from './assets/env-var';
import ReviewsPage from './components/routes/Reviews';
import ReviewDetails from './components/routes/ReviewPage';
import ReviewPage from './components/routes/ReviewPage';
import RecommendationsPage from './components/routes/RecommendationsPage';
import CreateThought from './components/CreateThought';

const Placeholder = ({ title, backgroundColor = 'transparent' }) => {
  useEffect(() => {
    // Set the background color of the body
    document.body.style.backgroundColor = backgroundColor || 'black';

    // Clean up: Restore original background on unmount
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [backgroundColor]);

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white"
      style={{ backgroundColor: 'transparent' }}
    >
      <h1 className="text-4xl">{title}</h1>
      <Background />
    </div>
  );
};

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState('artsy');
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 720);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 720);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(apiUrl + '/posts/latest', {
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Origin: window.location.origin,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch posts');

        const data = await response.json();
        setPosts(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []); // Add empty dependency array to run only once

  useEffect(() => {
    // Set the background color of the body
    document.body.style.backgroundColor = 'transparent';

    // Clean up: Restore original background on unmount
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  function loadRouteCSS(route: string) {
    const existingLink = document.getElementById(
      'route-stylesheet',
    ) as HTMLLinkElement;

    if (existingLink) {
      existingLink.parentNode?.removeChild(existingLink);
    }

    const routeToCSSMap: { [key: string]: string } = {
      '/': 'artsy.css',
      '/retro': 'retro.css',
      '/elegant': 'elegant.css',
    };
    console.log('I\'m in');
    console.log(route);

    const cssFile = routeToCSSMap[route] || 'artsy';
    const link = document.createElement('link');
    link.id = 'route-stylesheet';
    link.rel = 'stylesheet';
    link.href = `/${cssFile}`;
    document.head.appendChild(link);
  }

  return (
    <div
      className="App min-h-screen  bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: 'url(\'/path-to-your-image.jpg\')' }}
    >
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route
          path="/"
          element={
            <>
              <NavBar />
              <div className="flex flex-row justify-center content-center text-center mt-8">
                <div className="w-8/12 pb-20">
                  <MovingTitle />
                  {isLoading ? (
                    <div className="text-white text-center">Loading posts...</div>
                  ) : error ? (
                    <div className="text-red-500 text-center">Error: {error}</div>
                  ) : (
                    <PostContainer posts={posts} className="post-container" />
                  )}
                </div>
              </div>

              {isMobile ? '' : <MyName />}
              {/* <Background /> */}

              <div className="flex flex-row justify-center gap-52">
                {isAdmin && (
                  <div className="fixed bottom-10 right-10 space-y-4">
                    <button onClick={() => navigate('/create-thought')}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 w-full"
                    >Create Thought
                    </button>
                    <button onClick={() => navigate('/create-recommendation')}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 w-full"
                    >Create Recommendation
                    </button>
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
              </div>
              <AboutThisPage />
            </>
          }
        />
        {/* <Route path="/posts/:id" element={<PostDetail />} /> */}
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/create-thought" element={<CreateThought/>} />
        {/* <Route path="/create-recommendation" element={<CreateRecommendation />} /> */}
        <Route path="/posts/admin" element={<SeeAllPosts admin={true} />} />
        <Route path="/posts/" element={<SeeAllPosts admin={false} />} />
        <Route path="/edit-post/:id" element={<EditPost />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Posts routes */}
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route
          path="/posts/programming"
          element={<Placeholder title="Programming Posts" />}
        />
        <Route
          path="/posts/arts"
          element={<Placeholder title="Arts Posts" />}
        />
        <Route
          path="/posts/opinion"
          element={<Placeholder title="Opinion Posts" />}
        />
        <Route
          path="/posts/philosophy"
          element={<Placeholder title="Philosophy Posts" />}
        />
        <Route
          path="/posts/mathematics"
          element={<Placeholder title="Mathematics Posts" />}
        />
        <Route
          path="/posts/gaming"
          element={<Placeholder title="Gaming Posts" />}
        />
        <Route
          path="/posts/literature"
          element={<Placeholder title="Literature Posts" />}
        />

        {/* Music routes */}
        <Route path="/music" element={<Music />} />
        <Route
          path="/music/soundcloud"
          element={<Placeholder title="Soundcloud" />}
        />
        <Route
          path="/music/bandcamp"
          element={<Placeholder title="Bandcamp" />}
        />
        <Route
          path="/music/youtube"
          element={<Placeholder title="YouTube" />}
        />
        <Route path="/music/twitch" element={<Placeholder title="Twitch" />} />
        <Route path="/music/tiktok" element={<Placeholder title="TikTok" />} />

        {/* Programming routes */}
        <Route path="/programming" element={<Programming />}>
          <Route path=":id" element={<PostDetail />} />
        </Route>
        <Route
          path="/programming/articles"
          element={<Placeholder title="Programming Articles" />}
        />

        {/* Videos routes */}
        <Route path="/videos" element={<Placeholder title="Videos" />} />

        {/* Streaming routes */}
        <Route path="/streaming" element={<Placeholder title="Streaming" />} />
        <Route
          path="/streaming/twitch"
          element={<Placeholder title="Twitch Streaming" />}
        />

        {/* Writings routes */}
        <Route path="/writings" element={<Writings />} />
        <Route path="/writings/poetry" element={<Poetry />} />
        <Route path="/writings/fiction" element={<Fiction />} />
        <Route path="/writings/non-fiction" element={<NonFiction />} />

        {/* Visual Media routes */}
        <Route
          path="/visual-media"
          element={<Placeholder title="Visual Media" />}
        />
        <Route
          path="/visual-media/articles"
          element={<Placeholder title="Visual Media Articles" />}
        />
        <Route
          path="/visual-media/photography"
          element={<Placeholder title="Photography" />}
        />
        <Route
          path="/visual-media/collages"
          element={<Placeholder title="Collages" />}
        />
        <Route
          path="/visual-media/digital-art"
          element={<Placeholder title="Digital Art" />}
        />
        <Route
          path="/visual-media/drawings"
          element={<Placeholder title="Drawings" />}
        />

        <Route path="/gaming" element={<GamingPage />} />
        <Route path="/philosophy" element={<PhilosophyBlog />} />
        <Route path="/intersectionality" element={<IntersectionalityPage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/thoughts" element={<Thoughts />} />
        <Route path="/tag/:tag" element={<TagDetail />} />
        <Route path="/reviews" element={<ReviewsPage/>} />
        <Route path="/reviews/:tag" element={<ReviewPage/>} />
        <Route path="/recommendations" element={<RecommendationsPage/>} />
      </Routes>
    </div>
  );
}

export default App;

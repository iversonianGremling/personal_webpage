import React, { useEffect, useState } from 'react';
import NavBar from '../NavBar';
import '../../assets/styles/flicker.css';
import Post from '../../types';
import { apiUrl } from '../../assets/env-var';
import { useTranslation } from 'react-i18next';

const GamingPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(apiUrl + '/posts/tag/videogames');
      const data = await response.json();
      console.log(data);
      setPosts(data.reverse());
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleConsoleClick = (consoleName: string) => {
    let alertMessage = '';

    switch (consoleName) {
      case t('gamingPage.consoles.Atari2600'):
        alertMessage = t('gamingPage.alerts.Atari2600');
        break;
      case t('gamingPage.consoles.PC'):
        alertMessage = t('gamingPage.alerts.PC');
        break;
      case t('gamingPage.consoles.Nintendo'):
        alertMessage = t('gamingPage.alerts.Nintendo');
        break;
      case t('gamingPage.consoles.Sega'):
        alertMessage = t('gamingPage.alerts.Sega');
        break;
      case t('gamingPage.consoles.Chess'):
        alertMessage = t('gamingPage.alerts.Chess');
        break;
      case t('gamingPage.consoles.Bondage'):
        alertMessage = t('gamingPage.alerts.Bondage');
        break;
      default:
        alertMessage = t('gamingPage.alerts.default', { consoleName });
    }

    alert(alertMessage);
  };

  const consoles = [
    'PC',
    'Nintendo',
    'Sega',
    'Chess',
    'Atari2600',
    'Bondage'
  ];

  return (
    <>
      <NavBar />
      <div
        className="min-h-screen p-8"
        style={{
          backgroundImage:
            'url("https://www.webdesignmuseum.org/uploaded/fullscreen/2002/sega-2002.png")',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          color: '#00ff00',
          fontFamily: 'Comic Sans MS, cursive, sans-serif',
          textShadow: '2px 2px #ff0000',
        }}
      >
        <h1
          className="text-6xl font-bold text-center mb-8 animate-pulse"
          style={{ border: '5px solid yellow', padding: '10px' }}
        >
          {t('gamingPage.title')}
        </h1>

        {/* Fake Console Navbar */}
        <div className="flex justify-center gap-8 mb-12">
          {consoles.map((console) => (
            <button
              key={console}
              onClick={() => handleConsoleClick(t(`gamingPage.consoles.${console}`))}
              className="px-6 py-3 text-2xl font-bold bg-black border-4 border-green-500 text-green-300 hover:text-red-500 hover:border-red-500"
            >
              {t(`gamingPage.consoles.${console}`)}
            </button>
          ))}
        </div>

        <div
          className="text-4xl font-bold mb-8"
          style={{ color: '#ff00ff' }}
        >
          {t('gamingPage.marqueeText')}
        </div>

        {/* Search Bar */}
        <div className="text-center mb-8">
          <input
            type="text"
            placeholder={t('gamingPage.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 text-2xl border-4 border-green-500 bg-black text-green-300 placeholder-yellow-400 focus:outline-none"
            style={{ width: '80%' }}
          />
        </div>

        {/* Recent Posts Section */}
        <div className="text-center mb-12">
          <h2
            className="text-5xl font-extrabold mb-4 underline flicker-effect"
            style={{ color: '#ff6600' }}
          >
            {t('gamingPage.recentPostsTitle')}
          </h2>
          <ul className="list-disc list-inside text-left text-3xl mx-auto w-3/4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <li
                  key={post.id}
                  className="hover:text-red-500"
                  style={{ cursor: 'pointer' }}
                >
                  <a href={`/posts/${post.id}`} style={{ color: '#00ff00' }}>
                    {post.title}
                  </a>
                </li>
              ))
            ) : (
              <p className="text-red-500">
                {t('gamingPage.noPostsFound')}
              </p>
            )}
          </ul>
        </div>

        {/* Quotes Section */}
        <div className="flex flex-wrap justify-center gap-12 mb-12">
          <div className="border-4 border-pink-500 p-4 bg-yellow-300 max-w-80">
            <p className="mt-2 text-center text-xl max-w-40">
              {t('gamingPage.quotes.quote1')}
            </p>
          </div>
          <div className="border-4 border-cyan-500 p-4 bg-purple-300 max-w-80">
            <p className="mt-2 text-center text-xl">
              {t('gamingPage.quotes.quote2')}
            </p>
          </div>
          <div
            className="border-4 border-green-500 p-4 bg-pink-300 max-w-80"
            style={{ maxHeight: '19rem' }}
          >
            <p className="mt-2 text-center text-xl">
              {t('gamingPage.quotes.quote3')}
            </p>
          </div>
          <div className="border-4 border-purple-500 p-4 bg-cyan-300 max-w-80">
            <p className="mt-2 text-center text-xl">
              {t('gamingPage.quotes.quote4')}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="text-center text-2xl font-bold"
          style={{
            backgroundColor: '#0000ff',
            color: '#00ff00',
            padding: '10px',
            border: '5px dashed #ff00ff',
          }}
        >
          {t('gamingPage.footer')}
        </div>
      </div>
    </>
  );
};

export default GamingPage;

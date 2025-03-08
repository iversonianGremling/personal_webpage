import React, { useState, useEffect } from 'react';
import NavBar from '../NavBar';
import Post from '../../types';
import PostCard from '../PostCard';
import { apiUrl } from '../../assets/env-var';
import { useTranslation } from 'react-i18next';

// Static GIF URLs for decoration
const sideGifs = {
  flames: 'https://media.giphy.com/media/10SvWCbt1ytWCc/giphy.gif', // Flames on the sides
  skull: 'https://media.giphy.com/media/3oEjI1erPMTMBFmNHi/giphy.gif', // Spinning skulls
  truck: 'https://media.giphy.com/media/Rjo6j7XKZ6Fsk/giphy.gif', // Monster truck
  lightning: 'https://media.giphy.com/media/26gsjCZpPolPr3sBy/giphy.gif', // Lightning bolts
};

const PoliticsPage: React.FC = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          apiUrl + '/posts/tag/intersectionality/latest',
        );
        console.log(response);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <NavBar />
      <div
        className="min-h-screen p-8 relative"
        style={{
          backgroundImage: 'url("https://i.gifer.com/CaH.gif")',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          color: '#ff69b4',
          fontFamily: '"Comic Sans MS", cursive, sans-serif',
        }}
      >
        <header className="text-center mb-12">
          <h1
            className="text-6xl font-extrabold mb-4"
            style={{
              textShadow: '4px 4px #ff00ff',
              color: '#fff',
            }}
          >
            {t('politicsPage.title')}
          </h1>
          <p
            className="text-2xl italic"
            style={{
              color: '#fff',
              display: 'inline-block',
              padding: '10px 20px',
              borderRadius: '30px',
              border: '3px solid #ff69b4',
            }}
          >
            {t('politicsPage.subtitle')}
          </p>
          <p className="text-lg mt-4 border-b-2 border-pink-500 text-black">
            {t('politicsPage.disclaimer')}
          </p>
        </header>

        <main className="max-w-5xl mx-auto">
          <section className="mb-16">
            <h2
              className="text-4xl font-bold mb-4"
              style={{
                color: '#fff',
                borderBottom: '4px dashed #ff1493',
                textAlign: 'center',
                textShadow: '2px 2px #ff00ff',
              }}
            >
              {t('politicsPage.postsSection')}
            </h2>

            {loading ? (
              <p
                className="text-center italic"
                style={{ color: '#fff', fontSize: '1.5rem' }}
              >
                {t('politicsPage.loading')}
              </p>
            ) : posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    content={post.content}
                    tags={post.tags}
                    date={post.date}
                    variant="pink"
                    type={post.type}
                    basePath="/intersectionality"
                  />
                ))}
              </div>
            ) : (
              <p
                className="text-center italic"
                style={{ color: '#fff', fontSize: '1.5rem' }}
              >
                {t('politicsPage.noPosts')}
              </p>
            )}
          </section>
        </main>
      </div>
    </>
  );
};

export default PoliticsPage;

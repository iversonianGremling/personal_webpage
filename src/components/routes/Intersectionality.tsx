import React, { useState, useEffect } from 'react';
import NavBar from '../NavBar';

// Static GIF URLs for decoration
const sideGifs = {
  flames: 'https://media.giphy.com/media/10SvWCbt1ytWCc/giphy.gif', // Flames on the sides
  skull: 'https://media.giphy.com/media/3oEjI1erPMTMBFmNHi/giphy.gif', // Spinning skulls
  truck: 'https://media.giphy.com/media/Rjo6j7XKZ6Fsk/giphy.gif', // Monster truck
  lightning: 'https://media.giphy.com/media/26gsjCZpPolPr3sBy/giphy.gif', // Lightning bolts
};

const IntersectionalityPage: React.FC = () => {
  const [posts, setPosts] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Simulate API call to fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const mockPosts = [
          '🌈 Embrace your fabulous self! Life is too short for boring vibes. 💖✨',
          '💖 Remember: Glitter isn’t just decoration—it’s a way of life! 🌟',
          '🔥 Intersectionality means recognizing that we all carry multiple identities that shape our experiences. 🌈✊',
          '🌟 Love yourself unapologetically, because being different is fabulous! 💅✨',
        ];

        setPosts(mockPosts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
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
          backgroundImage:
          'url("https://i.gifer.com/CaH.gif")',
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
          💖 iNtERseCtiOnaLiTy, fuCk yEah!!!! 💖
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
          bEcAuSe LiFE iS MOre fAbUloUs wHEN We JuSt dON'T gIVe A fUck! 🌈✨
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
            🌟 LAST POSTS 🌟
            </h2>

            {loading ? (
              <p
                className="text-center italic"
                style={{ color: '#fff', fontSize: '1.5rem' }}
              >
              Loading fabulous posts... ✨🌈
              </p>
            ) : posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {posts.map((post, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-lg"
                    style={{
                      backgroundColor: 'rgba(255, 105, 180, 0.7)',
                      border: '3px solid #ff69b4',
                      boxShadow: '4px 4px 10px rgba(255, 20, 147, 0.8)',
                    }}
                  >
                    <h3
                      className="text-2xl font-bold mb-2"
                      style={{ color: '#fff', textShadow: '2px 2px #ff00ff' }}
                    >
                    ✨ Fabulous Post ✨
                    </h3>
                    <p style={{ color: '#fff' }}>{post}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p
                className="text-center italic"
                style={{ color: '#fff', fontSize: '1.5rem' }}
              >
              No fabulous posts yet. Be the first to post something! 🌈✨
              </p>
            )}
          </section>
        </main>

      </div>

    </>
  );
};

export default IntersectionalityPage;

import React, { useEffect, useState } from 'react';
import '../../../assets/styles/fiction.css';
import NavBar from '../../NavBar';
import PostCard from '../../PostCard';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../../../assets/env-var';
import insideBrainImage from '../../../assets/images/inside_brain.webp';
import { useTranslation } from 'react-i18next';

type Post = {
  id: number;
  title: string;
  content: string;
  date: string;
  tags: string[];
};

const Fiction: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 720);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 720);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(apiUrl + '/posts/tag/fiction');
      const data = await response.json();
      console.log(data);
      setPosts(data);
    };
    fetchPosts();
  }, []); // Added dependency array to prevent infinite re-renders

  const title = t('fictionPage.title');
  const backButtonText = t('fictionPage.backButton');

  return (
    <>
      <NavBar />
      <div className="container-fiction">
        <img
          src={insideBrainImage}
          alt="fiction"
          className="image-fiction"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1,
          }}
        />
        <button
          onClick={() => navigate(-1)}
          className="back-button-fiction"
          style={{
            position: 'fixed',
            top: '90px',
            left: '15px',
          }}
        >
          {Array.from(backButtonText).map((char, index) => {
            if (char === ' ') {
              return <span key={index}>&nbsp;</span>;
            } else {
              return (
                <span
                  key={index}
                  className="wobble-letter"
                  style={
                    {
                      '--char-index': index,
                      '--random-x': Math.random() * 0.5 + 1,
                      '--random-y': Math.random() * 0.5 + 1,
                      '--random-duration': `${Math.random() * 1 + 1}s`,
                    } as React.CSSProperties
                  }
                >
                  {char}
                </span>
              );
            }
          })}
        </button>

        <div className={`${isMobile ? 'text-7xl' : 'text-9xl'} header-fiction`}>
          {Array.from(title).map((char, index) => {
            return (
              <span
                key={index}
                className="wobble-letter"
                style={
                  {
                    fontFamily: 'Lithops, sans-serif',
                    '--char-index': index,
                    '--random-x': Math.random() * 2 + 1,
                    '--random-y': Math.random() * 2 + 1,
                    '--random-duration': `${Math.random() * 1 + 1}s`,
                  } as React.CSSProperties
                }
              >
                {char}
              </span>
            );
          })}
        </div>
        <div className="posts-container-fiction">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content}
              date={post.date}
              tags={post.tags}
              type="blog"
              variant="fiction"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Fiction;

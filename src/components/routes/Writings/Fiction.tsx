import React, { useEffect } from 'react';
import '../../../assets/styles/fiction.css';
import NavBar from '../../NavBar';
import PostCard from '../../PostCard';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../../../assets/env-var';
import insideBrainImage from '../../../assets/images/inside_brain.webp';

type Post = {
  id: number;
  title: string;
  content: string;
  date: string;
  tags: string[];
};

const Fiction: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = React.useState<Post[]>([]);
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(apiUrl + 'posts/tag/fiction');
      const data = await response.json();
      console.log(data);
      setPosts(data);
    };
    fetchPosts();
  });

  return (
    <>
      <NavBar/>
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
            top: '80px',
            left: '20px',
          }}
        >
          {Array.from('Return  to  my  body').map((char, index) => {
            if (char === ' ') {
              return <span key={index}>&nbsp;</span>;
            } else {
              return (
                <span
                  key={index}
                  className="wobble-letter"
                  style={{
                    '--char-index': index,
                    '--random-x': Math.random() * 0.5 + 1,
                    '--random-y': Math.random() * 0.5 + 1,
                    '--random-duration': `${Math.random() * 1 + 1}s`,
                  } as React.CSSProperties}
                >
                  {char}
                </span>
              );
            }
          })}
        </button>


        <div className="header-fiction">

          {Array.from('FICTION').map((char, index) => {
            return (
              <span
                key={index}
                className="wobble-letter"

                style={{
                  fontFamily: 'Lithops, sans-serif',
                  '--char-index': index,
                  '--random-x': Math.random() * 2 + 1,
                  '--random-y': Math.random() * 2 + 1,
                  '--random-duration': `${Math.random() * 1 + 1}s`,
                } as React.CSSProperties}
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

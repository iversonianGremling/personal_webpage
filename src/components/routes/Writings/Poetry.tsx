import React, { useEffect } from 'react';
import '../../../../public/styles/poetry.css';
import NavBar from '../../NavBar';
import PostCard from '../../PostCard';
import { useNavigate } from 'react-router-dom';
type Post = {
  id: number;
  title: string;
  content: string;
  date: string;
  tags: string[];
};

const Poetry: React.FC = () => {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('http://localhost:3000/api/posts/tag/poetry');
      const data = await response.json();
      console.log(data);
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <>
      <NavBar/>


      <div className="container-poetry">
        <button
          onClick={() => navigate(-1)}
          className="back-button-poetry"
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
        <img src='../../../public/inside_heart.webp' alt="poetry" className="poetry-image" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }}/>
        <div className="header-poetry">
          {Array.from('POETRY').map((char, index) => (
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
          ))}

        </div>
        <div className="posts-container-poetry">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content}
              date={post.date}
              tags={post.tags}
              type="blog"
              variant="poetry"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Poetry;

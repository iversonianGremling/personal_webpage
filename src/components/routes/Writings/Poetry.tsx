import React from 'react';
import '../../../../public/styles/poetry.css';
import NavBar from '../../NavBar';
type Post = {
  id: number;
  title: string;
  content: string;
  date: string;
  tags: string[];
};

const Poetry: React.FC = () => {
  const posts: Post[] = [
    {
      id: 1,
      title: 'The Whispering Wind',
      content: 'In the quiet of the forest, the wind whispered secrets of old...',
      date: '2023-05-10',
      tags: ['nature', 'whisper', 'forest'],
    },
    {
      id: 2,
      title: 'Echoes of the Night',
      content: 'Beneath the pale moonlight, echoes of dreams danced in shadows...',
      date: '2023-06-15',
      tags: ['night', 'echo', 'dreams'],
    },
    {
      id: 3,
      title: 'Flames of Solitude',
      content: 'In the solitude of the mind, flames of thought burned brightly...',
      date: '2023-07-01',
      tags: ['solitude', 'flame', 'thought'],
    },
  ];

  return (
    <>
      <NavBar/>
      <div className="container-poetry">
        <img src='../../../public/inside_heart.webp' alt="poetry" className="poetry-image" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }}/>
        <div className="header-poetry">Poetry</div>
        <div className="posts-container-poetry">
          {posts.map((post) => (
            <div key={post.id} className="post-card-poetry">
              <h2 className="post-title-poetry">{post.title}</h2>
              <p className="post-content-poetry">{post.content}</p>
              <div className="post-meta-poetry">
                <span>{post.date}</span> | <span>{post.tags.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Poetry;

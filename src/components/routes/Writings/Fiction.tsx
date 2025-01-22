import React from 'react';
import '../../../../public/styles/fiction.css';
import NavBar from '../../NavBar';

type Post = {
  id: number;
  title: string;
  content: string;
  date: string;
  tags: string[];
};

const Fiction: React.FC = () => {
  const posts: Post[] = [
    {
      id: 1,
      title: 'The Last Dreamer',
      content: 'In a world where dreams are forbidden, one man dares to dream...',
      date: '2023-04-20',
      tags: ['dreams', 'forbidden', 'adventure'],
    },
    {
      id: 2,
      title: 'The Forgotten Realm',
      content: 'A hidden world beyond the veil, waiting to be rediscovered...',
      date: '2023-05-25',
      tags: ['realm', 'mystery', 'magic'],
    },
    {
      id: 3,
      title: 'Shadows of Tomorrow',
      content: 'As the future unfolds, shadows of the past rise once again...',
      date: '2023-06-30',
      tags: ['future', 'shadows', 'time'],
    },
  ];

  return (
    <>
      <NavBar/>
      <div className="fiction-container">
        <img
          src='../../../public/inside_brain.webp'
          alt="fiction"
          className="fiction-image"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1,
          }}
        />
        <div className="fiction-header">Fiction</div>
        <div className="posts-container-fiction">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <h2 className="post-title-fiction">{post.title}</h2>
              <p className="post-content-fiction">{post.content}</p>
              <div className="post-meta-fiction">
                <span>{post.date}</span> | <span>{post.tags.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </>
  );
};

export default Fiction;

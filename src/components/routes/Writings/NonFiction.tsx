import React from 'react';
import '../../../../public/styles/non-fiction.css';
import NavBar from '../../NavBar';

type Post = {
  id: number;
  title: string;
  content: string;
  date: string;
  tags: string[];
};

const NonFiction: React.FC = () => {
  const posts: Post[] = [
    {
      id: 1,
      title: 'The Art of Mindfulness',
      content: 'A practical guide to finding peace in a chaotic world...',
      date: '2023-03-10',
      tags: ['mindfulness', 'peace', 'self-help'],
    },
    {
      id: 2,
      title: 'Journey Through History',
      content: 'Exploring the key events that shaped our modern world...',
      date: '2023-04-05',
      tags: ['history', 'events', 'world'],
    },
    {
      id: 3,
      title: 'Science Behind the Stars',
      content: 'Unraveling the mysteries of the universe and beyond...',
      date: '2023-05-15',
      tags: ['science', 'stars', 'universe'],
    },
  ];

  return (
    <>
      <NavBar/>
      <div className="container-non-fiction">
        <img
          src='../../../public/inside_intestine.webp'
          alt="nonfiction"
          className="nonfiction-image"
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
        <div className="header-non-fiction">NonFiction</div>
        <div className="posts-container-non-fiction">
          {posts.map((post) => (
            <div key={post.id} className="post-card-non-fiction">
              <h2 className="post-title-non-fiction">{post.title}</h2>
              <p className="post-content-non-fiction">{post.content}</p>
              <div className="post-meta-non-fiction">
                <span>{post.date}</span> | <span>{post.tags.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NonFiction;

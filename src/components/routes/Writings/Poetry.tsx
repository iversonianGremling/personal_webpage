import React, { useEffect } from 'react';
import '../../../../public/styles/poetry.css';
import NavBar from '../../NavBar';
import PostCard from '../../PostCard';
type Post = {
  id: number;
  title: string;
  content: string;
  date: string;
  tags: string[];
};

const Poetry: React.FC = () => {
  const [posts, setPosts] = React.useState<Post[]>([]);
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
        <img src='../../../public/inside_heart.webp' alt="poetry" className="poetry-image" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }}/>
        <div className="header-poetry">Poetry</div>
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

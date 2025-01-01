import React from 'react';
import PostCard from './PostCard';
import Post from '../types';

interface Props {
  posts: Post[]; // Define an array of Post objects
  className?: string;
}

const PostContainer: React.FC<Props> = ({ posts: posts, className }) => {
  return (
    <div className={`${className} mt-8 w-7/12`}>
      {posts.map((child, i) => (
        <PostCard
          id={i}
          key={i} // Provide a unique key for each item
          title={child.title}
          content={child.content}
          tags={child.tags}
          image={child.image}
          date={child.date}
          type={child.type}
        />
      ))}
    </div>
  );
};

export default PostContainer;

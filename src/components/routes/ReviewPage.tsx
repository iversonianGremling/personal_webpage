import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Post from '../../types';
import ReviewCard from '../ReviewCard';
import NavBar from '../NavBar';
import { apiUrl } from '../../assets/env-var';

const ReviewPage: React.FC = () => {

  const { tag } = useParams<{ tag: string }>();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(apiUrl + `/posts/tag/${tag}`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        const filteredData = data.filter((post: Post) => post.tags?.includes('review'));
        setPosts(filteredData);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [tag]);

  return (
    <>
      <NavBar />
      <div className="bg-white text-black p-8">
        {posts.length === 0 ? <p>Loading or under construction</p> :
          (<>
            <div className="flex flex-wrap justify-left">
              {posts.map((post) => (
                <ReviewCard key={post.id} post={post} />
              ))}
            </div>
          </>
          ) }

      </div>
    </>
  );
};

export default ReviewPage;

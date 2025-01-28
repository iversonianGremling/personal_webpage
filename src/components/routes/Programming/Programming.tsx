import React, { useEffect, useState } from 'react';
import ProgrammingSidebar from './ProgrammingSidebar';
import PostDetail from '../../PostDetail';
import NavBar from '../../NavBar';
import Post from '../../../types';
import { Link, Outlet } from 'react-router-dom';

const Programming: React.FC = () => {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/posts/tag/programming/latest');
        console.log(response);
        const data = await response.json();
        console.table(data);

        setLatestPosts(data);
      } catch (error) {
        console.error('Error fetching latest posts:', error);
      }
    };

    fetchLatestPosts();
  }, []);

  useEffect(() => {
    document.documentElement.style.backgroundColor = 'white';
    return () => {
      document.documentElement.style.backgroundColor = 'black';
    };
  }, []);

  useEffect(() => {
    console.log(selectedPostId);
  });

  return (
    <>
      <NavBar />
      <div className="flex h-screen">
        <ProgrammingSidebar onPostSelect={setSelectedPostId} />

        <div className="flex-1 p-8 overflow-y-auto">
          <Outlet /> {/* This will render PostDetail when on /programming/:id */}

          {/* Show default content only when no post is selected */}
          {!selectedPostId && (
            <div className="p-8">
              <h1 className="text-3xl font-bold mb-4">Programming</h1>
              <p>printf("And folks, let’s be honest...") – Al viro</p>
              <p className="text-xl">Recent posts</p>
              <ul className="list-disc pl-5 mt-4">
                {latestPosts.map(post => (
                  <li key={post.id}>
                    <Link
                      to={`/programming/${post.id}`}
                      className="text-blue-600 hover:underline"
                      style={{ fontFamily: 'VT323' }}
                      onClick={() => setSelectedPostId(post.id.toString())}
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Programming;

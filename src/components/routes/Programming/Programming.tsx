import React, { useEffect, useState } from 'react';
import ProgrammingSidebar from './ProgrammingSidebar';
import PostDetail from '../../PostDetail';
import NavBar from '../../NavBar';
import Post from '../../../types';
import { Link, Outlet } from 'react-router-dom';
import { apiUrl } from '../../../assets/env-var';

const Programming: React.FC = () => {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 720);
  const [loading, setLoading] = useState(true);
  const [mobilePosts, setMobilePosts] = useState<Post[]>([]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 720);
  };

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const response = await fetch(apiUrl + 'posts/tag/programming/latest');
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
    const fetchMobilePosts = async () => {
      try {
        const response = await fetch(apiUrl + 'posts/tag/programming/');
        console.log(response);
        const data = await response.json();

        const programmingPosts = data
          .filter((post: any) => post.tags?.includes('programming'))
          .map((post: any) => ({
            id: post.id.toString(),
            title: post.title,
            tags: post.tags
          }));

        setMobilePosts(programmingPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMobilePosts();
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
      <div className='gopher'>
        <NavBar />
        <div className="flex h-screen">
          {!isMobile && <ProgrammingSidebar onPostSelect={setSelectedPostId} />}

          <div className="flex-1 p-8 overflow-y-auto">

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
                        to={`/posts/${post.id}`}
                        className="text-blue-600 hover:underline"
                        style={{ fontFamily: 'VT323' }}
                        onClick={() => setSelectedPostId(post.id.toString())}
                      >
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ul>

                <p className='text-xl'>All posts</p>
                <div className='bg-black text-white border-1 border-white mt-2 pb-2'
                >
                  <div className='flex flex-col ml-2 text-emerald-400' style={{ fontFamily: 'VT323' }}>
                    <div className='flex flex-row'>
                      <p>body@velavelucci:~$</p>
                      <p className='ml-2 text-white'>ls -lha posts</p>
                    </div>
                    <ul>
                      {mobilePosts.map(post => (
                        <li key={post.id}>
                          <Link
                            to={`/posts/${post.id}`}
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
                </div>
              </div>

            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Programming;

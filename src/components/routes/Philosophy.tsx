import React, { useEffect } from 'react';
import NavBar from '../NavBar';
import Post from '../../types';
import PostCard from '../PostCard';

const PhilosophyBlog: React.FC = () => {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [latestPosts, setLatestPosts] = React.useState<Post[]>([]);
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('http://localhost:3000/api/posts/tag/philosophy');
      const data = await response.json();
      console.log(data);
      setPosts(data);
    };
    const fetchLatestPosts = async () => {
      const response = await fetch('http://localhost:3000/api/posts/tag/philosophy/latest');
      const data = await response.json();
      console.log(data);
      setLatestPosts(data);
    };
    fetchPosts();
    fetchLatestPosts();
  }, []);
  return (
    <>

      <NavBar />
      <div
        className="min-h-screen bg-black text-gray-300 p-8"
        style={{
          fontFamily: 'Georgia, serif',
          lineHeight: '1.8',
        }}
      >

        <header className="pb-6 mb-12 mt-12">
          <h1 className="text-5xl font-bold text-white text-center tracking-wide">Philosophy</h1>
          {/* <div className="flex flex-row justify-center gap-6">
          <div className='flex flex-col'>
            <p className="text-center text-gray-500 text-lg mt-2">
              “If you're trapped in the dream of the Other, you're fucked.”
            </p>
            <p className="text-center text-gray-500 text-lg">
          -Giles Deleuze
            </p>
          </div>
          <div>
            <p className="text-center text-gray-500 text-lg mt-2">
          “Man has, since the Enlightenment, dealt with things he should have ignored.”
            </p>
            <p className="text-center text-gray-500 text-lg">
          -Andrei Tarkovsky
            </p>
          </div>
          <div>
            <p className="text-center text-gray-500 text-lg mt-2">
“Nothing human makes it out of the near-future.”
            </p>
            <p className="text-center text-gray-500 text-lg">
          -Nick Land
            </p>
          </div>
        </div> */}

        </header>

        <main className="max-w-4xl mx-auto">
          <section className="mb-16">
            {posts.length > 0 && (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  content={post.content}
                  tags={post.tags}
                  date={post.date}
                  type={post.type}
                  variant='philosophy'
                  basePath={post.basePath}
                  index={post.index}
                />
              ))
            )}
          </section>
          {/* Recent Posts */}
          <section className="border-gray-700 pt-8">
            <h3 className="text-2xl font-semibold text-gray-400 mb-6">
            Recent Posts
            </h3>
            <div >
              <ul className='space-y-6'>
                {latestPosts.length > 0 && (
                  latestPosts.map((post) => (

                    <li key={post.id}>
                      <a href="#"
                        className="text-xl font-semibold text-white hover:text-gray-400 transition">
                        {post.title}
                      </a>
                      <p className="text-gray-500 mt-1">{post.content}</p>
                    </li>
                  ))
                )}
              </ul>
            </div>

          </section>
        </main>

      </div>
    </>
  );
};

export default PhilosophyBlog;

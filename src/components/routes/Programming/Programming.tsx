// src/Programming.tsx

import React, { useEffect, useState } from 'react';
import ProgrammingSidebar from './ProgrammingSidebar';
import PostDetail from '../../PostDetail';
import NavBar from '../../NavBar';

const Programming: React.FC = () => {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const handlePostSelect = (postId: string) => {
    setSelectedPostId(postId);
  };

  useEffect(() => {
    // Set background color to white when the component is mounted
    document.documentElement.style.backgroundColor = 'white';

    // Reset background color to black when the component is unmounted
    return () => {
      document.documentElement.style.backgroundColor = 'black';
    };
  }, []);

  return (
    <>
      <NavBar />
      <div className="flex h-screen">
        {/* Sidebar Section */}
        <ProgrammingSidebar onPostSelect={handlePostSelect} />

        {/* Main Content Section */}
        <div className="flex-1 p-8 overflow-y-auto">
          {selectedPostId ? (
            <PostDetail postId={selectedPostId} />
          ) : (
            <div className="p-8">
              <h1 className="text-3xl font-bold mb-4">Programming</h1>
              <p style={{}}>printf("And folks, let’s be honest. Sturgeon was an optimist. Way more than 90% of code is crap.")
– Al viro</p>
              <p className='text-xl'>Recent posts</p>
              <ul className="list-disc pl-5 mt-4">
                <li><a href="/programming/post1" className="text-blue-600 hover:underline" style={{ fontFamily: 'VT323'}}>Understanding Closures in JavaScript</a></li>
                <li><a href="/programming/post2" className="text-blue-600 hover:underline" style={{ fontFamily: 'VT323'}}>Getting Started with TypeScript</a></li>
                <li><a href="/programming/post3" className="text-blue-600 hover:underline" style={{ fontFamily: 'VT323'}}>React Hooks: A Beginner's Guide</a></li>
                <li><a href="/programming/post4" className="text-blue-600 hover:underline" style={{ fontFamily: 'VT323'}}>Building a Simple REST API with Node.js</a></li>
                <li><a href="/programming/post5" className="text-blue-600 hover:underline" style={{ fontFamily: 'VT323'}}>CSS Grid vs. Flexbox: When to Use Which</a></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Programming;

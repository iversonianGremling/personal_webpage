import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import Sidebar from './components/Sidebar';
import NavBar from './components/NavBar';
import PostContainer from './components/PostContainer';
import Login from './login';
import Post from './types';
// Other imports...

function App() {
  const posts: Post[] = [ //Api call
    {
      title: 'La funcionalidad de los lenguajes funcionales',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Donec euismod, nisl eget ultrices ultrices, nunc nisl ultricies nunc, auctor nunc nisl eu nisl. Nulla facilisi. Donec euismod, nisl eget ultrices ultrices, nunc nisl ultricies nunc, auctor nunc nisl eu nisl. Nulla facilisi. Donec euismod, nisl eget ultrices ultrices, nunc nisl ultricies nunc, auctor nunc nisl eu nisl.',
      tags: ['react', 'typescript'],
      image: 'image1.png',
      date: '2024-12-22',
      type: 'blog',
    },
    {
      title: 'Second Post',
      content: 'Another post with different content.',
      tags: ['css', 'javascript'],
      image: 'image2.png',
      date: '2024-12-21',
      type: 'blog',
    },
    {
      title: 'Exploring React Hooks',
      content: 'React Hooks are a powerful feature introduced in React 16.8. They allow function components to use state and other React features.',
      tags: ['react', 'hooks'],
      image: 'image3.png',
      date: '2024-12-20',
      type: 'blog',
    },
    {
      title: 'Styling Components in React',
      content: 'CSS-in-JS libraries like Styled Components and Emotion have gained popularity for their ability to scope styles to components.',
      tags: ['css', 'react'],
      image: 'image4.png',
      date: '2024-12-19',
      type: 'blog',
    },
    {
      title: 'Understanding TypeScript',
      content: 'TypeScript brings static typing to JavaScript, helping developers catch errors early and write better code.',
      tags: ['typescript', 'javascript'],
      image: 'image5.png',
      date: '2024-12-18',
      type: 'blog',
    },
  ];

  return (
    <div className="App min-h-screen bg-black bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: 'url(\'/path-to-your-image.jpg\')' }}>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/" element={
            <>
              <Sidebar />
              <NavBar />
              <div className="left-14">
                <div className="title text-7xl text-red-600 text-center font-serif mt-6 transition-colors hover:text-white ml-80">LAST POSTS</div>
                <div className="flex flex-col justify-center items-center text-center ">
                  <PostContainer posts={posts} className="post-container" />
                </div>
              </div>
            </>
          } />
          {/* Add other routes as needed */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

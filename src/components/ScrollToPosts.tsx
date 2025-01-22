import React from 'react';

const ScrollToPosts = () => {
  const handleScrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth', // Smooth scrolling animation
    });
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div
        className="flex flex-col items-center space-y-4 cursor-pointer text-red-700 pb-32 hover:text-white transition-colors duration-300"
        onClick={handleScrollToBottom}
      >
        <h2 className="text-2xl font-semibold font-serif">LATEST POSTS</h2>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
          className="w-10 h-10"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default ScrollToPosts;

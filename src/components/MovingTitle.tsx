import React, { useEffect, useState } from 'react';

const MovingTitle = () => {

  return (
    <div className="container h-28 w-full mx-auto relative overflow-hidden pb-6 mb-2 content-center">
      <div
        className="title text-8xl text-red-600 font-serif mt-6 transition-colors absolute top-0 cursor-default shadow-lg pb-16 text-center"
      >
        LATEST POSTS
      </div>


    </div>
  );
};

export default MovingTitle;

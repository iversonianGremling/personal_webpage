import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const MovingTitle = () => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 720);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleResize = () => {
    const mobile = window.innerWidth < 720;
    setIsMobile(mobile);
  };

  return (
    <div className={`container h-28 w-full mx-auto relative ${isMobile ? '' : ''} pb-6 mb-2 content-center`}>
      <div
        className={`${isMobile ? 'text-7xl' : 'text-8xl'} title text-red-600 font-serif mt-6 transition-colors absolute top-0 cursor-default shadow-lg pb-16 text-left`}
      >
        {t('posts.latestPosts')}
      </div>


    </div>
  );
};

export default MovingTitle;

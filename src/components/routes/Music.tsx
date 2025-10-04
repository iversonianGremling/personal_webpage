import React from 'react';
import NavBar from '../NavBar';
import { useTranslation } from 'react-i18next';

const Music: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-white text-black p-8">
        <h1 className="text-5xl font-bold text-center mb-8 border-b-4 border-black pb-4">
          {t('musicPage.title')}
        </h1>
        <div className='mb-2'>
          {t('musicPage.description')}
        </div>

        {/* YouTube Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4 border-b-2 border-black">{t('musicPage.platform1')}</h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="border-4 border-black p-2">
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/K0-zBSbicpE"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full"
              ></iframe>
            </div>
            <div className="border-4 border-black p-2">
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/l-Df5ATkJsQ"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full"
              ></iframe>
            </div>
          </div>
        </div>

        {/* SoundCloud Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4 border-b-2 border-black">{t('musicPage.platform2')}</h2>
          <div className="border-4 border-black p-4">
            <iframe
              width="100%"
              height="166"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/vela-velucci/&color=%23000000&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
              className="w-full"
            ></iframe>
          </div>
        </div>

        {/* Bandcamp Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4 border-b-2 border-black">{t('musicPage.platform3')}</h2>
          <div className="border-4 border-black p-4 inline-block">
            <a href="https://stephenwoolf.bandcamp.com/music">{t('musicPage.bandcampLink')}</a>
          </div>
        </div>

      </div>
    </>
  );
};

export default Music;

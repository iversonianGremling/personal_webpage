import React from 'react';
import NavBar from '../NavBar';

const Music: React.FC = () => {
  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-white text-black p-8">
        <h1 className="text-5xl font-bold text-center mb-8 border-b-4 border-black pb-4">My Music Showcase</h1>

        {/* YouTube Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4 border-b-2 border-black">YouTube Videos</h2>
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
          <h2 className="text-3xl font-bold mb-4 border-b-2 border-black">SoundCloud</h2>
          <div className="border-4 border-black p-4">
            <iframe
              width="100%"
              height="166"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/YOUR_TRACK_ID&color=%23000000&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
              className="w-full"
            ></iframe>
          </div>
        </div>

        {/* Bandcamp Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4 border-b-2 border-black">Bandcamp</h2>
          <div className="border-4 border-black p-4 inline-block">
            <iframe
              style={{ border: '0', width: '350px', height: '470px' }}
              src="https://bandcamp.com/EmbeddedPlayer/album=YOUR_ALBUM_ID/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/"
              seamless
            >
              <a href="https://YOUR_BANDCAMP_URL">Your Album Name</a>
            </iframe>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 border-t-4 border-black pt-4">
          <p className="text-xl font-bold">Follow me on YouTube, Bandcamp, and SoundCloud for more music!</p>
        </div>
      </div>
    </>
  );
};

export default Music;

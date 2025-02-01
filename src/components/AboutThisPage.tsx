import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white p-8 pt-20">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Permanent+Marker&family=Shadows+Into+Light&family=Indie+Flower&family=Dancing+Script:wght@400;700&display=swap');
        `}
      </style>

      <h1
        className="text-6xl mb-16 text-center"
        style={{
          fontFamily: 'Permanent Marker, cursive',
          textShadow: '0 0 15px rgba(255,255,255,0.4)'
        }}
      >
        Why This Exists
      </h1>

      <div className="max-w-3xl mx-auto space-y-12 text-xl">
        <p
          className="leading-relaxed"
          style={{
            fontFamily: 'Caveat, cursive',
            fontSize: '2.1rem',
            transform: 'rotate(-0.7deg)'
          }}
        >
          <span style={{ fontFamily: 'Shadows Into Light, cursive' }}></span>
          <span style={{ fontFamily: 'Indie Flower, cursive' }}>My blood </span>         </p>

        <div
          className="p-6 border rounded-lg"
          style={{
            fontFamily: 'Shadows Into Light, cursive',
            borderColor: 'rgba(255,255,255,0.2)',
            transform: 'rotate(1.2deg)',
            fontSize: '1.8rem'
          }}
        >
          The methodologies and inner mechanisms are <span style={{ fontFamily: 'Permanent Marker, cursive' }}>completely irrelevant but include: </span>
          <span style={{ fontFamily: 'Caveat, cursive' }}> </span><br/>
          <span className="ml-8">→</span> Ego death<br/>
          <span className="ml-8">→</span> Digital brutalism<br/>
          <span className="ml-8">→</span> Philosophical fragments<br/>
          <span className="ml-8">→</span> Software demonic rituals
        </div>

        <p
          style={{
            fontFamily: 'Indie Flower, cursive',
            fontSize: '1.7rem',
            lineHeight: '1.8',
            textShadow: '0 0 8px rgba(255,255,255,0.2)'
          }}
        >
          <span style={{ fontFamily: 'Dancing Script, cursive' }}>As everything that has life</span>, it's unpolished.
          <span style={{ fontFamily: 'Permanent Marker, cursive' }}> As every piece of software</span>, it's
          forever-unfinished
          <span style={{ fontFamily: 'Caveat, cursive' }}> this website preexists</span> modern web development.
        </p>

        <div
          className="p-6 bg-black border-2 mt-16"
          style={{
            fontFamily: 'Shadows Into Light, cursive',
            borderColor: 'rgba(255,75,75,0.3)',
            transform: 'rotate(-2deg)'
          }}
        >
          <div className="text-center mb-4" style={{ fontFamily: 'Permanent Marker, cursive', fontSize: '1.8rem' }}>
            ↗ OOP Patterns used ↗
          </div>
          <div className="text-center" style={{ fontFamily: 'Caveat, cursive', fontSize: '1.4rem' }}>
            No spooky cookies<br/>
            No ads that steal time<br/>
            "Emptiness as a concept"
          </div>
        </div>

        <div
          className="border-t pt-12 mt-20"
          style={{
            fontFamily: 'Indie Flower, cursive',
            borderColor: 'rgba(255,255,255,0.1)'
          }}
        >
          <h2 className="text-3xl mb-6" style={{ fontFamily: 'Permanent Marker, cursive' }}>Blood Components:</h2>
          <ul className="space-y-4 text-2xl pl-8">
            <li style={{ fontFamily: 'Caveat, cursive' }}>→ <span className="underline">The reanimated corpse of my </span>CV</li>
            <li style={{ fontFamily: 'Shadows Into Light, cursive' }}>→ Trauma</li>
            <li style={{ fontFamily: 'Dancing Script, cursive' }}>→ Love, passion, romanticism</li>
            <li style={{ fontFamily: 'Indie Flower, cursive' }}>→ Stolen time</li>
            <li
              className="text-red-300"
              style={{
                fontFamily: 'Permanent Marker, cursive',
                textShadow: '0 0 10px rgba(255,0,0,0.3)'
              }}
            >
              → Finger bleeding keystrokes
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

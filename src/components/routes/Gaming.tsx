import React, { useEffect, useState } from 'react';
import NavBar from '../NavBar';
import '../../../public/styles/flicker.css';
import Post from '../../types';

const GamingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('http://localhost:3000/api/posts/tag/gaming');
      const data = await response.json();
      console.log(data);
      setPosts(data);
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConsoleClick = (consoleName: string) => {
    switch (consoleName) {
      case 'Atari 2600':
        alert('People used to take LSD while making my games. Also I invented the concept of having contracts with companies so they couldn\'t be developed by other companies, you are welcome blyaaaaaaaat! 🎮');
        break;
      case 'PC':
        alert('You either get a 4090GTX for playing marvel rivals in 4k in 3 monitors in ultra at 1000fps or you are using it for mining bitcoins, either way, gaming and gambling addicts found the same piece of hardware as a useful way for feeding their addiction 🎮');
        break;
      case 'Nintendo':
        alert('Yeah, I love treating my employees like shit while making games for children, btw in Zelda II Link recovered health when sleeping with prostitutes?? 🎮');
        break;
      case 'Sega':
        alert('Does what nintendon\'t, aka, the mascot of autistic people all over the world 🎮');
        break;
      case 'Chess':
        alert('Chess is the dark souls of colonoscopies');
        break;
      case 'Bondage':
        alert('As much as bed gaming is a fun topic this is a serious website and here, we separate stuff properly, this part is not for *that* kind of games, please, refer yourself to the sexuality section, this section is EXCLUSIVELY for epic games 🎮');
        break;
      default:
        alert(`You are a true ${consoleName} fan! 🎮`);
    }
  };

  return (
    <>
      <NavBar />
      <div
        className="min-h-screen p-8"
        style={{
          backgroundImage: 'url("https://www.webdesignmuseum.org/uploaded/fullscreen/2002/sega-2002.png")',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          color: '#00ff00',
          fontFamily: 'Comic Sans MS, cursive, sans-serif',
          textShadow: '2px 2px #ff0000',
        }}
      >
        <h1
          className="text-6xl font-bold text-center mb-8 animate-pulse"
          style={{ border: '5px solid yellow', padding: '10px' }}
        >
        Welcome to the Ultimate Gaming Zone
        </h1>

        {/* Fake Console Navbar */}
        <div className="flex justify-center gap-8 mb-12">
          {['PC', 'Nintendo', 'Sega', 'Chess', 'Atari 2600','Bondage'].map((console) => (
            <button
              key={console}
              onClick={() => handleConsoleClick(console)}
              className="px-6 py-3 text-2xl font-bold bg-black border-4 border-green-500 text-green-300 hover:text-red-500 hover:border-red-500"
            >
              {console}
            </button>
          ))}
        </div>

        <marquee
          behavior="scroll"
          direction="left"
          scrollamount="10"
          className="text-4xl font-bold mb-8"
          style={{ color: '#ff00ff' }}
        >
        🎮 YOU HAVE FAILED THE LUDONARRATIVE EXAM, FUCK YEAH 🎮
        </marquee>

        {/* Search Bar */}
        <div className="text-center mb-8">
          <input
            type="text"
            placeholder="Search for epic gamer posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 text-2xl border-4 border-green-500 bg-black text-green-300 placeholder-yellow-400 focus:outline-none"
            style={{ width: '80%' }}
          />
        </div>

        {/* Recent Posts Section */}
        <div className="text-center mb-12">
          <h2
            className="text-5xl font-extrabold mb-4 underline flicker-effect"
            style={{ color: '#ff6600' }}
          >
          Recent Posts
          </h2>
          <ul className="list-disc list-inside text-left text-3xl mx-auto w-3/4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <li
                  key={post.id}
                  className="hover:text-red-500"
                  style={{ cursor: 'pointer' }}
                >
                  <a href={`/posts/${post.id}`} style={{ color: '#00ff00' }}>
                    {post.title}
                  </a>
                </li>
              ))
            ) : (
              <p className="text-red-500">No posts found. Try another search!</p>
            )}
          </ul>
        </div>

        {/* Quotes Section */}
        <div className="flex flex-wrap justify-center gap-12 mb-12">
          <div className="border-4 border-pink-500 p-4 bg-yellow-300 max-w-80">
            <p className="mt-2 text-center text-xl max-w-40">
            "I think tackling the fourth wall so directly is kind of tasteless in the modern world." - Entity inside the Polyhedron, Pathologic
            </p>
          </div>
          <div className="border-4 border-cyan-500 p-4 bg-purple-300 max-w-80">
            <p className="mt-2 text-center text-xl">
            "Any choice is right as long as it's willed." - Artemy Burakh, Pathologic
            </p>
          </div>
          <div
            className="border-4 border-green-500 p-4 bg-pink-300 max-w-80"
            style={{ maxHeight: '19rem' }}
          >
            <p className="mt-2 text-center text-xl">
            "SHOOT ME IN THE FACE! IN THE FAAAAAAAACE! DO IT! SHOOT ME IN THE
            FACE! FACE FACEFACEFACEFACE! NOW! BULLETS IN THE FACE! WANT EM! NEED
            EM! GIMMEGIMMEGIMME! AT THE SOUND OF THE BELL IT WILL BE FACESHOOTING
            O'CLOCK! BONGGGGG! KNOCK KNOCK WHO'S THERE SHOOT ME IN THE FACE! END
            OF JOKE! I'M GONNA SING A SONG! SHOOT ME AT THE END OF IT! DA DA DA
            DA DA DA DA! BONG!! ...I NOTICE YOU HAVEN'T SHOT ME IN THE FACE!
            CURIOUS AS TO WHY! Maybe you're weighing the moral pros and cons but
            let me assure you that OH MY GOD SHOOT ME IN THE GODDAMNED FACE!! WHAT
            ARE YOU WAITING FOR!?!?" - Face McShooty, Borderlands 2
            </p>
          </div>
          <div className="border-4 border-purple-500 p-4 bg-cyan-300 max-w-80">
            <p className="mt-2 text-center text-xl">
            "Anything not saved will be lost." - Nelson Mandela
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="text-center text-2xl font-bold"
          style={{
            backgroundColor: '#0000ff',
            color: '#00ff00',
            padding: '10px',
            border: '5px dashed #ff00ff',
          }}
        >
        © 2000 GamingZone. All Rights Reserved. Soundtrack of the webpage composed by Tommy Tallarico
        </div>
      </div>
    </>
  );
};

export default GamingPage;

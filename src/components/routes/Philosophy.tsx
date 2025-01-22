import React from 'react';
import NavBar from '../NavBar';

const PhilosophyBlog: React.FC = () => {
  return (
    <div
      className="min-h-screen bg-black text-gray-300 p-8"
      style={{
        fontFamily: 'Georgia, serif',
        lineHeight: '1.8',
      }}
    >

      <NavBar />
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
        {/* Featured Article */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-white mb-4">
            Acceleration and Catastrophe
          </h2>
          <p className="text-gray-400 mb-4">
            "Capitalism is nothing more than a machine that accelerates
            deterritorialization." — Nick Land
          </p>
          <p>
            In a world increasingly defined by abstraction and hyperstition, we
            find ourselves at the edge of thought, where philosophy dissolves
            into the future. The works of Nick Land, Deleuze, and Brassier push
            us into a confrontation with the real—a real that escapes human
            comprehension, yet defines the contours of existence.
          </p>
        </section>

        {/* Recent Posts */}
        <section className="border-gray-700 pt-8">
          <h3 className="text-2xl font-semibold text-gray-400 mb-6">
            Recent Posts
          </h3>
          <ul className="space-y-6">
            <li>
              <a
                href="#"
                className="text-xl font-semibold text-white hover:text-gray-400 transition"
              >
                Hyperstition and the Future of Reality
              </a>
              <p className="text-gray-500 mt-1">
                Hyperstition, a concept coined by Nick Land, describes the way
                ideas influence reality by accelerating their own becoming.
              </p>
            </li>
            <li>
              <a
                href="#"
                className="text-xl font-semibold text-white hover:text-gray-400 transition"
              >
                Machines of Desire: Deleuzian Assemblages
              </a>
              <p className="text-gray-500 mt-1">
                Deleuze and Guattari’s concept of the assemblage offers a lens
                through which we can understand the fragmented nature of desire
                in modernity.
              </p>
            </li>
            <li>
              <a
                href="#"
                className="text-xl font-semibold text-white hover:text-gray-400 transition"
              >
                Nihil Unbound: Brassier’s Dark Enlightenment
              </a>
              <p className="text-gray-500 mt-1">
                Ray Brassier’s nihilism confronts the void left by metaphysics,
                offering a stark, uncompromising view of existence.
              </p>
            </li>
          </ul>
        </section>
      </main>

    </div>
  );
};

export default PhilosophyBlog;

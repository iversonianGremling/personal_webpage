import React from 'react';

const Sidebar = () => {
  return (
    <div className="absolute top-14 left-0 h-screen w-64 mt-12 ml-8 text-white shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">About Me</h2>
      <img
        src="../assets/react.svg"
        alt="Your Name"
        className="w-32 h-32 rounded-full mx-auto mb-4"
      />
      <p className="text-center text-gray-300 mb-4">
        Hi, I&apos;m [Your Name], a passionate [Your Profession/Role] who loves coding, writing, and creating beautiful things. Let&apos;s connect!
      </p>
      <div className="text-sm space-y-2">
        <p><strong>Location:</strong> Your City, Your Country</p>
        <p><strong>Interests:</strong> Programming, Music, Art</p>
        <p><strong>Email:</strong> your-email@example.com</p>
      </div>
      <div className="mt-6 flex justify-center space-x-4">
        <a
          href="https://twitter.com/yourprofile"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-400"
        >
          Twitter
        </a>
        <a
          href="https://github.com/yourprofile"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400"
        >
          GitHub
        </a>
        <a
          href="https://linkedin.com/in/yourprofile"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-300"
        >
          LinkedIn
        </a>
      </div>
    </div>
  );
};

export default Sidebar;

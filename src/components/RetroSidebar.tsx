import React, { useState } from 'react';

function RetroSidebar() {
  const [openMenu, setOpenMenu] = useState({});
  const [theme, setTheme] = useState('retrosidebar');
  const loadTheme = (newTheme: string) => {
    // Remove any existing theme link tag
    const existingLink = document.getElementById('theme-stylesheet');
    if (existingLink) {
      existingLink.remove();
    }

    // Create a new link element for the new theme
    const link = document.createElement('link');
    link.id = 'theme-stylesheet';
    link.rel = 'stylesheet';
    link.href = `/styles/${newTheme}.css`;
    document.head.appendChild(link);

    setTheme(newTheme); // Update theme state
  };
  const toggleMenu = (menu) => {
    setOpenMenu((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  return (
    <nav className="sidebar">
      <ul>
        <li>
          <a onClick={() => toggleMenu('music')}>📁 Music</a>
          {openMenu['music'] && (
            <ul>
              <li><a href="#">Soundcloud</a></li>
              <li><a href="#">Bandcamp</a></li>
              <li><a href="#">YouTube</a></li>
              <li><a href="#">Twitch</a></li>
              <li><a href="#">TikTok</a></li>
            </ul>
          )}
        </li>
        <li><a href="#">📁 Programming</a></li>
        <li>
          <a onClick={() => toggleMenu('videos')}>📁 Videos</a>
          {openMenu['videos'] && (
            <ul>
              <li><a href="#">Video Essays</a></li>
            </ul>
          )}
        </li>
        <li>
          <a onClick={() => toggleMenu('articles')}>📁 Articles</a>
          {openMenu['articles'] && (
            <ul>
              <li><a href="#">Programming</a></li>
              <li><a href="#">Arts</a></li>
              <li><a href="#">Opinion</a></li>
              <li><a href="#">Philosophy</a></li>
              <li><a href="#">Mathematics</a></li>
              <li><a href="#">Gaming</a></li>
              <li><a href="#">Literature</a></li>
            </ul>
          )}
        </li>
        <li>
          <a onClick={() => toggleMenu('streaming')}>📁 Streaming</a>
          {openMenu['streaming'] && (
            <ul>
              <li><a href="#">Twitch</a></li>
            </ul>
          )}
        </li>
        <li>
          <a onClick={() => toggleMenu('writings')}>📁 Writings</a>
          {openMenu['writings'] && (
            <ul>
              <li><a href="#">Poems</a></li>
              <li><a href="#">Fiction</a></li>
              <li><a href="#">Fanfiction</a></li>
              <li><a href="#">Vent Writing</a></li>
            </ul>
          )}
        </li>
        <li>
          <a onClick={() => toggleMenu('visualArt')}>📁 Visual Art</a>
          {openMenu['visualArt'] && (
            <ul>
              <li><a href="#">Photography</a></li>
              <li><a href="#">Collages</a></li>
              <li><a href="#">Digital Art</a></li>
              <li><a href="#">Drawings</a></li>
            </ul>
          )}
        </li>
        <li>
          <a onClick={() => toggleMenu('socialMedia')}>📁 Social Media</a>
          {openMenu['socialMedia'] && (
            <ul>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">TikTok</a></li>
            </ul>
          )}
        </li>
        <li><a href="#">📁 Patreon</a></li>
        <li><a href="#">📁 Contact</a></li>
      </ul>
    </nav>
  );
}

export default RetroSidebar;

import React from 'react';
import '../App.css';

function NavBar() {
  return (
    <nav>
      <ul>
        <li>
          <a>Posts</a>
          <ul>
            <li><a>Programming</a></li>
            <li><a>Arts</a></li>
            <li><a>Opinion</a></li>
            <li><a>Philosophy</a></li>
            <li><a>Mathematics</a></li>
            <li><a>Gaming</a></li>
            <li><a>Literature</a></li>
          </ul>
        </li>

        <li>
          <a>Music</a>
          <ul>
            <li><a>Soundcloud</a></li>
            <li><a>Bandcamp</a></li>
            <li><a>Youtube</a></li>
            <li><a>Twitch</a></li>
            <li><a>TikTok</a></li>
          </ul>
        </li>
        <li><a>Programming</a>
          <ul>
            <li><a>Articles</a>
            </li>
          </ul>
        </li>
        <li>
          <a>Videos</a>
        </li>
        <li>
          <a>Streaming</a>
          <ul>
            <li><a>Twitch</a></li>
          </ul>
        </li>
        <li>
          <a>Writings</a>
          <ul>
            <li><a>Poems</a></li>
            <li><a>Fiction</a></li>
            <li><a>Fanfiction</a></li>
            <li><a>Vent Writing</a></li>
          </ul>
        </li>
        <li>
          <a>Visual Media</a>
          <ul>
            <li><a>Articles</a></li>
            <li><a>Photography</a></li>
            <li><a>Collages</a></li>
            <li><a>Digital Art</a></li>
            <li><a>Drawings</a></li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;

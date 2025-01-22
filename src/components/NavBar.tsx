import React from 'react';
import { Link } from 'react-router-dom'; // <-- Import Link
import '../App.css';

function NavBar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/music">Music</Link>
          <ul>
            <li><Link to="/music/soundcloud">Soundcloud</Link></li>
            <li><Link to="/music/bandcamp">Bandcamp</Link></li>
            <li><Link to="/music/youtube">YouTube</Link></li>
            <li><Link to="/music/twitch">Twitch</Link></li>
            <li><Link to="/music/tiktok">TikTok</Link></li>
          </ul>
        </li>

        <li>
          <Link to="/programming">Programming</Link>
          <ul>
            <li><Link to="/programming/articles">Articles</Link></li>
          </ul>
        </li>

        <li>
          <Link to="http://www.youtube.com/@Vdevelasko">Videos</Link>
        </li>

        <li>
          <Link to="/streaming">Streaming</Link>
          <ul>
            <li><Link to="/streaming/twitch">Twitch</Link></li>
          </ul>
        </li>

        <li>
          <Link to="/writings">Writings</Link>
          <ul>
            <li><Link to="/writings/poems">Poems</Link></li>
            <li><Link to="/writings/fiction">Fiction</Link></li>
            <li><Link to="/writings/nonfiction">Fanfiction</Link></li>
          </ul>
        </li>

        <li>
          <Link to="/visual-media">Visual Media</Link>
          <ul>
            <li><Link to="/visual-media/articles">Articles</Link></li>
            <li><Link to="/visual-media/photography">Photography</Link></li>
            <li><Link to="/visual-media/collages">Collages</Link></li>
            <li><Link to="/visual-media/digital-art">Digital Art</Link></li>
            <li><Link to="/visual-media/drawings">Drawings</Link></li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;

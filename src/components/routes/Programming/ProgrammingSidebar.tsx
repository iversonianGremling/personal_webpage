import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../../../assets/env-var';
import '../../../assets/styles/gopher.css';

interface Post {
  id: string;
  title: string;
  tags: string[];
}

interface Folder {
  id: string;
  name: string;
  posts?: Post[];
}

interface ProgrammingSidebarProps {
  onPostSelect: (postId: string) => void;
}

const ProgrammingSidebar: React.FC<ProgrammingSidebarProps> = ({ onPostSelect }) => {
  const [expanded, setExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(apiUrl + 'posts/tag/programming/');
        console.log(response);
        const data = await response.json();

        const programmingPosts = data
          .filter((post: any) => post.tags?.includes('programming'))
          .map((post: any) => ({
            id: post.id.toString(),
            title: post.title,
            tags: post.tags
          }));

        setPosts(programmingPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts;
    return posts.filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [posts, searchQuery]);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '../../src/assets/styles/gopher.css';
    link.id = 'gopher-stylesheet';
    document.head.appendChild(link);

    return () => {
      const existingLink = document.getElementById('gopher-stylesheet');
      if (existingLink) document.head.removeChild(existingLink);
    };
  }, []);

  return (
    <div className="w-64 h-screen bg-gray-100 border-r border-gray-300 p-4">
      <div className="mb-4 flex flex-row items-center">
        <img
          src='../../src/assets/icons/search.png'
          alt="Search"
          className="pr-1 py-1 size-8"
        />
        <input
          type="text"
          placeholder="Search posts or folders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
        </div>
      ) : (
        <ul>
          <li className="mb-2">
            <div
              className="cursor-pointer font-bold text-gray-700 hover:text-gray-900"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <img
                  src='../../src/assets/icons/open_folder.png'
                  alt="Open Folder"
                  className="inline-block mr-2 max-h-4"
                />
              ) : (
                <img
                  src='../../src/assets/icons/closed_folder.png'
                  alt="Closed Folder"
                  className="inline-block mr-2 max-h-4"
                />
              )}
              Programming
            </div>
            {expanded && (
              <ul className="mt-2 ml-4">
                {filteredPosts.map(post => (
                  <li
                    key={post.id}
                    className="text-gray-600 hover:text-gray-800 cursor-pointer"
                    // onClick={() => onPostSelect(post.id)}
                    onClick={() => navigate(`/posts/${post.id}`)}
                    style={{ fontFamily: 'VT323' }}
                  >
                    {post.title}
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      )}
    </div>
  );
};

export default ProgrammingSidebar;


import React, { useState, useEffect, useMemo } from 'react';

interface Post {
  id: string;
  title: string;
}

interface Folder {
  id: string;
  name: string;
  posts?: Post[];
  subfolders?: Folder[];
}

interface ProgrammingSidebarProps {
  onPostSelect: (postId: string) => void;
}

// Sample data
const foldersData: Folder[] = [
  {
    id: 'folder1',
    name: 'Folder 1',
    subfolders: [
      {
        id: 'subfolder1',
        name: 'Subfolder 1',
        posts: [
          { id: '1', title: 'Post 1' },
          { id: '2', title: 'Post 2' },
        ],
      },
      {
        id: 'subfolder2',
        name: 'Subfolder 2',
        posts: [{ id: '3', title: 'Post 3' }],
      },
    ],
  },
  {
    id: 'folder2',
    name: 'Folder 2',
    posts: [
      { id: '4', title: 'Post 4' },
      { id: '5', title: 'Post 5' },
    ],
  },
];

// Helper: shallow-compare two string arrays
function arraysAreEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((val, i) => val === b[i]);
}

const ProgrammingSidebar: React.FC<ProgrammingSidebarProps> = ({ onPostSelect }) => {
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [manuallyToggledFolders, setManuallyToggledFolders] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleFolder = (folderId: string) => {
    setManuallyToggledFolders((prev) =>
      prev.includes(folderId)
        ? prev.filter((id) => id !== folderId) // Remove if it's already toggled
        : [...prev, folderId] // Add if it's not toggled yet
    );
    // Remove from expandedFolders when manually toggled closed
    setExpandedFolders((prev) => prev.filter((id) => id !== folderId));
  };

  const filterFolders = (
    folders: Folder[],
    query: string
  ): { filtered: Folder[]; expandedIds: string[] } => {
    if (!query) return { filtered: folders, expandedIds: [] };

    const expandedIds: string[] = [];

    const filtered = folders
      .map((folder) => {
        const matchingSubfolders = folder.subfolders
          ? filterFolders(folder.subfolders, query)
          : { filtered: [], expandedIds: [] };

        const matchingPosts = folder.posts
          ? folder.posts.filter((post) =>
            post.title.toLowerCase().includes(query.toLowerCase())
          )
          : [];

        if (
          folder.name.toLowerCase().includes(query.toLowerCase()) ||
          matchingSubfolders.filtered.length > 0 ||
          matchingPosts.length > 0
        ) {
          expandedIds.push(folder.id, ...matchingSubfolders.expandedIds);
          return {
            ...folder,
            subfolders: matchingSubfolders.filtered,
            posts: matchingPosts,
          };
        }
        return null;
      })
      .filter(Boolean) as Folder[];

    return { filtered, expandedIds };
  };

  const { filtered: filteredFolders, expandedIds } = useMemo(() => {
    return filterFolders(foldersData, searchQuery);
  }, [foldersData, searchQuery]); // Memoize result based on searchQuery and foldersData

  useEffect(() => {
    // Dynamically load the stylesheet
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/public/styles/gopher.css';
    link.id = 'gopher-stylesheet';
    document.head.appendChild(link);

    // Cleanup: Remove the stylesheet when the component unmounts
    return () => {
      const existingLink = document.getElementById('gopher-stylesheet');
      if (existingLink) {
        document.head.removeChild(existingLink);
      }
    };
  }, []);

  useEffect(() => {
    if (searchQuery) {
      console.log(searchQuery);
      if (!arraysAreEqual(expandedFolders, expandedIds)) {
        setExpandedFolders(expandedIds);
      }
    } else {
      setExpandedFolders([]);
    }
  }, [searchQuery, expandedIds]); // Remove expandedFolders from the dependency array

  const isFolderExpanded = (folderId: string) =>
    manuallyToggledFolders.includes(folderId) || expandedFolders.includes(folderId);

  const renderFolder = (folder: Folder) => (
    <li key={folder.id} className="mb-2">
      <div
        className="cursor-pointer font-bold text-gray-700 hover:text-gray-900"
        onClick={() => toggleFolder(folder.id)}
      >
        {isFolderExpanded(folder.id) ? (
          <img
            src="../../../../public/open_folder.png"
            alt="Folder Icon"
            className="inline-block mr-2 max-h-4"
          />
        ) : (
          <img
            src="../../../../public/closed_folder.png"
            alt="Folder Icon"
            className="inline-block mr-2 max-h-4"
          />
        )}
        {folder.name}
      </div>
      {isFolderExpanded(folder.id) && (
        <ul className="mt-2 ml-4">
          {folder.subfolders && folder.subfolders.map((sub) => renderFolder(sub))}
          {folder.posts &&
            folder.posts.map((post) => (
              <li
                key={post.id}
                className="text-gray-600 hover:text-gray-800 cursor-pointer"
                onClick={() => onPostSelect(post.id)}
              >
                {post.title}
              </li>
            ))}
        </ul>
      )}
    </li>
  );

  return (
    <div className="w-64 h-screen bg-gray-100 border-r border-gray-300 p-4">
      <div className="mb-4 flex flex-row items-center">
        <img src="../../../../public/search.png" alt="Programming Icon" className="pr-1 py-1 size-8" />
        <input
          type="text"
          placeholder="Search posts or folders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <ul>{filteredFolders.map(renderFolder)}</ul>
    </div>
  );
};

export default ProgrammingSidebar;

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import '../App.css';
import { SelectLanguage } from './SelectLanguage';
import ThemeSwitcher from './SelectStyle';
import Categories from './Categories';
import About from './About';

function NavBar() {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const dropdownRefCategories = useRef<HTMLDivElement>(null);
  const dropdownRefAbout = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Check Categories dropdown
      if (dropdownRefCategories.current &&
          !dropdownRefCategories.current.contains(target)) {
        setIsCategoriesOpen(false);
      }

      // Check About dropdown
      if (dropdownRefAbout.current &&
          !dropdownRefAbout.current.contains(target)) {
        setIsAboutOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCategoriesClick = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
    // Close About if opening Categories
    if (!isCategoriesOpen) setIsAboutOpen(false);
  };

  const handleAboutClick = () => {
    setIsAboutOpen(!isAboutOpen);
    // Close Categories if opening About
    if (!isAboutOpen) setIsCategoriesOpen(false);
  };

  return (
    <nav>
      <ul className="flex gap-4 relative">
        <li>
          <Link to="/">Home</Link>
        </li>

        {/* Categories Dropdown */}
        <li className="relative"
          onClick={handleCategoriesClick}
        >
          <button
            className="hover:text-gray-300 transition-colors"
            aria-haspopup="true"
            aria-expanded={isCategoriesOpen}
          >
            Categories
          </button>
          <div
            ref={dropdownRefCategories}
            className={`absolute top-full left-0 dark:bg-gray-800 shadow-lg rounded-md mt-1 transition-all duration-200 ${
              isCategoriesOpen
                ? 'opacity-100 translate-y-0 visible'
                : 'opacity-0 -translate-y-2 invisible'
            }`}
          >
            <Categories/>
          </div>
        </li>

        {/* About Dropdown */}
        <li className="relative"

          onClick={handleAboutClick}
        >
          <button
            className="hover:text-gray-300 transition-colors"
            aria-haspopup="true"
            aria-expanded={isAboutOpen}
          >
            About
          </button>
          <div
            ref={dropdownRefAbout}
            className={`absolute top-full left-0 dark:bg-gray-800 shadow-lg rounded-md mt-1 transition-all duration-200 ${
              isAboutOpen
                ? 'opacity-100 translate-y-0 visible'
                : 'opacity-0 -translate-y-2 invisible'
            }`}
          >
            <About/>
          </div>
        </li>

        <div className="search-bar-li">
          <SearchBar />
        </div>
        {/* <SelectLanguage />
        <ThemeSwitcher /> */}
      </ul>
    </nav>
  );
}

export default NavBar;

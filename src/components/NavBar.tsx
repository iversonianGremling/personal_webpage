import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SearchBar from './SearchBar';
import '../App.css';
import { SelectLanguage } from './SelectLanguage';
import Categories from './Categories';
import About from './About';

// Icons
import musicIcon from '../assets/icons/music.svg';
import gamingIcon from '../assets/icons/gaming.svg';
import philosophyIcon from '../assets/icons/philosophy.svg';
import writingsIcon from '../assets/icons/writings.svg';
import articlesIcon from '../assets/icons/articles.svg';
import intersectionalityIcon from '../assets/icons/intersectionality.svg';
import programmingIcon from '../assets/icons/programming.svg';
import thoughtsIcon from '../assets/icons/thoughts.svg';
import githubIcon from '../assets/icons/github.svg';
import instagramIcon from '../assets/icons/instagram.svg';
import youtubeIcon from '../assets/icons/youtube.svg';
import bandcampIcon from '../assets/icons/bandcamp.svg';
import soundcloudIcon from '../assets/icons/soundcloud.svg';
import twitchIcon from '../assets/icons/twitch.svg';
import mailIcon from '../assets/icons/mail.svg';
import tiktokIcon from '../assets/icons/tiktok.svg';
import reviewsIcon from '../assets/icons/reviews.svg';
import blueskyIcon from '../assets/icons/bluesky.svg';
import SaladFingersText from './SaladFingers';

function NavBar() {
  const { t } = useTranslation();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const dropdownRefCategories = useRef<HTMLDivElement>(null);
  const dropdownRefAbout = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 720);

  const categories = [
    { to: '/music', imgSrc: musicIcon, alt: t('categories.music'), label: t('categories.music') },
    { to: '/gaming', imgSrc: gamingIcon, alt: t('categories.gaming'), label: t('categories.gaming') },
    { to: '/philosophy', imgSrc: philosophyIcon, alt: t('categories.philosophy'), label: t('categories.philosophy') },
    { to: '/writings', imgSrc: writingsIcon, alt: t('categories.writings'), label: t('categories.writings') },
    { to: '/articles', imgSrc: articlesIcon, alt: t('categories.articles'), label: t('categories.articles') },
    { to: '/intersectionality', imgSrc: intersectionalityIcon, alt: t('categories.politics'), label: t('categories.politics') },
    { to: '/programming', imgSrc: programmingIcon, alt: t('categories.programming'), label: t('categories.programming') },
    { to: '/thoughts', imgSrc: thoughtsIcon, alt: t('categories.thoughts'), label: t('categories.thoughts') },
    { to: '/reviews', imgSrc: reviewsIcon, alt: t('categories.reviews'), label: t('categories.reviews') }
  ];

  const socialMediaLinks = [
    { href: 'https://github.com/iversonianGremling', imgSrc: githubIcon, alt: t('social.github'), label: t('social.github') },
    { href: 'mailto:velavelucci@proton.me', imgSrc: mailIcon, alt: t('social.email'), label: t('social.email') },
    { href: 'https://instagram.com/velavelucci', imgSrc: instagramIcon, alt: t('social.instagram'), label: t('social.instagram') },
    { href: 'https://www.tiktok.com/@velavelucci?lang=en', imgSrc: tiktokIcon, alt: t('social.tiktok'), label: t('social.tiktok') },
    { href: 'https://www.youtube.com/@VelaVelucci', imgSrc: youtubeIcon, alt: t('social.youtube'), label: t('social.youtube') },
    { href: 'https://velavelucci.bandcamp.com/', imgSrc: bandcampIcon, alt: t('social.bandcamp'), label: t('social.bandcamp') },
    { href: 'https://soundcloud.com/vela-velucci', imgSrc: soundcloudIcon, alt: t('social.soundcloud'), label: t('social.soundcloud') },
    { href: 'https://www.twitch.tv/velavelucci', imgSrc: twitchIcon, alt: t('social.twitch'), label: t('social.twitch') },
    { href: 'https://bsky.app/profile/velavelucci.bsky.social', imgSrc: blueskyIcon, alt: t('social.bluesky'), label: t('social.bluesky') }
  ];


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

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  const handleResize = () => {
    const mobile = window.innerWidth < 720;
    setIsMobile(mobile);
    // Close menu when switching to desktop view
    if (!mobile) setIsMenuOpen(false);
  };

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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav>
      <div className="flex ">
        <div className='bg-black w-full h-20 relative top-0 left-0 opacity-20'/>
        <button
          className={`hamburguer ${isMenuOpen ? 'active bg-red-600' : 'inactive bg-black'}  w-12 h-12 absolute top-3 left-4 border-white border-2 shadow-lg mt-1 ${isMobile ? 'block' : 'hidden'}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <div className='w-8 h-1 bg-white my-2 ml-1 rotate-3'/>
          <div className='w-8 h-1 bg-white my-2 ml-2 rotate-6'/>
          <div className='w-8 h-1 bg-white my-2 ml-2 rotate-12 '/>
        </button>
      </div>
      <ul className={`flex gap-4 relative nav-links p-2 ${isMenuOpen ? 'active' : ''} ${isMobile ? 'mobile text-white relative top-8' : ''} mt-2`}>
        <li className='py-4'>
          <Link to="/" className={`${isMobile? 'text-white' : ''}`}>{t('nav.home')}</Link>
        </li>

        {/* Categories Dropdown */}
        <li className="relative py-4" onClick={handleCategoriesClick}>
          <button className={`cursor-pointer hover:text-gray-300 transition-colors ${isMobile ? 'ml-4' : ''}`}>
            {t('nav.topics')}
          </button>
          {isMobile ? (
            <div className='pl-8 max-h-[60vh] overflow-y-auto'>
              <ul className={`pb-4 ${isCategoriesOpen ? 'block' : 'hidden'} bg-black
                overflow-y-auto
                max-h-[50vh]`}>
                {categories.map((category) => (
                  <li key={category.to} className="">
                    <Link
                      to={category.to}
                      className="flex items-center gap-3 hover:bg-red-600 px-4 py-4 rounded text-white"
                    >
                      <div className='bg-white rounded-full'>
                        <img
                          src={category.imgSrc}
                          alt={category.alt}
                          className="w-8 h-8 object-contain flex-shrink-0"
                        />
                      </div>
                      <span>{category.label}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/posts"
                  >
                    <SaladFingersText textSize="1.5rem" linkTo='/posts' text={t('nav.allPosts')}/>
                  </Link>
                </li>
              </ul>
            </div>
          ) : (  <div>
            <button
              className="hover:text-gray-300 transition-colors"
              aria-haspopup="true"
              aria-expanded={isCategoriesOpen}
            >
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
          </div>)}
        </li>

        {/* About Dropdown */}
        <li className="relative py-4"

          onClick={handleAboutClick}
        >
          <button
            className={`hover:text-gray-300 transition-colors ${isMobile ? 'ml-4' : ''}`}
            aria-haspopup="true"
            aria-expanded={isAboutOpen}
          >
            {t('nav.about')}
          </button>
          {isMobile ? (
            <div className='pl-4 max-h-[60vh] overflow-y-auto'>
              <ul className={`pb-4 ${isAboutOpen ? 'block' : 'hidden'} 
              bg-black
                overflow-y-auto
                max-h-[50vh]`}>
                {socialMediaLinks.map((category) => (
                  <li key={category.href} className="py-2">
                    <Link
                      to={category.href}
                      className="flex items-center gap-3 hover:bg-red-600 px-4 py-2 rounded text-white"
                    >
                      <div className='bg-white rounded-full'>
                        <img
                          src={category.imgSrc}
                          alt={category.alt}
                          className="w-8 h-8 object-contain flex-shrink-0"
                        />
                      </div>
                      <span>{category.label}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to='/about'
                  >
                    <SaladFingersText textSize="1.5rem" linkTo='/about' text={t('social.aboutMe')}/>
                  </Link>
                </li>
              </ul>
            </div>
          ) : (
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
          )}
        </li>

        <div className="search-bar-li">
          <SearchBar />
        </div>
        {/* <SelectLanguage /> */}
        {/* <ThemeSwitcher /> */}
      </ul>
    </nav>
  );
}

export default NavBar;

/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../NavBar';
import '../../assets/styles/move-image.css';
import '../../assets/styles/reviews.css';
import literaturePicture from '../../assets/images/literature.png';
import moviesPicture from '../../assets/images/movies.png';
import musicPicture from '../../assets/images/music.png';
import nonFictionPicture from '../../assets/images/non-fiction.png';
import opinionPicture from '../../assets/images/opinion.png';
import programmingPicture from '../../assets/images/programming.png';
import videogamesPicture from '../../assets/images/videogames.png';
import artPicture from '../../assets/images/art.png';

// Sample black-and-white images
const sampleImages = [
  musicPicture,
  moviesPicture,
  videogamesPicture,
  literaturePicture,
  nonFictionPicture,
  artPicture,
  programmingPicture,
  opinionPicture,
];

// Updated categories with imageUrl property
const categories = [
  { name: 'Music', textColor: '#72955A', backgroundColor: '#E78B21', imageUrl: sampleImages[0] },
  { name: 'Movies', textColor: '#FDFD00', backgroundColor: '#2C3CD0', imageUrl: sampleImages[1] },
  { name: 'Videogames', textColor: '#894545', backgroundColor: '#8AD571',imageUrl: sampleImages[2] },
  { name: 'Literature', textColor: '#D39797', backgroundColor: '#502F56', imageUrl: sampleImages[3] },
  { name: 'Non-fiction', textColor: '#763939', backgroundColor: '#CD74DD', imageUrl: sampleImages[4] },
  { name: 'Art', textColor: '#946DBD', backgroundColor: '#403D5A', imageUrl: sampleImages[5] },
  { name: 'Software', textColor: '#000000', backgroundColor: '#392AC9', imageUrl: sampleImages[6] },
  { name: 'Recommendations',  textColor: '#D374D6', backgroundColor: '#4B55B0', imageUrl: sampleImages[7] },
];

const GridItem = ({ name, textColor, backgroundColor, imageUrl }) => {
  const [isHovered, setIsHovered] = useState(false);

  const containerStyle = {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: isHovered ? '#ffffff' : backgroundColor,
    color: isHovered ? '#000000' : textColor,
    transition: 'background-color 0.3s, color 0.3s',
  };

  const linkStyle = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'clamp(0.5rem, 1.5vw + 0.7rem, 5rem)',
    fontWeight: 'bold',
    padding: '1rem',
    zIndex: 1,
    textDecoration: 'none',
    color: 'inherit',
  };

  const imageStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: isHovered ? 1 : 0,
    animation: isHovered ? 'moveImage 10s linear infinite' : 'none',
    zIndex: 2
  };

  return (
    <div
      className='linealVF-text'
      style={{...containerStyle,
        fontFamily: 'linealVF-text, sans-serif'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      <Link className='linealVF-text' to={`${name === 'Recommendations' ? '/recommendations': '/reviews/'+name.toLowerCase() }`} style={linkStyle}>
        <img src={imageUrl} alt={name} style={{...imageStyle}} />
        {name.toUpperCase()}
      </Link>
    </div>
  );
};

const ReviewsPage = () => (
  <div className="flex flex-col h-screen overflow-hidden">
    <NavBar />
    <div className="grid grid-cols-2 md:grid-cols-4 flex-1 min-h-0">
      {categories.map((category) => (
        <GridItem
          key={category.name}
          name={category.name}
          textColor={category.textColor}
          backgroundColor={category.backgroundColor}
          imageUrl={category.imageUrl}
        />
      ))}
    </div>
    <footer
      style={{
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
        padding: '10px 0',
        color: 'rgba(255, 200, 200, 0.8)',
        fontSize: '0.9rem',
        backgroundColor: 'black',
      }}
    >
        Font Lineal by Frank Adebiaye, with the contribution of Anton Moglia, Ariel Martín Pérez. Distributed by
      <a
        href="https://velvetyne.fr"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'rgba(255, 200, 200, 0.9)' }}
      >
          velvetyne.fr
      </a>
        .
    </footer>

  </div>
);

export default ReviewsPage;

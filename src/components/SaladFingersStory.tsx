import React, { useEffect, useState } from 'react';
import '../assets/styles/salad-fingers.css'; // CSS for styles
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const fonts = [
  '\'Shadows Into Light\', cursive',
  '\'Caveat\', cursive',
  '\'Patrick Hand\', cursive',
  '\'Indie Flower\', cursive'
];

interface SaladFingersTextProps {
  enableHoverEffect?: boolean;
  text?: string;
  textSize: string;
  linkTo?: string;
  onClickSpecialBehavior?: boolean;
}

const SaladFingersText: React.FC<SaladFingersTextProps> = ({ enableHoverEffect = false, text = 'About', textSize = '2.5rem', linkTo = '/' }) => {
  const { t } = useTranslation();
  const textArray = t('aboutPage.textArray', { returnObjects: true });

  const [index, setIndex] = useState(0);
  const [letters, setLetters] = useState<string[]>([]);
  const [hovering, setHovering] = useState(false); // Track whether the user is hovering
  const navigate = useNavigate();

  useEffect(() => {
    const currentText = textArray[index].split('');
    setLetters(currentText);
  }, [index]);

  const handleClick = () => {
    setIndex((prevIndex) => (prevIndex + 1) % (textArray as string[]).length);
    if (index === (textArray as string[]).length - 2) navigate('/');
  };

  const handleMouseEnter = () => {
    if (enableHoverEffect) setHovering(true); // Start animation on hover if enabled
  };

  const handleMouseLeave = () => {
    if (enableHoverEffect) setHovering(false); // Stop animation on hover if enabled
  };

  return (
    <div
      className="salad-fingers-container"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="salad-fingers-text">
        {letters.map((char, i) => (
          <RandomFontLetter key={i} char={char} animate={hovering || !enableHoverEffect} textSize={textSize}/>
        ))}
      </div>
    </div>
  );
};

// Component for each individual letter with random font
interface RandomFontLetterProps {
  char: string;
  animate: boolean;
  textSize: string;
}

const RandomFontLetter: React.FC<RandomFontLetterProps> = ({ char, animate, textSize }) => {
  const [font, setFont] = useState(fonts[0]);

  useEffect(() => {
    if (!animate) return; // Skip animation if it's not active

    const changeFont = () => {
      const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
      setFont(randomFont);
    };

    const interval = setInterval(changeFont, 800 * (Math.random() + 0.1)); // Change font every 800ms with random variation
    return () => clearInterval(interval); // Clean up on unmount
  }, [animate]); // Only run effect if animation is active

  return (
    <span
      className="char"
      style={{
        fontFamily: font,
        fontSize: textSize,
        display: 'inline-block',
        transform: animate
          ? `translateY(${Math.random() * 4 - 2}px) rotate(${Math.random() * 6 - 3}deg) skew(${Math.random() * 4 - 2}deg) scale(${1 + Math.random() * 0.05})`
          : 'none',
        transition: 'transform 0.2s ease',
        whiteSpace: char === ' ' ? 'pre' : 'normal',
        textShadow: `
          1px 1px 0 rgba(0, 0, 0, 0.15),
          -1px -1px 0 rgba(0, 0, 0, 0.15),
          2px -2px 0 rgba(0, 0, 0, 0.1),
          -2px 2px 0 rgba(0, 0, 0, 0.1),
          1px -1px 0 rgba(0, 0, 0, 0.1),
          -1px 1px 0 rgba(0, 0, 0, 0.1)
        `,
        cursor: 'default'
      }}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  );
};

export default SaladFingersText;

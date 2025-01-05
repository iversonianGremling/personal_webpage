import React, { useEffect, useState } from 'react';
import '../../public/styles/salad-fingers.css'; // CSS for styles

const fonts = [
  '\'Shadows Into Light\', cursive',
  '\'Caveat\', cursive',
  '\'Patrick Hand\', cursive',
  '\'Indie Flower\', cursive'
];

const SaladFingersText: React.FC = () => {
  const textArray = [
    'Salad Fingers...',
    'I like rusty spoons...',
    'The feeling of rust...',
    'It delights me...',
    'Hello there...'
  ];

  const [index, setIndex] = useState(0);
  const [letters, setLetters] = useState<string[]>([]);

  useEffect(() => {
    const currentText = textArray[index].split('');
    setLetters(currentText);
  }, [index]);

  const handleClick = () => {
    setIndex((prevIndex) => (prevIndex + 1) % textArray.length);
  };

  return (
    <div className="salad-fingers-container" onClick={handleClick}>
      <div className="salad-fingers-text">
        {letters.map((char, i) => (
          <RandomFontLetter key={i} char={char} />
        ))}
      </div>
    </div>
  );
};

// Component for each individual letter with random font
const RandomFontLetter: React.FC<{ char: string }> = ({ char }) => {
  const [font, setFont] = useState(fonts[0]);

  useEffect(() => {
    const changeFont = () => {
      const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
      setFont(randomFont);
    };

    const interval = setInterval(changeFont, 800 * (Math.random() + 0.1)); // Change font every 150ms (slightly slower)
    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  return (
    <span
      className="char"
      style={{
        fontFamily: font,
        fontSize: '2.5rem',
        display: 'inline-block',
        transform: `translateY(${Math.random() * 4 - 2}px) rotate(${Math.random() * 6 - 3}deg) skew(${Math.random() * 4 - 2}deg) scale(${1 + Math.random() * 0.05})`,
        transition: 'transform 0.2s ease',
        whiteSpace: char === ' ' ? 'pre' : 'normal',
        textShadow: `
          1px 1px 0 rgba(0, 0, 0, 0.15),
          -1px -1px 0 rgba(0, 0, 0, 0.15),
          2px -2px 0 rgba(0, 0, 0, 0.1),
          -2px 2px 0 rgba(0, 0, 0, 0.1),
          1px -1px 0 rgba(0, 0, 0, 0.1),
          -1px 1px 0 rgba(0, 0, 0, 0.1)
        `
      }}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  );
};

export default SaladFingersText;

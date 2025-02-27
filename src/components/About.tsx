import React, { useEffect, useState, useRef } from 'react';
import SaladFingersText from './SaladFingers';
import githubIcon from '../assets/icons/github.svg';
import linkedinIcon from '../assets/icons/linkedin.svg';
import instagramIcon from '../assets/icons/instagram.svg';
import twitterIcon from '../assets/icons/twitter.svg';
import youtubeIcon from '../assets/icons/youtube.svg';
import bandcampIcon from '../assets/icons/bandcamp.svg';
import soundcloudIcon from '../assets/icons/soundcloud.svg';
import twitchIcon from '../assets/icons/twitch.svg';
import mailIcon from '../assets/icons/mail.svg';
import tiktokIcon from '../assets/icons/tiktok.svg';

const About = () => {
  const radius = 120; // Radius of the circle
  const iconSize = 60; // Size of each icon
  const innerBoundary = radius - iconSize / 2 - 50; // Inner boundary for interactive zone
  const outerBoundary = radius + iconSize / 2; // Outer boundary for interactive zone
  const [rotation, setRotation] = useState(0); // Current rotation angle
  const [prevAngle, setPrevAngle] = useState(null); // Previous angle of the mouse relative to the center
  const [isInside, setIsInside] = useState(false); // Whether the mouse is inside the interactive zone
  const circleRef = useRef(null); // Ref for the circle container

  const socialMediaLinks = [
    { href: 'https://github.com/iversonianGremling', imgSrc: githubIcon, alt: 'GitHub', label: 'GitHub' },
    { href: 'mailto:velavelucci@proton.me', imgSrc: mailIcon, alt: 'Email', label: 'Email' },
    { href: 'https://instagram.com/velavelucci', imgSrc: instagramIcon, alt: 'Instagram', label: 'Instagram' },
    { href: 'https://www.tiktok.com/@velavelucci?lang=en', imgSrc: tiktokIcon, alt: 'TikTok', label: 'TikTok' },
    { href: 'https://www.youtube.com/@VelaVelucci', imgSrc: youtubeIcon, alt: 'YouTube', label: 'YouTube' },
    { href: 'https://velavelucci.bandcamp.com/', imgSrc: bandcampIcon, alt: 'Bandcamp', label: 'Bandcamp' },
    { href: 'https://soundcloud.com/vela-velucci', imgSrc: soundcloudIcon, alt: 'SoundCloud', label: 'SoundCloud' },
    { href: 'https://www.twitch.tv/velavelucci', imgSrc: twitchIcon, alt: 'Twitch', label: 'Twitch' },
  ];

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!circleRef.current) return;

      const rect = circleRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      // Calculate distance from mouse to center of the circle
      const distance = Math.sqrt((mouseX - centerX) ** 2 + (mouseY - centerY) ** 2);

      // Check if mouse is within the interactive zone (between inner and outer boundaries)
      if (distance >= innerBoundary && distance <= outerBoundary) {
        setIsInside(true); // Mark that the mouse is inside the interactive zone

        // Calculate the absolute angle between the mouse and the center of the circle
        const angle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI) * 2;

        if (prevAngle !== null) {
          // Calculate the difference between the current angle and the previous angle
          let deltaAngle = angle - prevAngle;

          // Normalize the delta angle to be within -180 to 180 degrees
          if (deltaAngle > 180) deltaAngle -= 360;
          if (deltaAngle < -180) deltaAngle += 360;

          // Update the rotation based on the delta angle
          setRotation((prevRotation) => prevRotation + deltaAngle);
        }

        // Update the previous angle
        setPrevAngle(angle);
      } else {
        setIsInside(false); // Mark that the mouse has left the interactive zone
        setPrevAngle(null); // Reset previous angle to prevent sudden jumps
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [innerBoundary, outerBoundary, prevAngle]);

  return (
    <div className="justify-center text-white h-screen pb-32 pt-10 block absolute top-4 -left-20">
      <div
        ref={circleRef}
        className="circle-container relative bg-black rounded-full"
        style={{ width: `${2 * radius}px`, height: `${2 * radius}px` }}
      >
        {/* Render social media icons in a rotated position */}
        {socialMediaLinks.map((link, index) => {
          const angle = -((index * 2 * Math.PI) / socialMediaLinks.length + (rotation * Math.PI) / 180);
          const x = radius + radius * Math.cos(angle) - iconSize / 2;
          const y = radius + radius * Math.sin(angle) - iconSize / 2;

          return (
            <div
              key={index}
              className="absolute flex flex-col items-center "
              style={{
                left: `${x}px`,
                top: `${y}px`,
                width: `${iconSize}px`,
                height: `${iconSize + 20}px`, // Extra height for label text
              }}
            >
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-full"
              >
                <img
                  src={link.imgSrc}
                  alt={link.alt}
                  className="w-full h-full rounded-full hover:opacity-80 bg-white"
                />
              </a>
              <span className="text-xs mt-1">{link.label}</span>
            </div>
          );
        })}

        {/* Center text */}
        <div
          className="absolute text-center font-bold text-white"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <SaladFingersText enableHoverEffect={true} linkTo='/about' textSize='2.5rem'/>
        </div>
      </div>
    </div>
  );
};

export default About;


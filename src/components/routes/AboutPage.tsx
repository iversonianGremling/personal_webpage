//Create an about page for the app
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';
import SaladFingersStory from '../SaladFingersStory';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className='h-screen content-center'>
        <SaladFingersStory text={'Hello...'} textSize='2.5rem'  />
      </div>
    </div>
  );
};

export default AboutPage;

//Brutalist style recommendations page that fetches the posts with the tag recommendation
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Post from '../../types';
import PostCard from '../PostCard';
import NavBar from '../NavBar';
import { apiUrl } from '../../assets/env-var';
import '../../assets/styles/recommendations.css';
import RecommendationCard from '../RecommendationCard';

const Recommendations: React.FC<{ posts: Post[], text: string, quality: number }> = ({ posts, text, quality}) => {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  // Check if device is mobile or tablet
  useEffect(() => {
    const checkDevice = () => {
      setIsMobileOrTablet(window.innerWidth <= 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  return (
    <>
      <div className='karrik-regular-text text-2xl text-left'>{text.toUpperCase()}</div>
      <div className={`flex flex-nowrap w-full gap-2 ${isMobileOrTablet ? 'flex-col' : 'flex-row'}`}>
        {posts.map((post) => (
          <RecommendationCard key={post.id} post={post} quality={quality}/>
        ))}
      </div>
    </>
  );
};

const RecommendationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [recommendationsQ5, setRecommendationsQ5] = React.useState<Post[]>([]);
  const [recommendationsQ4, setRecommendationsQ4] = React.useState<Post[]>([]);
  const [recommendationsQ3, setRecommendationsQ3] = React.useState<Post[]>([]);
  const [recommendationsQ2, setRecommendationsQ2] = React.useState<Post[]>([]);
  const [recommendationsQ1, setRecommendationsQ1] = React.useState<Post[]>([]);

  React.useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(apiUrl + '/posts/tag/recommendation');
      const data = await response.json();
      setPosts(data);
      setRecommendationsQ5(data.filter((post) => post.tags.includes('q5')));
      setRecommendationsQ4(data.filter((post) => post.tags.includes('q4')));
      setRecommendationsQ3(data.filter((post) => post.tags.includes('q3')));
      setRecommendationsQ2(data.filter((post) => post.tags.includes('q2')));
      setRecommendationsQ1(data.filter((post) => post.tags.includes('q1')));
    };
    fetchPosts();
  }, []);

  return (
    <>
      <NavBar />
      <div className="bg-white text-black p-8 karrik-regular-text">
        <Recommendations posts={recommendationsQ5} text="Ω A masterpiece, one of the best experiences crafted by humanity" quality={5} />
        <Recommendations posts={recommendationsQ4} text="∀ The best of its medium, worth checking out whether you are familiarized with said medium or not" quality={4}/>
        <Recommendations posts={recommendationsQ3} text="א Redefined its medium in some form or another, a golden standard that opened new frontiers and is a point of reference for other works" quality={3}/>
        <Recommendations posts={recommendationsQ2} text="∞ It incorporates enough difference, innovation or quality to advance its medium, something that must be experienced if you enjoy works of similar nature" quality={2}/>
        <Recommendations posts={recommendationsQ1} text="⧜ A solid work worth experiencing, perfected some part of its medium" quality={1}/>
      </div>
    </>
  );
};

export default RecommendationsPage;

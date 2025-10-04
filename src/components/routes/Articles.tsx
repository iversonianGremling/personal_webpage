import React, { useEffect } from 'react';
import NavBar from '../NavBar';
import Post from '../../types';
import PostCard from '../PostCard';
import { apiUrl } from '../../assets/env-var';
import { useTranslation } from 'react-i18next';


const ArticlesPage: React.FC = () => {
  const [latestPosts, setLatestPosts] = React.useState<Post[] | null>(null);
  const { t } = useTranslation();
  useEffect(() => {
    const fetchLatestPost = async () => {
      try {
        const response = await fetch(apiUrl + '/posts/tag/articles/latest');
        const data = await response.json();
        console.table(data);
        setLatestPosts(data);
      } catch (error) {
        console.error('Error fetching latest post:', error);
      }
    };
    fetchLatestPost();
  }, []);
  return (
    <>
      <NavBar />
      <div
        className="min-h-screen p-8"
        style={{
          backgroundColor: '#e0e0e0',
          fontFamily: '"Courier New", monospace',
          color: '#000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1
          className="text-6xl font-bold mb-12"
          style={{
            textTransform: 'uppercase',
            letterSpacing: '2px',
            borderBottom: '4px solid black',
            paddingBottom: '8px',
          }}
        >
          {t('articlesPage.latestArticles')}
        </h1>

        <div
          className="articles-container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
            width: '80%',
          }}
        >
          {latestPosts?.map((article, index) => (
            <PostCard
              key={article.id}
              id={article.id}
              title={article.title}
              content={article.content}
              tags={article.tags}
              image={article.image}
              date={article.date}
              type={article.type}
              variant="magazine"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ArticlesPage;

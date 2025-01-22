import React from 'react';
import NavBar from '../NavBar';

// Sample articles data
const articles = [
  { id: 1, title: 'Accelerationism: A Brief Primer', content: 'Exploring the philosophical movement focused on...', date: 'Jan 10, 2025' },
  { id: 2, title: 'Fragments of Postmodern Thought', content: 'Postmodernism challenges the grand narratives...', date: 'Jan 8, 2025' },
  { id: 3, title: 'Hyperstition: Fiction Becomes Reality', content: 'How speculative ideas influence the real world...', date: 'Jan 5, 2025' },
  { id: 4, title: 'The Collapse of Meaning', content: 'Delve into the nihilistic critique of metaphysics...', date: 'Jan 1, 2025' },
];

const ArticlesPage: React.FC = () => {
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
        Articles
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
          {articles.map((article, index) => (
            <div
              key={article.id}
              className={`article-box article-${index}`}
              style={{
                backgroundColor: index % 2 === 0 ? '#d0d0d0' : '#c0c0c0',
                padding: '20px',
                border: '4px solid black',
                transform: `rotate(${index % 2 === 0 ? '-2deg' : '3deg'})`,
                boxShadow: '8px 8px 0px rgba(0, 0, 0, 0.8)',
                width: `${70 + index * 5}%`,
              }}
            >
              <h2 className="text-3xl font-bold mb-4">{article.title}</h2>
              <p className="text-sm text-gray-700 mb-2">{article.date}</p>
              <p className="text-lg">{article.content}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ArticlesPage;

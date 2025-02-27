//Brutalist rendering of a post card with limited text view
import React from 'react';
import { Link } from 'react-router-dom';
import Post from '../types';
import '../assets/styles/review-card.css';

interface ReviewCardProps {
  post: Post;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ post }) => {
  return (
    <div className="review-card karrik-regular-text">
      <Link to={`/post/${post.id}`}>
        <h2 className="title bold text-3xl">{post.title}</h2>
        <p className="content line-clamp-5 " dangerouslySetInnerHTML={{ __html: post.content }}
          style={{
            lineClamp: 3,
            WebkitLineClamp: 3,
          }
          }></p>
      </Link>
    </div>
  );
};

export default ReviewCard;

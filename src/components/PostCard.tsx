import React from 'react';
import { useNavigate } from 'react-router-dom';
import { sanitizeHTML, truncateHTMLContent } from '../utils/contentUtils';

interface Props {
  id: number;
  title: string;
  content: string;
  tags: string[];
  image?: string;
  date: string;
  type: string;
}

const PostCard: React.FC<Props> = ({
  id,
  title,
  content,
  tags,
  image,
  date,
  type,
}) => {
  const navigate = useNavigate();

  // Date handling remains the same
  const parseDate = (dateString: string) => {
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseDate(dateString);
      return new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).format(date);
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formattedDate = formatDate(date).split(' ');
  const [month, day, year] = formattedDate;

  const handleClick = () => {
    navigate(`/posts/${id}`);
  };

  // Modified content rendering for Tiptap HTML
  const renderContentPreview = () => {
    const sanitizedContent = sanitizeHTML(content);

    return (
      <div
        className="content-preview text-md text-justify tracking-wide leading-relaxed line-clamp-3 prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    );
  };

  return (
    <article
      onClick={handleClick}
      className="post-card bg-violet-950 text-white flex flex-col justify-left items-left mb-3 transition-colors duration-300 hover:bg-yellow-300 py-6 hover:text-black cursor-pointer pr-72"
    >
      <div className="flex flex-column ml-6 my-4">
        <div className="date text-3xl mr-6 text-white content-center flex flex-col text-center">
          <span className='text-6xl'>{day.replace(',', '')}</span>
          <span className='text-xl'>{month}</span>
          <span className='text-xl'>{year}</span>
        </div>

        <div className='flex flex-col flex-1'>
          <h2 className="title text-3xl text-left font-semibold mb-2">
            {title}
          </h2>

          {tags.length > 0 && (
            <div className="tags mt-3 mb-4 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  className="tag px-3 py-1 border-2 border-black bg-white/10 rounded-full text-sm hover:bg-red-600 hover:border-red-600 transition-colors"
                  key={index}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {renderContentPreview()}
        </div>
      </div>
    </article>
  );
};

export default PostCard;
